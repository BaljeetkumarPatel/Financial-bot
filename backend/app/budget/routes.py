# from fastapi import APIRouter, HTTPException, Body
# from openai import OpenAI
# from dotenv import load_dotenv
# import os
# import traceback
# from app.db import budget_collection

# load_dotenv()
# router = APIRouter(prefix="/budget", tags=["Budget Planner"])

# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# @router.post("/plan")
# async def generate_budget_plan(data: dict = Body(...)):
#     """
#     Generate a human-readable, visually formatted monthly budget plan
#     with emoji, sections, and graph-friendly numeric hints.
#     """
#     income = data.get("income")
#     expenses = data.get("expenses", {})
#     goal = data.get("goal", "save more effectively")

#     if not income:
#         raise HTTPException(status_code=400, detail="Income is required")

#     try:
        # user_prompt = f"""
        # You are a professional financial advisor and creative writer.

        # Create a STYLISH, emoji-rich, and visually appealing budget report based on this data:
        # - Monthly Income: ₹{income}
        # - Expenses: {expenses}
        # - Goal: {goal}

        # ⚙️ Format Guidelines:
        # 1. Start with a short personalized greeting (1-2 lines)
        # 2. Use sections with emojis and bold titles, such as:
        #    💰 **Summary:**
                
        #    🧾 **Expense Breakdown:**
        #    📈 **Smart Recommendations:**
        #    💡 **Tips to Save Better:**
        #        **Conclude:**
        #        **Advisor Tips:**
        #          - Tip 1: Advice by experts privide 4 to 5 tips
        #          - Tip 2: Advice by good writer
        #          - Tip 3: Advice by financial books
        # 3. Use bullet points, lists, or markdown-style formatting
        # 4. Include clear numbers for Needs / Wants / Savings categories
        # 5. Keep it short, professional, and friendly
        # 6. Avoid using markdown ```json blocks or code format.
        # 7. Use ₹ symbols and emojis effectively.
        # 8. Provide actionable advice aligned with the user's goal.
        # 9. add financial tips based on general financial advice from experts and books.
        # 11. after each section add line breaks for better readability

        # Example style:
        # 💰 **Summary**
        # - Total Income: ₹50,000
        # - Expected Expenses: ₹25,000
        # - Savings: Total Income - Total Expenses

        # Make it sound like a real financial coach speaking clearly and positively.
        # """

#         response = client.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[{"role": "user", "content": user_prompt}],
#             max_tokens=800,
#             temperature=0.7,
#         )

#         ai_text = response.choices[0].message.content.strip()

#         print("\n===== AI Generated Budget Plan =====")
#         print(ai_text)
#         print("===================================\n")

#         return {"ok": True, "budget_plan": ai_text}

#     except Exception as e:
#         print("❌ Budget Planner Error:", str(e))
#         print(traceback.format_exc())
#         raise HTTPException(status_code=500, detail=f"Budget generation failed: {str(e)}")

# backend/app/budget/routes.py
from fastapi import APIRouter, HTTPException, Body
from openai import OpenAI
from dotenv import load_dotenv
import os
import traceback
from app.db import budget_collection
from datetime import datetime
from bson import ObjectId

load_dotenv()
router = APIRouter(prefix="/budget", tags=["Budget Planner"])

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@router.post("/plan")
async def generate_budget_plan(data: dict = Body(...)):
    """
    Generate a human-readable budget plan via OpenAI and save to MongoDB.
    Returns the saved document (including _id).
    """
    income = data.get("income")
    expenses = data.get("expenses", {})
    goal = data.get("goal", "save more effectively")

    if not income:
        raise HTTPException(status_code=400, detail="Income is required")

    try:
        # Build user prompt (kept from your original)
        
        user_prompt = f"""
        You are a professional financial advisor and creative writer.

        Create a STYLISH, emoji-rich, and visually appealing budget report based on this data:
        - Monthly Income: ₹{income}
        - Expenses: {expenses}
        - Goal: {goal}

        ⚙️ Format Guidelines:
        1. Start with a short personalized greeting (1-2 lines)
        2. Use sections with emojis and bold titles, such as:
           💰 **Summary:**
                
           🧾 **Expense Breakdown:**
           📈 **Smart Recommendations:**
           💡 **Tips to Save Better:**
               **Conclude:**
               **Advisor Tips:**
                 - Tip 1: Advice by experts privide 4 to 5 tips
                 - Tip 2: Advice by good writer
                 - Tip 3: Advice by financial books
        3. Use bullet points, lists, or markdown-style formatting
        4. Include clear numbers for Needs / Wants / Savings categories
        5. Keep it short, professional, and friendly
        6. Avoid using markdown ```json blocks or code format.
        7. Use ₹ symbols and emojis effectively.
        8. Provide actionable advice aligned with the user's goal.
        9. add financial tips based on general financial advice from experts and books.
        11. after each section add line breaks for better readability

        Example style:
        💰 **Summary**
        - Total Income: ₹50,000
        - Expected Expenses: ₹25,000
        - Savings: Total Income - Total Expenses

        Make it sound like a real financial coach speaking clearly and positively.
        """
    

        # Call OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": user_prompt}],
            max_tokens=800,
            temperature=0.7,
        )

        ai_text = response.choices[0].message.content.strip()

        # Prepare document for DB
        document = {
            "income": float(income),
            "expenses": expenses,
            "goal": goal,
            "plan": ai_text,
            "timestamp": datetime.utcnow(),
        }

        # Save to MongoDB
        result = await budget_collection.insert_one(document)
        document["_id"] = str(result.inserted_id)

        print("✅ Saved budget plan:", document)

        # Return both AI text and saved document (frontend can use saved._id)
        return {"ok": True, "budget_plan": ai_text, "saved": document}

    except Exception as e:
        print("❌ Budget Planner Error:", str(e))
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Budget generation failed: {str(e)}")


@router.get("/plans")
async def get_all_plans():
    """Fetch all saved budget plans"""
    try:
        plans = []
        async for plan in budget_collection.find().sort("_id", -1):
            plan["_id"] = str(plan["_id"])
            plans.append(plan)
        print(f"📊 Found {len(plans)} plans.")
        return {"plans": plans}
    except Exception as e:
        print("❌ Error fetching plans:", e)
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/plan/{plan_id}")
async def get_plan(plan_id: str):
    """Fetch a single saved plan by id (for the Generated page)"""
    try:
        doc = await budget_collection.find_one({"_id": ObjectId(plan_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Plan not found")
        doc["_id"] = str(doc["_id"])
        return {"plan": doc}
    except Exception as e:
        print("❌ Error fetching plan:", e)
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/plan/{plan_id}")
async def delete_plan(plan_id: str):
    """Delete a saved budget plan"""
    try:
        result = await budget_collection.delete_one({"_id": ObjectId(plan_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Plan not found")
        return {"ok": True, "message": "Plan deleted successfully"}
    except Exception as e:
        print("❌ Error deleting plan:", e)
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
