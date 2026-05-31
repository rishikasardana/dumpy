from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import os
from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import json
import secrets
from fastapi.responses import RedirectResponse

def get_flow(redirect_uri):
    credentials_json = os.getenv("GOOGLE_CREDENTIALS_JSON")
    if credentials_json:
        client_config = json.loads(credentials_json)
        flow = Flow.from_client_config(
            client_config,
            scopes=['https://www.googleapis.com/auth/calendar'],
            redirect_uri=redirect_uri
        )
    else:
        flow = Flow.from_client_secrets_file(
            'credentials.json',
            scopes=['https://www.googleapis.com/auth/calendar'],
            redirect_uri=redirect_uri
        )
    flow.code_verifier = None
    return flow

flow_store = {}

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://dumpy-umber.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class ScheduleRequest(BaseModel):
    tasks: str
    start_time: str
    end_time: str
    block_start: str = ""
    block_end: str = ""

@app.post("/schedule")
def create_schedule(request: ScheduleRequest):
    prompt = f"""
    You are a smart scheduling assistant. The user has dumped their tasks and you need to create a schedule for them.
    
    Their day starts at: {request.start_time}
    Their day ends at: {request.end_time}
    Blocked time (nothing scheduled here): {request.block_start} to {request.block_end}
    IMPORTANT: You must not schedule ANY task during the blocked time. This is a hard rule, no exceptions.

    
    Their tasks:
    {request.tasks}
    
    Rules:
    - If a task says "important", lock it in and never move it
    - If a task has an explicit time like "meeting at 5pm", keep it at that time
    - If a task is something like "breakfast" or "lunch", use common sense for the time
    - Fill flexible tasks into available gaps
    - Never schedule anything in the blocked time slot
    
    Return a JSON array of tasks like this, and nothing else:
    [
      {{"task": "Breakfast", "time": "8:00 AM", "duration": "30 mins", "type": "implicit"}},
      {{"task": "Meeting", "time": "5:00 PM", "duration": "1 hour", "type": "important"}}
    ]
    
    Types are: "important", "implicit", "flexible"
    """

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )

    
    return {"schedule": message.content[0].text}




@app.get("/auth/login")
def login():
    flow = get_flow('https://dumpy-backend.onrender.com/auth/callback')
    auth_url, state = flow.authorization_url(
        prompt='consent',
        access_type='offline'
    )
    flow_store[state] = flow
    return {"auth_url": auth_url}


@app.get("/auth/callback")
def callback(code: str, state: str):
    flow = flow_store.get(state)
    flow.fetch_token(code=code)
    credentials = flow.credentials
    return RedirectResponse(
         url=f"https://dumpy-umber.vercel.app/success?token={credentials.token}"
    )

class CalendarRequest(BaseModel):
    schedule: list
    token: str

@app.post("/add-to-calendar")
def add_to_calendar(request: CalendarRequest):
    credentials = Credentials(token=request.token)
    service = build('calendar', 'v3', credentials=credentials)
    
    
    from datetime import datetime, timedelta
    import pytz
    tz = pytz.timezone('America/Phoenix')
    today = datetime.now(tz).strftime('%Y-%m-%d')
    
    for item in request.schedule:
        time_obj = datetime.strptime(f"{today} {item['time']}", '%Y-%m-%d %I:%M %p')
        end_time = time_obj + timedelta(hours=1)
        
        event = {
            'summary': item['task'],
            'start': {'dateTime': time_obj.isoformat(), 'timeZone': 'America/Phoenix'},
            'end': {'dateTime': end_time.isoformat(), 'timeZone': 'America/Phoenix'},
        }
        service.events().insert(calendarId='primary', body=event).execute()
    
    return {"status": "success"}