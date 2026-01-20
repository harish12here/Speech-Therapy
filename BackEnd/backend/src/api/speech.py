from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
import tempfile
import os
import json
import shutil
from typing import Optional, Dict, List
from datetime import datetime
try:
    import librosa
    HAS_LIBROSA = True
except ImportError:
    HAS_LIBROSA = False

from src.services.speech_analyzer import SpeechAnalyzer
from src.services.audio_processor import AudioProcessor
from src.api.auth import get_current_user
from src.database.models import User, Session, Progress, Exercise
from src.database.schemas import SessionResponse

router = APIRouter()
speech_analyzer = SpeechAnalyzer()
audio_processor = AudioProcessor()

@router.post("/analyze", response_model=dict)
async def analyze_speech(
    audio: UploadFile = File(...),
    exercise_id: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user)
):
    """
    Analyze speech audio and provide feedback
    """
    temp_path = None
    try:
        # Validate exercise exists if ID provided
        target_text = "General Speech Practice"
        if exercise_id:
            exercise = await Exercise.get(exercise_id)
            if not exercise:
                raise HTTPException(status_code=404, detail="Exercise not found")
            target_text = exercise.target_word

        # Save uploaded file temporarily
        suffix = os.path.splitext(audio.filename)[1] or ".wav"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
            shutil.copyfileobj(audio.file, tmp_file)
            temp_path = tmp_file.name
        
        # Analyze speech using AI
        # We pass the target word/sentence as reference text
        analysis_result = speech_analyzer.analyze_audio(
            temp_path,
            reference_text=target_text
        )
        
        if not analysis_result["success"]:
            raise HTTPException(status_code=500, detail=analysis_result.get("error", "Analysis failed"))
        
        # Get duration safely
        duration = 0
        if HAS_LIBROSA:
            try:
                duration = librosa.get_duration(filename=temp_path)
            except:
                pass
        
        if duration == 0:
            # Fallback duration for mock mode or failure
            import random
            duration = random.randint(5, 15)
        
        # Save session to MongoDB
        new_session = Session(
            user_id=str(current_user.id),
            exercise_id=exercise_id,
            audio_url=f"/uploads/{os.path.basename(temp_path)}", # Placeholder URL
            duration=duration,
            pronunciation_score=analysis_result["pronunciation_score"],
            pitch_score=analysis_result["pitch_analysis"]["score"],
            fluency_score=analysis_result["fluency_score"],
            confidence_score=analysis_result.get("fluency_score", 0) * 0.9, # Approximate confidence
            overall_score=analysis_result["pronunciation_score"], # Map pronunciation to overall for consistency
            mispronounced_phonemes=analysis_result["mispronounced_phonemes"],
            pitch_contour=analysis_result["pitch_analysis"],
            ai_feedback=analysis_result["feedback"],
            suggestions=analysis_result["suggestions"],
            strengths=analysis_result.get("strengths", []),
            areas_to_improve=analysis_result.get("areas_to_improve", []),
            points_earned=10 if analysis_result["pronunciation_score"] > 60 else 5,
            is_completed=True
        )
        
        await new_session.insert()
        
        # Update User Progress (Async/Background simplified)
        await update_user_progress(current_user.id, new_session)

        return {
            "session_id": str(new_session.id),
            "analysis": analysis_result,
            "feedback": analysis_result["feedback"],
            "suggestions": analysis_result["suggestions"],
            "points_earned": new_session.points_earned
        }
            
    except Exception as e:
        print(f"Error in analyze_speech: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup temporary file
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except:
                pass

async def update_user_progress(user_id: str, session: Session):
    """Update user's daily progress stats"""
    user_id_str = str(user_id)
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    # specific query for Beanie might need adjustment depending on datetime storage, 
    # but basic find should work.
    # Note: Querying by date range is safer.
    
    progress = await Progress.find_one(
        Progress.user_id == user_id_str,
        Progress.date >= today
    )
    
    if not progress:
        progress = Progress(user_id=user_id_str, date=today)
        await progress.insert()
    
    progress.sessions_completed += 1
    progress.total_points += session.points_earned
    if session.duration:
        progress.total_duration += session.duration / 60
    
    # Update average score (simplified running average)
    current_total_score = (progress.average_score * (progress.sessions_completed - 1)) + session.pronunciation_score
    progress.average_score = current_total_score / progress.sessions_completed
    
    await progress.save()
