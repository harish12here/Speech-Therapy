#backend/src/api/exercises.py
from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime

from src.database.models import Exercise, ExerciseType, DifficultyLevel, LanguageCode, User
from src.database.schemas import ExerciseCreate, ExerciseUpdate, ExerciseResponse
from src.api.auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[ExerciseResponse])
async def get_exercises(
    language: Optional[LanguageCode] = None,
    difficulty: Optional[DifficultyLevel] = None,
    exercise_type: Optional[ExerciseType] = None,
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_active_user)
):
    """Get all exercises with optional filters"""
    
    # Build query
    query = {"is_active": True}
    
    if language:
        query["language"] = language
    if difficulty:
        query["difficulty"] = difficulty
    if exercise_type:
        query["exercise_type"] = exercise_type
    
    # Execute query with pagination
    exercises = await Exercise.find(query).skip(skip).limit(limit).to_list()
    
    return [
        ExerciseResponse(
            id=str(exercise.id),
            title=exercise.title,
            description=exercise.description,
            target_word=exercise.target_word,
            target_phoneme=exercise.target_phoneme,
            difficulty=exercise.difficulty,
            exercise_type=exercise.exercise_type,
            language=exercise.language,
            reference_audio_url=exercise.reference_audio_url,
            visual_aid_url=exercise.visual_aid_url,
            animation_url=exercise.animation_url,
            instructions=exercise.instructions,
            tips=exercise.tips,
            created_at=exercise.created_at,
            is_active=exercise.is_active,
            points=exercise.points
        )
        for exercise in exercises
    ]

@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise(
    exercise_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific exercise by ID"""
    exercise = await Exercise.get(exercise_id)
    
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )
    
    return ExerciseResponse(
        id=str(exercise.id),
        title=exercise.title,
        description=exercise.description,
        target_word=exercise.target_word,
        target_phoneme=exercise.target_phoneme,
        difficulty=exercise.difficulty,
        exercise_type=exercise.exercise_type,
        language=exercise.language,
        reference_audio_url=exercise.reference_audio_url,
        visual_aid_url=exercise.visual_aid_url,
        animation_url=exercise.animation_url,
        instructions=exercise.instructions,
        tips=exercise.tips,
        created_at=exercise.created_at,
        is_active=exercise.is_active,
        points=exercise.points
    )

@router.post("/", response_model=ExerciseResponse, status_code=status.HTTP_201_CREATED)
async def create_exercise(
    exercise_data: ExerciseCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Create a new exercise (therapist/admin only)"""
    
    # Check if user is therapist or admin
    if current_user.role not in ["therapist", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only therapists and admins can create exercises"
        )
    
    new_exercise = Exercise(
        title=exercise_data.title,
        description=exercise_data.description,
        target_word=exercise_data.target_word,
        target_phoneme=exercise_data.target_phoneme,
        difficulty=exercise_data.difficulty,
        exercise_type=exercise_data.exercise_type,
        language=exercise_data.language,
        reference_audio_url=exercise_data.reference_audio_url,
        visual_aid_url=exercise_data.visual_aid_url,
        animation_url=exercise_data.animation_url,
        mouth_position_guide=exercise_data.mouth_position_guide,
        instructions=exercise_data.instructions,
        tips=exercise_data.tips,
        tags=exercise_data.tags,
        points=exercise_data.points,
        badge_reward=exercise_data.badge_reward,
        created_by=str(current_user.id),
        created_at=datetime.utcnow(),
        is_active=True
    )
    
    await new_exercise.insert()
    
    return ExerciseResponse(
        id=str(new_exercise.id),
        title=new_exercise.title,
        description=new_exercise.description,
        target_word=new_exercise.target_word,
        target_phoneme=new_exercise.target_phoneme,
        difficulty=new_exercise.difficulty,
        exercise_type=new_exercise.exercise_type,
        language=new_exercise.language,
        reference_audio_url=new_exercise.reference_audio_url,
        visual_aid_url=new_exercise.visual_aid_url,
        animation_url=new_exercise.animation_url,
        instructions=new_exercise.instructions,
        tips=new_exercise.tips,
        created_at=new_exercise.created_at,
        is_active=new_exercise.is_active,
        points=new_exercise.points
    )

@router.put("/{exercise_id}", response_model=ExerciseResponse)
async def update_exercise(
    exercise_id: str,
    exercise_data: ExerciseUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Update an exercise (therapist/admin only)"""
    
    if current_user.role not in ["therapist", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only therapists and admins can update exercises"
        )
    
    exercise = await Exercise.get(exercise_id)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )
    
    # Update fields
    update_data = exercise_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(exercise, field, value)
    
    await exercise.save()
    
    return ExerciseResponse(
        id=str(exercise.id),
        title=exercise.title,
        description=exercise.description,
        target_word=exercise.target_word,
        target_phoneme=exercise.target_phoneme,
        difficulty=exercise.difficulty,
        exercise_type=exercise.exercise_type,
        language=exercise.language,
        reference_audio_url=exercise.reference_audio_url,
        visual_aid_url=exercise.visual_aid_url,
        animation_url=exercise.animation_url,
        instructions=exercise.instructions,
        tips=exercise.tips,
        created_at=exercise.created_at,
        is_active=exercise.is_active,
        points=exercise.points
    )

@router.delete("/{exercise_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_exercise(
    exercise_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Soft delete an exercise (admin only)"""
    
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete exercises"
        )
    
    exercise = await Exercise.get(exercise_id)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )
    
    # Soft delete
    exercise.is_active = False
    await exercise.save()
    
    return None

@router.get("/phoneme/{phoneme}", response_model=List[ExerciseResponse])
async def get_exercises_by_phoneme(
    phoneme: str,
    language: Optional[LanguageCode] = None,
    current_user: User = Depends(get_current_active_user)
):
    """Get exercises targeting a specific phoneme"""
    
    query = {"target_phoneme": phoneme, "is_active": True}
    if language:
        query["language"] = language
    
    exercises = await Exercise.find(query).to_list()
    
    return [
        ExerciseResponse(
            id=str(exercise.id),
            title=exercise.title,
            description=exercise.description,
            target_word=exercise.target_word,
            target_phoneme=exercise.target_phoneme,
            difficulty=exercise.difficulty,
            exercise_type=exercise.exercise_type,
            language=exercise.language,
            reference_audio_url=exercise.reference_audio_url,
            visual_aid_url=exercise.visual_aid_url,
            animation_url=exercise.animation_url,
            instructions=exercise.instructions,
            tips=exercise.tips,
            created_at=exercise.created_at,
            is_active=exercise.is_active,
            points=exercise.points
        )
        for exercise in exercises
    ]
