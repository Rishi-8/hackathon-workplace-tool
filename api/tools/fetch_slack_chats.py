import requests
import datetime
import time
import json

SLACK_BOT_TOKEN = "xoxb-9246506407152-9221708332229-7NoyQBEiFykUwpL6XihDZwuK"
CHANNEL_ID = "C0978EWDJPJ"  # replace with your channel ID

def get_day_range_timestamps(date_str):
    """Convert 'YYYY-MM-DD' to Slack-compatible UNIX timestamp range"""
    dt = datetime.datetime.strptime(date_str, "%Y-%m-%d")
    start_ts = time.mktime(dt.timetuple())
    end_ts = start_ts + 86400  # add 24 hours
    return start_ts, end_ts

def get_user_info(user_id):
    url = "https://slack.com/api/users.info"
    headers = {
        "Authorization": f"Bearer {SLACK_BOT_TOKEN}"
    }
    params = {
        "user": user_id
    }
    res = requests.get(url, headers=headers, params=params).json()
    if res.get("ok"):
        user = res["user"]
        return {
            "username": user["profile"].get("real_name", ""),
            "email": user["profile"].get("email", "")
        }
    return {"username": "Unknown", "email": "Unknown"}

def read_messages_of_day(date_str):
    oldest, latest = get_day_range_timestamps(date_str)

    url = "https://slack.com/api/conversations.history"
    headers = {
        "Authorization": f"Bearer {SLACK_BOT_TOKEN}"
    }
    params = {
        "channel": CHANNEL_ID,
        "oldest": oldest,
        "latest": latest,
        "inclusive": True,
        "limit": 1000
    }

    messages = []
    has_more = True
    while has_more:
        response = requests.get(url, headers=headers, params=params).json()
        messages.extend(response.get("messages", []))
        has_more = response.get("has_more", False)
        if has_more:
            params["cursor"] = response["response_metadata"]["next_cursor"]

    result = []
    for msg in reversed(messages):
        user_id = msg.get("user")
        if not user_id:  # bot or system messages
            continue

        user_info = get_user_info(user_id)
        print(user_info)
        readable_time = datetime.datetime.fromtimestamp(float(msg["ts"])).strftime('%Y-%m-%d %H:%M:%S')

        result.append({
            "username": user_info["username"],
            "email": user_info["email"],
            "time": readable_time,
            "message": msg.get("text")
        })

    # print(json.dumps(result, indent=2))
    return result

# Example usage
read_messages_of_day("2025-07-19")