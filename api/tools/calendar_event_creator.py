import datetime
import os.path
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# If modifying scopes, delete token.json
SCOPES = ['https://www.googleapis.com/auth/calendar.events']
TOKEN_PATH = os.path.join(os.path.dirname(__file__), 'token.json')

class GoogleCalendarEventCreator:
    def __init__(self):
        self.creds = None
        self.service = self.authenticate()

    def authenticate(self):
        """Authenticate and return the Google Calendar service"""
        # Load credentials from token file if available
        if os.path.exists(TOKEN_PATH):
            self.creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)

        # If no valid credentials available, prompt login
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                # NOTE: Adjust the path to your actual credentials file
                flow = InstalledAppFlow.from_client_secrets_file('../credentials.json', SCOPES)
                self.creds = flow.run_local_server(port=0)

            # Save the credentials for next run
            with open('token.json', 'w') as token:
                token.write(self.creds.to_json())

        return build('calendar', 'v3', credentials=self.creds)

    def create_event(self, summary, description, start_time_str, end_time_str, timezone='Asia/Kolkata', attendees_emails=None):
        """
        Creates a Google Calendar event
        :param summary: Title of the event
        :param description: Description of the event
        :param start_time_str: Start time in ISO format (e.g., '2025-07-20T10:00:00')
        :param end_time_str: End time in ISO format
        :param timezone: Timezone
        :param attendees_emails: List of email addresses to invite
        :return: Created event link
        """
        event = {
            'summary': summary,
            'description': description,
            'start': {
                'dateTime': start_time_str,
                'timeZone': timezone,
            },
            'end': {
                'dateTime': end_time_str,
                'timeZone': timezone,
            },
        }
        if attendees_emails:
            event['attendees'] = [{'email': email} for email in attendees_emails]
        created_event = self.service.events().insert(calendarId='primary', body=event, sendUpdates='all').execute()
        print(f"Event created: {created_event.get('htmlLink')}")
        return created_event.get('htmlLink')



# Example usage
if __name__ == "__main__":
    cal = GoogleCalendarEventCreator()
    cal.create_event(
        summary="Test Meeting",
        description="This is a test meeting",
        start_time_str="2025-07-20T15:00:00",
        end_time_str="2025-07-20T16:00:00",
        attendees_emails=["participant1@example.com", "participant2@example.com"]
    )
