# from fastapi import APIRouter, Body
# from app.services.chatbot_service import generate_response

# router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

# @router.post("/")
# async def chatbot_reply(data: dict = Body(...)):
#     message = data.get("message", "")
#     if not message.strip():
#         return {"response": "Please enter a valid message."}

#     reply = generate_response(message)
#     return {"response": reply}


# app/chatbot/routes.py
# app/chatbot/routes.py
from fastapi import APIRouter, Body
from app.services.chatbot_service import generate_response
from app.db import chat_history
from bson import ObjectId

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

@router.post("/")
async def chatbot_reply(data: dict = Body(...)):
    message = data.get("message", "")
    user_id = data.get("user_id", "guest")

    if not message.strip():
        return {"response": "Please enter a valid message."}

    reply = await generate_response(message, user_id)
    return {"response": reply}



@router.get("/history/{user_id}")
async def get_chat_history(user_id: str):
    """
    Fetch all chat history for a given user.
    """
    try:
        chats = await chat_history.find({"user_id": user_id}).sort("timestamp", -1).to_list(None)

        # ✅ Convert ObjectId and datetime for JSON serialization
        for chat in chats:
            chat["_id"] = str(chat["_id"])
            if "timestamp" in chat:
                chat["timestamp"] = str(chat["timestamp"])

        return {"history": chats}
    except Exception as e:
        print("❌ Error fetching chat history:", e)
        return {"history": [], "error": str(e)}

@router.delete("/delete/{chat_id}")
async def delete_chat(chat_id: str):
    """Delete a specific chat by its MongoDB ObjectId."""
    try:
        # validate ObjectId
        if not ObjectId.is_valid(chat_id):
            raise HTTPException(status_code=400, detail="Invalid chat ID format")

        result = await chat_history.delete_one({"_id": ObjectId(chat_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Chat not found")

        return {"message": "Chat deleted successfully"}
    except Exception as e:
        print(f"❌ Error deleting chat: {e}")
        raise HTTPException(status_code=500, detail="Error deleting chat")

