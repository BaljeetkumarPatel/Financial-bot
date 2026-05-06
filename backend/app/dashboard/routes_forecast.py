from datetime import datetime
import json

from bson import ObjectId
from fastapi import APIRouter, HTTPException

from app.db import db, financial_profiles, statement_collection
from app.services.gemini_client import GeminiQuotaError, generate_text

router = APIRouter()
forecast_collection = db["forecast_history"]


@router.get("/dashboard/forecast")
async def get_ai_forecast():
    """Generate and save an AI-based forecast."""
    try:
        latest_statement = await statement_collection.find_one({}, sort=[("created_at", -1)])
        latest_profile = await financial_profiles.find_one({}, sort=[("created_at", -1)])

        if not latest_statement and not latest_profile:
            raise HTTPException(status_code=404, detail="No data found to forecast.")

        statement_text = latest_statement.get("insight", "No statement insights available.") if latest_statement else ""
        profile_text = (
            f"Goals: {latest_profile.get('goals', [])}, Debts: {latest_profile.get('debts', [])}"
            if latest_profile
            else ""
        )

        prompt = f'''
You are an expert financial AI advisor.
Analyze the user's bank statement and profile to forecast next month's financial behavior.

Data:
Statement Insight:
{statement_text}

Financial Profile:
{profile_text}

Return strict JSON:
{{
  "forecast": "Short forecast summary",
  "tips": ["tip1", "tip2", "tip3"],
  "message": "Motivational message"
}}
'''

        text = generate_text(prompt).replace("```json", "").replace("```", "").strip()
        try:
            result = json.loads(text)
        except Exception:
            result = {"forecast": "No forecast generated.", "tips": [], "message": ""}

        result["created_at"] = datetime.utcnow()
        insert_result = await forecast_collection.insert_one(result)
        result["_id"] = str(insert_result.inserted_id)

        for key, value in result.items():
            if isinstance(value, ObjectId):
                result[key] = str(value)

        return result
    except HTTPException:
        raise
    except GeminiQuotaError as e:
        print(f"Gemini quota exhausted for forecast: {e}")
        raise HTTPException(
            status_code=503,
            detail="AI forecast is temporarily unavailable due to Gemini quota limits. Please try again later."
        )
    except Exception as e:
        print(f"Forecast generation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate forecast.")


@router.get("/dashboard/forecast/history")
async def get_forecast_history():
    """Return latest 10 forecasts."""
    try:
        history = await forecast_collection.find().sort("created_at", -1).to_list(10)
        for item in history:
            item["_id"] = str(item.get("_id", ""))
            if "created_at" in item and isinstance(item["created_at"], datetime):
                item["created_at"] = item["created_at"].strftime("%Y-%m-%d %H:%M:%S")
        return history
    except Exception as e:
        print(f"Error fetching forecast history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

