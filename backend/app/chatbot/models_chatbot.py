# app/chatbot/models_chatbot.py

# from pydantic import BaseModel, Field
# from datetime import datetime
# from bson import ObjectId


# class ChatMessage(BaseModel):
#     id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
#     user_id: str
#     question: str
#     response: str
#     timestamp: datetime = Field(default_factory=datetime.utcnow)

#     class Config:
#         json_encoders = {ObjectId: str}
#         populate_by_name = True
#         orm_mode = True


from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId


class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str
    question: str
    response: str
    sentiment: str = Field(default="Neutral", description="Detected sentiment: Positive, Neutral, or Negative")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        orm_mode = True
