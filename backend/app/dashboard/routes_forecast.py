# from fastapi import APIRouter, HTTPException
# from app.db import financial_profiles, statement_collection
# from google import generativeai as genai
# import os
# from datetime import datetime

# router = APIRouter()

# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# @router.get("/dashboard/forecast")
# async def get_ai_forecast():
#     """
#     Generate AI-based financial forecast using the latest
#     statement + financial profile data.
#     """
#     try:
#         # 🧾 Fetch the latest statement insight
#         latest_statement = await statement_collection.find_one(
#             {}, sort=[("created_at", -1)]
#         )

#         # 🎯 Fetch latest financial profile
#         latest_profile = await financial_profiles.find_one(
#             {}, sort=[("created_at", -1)]
#         )

#         if not latest_statement and not latest_profile:
#             raise HTTPException(status_code=404, detail="No data found to forecast.")

#         # Prepare clean text for AI
#         statement_text = (
#             latest_statement.get("insight", "No statement insights available.")
#             if latest_statement else ""
#         )
#         profile_text = (
#             f"Goals: {latest_profile.get('goals', [])}, Debts: {latest_profile.get('debts', [])}"
#             if latest_profile else ""
#         )

#         prompt = f"""
#         You are an expert financial AI advisor.
#         Analyze the latest user's bank statement and financial profile to forecast their next month's financial behavior.

#         Data:
#         ---
#         Statement Insight:
#         {statement_text}

#         Financial Profile:
#         {profile_text}
#         ---

#         Provide:
#         1️⃣ A 2–3 line short **AI Forecast** on spending, income, or savings trends.
#         2️⃣ 3 actionable **Tips** for financial improvement.
#         3️⃣ 1 motivating **Personalized Message**.

#         Format strictly as JSON:
#         {{
#           "forecast": "Short 2–3 line forecast summary",
#           "tips": ["tip1", "tip2", "tip3"],
#           "message": "motivational ending message"
#         }}
#         """

#         model = genai.GenerativeModel("gemini-2.5-flash")
#         response = model.generate_content(prompt)
#         text = response.text.replace("```json", "").replace("```", "").strip()

#         import json
#         try:
#             result = json.loads(text)
#         except:
#             result = {"forecast": "No forecast generated.", "tips": [], "message": ""}

#         result["timestamp"] = datetime.utcnow()
#         return result

#     except Exception as e:
#         print("⚠️ Forecast generation error:", e)
#         raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException
from app.db import financial_profiles, statement_collection, db
from google import generativeai as genai
import os
from datetime import datetime
from bson import ObjectId
import json

router = APIRouter()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Forecast collection
forecast_collection = db["forecast_history"]

@router.get("/dashboard/forecast")
async def get_ai_forecast():
    """Generate and save an AI-based forecast."""
    try:
        latest_statement = await statement_collection.find_one({}, sort=[("created_at", -1)])
        latest_profile = await financial_profiles.find_one({}, sort=[("created_at", -1)])

        if not latest_statement and not latest_profile:
            raise HTTPException(status_code=404, detail="No data found to forecast.")

        statement_text = (
            latest_statement.get("insight", "No statement insights available.")
            if latest_statement else ""
        )
        profile_text = (
            f"Goals: {latest_profile.get('goals', [])}, Debts: {latest_profile.get('debts', [])}"
            if latest_profile else ""
        )

        prompt = f"""
        You are an expert financial AI advisor.
        Analyze the user's bank statement and profile to forecast their next month's financial behavior.

        Data:
        ---
        Statement Insight:
        {statement_text}

        Financial Profile:
        {profile_text}
        ---

        Provide:
        1️⃣ A short forecast.
        2️⃣ 3 actionable tips.
        3️⃣ 1 motivational message.

        Format as JSON:
        {{
          "forecast": "Short forecast summary",
          "tips": ["tip1", "tip2", "tip3"],
          "message": "Motivational message"
        }}
        """

        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()

        try:
            result = json.loads(text)
        except:
            result = {"forecast": "No forecast generated.", "tips": [], "message": ""}

        # Add timestamp
        result["created_at"] = datetime.utcnow()

        # Insert into DB and get inserted_id
        insert_result = await forecast_collection.insert_one(result)
        result["_id"] = str(insert_result.inserted_id)

        # ✅ Ensure all ObjectIds are converted before returning
        for key, value in result.items():
            if isinstance(value, ObjectId):
                result[key] = str(value)

        return result

    except Exception as e:
        print("⚠️ Forecast generation error:", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dashboard/forecast/history")
async def get_forecast_history():
    """Return latest 10 forecasts."""
    try:
        history = await forecast_collection.find().sort("created_at", -1).to_list(10)

        # Convert ObjectIds & timestamps
        for item in history:
            item["_id"] = str(item.get("_id", ""))
            if "created_at" in item and isinstance(item["created_at"], datetime):
                item["created_at"] = item["created_at"].strftime("%Y-%m-%d %H:%M:%S")

        return history

    except Exception as e:
        print("⚠️ Error fetching forecast history:", e)
        raise HTTPException(status_code=500, detail=str(e))

