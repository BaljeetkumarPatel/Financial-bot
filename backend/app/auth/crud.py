from datetime import datetime
from fastapi import HTTPException
from ..db import users
from .security import hash_password


# ---------- Get user by email ----------
async def get_user_by_email(email: str):
    """Find a user by email (case-insensitive)."""
    return await users.find_one({"email": email.lower()})


# ---------- Create a new user ----------
async def create_user(email: str, password: str, full_name: str = None):
    """Create a new user with hashed password."""
    # Check if already exists
    existing = await get_user_by_email(email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(password)

    user = {
        "email": email.lower(),
        "password": hashed,
        "full_name": full_name or "",
        "created_at": datetime.utcnow(),
    }

    await users.insert_one(user)

    # Return safe user data (omit password)
    return {
        "email": user["email"],
        "full_name": user["full_name"],
        "created_at": user["created_at"]
    }
