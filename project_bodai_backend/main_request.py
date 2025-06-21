from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests

from dotenv import load_dotenv
import os
load_dotenv()  # Load .env file
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

app = FastAPI()

url = f"{SUPABASE_URL}/rest/v1/users"

# Define input schema
class UserCreate(BaseModel):
    username: str
    email: str
    password: str  # or goal if you want to use that instead


@app.get("/")
def root():
    return {"message": "Welcome to the AI Fitness API"}

@app.post("/register")
def register_user(user: UserCreate):
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }

    payload = user.dict()

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code != 201:
        return {
            "status": "error",
            "code": response.status_code,
            "detail": response.text
        }
    return {"message": "User added successfully!"}
