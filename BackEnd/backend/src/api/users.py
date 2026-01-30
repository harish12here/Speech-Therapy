#backend/script/core/security.py
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str) -> str:
    return pwd_context.hash(password)
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
# This module provides functions for hashing and verifying passwords using bcrypt algorithm.
# It can be used in user authentication processes to securely store and check passwords.
# Example usage:
# hashed = hash_password("mysecretpassword
# is_valid = verify_password("mysecretpassword", hashed)
# print(is_valid)  # Output: True
#backend/src/core/dependencies.py
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_async_session
async def get_db_session() -> AsyncSession:
    async with get_async_session() as session:
        yield session
def get_db() -> AsyncSession:
    return Depends(get_db_session)
# This function can be used as a dependency in FastAPI routes to provide a database session

# Example usage in a FastAPI route:
# from fastapi import APIRouter
# router = APIRouter()
# @router.get("/items/")
# async def read_items(db: AsyncSession = get_db()):
#     result = await db.execute("SELECT * FROM items")
#     items = result.fetchall()
#     return items
#backend/src/api/video.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
import tempfile
import os
import shutil
from src.services.video_analyzer import VideoAnalyzer
from src.api.auth import get_current_user
from src.database.models import User
router = APIRouter()
video_analyzer = VideoAnalyzer()
@router.post("/analyze", response_model=dict)
async def analyze_video(
    video: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Analyze video to detect child activities.
    """
    temp_path = None
    try:
        # Save uploaded file temporarily
        suffix = os.path.splitext(video.filename)[1] or ".mp4"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
            shutil.copyfileobj(video.file, tmp_file)
            temp_path = tmp_file.name
        
        # Analyze video using Mock AI
        analysis_result = video_analyzer.analyze_video(temp_path)
        
        if not analysis_result["success"]:
            raise HTTPException(status_code=500, detail="Video analysis failed")
            
        return {
            "message": "Analysis Complete",
            "result": analysis_result
        }
            
    except Exception as e:
        print(f"Error in analyze_video: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup temporary file
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except:
                pass

# This module defines an API endpoint for analyzing uploaded videos to detect child activities.
# It uses a temporary file to store the uploaded video and a mock video analyzer service.
# Example usage:
# POST /analyze with a video file in the request
# The endpoint returns the analysis result or an error message if the analysis fails.

