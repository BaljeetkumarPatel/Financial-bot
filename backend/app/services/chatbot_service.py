from datetime import datetime

from app.db import chat_history
from app.services.gemini_client import MODEL_NAME, GeminiQuotaError, generate_text
from app.usage.usage_tracker import log_api_usage


async def generate_response(user_input: str, user_id: str = "guest") -> str:
    """Generate chatbot response using a single Gemini call to reduce quota usage."""
    try:
        main_prompt = f'''
You are a friendly financial assistant.
Infer the user's emotional tone from their message and adapt your style:
- If positive: respond warmly and encouragingly.
- If neutral: respond clearly and practically.
- If negative: respond empathetically and reassuringly.

User: {user_input}
Assistant:
'''

        reply = generate_text(main_prompt)
        sentiment_label = "Inferred"

        await chat_history.insert_one(
            {
                "user_id": user_id,
                "question": user_input,
                "response": reply,
                "sentiment": sentiment_label,
                "timestamp": datetime.utcnow(),
            }
        )

        tokens_used = len(user_input.split()) + len(reply.split())
        await log_api_usage(
            user_id=user_id,
            feature="chatbot",
            model=MODEL_NAME,
            tokens_used=tokens_used,
            success=True,
            extra_info={
                "sentiment": sentiment_label,
                "timestamp": datetime.utcnow().isoformat(),
            },
        )

        return reply or "I'm not sure how to respond to that."
    except GeminiQuotaError as e:
        print(f"Error generating chatbot response: {e}")
        return "Gemini quota is currently exhausted. Please retry in about a minute, or switch to a billed Gemini plan."
    except Exception as e:
        print(f"Error generating chatbot response: {e}")
        return "Sorry, something went wrong while generating a response."
