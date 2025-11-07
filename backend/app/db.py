# from motor.motor_asyncio import AsyncIOMotorClient
# from .config import settings

# client = AsyncIOMotorClient(settings.MONGO_URI)
# db = client[settings.DB_NAME]
# users = db["users"]
# financial_profiles = db["financial_profiles"]
# chat_history = db["chat_history"]
# budget_collection = db["budget_plans"]

# backend/app/db.py
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

print("🔗 Connecting to MongoDB...")
print(f"   URI: {settings.MONGO_URI}")
print(f"   DB:  {settings.DB_NAME}")

try:
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]

    # Collections
    users = db["users"]
    financial_profiles = db["financial_profiles"]
    chat_history = db["chat_history"]
    budget_collection = db["budget_plans"]
    statement_collection = db["statement_history"]
    profile_collection = db["profile_data"] 
    forecast_collection = db["forecast_history"]
    usage_collection = db["usage_stats"]

    print("✅ MongoDB connection successful!")

except Exception as e:
    print("❌ MongoDB connection failed:", e)
