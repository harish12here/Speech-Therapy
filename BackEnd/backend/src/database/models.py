from beanie import Document, Indexed
from pydantic import Field, EmailStr
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

# Enums for type safety
class UserRole(str, Enum):
    CHILD = "child"
    PARENT = "parent"
    THERAPIST = "therapist"
    ADMIN = "admin"

class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class ExerciseType(str, Enum):
    WORD = "word"
    SENTENCE = "sentence"
    PHONEME = "phoneme"
    STORY = "story"

class LanguageCode(str, Enum):
    ENGLISH = "en"
    TAMIL = "ta"
    HINDI = "hi"
    TELUGU = "te"
    KANNADA = "kn"

# MongoDB Document Models using Beanie

class User(Document):
    """User document model for children, parents, therapists, and admins"""
    email: Indexed(EmailStr, unique=True)
    username: str
    password_hash: str
    role: UserRole = UserRole.CHILD
    age: Optional[int] = None
    language_preference: LanguageCode = LanguageCode.ENGLISH
    regional_language: LanguageCode = LanguageCode.TAMIL
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    
    # Profile information
    avatar_url: Optional[str] = None
    parent_id: Optional[str] = None  # For child accounts
    therapist_id: Optional[str] = None  # Assigned therapist
    
    # Settings
    notification_enabled: bool = True
    sound_enabled: bool = True
    
    class Settings:
        name = "users"
        indexes = [
            "email",
            "username",
            "role",
            "parent_id",
            "therapist_id",
        ]

class Exercise(Document):
    """Exercise document model for speech therapy activities"""
    title: str
    description: Optional[str] = None
    target_word: str
    target_phoneme: str
    difficulty: DifficultyLevel = DifficultyLevel.EASY
    exercise_type: ExerciseType = ExerciseType.WORD
    language: LanguageCode = LanguageCode.TAMIL
    
    # Media
    reference_audio_url: Optional[str] = None
    visual_aid_url: Optional[str] = None
    animation_url: Optional[str] = None
    
    # Instructions
    mouth_position_guide: Optional[str] = None
    instructions: Optional[List[str]] = []
    tips: Optional[List[str]] = []
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None  # Therapist ID
    is_active: bool = True
    tags: Optional[List[str]] = []
    
    # Gamification
    points: int = 10
    badge_reward: Optional[str] = None
    
    class Settings:
        name = "exercises"
        indexes = [
            "language",
            "difficulty",
            "exercise_type",
            "target_phoneme",
            "is_active",
            "tags",
        ]

class Session(Document):
    """Session document model for tracking user practice sessions"""
    user_id: str
    exercise_id: Optional[str] = None
    
    # Audio data
    audio_url: Optional[str] = None
    duration: Optional[float] = None  # in seconds
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Analysis Results (scores 0-100)
    pronunciation_score: Optional[float] = None
    pitch_score: Optional[float] = None
    fluency_score: Optional[float] = None
    confidence_score: Optional[float] = None
    overall_score: Optional[float] = None
    
    # Detailed Analysis
    mispronounced_phonemes: Optional[List[str]] = []
    pitch_contour: Optional[Dict] = None  # {time: pitch_value}
    formant_data: Optional[Dict] = None
    transcription: Optional[str] = None
    
    # AI Feedback
    ai_feedback: Optional[str] = None
    suggestions: Optional[List[str]] = []
    strengths: Optional[List[str]] = []
    areas_to_improve: Optional[List[str]] = []
    
    # Gamification
    points_earned: int = 0
    badges_earned: Optional[List[str]] = []
    
    # Status
    is_completed: bool = False
    attempts: int = 1
    
    class Settings:
        name = "sessions"
        indexes = [
            "user_id",
            "exercise_id",
            "timestamp",
            [("user_id", 1), ("timestamp", -1)],
            "is_completed",
        ]

class Progress(Document):
    """Progress tracking document for user achievements"""
    user_id: str
    date: datetime = Field(default_factory=datetime.utcnow)
    
    # Daily statistics
    sessions_completed: int = 0
    total_duration: float = 0  # in minutes
    average_score: float = 0
    
    # Phoneme mastery (phoneme -> score mapping)
    phoneme_scores: Dict[str, float] = {}
    
    # Weekly/Monthly trends
    weekly_improvement: Optional[float] = None
    monthly_improvement: Optional[float] = None
    
    # Achievements
    total_points: int = 0
    badges: List[str] = []
    current_streak: int = 0  # days
    longest_streak: int = 0
    
    # Exercise breakdown
    exercises_by_type: Dict[str, int] = {}  # {type: count}
    exercises_by_difficulty: Dict[str, int] = {}  # {difficulty: count}
    
    # Milestones
    total_exercises_completed: int = 0
    perfect_scores: int = 0  # Number of 100% scores
    
    class Settings:
        name = "progress"
        indexes = [
            "user_id",
            "date",
            [("user_id", 1), ("date", -1)],
        ]

class Feedback(Document):
    """Feedback from parents/therapists"""
    session_id: str
    user_id: str
    feedback_by: str  # User ID of parent/therapist
    
    rating: int  # 1-5
    comment: Optional[str] = None
    tags: Optional[List[str]] = []
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "feedback"
        indexes = [
            "session_id",
            "user_id",
            "feedback_by",
            "created_at",
        ]