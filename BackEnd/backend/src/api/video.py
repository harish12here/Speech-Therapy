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
