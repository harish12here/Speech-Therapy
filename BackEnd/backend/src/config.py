from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Speech Therapy Assistant API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # MongoDB
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DATABASE: str = os.getenv("MONGODB_DATABASE", "speech_therapy_db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:8000",  # Backend
        "http://localhost:3000",  # React default
        "http://localhost:5173",  # Vite default
        "http://localhost:5174",  # Vite alternative
        "http://localhost:8080",
    ]
    
    # File Storage
    UPLOAD_DIR: str = "src/data/audio_samples"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # AI Model Settings
    WAV2VEC_MODEL: str = "facebook/wav2vec2-base-960h"
    REGIONAL_LANGUAGE_MODELS: dict = {
        "ta": "tamil-wav2vec2",  # Tamil
        "hi": "hindi-wav2vec2",  # Hindi
        "te": "telugu-wav2vec2",  # Telugu
    }
    
    # Speech Analysis Thresholds
    MIN_PRONUNCIATION_SCORE: float = 60.0
    MIN_CONFIDENCE_SCORE: float = 0.7
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
