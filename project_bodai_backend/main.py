#uvicorn main:app --reload --port 3000

""" 
main:app means: look in main.py, use the app object we defined.
--reload makes the server auto-restart when you change your code.
--port 3000 means the app will run on localhost:3000 — a common convention for local development. 
http://localhost:3000/docs
 """

from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User
from pydantic import BaseModel
#from dotenv import load_dotenv
#load_dotenv()  # Load environment variables from .env file

app = FastAPI()

# Simulated in-memory database
#fake_db: Dict[str, str] = {}

Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# User model
class UserCreate(BaseModel):
    username: str
    password: str

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    db_user = User(username=user.username, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User created", "id": db_user.id}

@app.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username, User.password == user.password).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful"}


