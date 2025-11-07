from fastapi import APIRouter, UploadFile, Form, HTTPException
from app.db import db
from datetime import datetime
import base64
from app.db import profile_collection
from typing import Optional

router = APIRouter()
profile_collection = db["profile_data"]


@router.get("/{user_id}")
async def get_profile(user_id: str):
    try:
        profile = await profile_collection.find_one({"user_id": user_id})
        if not profile:
            return {"exists": False, "message": "No profile found."}

        # Convert MongoDB BSON ObjectId and binary image to JSON-safe format
        profile["_id"] = str(profile["_id"])
        if "profilePic" in profile and profile["profilePic"]:
            profile["profilePic"] = base64.b64encode(profile["profilePic"]).decode("utf-8")

        return profile

    except Exception as e:
        print("⚠️ Error fetching profile:", e)
        raise HTTPException(status_code=500, detail=str(e))


# 🟢 DELETE profile
@router.delete("/{user_id}")
async def delete_profile(user_id: str):
    try:
        result = await profile_collection.delete_one({"user_id": user_id})
        if result.deleted_count == 0:
            return {"message": "Profile not found", "deleted": False}
        return {"message": "🗑 Profile deleted successfully", "deleted": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/update")
async def update_profile(
    user_id: str = Form(...),
    name: Optional[str] = Form(None),
    sex: Optional[str] = Form(None),
    age: Optional[str] = Form(None),
    persona: Optional[str] = Form(None),
    financialComfort: Optional[str] = Form(None),
    file: Optional[UploadFile] = None,
):
    """
    Create or update a user profile. (Upsert)
    """
    try:
        profile_pic_bytes = None
        if file:
            profile_pic_bytes = await file.read()

        update_data = {
            "user_id": user_id,
            "name": name,
            "sex": sex,
            "age": age,
            "persona": persona,
            "financialComfort": financialComfort,
            "updated_at": datetime.utcnow(),
        }

        if profile_pic_bytes:
            update_data["profilePic"] = profile_pic_bytes

        await profile_collection.update_one(
            {"user_id": user_id},
            {"$set": update_data},
            upsert=True
        )

        return {"message": "✅ Profile saved successfully", "updated": True}

    except Exception as e:
        print("⚠️ Error in update_profile:", e)
        raise HTTPException(status_code=500, detail=str(e))
