from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime
from src.database.models import UserRole, DifficultyLevel, ExerciseType, LanguageCode

# ===== User Schemas =====

class UserBase(BaseModel):
    email: EmailStr
    username: str
    role: UserRole = UserRole.CHILD
    age: Optional[int] = None
    language_preference: LanguageCode = LanguageCode.ENGLISH
    regional_language: LanguageCode = LanguageCode.TAMIL

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    age: Optional[int] = None
    language_preference: Optional[LanguageCode] = None
    regional_language: Optional[LanguageCode] = None
    avatar_url: Optional[str] = None
    notification_enabled: Optional[bool] = None
    sound_enabled: Optional[bool] = None

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    avatar_url: Optional[str] = None
    
    class Config:
        from_attributes = True

# ===== Authentication Schemas =====

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ===== Exercise Schemas =====

class ExerciseBase(BaseModel):
    title: str
    description: Optional[str] = None
    target_word: str
    target_phoneme: str
    difficulty: DifficultyLevel = DifficultyLevel.EASY
    exercise_type: ExerciseType = ExerciseType.WORD
    language: LanguageCode = LanguageCode.TAMIL

class ExerciseCreate(ExerciseBase):
    reference_audio_url: Optional[str] = None
    visual_aid_url: Optional[str] = None
    animation_url: Optional[str] = None
    mouth_position_guide: Optional[str] = None
    instructions: Optional[List[str]] = []
    tips: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    points: int = 10
    badge_reward: Optional[str] = None

class ExerciseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None
    reference_audio_url: Optional[str] = None
    visual_aid_url: Optional[str] = None
    animation_url: Optional[str] = None
    mouth_position_guide: Optional[str] = None
    instructions: Optional[List[str]] = None
    tips: Optional[List[str]] = None
    is_active: Optional[bool] = None

class ExerciseResponse(ExerciseBase):
    id: str
    reference_audio_url: Optional[str] = None
    visual_aid_url: Optional[str] = None
    animation_url: Optional[str] = None
    instructions: Optional[List[str]] = []
    tips: Optional[List[str]] = []
    created_at: datetime
    is_active: bool
    points: int
    
    class Config:
        from_attributes = True

# ===== Session Schemas =====

class SessionCreate(BaseModel):
    exercise_id: str
    audio_url: Optional[str] = None

class SessionUpdate(BaseModel):
    pronunciation_score: Optional[float] = None
    pitch_score: Optional[float] = None
    fluency_score: Optional[float] = None
    confidence_score: Optional[float] = None
    overall_score: Optional[float] = None
    mispronounced_phonemes: Optional[List[str]] = None
    ai_feedback: Optional[str] = None
    suggestions: Optional[List[str]] = None
    is_completed: Optional[bool] = None

class SessionResponse(BaseModel):
    id: str
    user_id: str
    exercise_id: Optional[str] = None
    timestamp: datetime
    duration: Optional[float] = None
    pronunciation_score: Optional[float] = None
    pitch_score: Optional[float] = None
    fluency_score: Optional[float] = None
    confidence_score: Optional[float] = None
    overall_score: Optional[float] = None
    mispronounced_phonemes: Optional[List[str]] = []
    ai_feedback: Optional[str] = None
    suggestions: Optional[List[str]] = []
    strengths: Optional[List[str]] = []
    areas_to_improve: Optional[List[str]] = []
    points_earned: int = 0
    badges_earned: Optional[List[str]] = []
    is_completed: bool = False
    
    class Config:
        from_attributes = True

# ===== Progress Schemas =====

class ProgressResponse(BaseModel):
    id: str
    user_id: str
    date: datetime
    sessions_completed: int
    total_duration: float
    average_score: float
    phoneme_scores: Dict[str, float]
    total_points: int
    badges: List[str]
    current_streak: int
    longest_streak: int
    total_exercises_completed: int
    perfect_scores: int
    
    class Config:
        from_attributes = True

# ===== Speech Analysis Schemas =====

class AudioUpload(BaseModel):
    exercise_id: str

class SpeechAnalysisRequest(BaseModel):
    audio_data: str  # Base64 encoded audio
    exercise_id: str
    expected_text: str

class SpeechAnalysisResponse(BaseModel):
    pronunciation_score: float
    pitch_score: float
    fluency_score: float
    confidence_score: float
    overall_score: float
    transcription: str
    mispronounced_phonemes: List[str]
    feedback: str
    suggestions: List[str]
    strengths: List[str]
    areas_to_improve: List[str]

# ===== Statistics Schemas =====

class UserStatistics(BaseModel):
    total_sessions: int
    total_duration: float  # minutes
    average_score: float
    exercises_completed: int
    current_streak: int
    total_points: int
    badges_count: int
    improvement_rate: float  # percentage

class PhonemeProgress(BaseModel):
    phoneme: str
    score: float
    attempts: int
    last_practiced: datetime
    trend: str  # "improving", "declining", "stable"
