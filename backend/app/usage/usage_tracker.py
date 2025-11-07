from datetime import datetime
from app.db import db

usage_collection = db["usage_stats"]

async def log_api_usage(
    user_id: str,
    feature: str,
    model: str,
    tokens_used: int = 0,
    success: bool = True,
    extra_info: dict = None
):
    """
    Log API usage info for any AI-based service (chatbot, tax, finance, etc.)
    """
    try:
        record = {
            "user_id": user_id,
            "feature": feature,  # e.g., chatbot, tax_advisor, ai_analysis
            "model": model,      # e.g., gemini-2.5-flash, ibm-granite-4.0-h-1b
            "tokens_used": tokens_used,
            "success": success,
            "extra_info": extra_info or {},
            "timestamp": datetime.utcnow()
        }
        await usage_collection.insert_one(record)
        print(f"📊 Logged usage: {feature} | Tokens: {tokens_used} | Status: {'✅' if success else '❌'}")
    except Exception as e:
        print("⚠️ Failed to log API usage:", e)
