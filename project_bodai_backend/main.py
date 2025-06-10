#uvicorn main:app --reload --port 3000

""" 
main:app means: look in main.py, use the app object we defined.
--reload makes the server auto-restart when you change your code.
--port 3000 means the app will run on localhost:3000 — a common convention for local development. 
http://localhost:3000/docs
 """

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Dict

app = FastAPI()

# Simulated in-memory database
fake_db: Dict[str, str] = {}

# User model
class User(BaseModel):
    username: str
    password: str

@app.post("/register")
def register(user: User):
    if user.username in fake_db:
        raise HTTPException(status_code=400, detail="Username already exists.")
    fake_db[user.username] = user.password
    return {"message": "User registered successfully."}

@app.post("/login")
def login(user: User):
    if user.username not in fake_db or fake_db[user.username] != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    return {"message": "Login successful."}
