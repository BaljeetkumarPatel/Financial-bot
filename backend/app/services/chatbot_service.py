# from transformers import AutoTokenizer, AutoModelForCausalLM

# # Load model and tokenizer globally (only once)
# print("🔄 Loading IBM Granite 4.0-h-tiny model... This may take a minute.")

# # tokenizer = AutoTokenizer.from_pretrained("ibm-granite/granite-4.0-h-tiny")
# # model = AutoModelForCausalLM.from_pretrained("ibm-granite/granite-4.0-h-tiny")
# tokenizer = AutoTokenizer.from_pretrained("ibm-granite/granite-4.0-h-1b")
# model = AutoModelForCausalLM.from_pretrained("ibm-granite/granite-4.0-h-1b")

# print("✅ Model loaded successfully!")


# def generate_response(user_input: str) -> str:
#     """
#     Generate a chatbot response using the IBM Granite model.
#     """
#     try:
#         messages = [
#             {"role": "user", "content": user_input},
#         ]

#         inputs = tokenizer.apply_chat_template(
#             messages,
#             add_generation_prompt=True,
#             tokenize=True,
#             return_dict=True,
#             return_tensors="pt",
#         ).to(model.device)

#         outputs = model.generate(**inputs, max_new_tokens=120)
#         reply = tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:])

#         # clean output (remove special tokens)
#         reply = reply.replace("<|im_end|>", "").strip()
#         return reply or "I'm not sure how to respond to that."

#     except Exception as e:
#         print(f"❌ Error generating response: {e}")
#         return "Sorry, something went wrong while generating a response."

# app/chatbot/chatbot_service.py


# from transformers import AutoTokenizer, AutoModelForCausalLM
# from app.db import chat_history
# from datetime import datetime

# print("🔄 Loading IBM Granite model...")
# tokenizer = AutoTokenizer.from_pretrained("ibm-granite/granite-4.0-h-1b")
# model = AutoModelForCausalLM.from_pretrained("ibm-granite/granite-4.0-h-1b")
# print("✅ Model loaded successfully!")


# async def generate_response(user_input: str, user_id: str = "guest") -> str:
#     """Generate a chatbot response and save the interaction."""
#     try:
#         messages = [{"role": "user", "content": user_input}]
#         inputs = tokenizer.apply_chat_template(
#             messages, add_generation_prompt=True, tokenize=True,
#             return_dict=True, return_tensors="pt"
#         ).to(model.device)

#         outputs = model.generate(**inputs, max_new_tokens=120)
#         reply = tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:])
#         reply = reply.replace("<|im_end|>", "").strip()

#         # Save conversation to MongoDB
#         await chat_history.insert_one({
#             "user_id": user_id,
#             "question": user_input,
#             "response": reply,
#             "timestamp": datetime.utcnow()
#         })

#         return reply or "I'm not sure how to respond to that."

#     except Exception as e:
#         print(f"❌ Error generating response: {e}")
#         return "Sorry, something went wrong while generating a response."


from transformers import AutoTokenizer, AutoModelForCausalLM
from app.db import chat_history
from datetime import datetime
from app.usage.usage_tracker import log_api_usage

print("🔄 Loading IBM Granite model...")
tokenizer = AutoTokenizer.from_pretrained("ibm-granite/granite-4.0-h-1b")
model = AutoModelForCausalLM.from_pretrained("ibm-granite/granite-4.0-h-1b")
print("✅ Model loaded successfully!")


async def generate_response(user_input: str, user_id: str = "guest") -> str:
    """
    Generate chatbot response with inline sentiment detection using IBM Granite model itself.
    """
    try:
        # Step 1️⃣: Ask Granite to analyze sentiment first
        sentiment_prompt = f"""
        Classify the sentiment of this message as Positive, Neutral, or Negative.
        Message: "{user_input}"
        Respond ONLY with one of: Positive, Neutral, or Negative.
        """

        sentiment_inputs = tokenizer(sentiment_prompt, return_tensors="pt").to(model.device)
        sentiment_outputs = model.generate(**sentiment_inputs, max_new_tokens=100)
        sentiment_label = tokenizer.decode(sentiment_outputs[0], skip_special_tokens=True).strip()

        # Clean up extra words
        sentiment_label = sentiment_label.split()[0].capitalize()
        if sentiment_label not in ["Positive", "Neutral", "Negative"]:
            sentiment_label = "Neutral"

        print(f"🧠 Sentiment Detected by Granite: {sentiment_label}")

        # Step 2️⃣: Build context prompt based on sentiment
        mood_instruction = {
            "Positive": "Respond warmly with encouragement and positivity.",
            "Neutral": "Respond informatively and clearly.",
            "Negative": "Respond empathetically and reassuringly."
        }[sentiment_label]

        main_prompt = f"""
        You are a friendly financial assistant.
        The user's emotional tone is {sentiment_label}.
        {mood_instruction}
        
        User: {user_input}
        Assistant:
        """

        # Step 3️⃣: Generate final response
        inputs = tokenizer(main_prompt, return_tensors="pt").to(model.device)
        outputs = model.generate(**inputs, max_new_tokens=300)
        reply = tokenizer.decode(outputs[0], skip_special_tokens=True).replace("<|im_end|>", "").strip()

        # Step 4️⃣: Save conversation with sentiment
        await chat_history.insert_one({
            "user_id": user_id,
            "question": user_input,
            "response": reply,
            "sentiment": sentiment_label,
            "timestamp": datetime.utcnow(),
        })

        # 📊 Step 5: Log model usage (tokens + feature tracking)
        tokens_used = len(user_input.split()) + len(reply.split())
        await log_api_usage(
            user_id=user_id,
            feature="chatbot",
            model=model,
            tokens_used=tokens_used,
            success=True,
            extra_info={
                "sentiment": sentiment_label,
                "timestamp": datetime.utcnow().isoformat(),
            },
        )

        return reply or "I'm not sure how to respond to that."

    except Exception as e:
        print(f"❌ Error generating response: {e}")
        return "Sorry, something went wrong while generating a response."
