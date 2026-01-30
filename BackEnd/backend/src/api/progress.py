#backend/src/api/progress.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from datetime import datetime, timedelta
from src.database.models import User, Session, Progress, Exercise
from src.database.schemas import UserStatistics, SessionResponse, ProgressResponse
from src.api.auth import get_current_active_user

router = APIRouter()

@router.get("/stats", response_model=UserStatistics)
async def get_user_stats(current_user: User = Depends(get_current_active_user)):
    """Get overall statistics for the current user"""
    
    # helper for rounding
    def safe_round(val):
        return round(val, 1) if val is not None else 0

    print("DEBUG: Fetching stats")
    # Total sessions
    total_sessions = await Session.find({"user_id": str(current_user.id)}).count()
    
    # Calculate totals from sessions
    sessions = await Session.find({"user_id": str(current_user.id)}).to_list(None)
    
    print(f"DEBUG: Found {len(sessions)} sessions")
    
    total_duration = sum([s.duration for s in sessions if s.duration]) / 60  # convert seconds to minutes
    
    # Average score
    scores = [s.overall_score for s in sessions if s.overall_score is not None]
    average_score = sum(scores) / len(scores) if scores else 0
    
    # Get latest progress for streak and badges
    latest_progress = await Progress.find({"user_id": str(current_user.id)}).sort("-date").first_or_none()
    
    current_streak = latest_progress.current_streak if latest_progress else 0
    total_points = sum([s.points_earned for s in sessions])
    badges_count = len(set([badge for s in sessions if s.badges_earned for badge in s.badges_earned]))
    
    # Calculate improvement rate (compare last 5 sessions vs previous 5)
    improvement_rate = 0.0
    if len(scores) >= 10:
        recent_avg = sum(scores[:5]) / 5
        prev_avg = sum(scores[5:10]) / 5
        if prev_avg > 0:
            improvement_rate = ((recent_avg - prev_avg) / prev_avg) * 100
            
    print("DEBUG: Stats calculated")
    return UserStatistics(
        total_sessions=total_sessions,
        total_duration=safe_round(total_duration),
        average_score=safe_round(average_score),
        exercises_completed=total_sessions,
        current_streak=current_streak,
        total_points=total_points,
        badges_count=badges_count,
        improvement_rate=safe_round(improvement_rate)
    )

@router.get("/weekly")
async def get_weekly_progress(current_user: User = Depends(get_current_active_user)):
    """Get progress data for the last 7 days"""
    print("DEBUG: Fetching weekly progress")
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=7)
    
    weekly_data = []
    
    for i in range(7):
        day_start = start_date + timedelta(days=i)
        day_end = day_start + timedelta(days=1)
        day_label = day_start.strftime("%a") # Mon, Tue, etc.
        
        daily_sessions = await Session.find({
            "user_id": str(current_user.id),
            "timestamp": {"$gte": day_start, "$lt": day_end}
        }).to_list(None)
        
        day_count = len(daily_sessions)
        day_scores = [s.overall_score for s in daily_sessions if s.overall_score is not None]
        day_avg_score = sum(day_scores) / len(day_scores) if day_scores else 0
        day_duration = sum([s.duration for s in daily_sessions if s.duration]) / 60 # minutes
        
        weekly_data.append({
            "day": day_label,
            "accuracy": round(day_avg_score, 1),
            "exercises": day_count,
            "time": round(day_duration, 1)
        })
        
    print("DEBUG: Weekly calculated")
    return weekly_data

@router.get("/phonemes")
async def get_phoneme_mastery(current_user: User = Depends(get_current_active_user)):
    """Get mastery levels for different phonemes based on session history"""
    print("DEBUG: Fetching phonemes dynamically from sessions")
    
    # Fetch all sessions for the user to analyze phoneme performance
    # Limit to last 50 for performance
    sessions = await Session.find({"user_id": str(current_user.id)}).sort("-timestamp").limit(50).to_list(None)
    
    if not sessions:
        return []

    phoneme_stats = {} # {phoneme: {'total_score': 0, 'count': 0}}
    
    # Pre-fetch exercises to avoid N+1 query problem if possible, or cache
    # For now, simplistic loop (batching would be better in prod)
    
    for session in sessions:
        if not session.exercise_id:
            continue
            
        # We need to know what phoneme was targeted.
        # This is where 'target_phoneme' on Exercise is crucial.
        # We'll fetch the exercise.
        try:
             # Ideally we cache this or use aggregation. 
             # Beanie doesn't do deep populate easily without aggregation pipeline.
             # We'll do a direct fetch for now suitable for < 50 items.
             exercise = await Exercise.get(session.exercise_id)
             if not exercise or not exercise.target_phoneme:
                 continue
                 
             target = exercise.target_phoneme
             
             # Calculate score for this phoneme in this session
             # Logic: If it's in mispronounced list -> Score is Low (e.g. 40-60%)
             # If NOT in mispronounced list AND total score is high -> Score is High (e.g. 80-100%)
             
             session_score = session.overall_score if session.overall_score else 0
             
             if session.mispronounced_phonemes and target in session.mispronounced_phonemes:
                 # It was specifically mispronounced
                 score = 40.0
             else:
                 # It wasn't mispronounced, assume session score reflects mastery
                 score = session_score if session_score > 0 else 85.0 # Default high if no specific score
             
             if target not in phoneme_stats:
                 phoneme_stats[target] = {'total_score': 0, 'count': 0}
             
             phoneme_stats[target]['total_score'] += score
             phoneme_stats[target]['count'] += 1
             
        except Exception as e:
            print(f"Error processing session {session.id}: {e}")
            continue

    # Format for frontend
    data = []
    colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1']
    i = 0
    
    for phoneme, stats in phoneme_stats.items():
        if stats['count'] > 0:
            avg_accuracy = stats['total_score'] / stats['count']
            data.append({
                "name": f"/{phoneme}/", 
                "accuracy": round(avg_accuracy, 1),
                "fill": colors[i % len(colors)]
            })
            i += 1
            
    # If no data found via exercises (e.g. free speech mode), try to infer from mispronounced only?
    # No, that's hard to normalize.
    
    return data

@router.get("/history", response_model=List[SessionResponse])
async def get_session_history(
    limit: int = 10, 
    current_user: User = Depends(get_current_active_user)
):
    """Get recent practice sessions"""
    print("DEBUG: Fetching history")
    sessions = await Session.find({"user_id": str(current_user.id)}).sort("-timestamp").limit(limit).to_list(None)
    
    result = []
    for s in sessions:
        s_dict = s.dict()
        s_dict['id'] = str(s.id) 
        result.append(SessionResponse(**s_dict))
        
    return result

@router.get("/recommendations")
async def get_recommendations(current_user: User = Depends(get_current_active_user)):
    """Get personalized recommendations"""
    print("DEBUG: Fetching recommendations")
    sessions = await Session.find({"user_id": str(current_user.id)}).sort("-timestamp").limit(5).to_list(None)
    
    recommendations = []
    
    if not sessions:
        recommendations.append({
            "type": "consistency",
            "title": "Start your journey",
            "description": "Complete your first exercise to start tracking progress!",
            "icon": "TrendingUp"
        })
        return recommendations
        
    # 2. Check low scores
    low_score_sessions = [s for s in sessions if s.overall_score and s.overall_score < 60]
    if low_score_sessions:
        recommendations.append({
            "type": "improvement",
            "title": "Review recent exercises",
            "description": "You had some trouble with recent exercises. Try practicing them again at a slower pace.",
            "icon": "Volume2"
        })
        
    # 3. Check for specific mispronounced phonemes
    bad_phonemes = {}
    for s in sessions:
        if s.mispronounced_phonemes:
            for p in s.mispronounced_phonemes:
                bad_phonemes[p] = bad_phonemes.get(p, 0) + 1
                
    if bad_phonemes:
        worst_phoneme = max(bad_phonemes, key=bad_phonemes.get)
        recommendations.append({
            "type": "phoneme",
            "title": f"Practice '{worst_phoneme}' Sound",
            "description": f"We noticed you struggled with '{worst_phoneme}'. Focus on tongue positioning for this sound.",
            "icon": "Volume2"
        })
    else:
        recommendations.append({
            "type": "positive",
            "title": "Great Pronunciation!",
            "description": "Your recent sessions show great accuracy. Keep it up!",
            "icon": "TrendingUp"
        })
        
    # 4. General motivation
    recommendations.append({
        "type": "general",
        "title": "Daily Practice",
        "description": "Consistency is key. 15 minutes a day leads to fast improvement.",
        "icon": "Clock"
    })
    
    return recommendations
