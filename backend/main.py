from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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