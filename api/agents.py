# agents.py

from dotenv import load_dotenv
import os
import re
import html
import requests
from datetime import datetime, timedelta
from tools.fetch_slack_chats import read_messages_of_day
from tools.calendar_event_creator import GoogleCalendarEventCreator

load_dotenv()
# ------------------------
# 🤖 Agent Class
# ------------------------
class Agent:
    def read_slack(self, state):
        state["messages"] = read_messages_of_day("2025-07-20")
        return state

    def summarize_messages(self, state):
        messages = state["messages"]
        conversation = "\n".join(f'{m["username"]}: {m["message"]}' for m in messages)

        prompt = f"""Summarize the following Slack conversation in an array of summaries:\n{conversation} ."""
        state["summary"] = call_groq_llm(prompt)
        return state

    def extract_action_items(self, state):
        prompt = f"""From the summary below, extract key action items as a list:\n\n{state['summary']}"""
        state["actions"] = call_groq_llm(prompt)
        return state

    def prioritize_items(self, state):
        prompt = f"""
            You are an intelligent assistant tasked with prioritizing action items based on their **urgency** and **importance**. Analyze the list of action items below and return a structured JSON array where each item contains:

            - "task": A brief summary of the task  
            - "bywhom": The person responsible  
            - "priority": One of ["high", "medium", "low"]  
            - "description": A concise explanation of why the task has this priority  

            Input actions:\n\n{state['actions']}

            Output format (as JSON list):
            [
            {{
                "task": "...",
                "bywhom": "...",
                "priority": "high/medium/low",
                "description": "..."
            }},
            ...
            ]
            Ensure the prioritization is clear, logically explained, and sorted with the most urgent and important tasks first.
            """

        state["prioritized_actions"] = call_groq_llm(prompt)
        return state
    
    def personalized_action_agent(state):
        summary = state['summary']
        user = "Rishikesh"

        prompt = f"""
            From the summary below, extract only those action items that concern the user "{user}".
            Rephrase them to directly address the user using "you".
            Please deliver the response in plain text without any Markdown or formatting. Provide the output as raw text.

            Example:
            If the action item is "Ram asked for Rohit's mid sem report", rewrite as "Ram asked for your mid sem report".

            Ignore any task not assigned to or involving {user}.

            Summary:
            {summary}

            Personalized Action Items for {user}:
        """

        state["user_action_items"] = call_groq_llm(prompt)
        return state

    def schedule_meeting(self, state):
        prompt = f"""
            You are a JSON-only assistant.

            Task: Read the following messages and return a list of meeting events as JSON.

            Instructions:
            - DO NOT include any explanation, thoughts, or markdown.
            - DO NOT include any <think> blocks or commentary.
            - Respond ONLY with a valid JSON array. Do not include any text before or after it.

            Input messages:
            {state['messages']}

            Format:
            [
            {{
                "eventName": "Meeting",
                "eventSummary": "Meeting at 9pm",
                "startTime": "2025-07-20T21:00:00",
                "endTime": "2025-07-20T22:00:00",
                "participants": ["alice", "bob"]
            }}
            ]
            """
        state["scheduled"] = call_groq_llm(prompt)
        # for action in state.get("prioritized_actions", []):
        #     result = create_event_if_time_found(action)
        #     if result:
        #         state["scheduled"].append(result)
        return state

# ------------------------
# 🧠 call_groq_llm
# ------------------------
def call_groq_llm(prompt: str) -> list[str]:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "qwen/qwen3-32b",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0,
        "reasoning_format":"hidden",
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"]

    return [line.strip("-• ") for line in content.strip().splitlines() if line.strip()]

# ------------------------
# 📅 create_event_if_time_found
# ------------------------
def create_event_if_time_found(action_text: str):
    time_range = extract_time_from_text(action_text)
    if not time_range:
        return None
    
    cal = GoogleCalendarEventCreator()

    createEvent = cal.create_event(
        summary=action_text,
        description="This is a test meeting",
        start_time_str=time_range["start"],
        end_time_str=time_range["end"],
        attendees_emails=["participant1@example.com", "participant2@example.com"]
    )

    return createEvent

# ------------------------
# 🕓 extract_time_from_text
# ------------------------
def extract_time_from_text(text: str):
    match = re.search(r'\b(\d{1,2})(?:[:.](\d{2}))?\s*(AM|PM|am|pm)?\b', text)
    if not match:
        return None

    hour = int(match.group(1))
    minute = int(match.group(2)) if match.group(2) else 0
    period = match.group(3)

    if period:
        if period.lower() == 'pm' and hour < 12:
            hour += 12
        elif period.lower() == 'am' and hour == 12:
            hour = 0

    start_time = datetime.now().replace(hour=hour, minute=minute, second=0, microsecond=0)
    end_time = start_time + timedelta(minutes=30)

    return {
        "start": start_time.isoformat(),
        "end": end_time.isoformat()
    }
