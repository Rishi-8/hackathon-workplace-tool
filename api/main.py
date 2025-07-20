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
initial_state = {}
result = graph.invoke(initial_state)
print(result)


