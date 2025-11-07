from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Environment variables
    MONGO_URI: str
    DB_NAME: str
    JWT_SECRET: str
    JWT_ALGO: str = "HS256"  # default
    EMAIL_FROM: str
    EMAIL_PASSWORD: str
    OPENAI_API_KEY: str
    GEMINI_API_KEY: str

    class Config:
        env_file = ".env"  # ✅ ensure your .env is in backend/ folder

# Instantiate settings globally
settings = Settings()
