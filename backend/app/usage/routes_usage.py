# from fastapi import APIRouter, HTTPException
# from app.db import db
# from datetime import datetime, timedelta
# from bson import ObjectId

# router = APIRouter(prefix="/usage", tags=["Usage Tracker"])
# usage_collection = db["usage_stats"]


# # 🧭 GLOBAL USAGE STATS
# @router.get("/stats")
# async def get_global_usage_stats(days: int = 30):
#     """Get total usage stats across all AI features for the last X days"""
#     try:
#         since_date = datetime.utcnow() - timedelta(days=days)
#         cursor = usage_collection.find({"timestamp": {"$gte": since_date}})
#         records = [r async for r in cursor]

#         total_calls = len(records)
#         total_tokens = sum(r.get("tokens_used", 0) for r in records)

#         feature_breakdown = {}
#         model_breakdown = {}

#         for r in records:
#             feature = r.get("feature", "unknown")
#             model = r.get("model", "unknown")

#             feature_breakdown[feature] = feature_breakdown.get(feature, 0) + 1
#             model_breakdown[model] = model_breakdown.get(model, 0) + 1

#         return {
#             "total_calls": total_calls,
#             "total_tokens": total_tokens,
#             "feature_breakdown": feature_breakdown,
#             "model_breakdown": model_breakdown,
#             "time_window_days": days,
#             "last_updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error fetching global usage: {e}")


# # 👤 PER-USER USAGE STATS
# @router.get("/user/{user_id}")
# async def get_user_usage_stats(user_id: str, days: int = 30):
#     """Get API usage analytics per user"""
#     try:
#         since_date = datetime.utcnow() - timedelta(days=days)
#         cursor = usage_collection.find(
#             {"user_id": user_id, "timestamp": {"$gte": since_date}}
#         )
#         records = [r async for r in cursor]

#         total_calls = len(records)
#         total_tokens = sum(r.get("tokens_used", 0) for r in records)

#         feature_breakdown = {}
#         for r in records:
#             f = r.get("feature", "unknown")
#             feature_breakdown[f] = feature_breakdown.get(f, 0) + 1

#         return {
#             "user_id": user_id,
#             "total_calls": total_calls,
#             "total_tokens": total_tokens,
#             "feature_breakdown": feature_breakdown,
#             "time_window_days": days,
#             "last_updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error fetching user stats: {e}")


# # 📆 DAILY USAGE TREND (for line chart)
# @router.get("/daily")
# async def get_daily_usage_trend(days: int = 7):
#     """Get number of API calls and tokens used per day for trend chart"""
#     try:
#         since_date = datetime.utcnow() - timedelta(days=days)
#         cursor = usage_collection.find({"timestamp": {"$gte": since_date}})
#         records = [r async for r in cursor]

#         daily_trend = {}
#         for r in records:
#             date_str = r["timestamp"].strftime("%Y-%m-%d")
#             if date_str not in daily_trend:
#                 daily_trend[date_str] = {"calls": 0, "tokens": 0}
#             daily_trend[date_str]["calls"] += 1
#             daily_trend[date_str]["tokens"] += r.get("tokens_used", 0)

#         # Sort by date for chart plotting
#         trend_list = [
#             {"date": d, "calls": v["calls"], "tokens": v["tokens"]}
#             for d, v in sorted(daily_trend.items())
#         ]

#         return {
#             "days": days,
#             "trend": trend_list,
#             "last_updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error fetching daily trend: {e}")


# # 🧾 RAW LOGS (Optional — for admin dashboard)
# @router.get("/logs")
# async def get_all_usage_logs(limit: int = 20):
#     """Fetch recent raw usage records"""
#     try:
#         cursor = usage_collection.find().sort("timestamp", -1).limit(limit)
#         records = [r async for r in cursor]

#         for r in records:
#             r["_id"] = str(r["_id"])
#             if "timestamp" in r:
#                 r["timestamp"] = r["timestamp"].strftime("%Y-%m-%d %H:%M:%S")

#         return {"records": records}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error fetching logs: {e}")

from fastapi import APIRouter, HTTPException, Query
from datetime import datetime, timedelta
from app.db import db

router = APIRouter(prefix="/usage", tags=["Usage Tracker"])
usage_collection = db["usage_stats"]

# ✅ Global Stats (with optional ?days=)
@router.get("/stats")
async def get_global_usage_stats(days: int = Query(7, ge=1, le=90)):
    """Return global usage summary and breakdown (with optional date filter)"""
    try:
        since_date = datetime.utcnow() - timedelta(days=days)
        records = await usage_collection.find({"timestamp": {"$gte": since_date}}).to_list(None)

        total_calls = len(records)
        total_tokens = sum(item.get("tokens_used", 0) for item in records)
        feature_breakdown, model_breakdown = {}, {}

        for item in records:
            feature = item.get("feature", "unknown")
            model = item.get("model", "unknown")
            feature_breakdown[feature] = feature_breakdown.get(feature, 0) + 1
            model_breakdown[model] = model_breakdown.get(model, 0) + 1

        return {
            "total_calls": total_calls,
            "total_tokens": total_tokens,
            "feature_breakdown": feature_breakdown,
            "model_breakdown": model_breakdown,
            "last_updated": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Daily trend stats (for charts)
@router.get("/daily")
async def get_daily_usage(days: int = Query(7, ge=1, le=90)):
    """Return daily API call and token trends"""
    try:
        since_date = datetime.utcnow() - timedelta(days=days)
        pipeline = [
            {"$match": {"timestamp": {"$gte": since_date}}},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}},
                "calls": {"$sum": 1},
                "tokens": {"$sum": "$tokens_used"},
            }},
            {"$sort": {"_id": 1}}
        ]
        result = await usage_collection.aggregate(pipeline).to_list(None)
        trend = [{"date": r["_id"], "calls": r["calls"], "tokens": r["tokens"]} for r in result]

        return {"trend": trend}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
