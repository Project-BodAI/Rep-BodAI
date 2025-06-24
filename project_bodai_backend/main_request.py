# main_request.py
# This file handles user registration and login requests using FastAPI and Supabase.
# It uses the Supabase REST API to interact with the user database.

# uvicorn main_request:app --reload --port 3000


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from utils.security import hash_password 
from dotenv import load_dotenv
import os
load_dotenv()  # Load .env file
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
url = f"{SUPABASE_URL}/rest/v1/users"

app = FastAPI()

origins = [
    "http://localhost:3000"  # Your frontend URL
    # Add other allowed origins here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Which origins are allowed to talk to backend
    allow_credentials=True,
    allow_methods=["*"],         # Which HTTP methods are allowed
    allow_headers=["*"],         # Which headers are allowed
)

# Define input schema
class UserCreate(BaseModel):
    username: str
    email: str
    password: str # Password should be hashed before storing


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

    # Hash the password before storing
    payload["password"] = hash_password(payload["password"])

    response = requests.post(url, headers=headers, json=payload)

    # Check if the response indicates a conflict (e.g., duplicate username or email)
    if response.status_code == 409:
        error_json = response.json()
        if (
            "message" in error_json
            and "duplicate key value" in error_json["message"]
        ):
            return {
                "status": "error",
                "code": 409,
                "detail": "Username or email already exists."
            }

    # Check if the request was successful
    if response.status_code != 201:
        return {
            "status": "error",
            "code": response.status_code,
            "detail": response.text
        }
    return {"message": "User added successfully!"}
