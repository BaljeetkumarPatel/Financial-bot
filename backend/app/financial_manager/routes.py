# # backend/app/financial_manager/routes.py
# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from app.db import financial_profiles
# from app.services.financial_manager_service import analyze_finances

# router = APIRouter(prefix="/financial-manager", tags=["Financial Manager"])

# # ────────────────────────────────────────────────────────────────
# # 1️⃣ Pydantic Models
# # ────────────────────────────────────────────────────────────────
# class ProfileCreate(BaseModel):
#     user_id: str
#     estimated_monthly_savings: float


# class DebtCreate(BaseModel):
#     title: str
#     balance: float
#     min_payment: float
#     priority: int


# class GoalCreate(BaseModel):
#     title: str
#     target_amount: float
#     saved_amount: float = 0
#     priority: int


# # ────────────────────────────────────────────────────────────────
# # 2️⃣ Create or Update Financial Profile
# # ────────────────────────────────────────────────────────────────
# @router.post("/create-profile")
# async def create_profile(profile: ProfileCreate):
#     existing = await financial_profiles.find_one({"user_id": profile.user_id})
#     if existing:
#         await financial_profiles.update_one(
#             {"user_id": profile.user_id},
#             {"$set": {"estimated_monthly_savings": profile.estimated_monthly_savings}},
#         )
#         return {"message": "Profile updated successfully"}
#     else:
#         doc = {
#             "user_id": profile.user_id,
#             "estimated_monthly_savings": profile.estimated_monthly_savings,
#             "debts": [],
#             "goals": [],
#         }
#         await financial_profiles.insert_one(doc)
#         return {"message": "Profile created successfully"}


# # ────────────────────────────────────────────────────────────────
# # 3️⃣ Add Debt — Auto-create profile if missing
# # ────────────────────────────────────────────────────────────────
# @router.post("/add-debt/{user_id}")
# async def add_debt(user_id: str, debt: DebtCreate):
#     # Check if user profile exists
#     profile = await financial_profiles.find_one({"user_id": user_id})
#     if not profile:
#         # Auto-create with zero savings if missing
#         new_profile = {
#             "user_id": user_id,
#             "estimated_monthly_savings": 0,
#             "debts": [],
#             "goals": [],
#         }
#         await financial_profiles.insert_one(new_profile)

#     # Push debt
#     await financial_profiles.update_one(
#         {"user_id": user_id},
#         {"$push": {"debts": debt.dict()}},
#     )
#     return {"message": "Debt added successfully"}


# # ────────────────────────────────────────────────────────────────
# # 4️⃣ Add Goal — Auto-create profile if missing
# # ────────────────────────────────────────────────────────────────
# @router.post("/add-goal/{user_id}")
# async def add_goal(user_id: str, goal: GoalCreate):
#     profile = await financial_profiles.find_one({"user_id": user_id})
#     if not profile:
#         new_profile = {
#             "user_id": user_id,
#             "estimated_monthly_savings": 0,
#             "debts": [],
#             "goals": [],
#         }
#         await financial_profiles.insert_one(new_profile)

#     await financial_profiles.update_one(
#         {"user_id": user_id},
#         {"$push": {"goals": goal.dict()}},
#     )
#     return {"message": "Goal added successfully"}


# # ────────────────────────────────────────────────────────────────
# # 5️⃣ Analyze User Finances (with Gemini)
# # ────────────────────────────────────────────────────────────────
# @router.get("/analyze/{user_id}")
# async def analyze_user_finances(user_id: str):
#     profile = await financial_profiles.find_one({"user_id": user_id})
#     if not profile:
#         raise HTTPException(status_code=404, detail="Profile not found")

#     ai_analysis = await analyze_finances(profile)
#     return {"profile": profile, "ai_analysis": ai_analysis}


from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.db import db  # your main db connection (from db.py)
from app.financial_manager.ai_analysis import generate_ai_analysis  # mock or Gemini-based AI allocation if you have
from typing import Any

router = APIRouter(prefix="/financial-manager", tags=["Financial Manager"])

# ---------------------------------------------------------
# 🧩 Utility: Convert MongoDB ObjectIds → str for JSON
# --------------------------------------------------------cl-
def convert_objectid(data: Any):
    """Recursively convert ObjectIds to strings."""
    if isinstance(data, list):
        return [convert_objectid(i) for i in data]
    elif isinstance(data, dict):
        return {k: convert_objectid(v) for k, v in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data


# ---------------------------------------------------------
# 🏦 Create / Update Financial Profile
# ---------------------------------------------------------
@router.post("/create-profile")
async def create_profile(data: dict):
    user_id = data.get("user_id")
    estimated_monthly_savings = data.get("estimated_monthly_savings", 0)

    if not user_id:
        raise HTTPException(status_code=400, detail="user_id required")

    existing = await db.financial_profiles.find_one({"user_id": user_id})
    if existing:
        await db.financial_profiles.update_one(
            {"user_id": user_id},
            {"$set": {"estimated_monthly_savings": estimated_monthly_savings}},
        )
        return {"message": "Profile updated successfully"}

    await db.financial_profiles.insert_one({
        "user_id": user_id,
        "estimated_monthly_savings": estimated_monthly_savings,
        "debts": [],
        "goals": [],
    })
    return {"message": "Profile created successfully"}


# ---------------------------------------------------------
# 💳 Add a Debt
# ---------------------------------------------------------
@router.post("/add-debt/{user_id}")
async def add_debt(user_id: str, data: dict):
    title = data.get("title")
    balance = data.get("balance", 0)
    min_payment = data.get("min_payment", 0)
    priority = data.get("priority", 1)

    if not title:
        raise HTTPException(status_code=400, detail="title required")

    profile = await db.financial_profiles.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    new_debt = {
        "_id": str(ObjectId()),
        "title": title,
        "balance": balance,
        "min_payment": min_payment,
        "priority": priority,
    }

    await db.financial_profiles.update_one(
        {"user_id": user_id},
        {"$push": {"debts": new_debt}}
    )
    return {"message": "Debt added successfully", "debt": new_debt}


# ---------------------------------------------------------
# 🎯 Add a Goal
# ---------------------------------------------------------
@router.post("/add-goal/{user_id}")
async def add_goal(user_id: str, data: dict):
    title = data.get("title")
    target_amount = data.get("target_amount", 0)
    saved_amount = data.get("saved_amount", 0)
    priority = data.get("priority", 1)

    if not title:
        raise HTTPException(status_code=400, detail="title required")

    profile = await db.financial_profiles.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    new_goal = {
        "_id": str(ObjectId()),
        "title": title,
        "target_amount": target_amount,
        "saved_amount": saved_amount,
        "priority": priority,
    }

    await db.financial_profiles.update_one(
        {"user_id": user_id},
        {"$push": {"goals": new_goal}}
    )
    return {"message": "Goal added successfully", "goal": new_goal}


# ---------------------------------------------------------
# 📊 Analyze full profile (AI + data return)
# ---------------------------------------------------------
@router.get("/analyze/{user_id}")
async def analyze_finances(user_id: str):
    profile = await db.financial_profiles.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Convert Mongo ObjectIds to string
    profile = convert_objectid(profile)

    # Generate AI allocation (Gemini or mock fallback)
    try:
        ai_analysis = await generate_ai_analysis(profile)
    except Exception as e:
        print("⚠️ AI analysis failed:", e)
        ai_analysis = None

    return {"profile": profile, "ai_analysis": ai_analysis}


# ---------------------------------------------------------
# 🗑️ Optional: Delete Debt / Goal (for Trash2 icon later)
# ---------------------------------------------------------
@router.delete("/delete-debt/{user_id}/{debt_id}")
async def delete_debt(user_id: str, debt_id: str):
    result = await db.financial_profiles.update_one(
        {"user_id": user_id},
        {"$pull": {"debts": {"_id": debt_id}}},
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Debt not found")
    return {"message": "Debt deleted successfully"}

@router.delete("/delete-goal/{user_id}/{goal_id}")
async def delete_goal(user_id: str, goal_id: str):
    result = await db.financial_profiles.update_one(
        {"user_id": user_id},
        {"$pull": {"goals": {"_id": goal_id}}},
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"message": "Goal deleted successfully"}


@router.put("/edit-debt/{user_id}/{debt_id}")
async def edit_debt(user_id: str, debt_id: str, data: dict):
    result = await db.financial_profiles.update_one(
        {"user_id": user_id, "debts._id": debt_id},
        {"$set": {
            "debts.$.title": data.get("title"),
            "debts.$.balance": data.get("balance"),
            "debts.$.min_payment": data.get("min_payment"),
            "debts.$.priority": data.get("priority")
        }}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Debt not found")
    return {"message": "Debt updated successfully"}


@router.put("/edit-goal/{user_id}/{goal_id}")
async def edit_goal(user_id: str, goal_id: str, data: dict):
    result = await db.financial_profiles.update_one(
        {"user_id": user_id, "goals._id": goal_id},
        {"$set": {
            "goals.$.title": data.get("title"),
            "goals.$.target_amount": data.get("target_amount"),
            "goals.$.saved_amount": data.get("saved_amount"),
            "goals.$.priority": data.get("priority")
        }}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"message": "Goal updated successfully"}
