from fastapi import APIRouter
from app.db import db

router = APIRouter()

@router.get("/visits")
async def get_visits():
    counter = await db["page_visits"].find_one({"page": "home"})
    if not counter:
        await db["page_visits"].insert_one({"page": "home", "count": 1})
        return {"count": 1}

    new_count = counter["count"] + 1
    await db["page_visits"].update_one({"page": "home"}, {"$set": {"count": new_count}})
    return {"count": new_count}
