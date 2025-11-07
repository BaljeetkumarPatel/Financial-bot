from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ---------- For creating a new user ----------
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str


# ---------- For returning user info ----------
class UserOut(BaseModel):
    email: EmailStr
    name: str
    created_at: datetime


# ---------- For login request ----------
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    created_at: datetime


# ---------- For user data inside DB ----------
class UserInDB(BaseModel):
    email: EmailStr
    password: str
    name:str
    created_at: datetime = datetime.utcnow()
