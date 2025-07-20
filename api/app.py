from fastapi import FastAPI
from pydantic import BaseModel
import re
import json
import html

app = FastAPI()

# main.py
import os
from dotenv import load_dotenv

load_dotenv()

from typing import TypedDict, List, Any, Optional
from langgraph.graph import StateGraph, END
from agents import Agent

class AgentState(TypedDict, total=False):
    messages: List[dict]
    summary: str
    actions: List[str]
    prioritized_actions: List[str]
    scheduled: Optional[List[Any]]

agent = Agent()
builder = StateGraph(state_schema=AgentState)

builder.add_node("read_slack", agent.read_slack)
builder.add_node("summarize", agent.summarize_messages)
builder.add_node("extract_actions", agent.extract_action_items)
builder.add_node("prioritize", agent.prioritize_items)
builder.add_node("schedule", agent.schedule_meeting)

builder.set_entry_point("read_slack")
builder.add_edge("read_slack", "summarize")
builder.add_edge("summarize", "extract_actions")
builder.add_edge("extract_actions", "prioritize")
builder.add_edge("prioritize", "schedule")
builder.add_edge("schedule", END)

graph = builder.compile()

# Run the graph
# initial_state = {}
# result = graph.invoke(initial_state)
# print(result)



# Create the POST endpoint
@app.post("/items/")
async def create_item():
    initial_state = {}
    result = graph.invoke(initial_state)
    cleanResult = clean_dict(result)
    return {
        "message": cleanResult
    }

def try_parse_json_fragmented_list(fragmented_list):
    if isinstance(fragmented_list, list) and all(isinstance(x, str) for x in fragmented_list):
        # Step 1: Join into one string
        combined = ''.join(fragmented_list)
        # Step 2: Remove backslashes and asterisks
        cleaned = re.sub(r"[\\*]", "", combined)
        # Step 3: Try parsing into real JSON
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return cleaned  # fallback
    return fragmented_list  # already parsed

def clean_dict(data):
    if isinstance(data, dict):
        return {k: clean_dict(v) for k, v in data.items()}
    elif isinstance(data, list):
        # First try to parse as JSON if it's a fragmented string list
        parsed = try_parse_json_fragmented_list(data)
        if parsed != data:
            return clean_dict(parsed)
        else:
            return [clean_dict(item) for item in data]
    elif isinstance(data, str):
        # Remove \ and *
        return re.sub(r"[\\*]", "", data)
    else:
        return data
