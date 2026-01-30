# backend\src\main.py
"""
Backend Application Entry Point

To run the server:
    python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

from src.config import settings
from src.database.database import connect_to_mongo, close_mongo_connection

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered speech therapy application for children with Wav2Vec2 and regional language support",
    version=settings.VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS + ["*"], # Allow all for dev, production uses settings
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Event handlers for database connection
@app.on_event("startup")
async def startup_db_client():
    """Connect to MongoDB on startup"""
    await connect_to_mongo()
    print(f"🚀 {settings.APP_NAME} v{settings.VERSION} started")

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close MongoDB connection on shutdown"""
    await close_mongo_connection()
    print("👋 Application shutdown complete")

# Import and include routers
from src.api import auth, exercises, speech, video, progress # , users
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(exercises.router, prefix="/api/exercises", tags=["Exercises"])
app.include_router(speech.router, prefix="/api/speech", tags=["Speech Analysis"])
app.include_router(video.router, prefix="/api/video", tags=["Video Analysis"])
# app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])

# Static files for audio samples
try:
    app.mount("/static", StaticFiles(directory=settings.UPLOAD_DIR), name="static")
except Exception as e:
    print(f"⚠️ Warning: Could not mount static files: {e}")

# Root endpoints
@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": settings.APP_NAME,
        "version": settings.VERSION,
        "docs": "/api/docs",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "speech-therapy-api",
        "version": settings.VERSION,
        "database": "mongodb"
    }

@app.get("/api/v1/info")
async def api_info():
    """Get API information"""
    return {
        "name": settings.APP_NAME,
        "version": settings.VERSION,
        "features": [
            "Speech Analysis with AI",
            "Regional Language Support (Tamil, Hindi, Telugu)",
            "Real-time Feedback",
            "Progress Tracking",
            "Gamification",
            "Parent/Therapist Dashboard"
        ],
        "supported_languages": [
            {"code": "en", "name": "English"},
            {"code": "ta", "name": "Tamil"},
            {"code": "hi", "name": "Hindi"},
            {"code": "te", "name": "Telugu"},
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )