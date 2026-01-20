from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

from src.database.models import User
from src.database.schemas import UserCreate, UserUpdate, UserResponse, Token, TokenData, LoginRequest
from src.config import settings

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Helper functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Get current authenticated user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = await User.find_one(User.email == token_data.email)
    if user is None:
        raise credentials_exception
    
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# API Endpoints

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await User.find_one(User.email == user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        password_hash=hashed_password,
        role=user_data.role,
        age=user_data.age,
        language_preference=user_data.language_preference,
        regional_language=user_data.regional_language,
        created_at=datetime.utcnow(),
        is_active=True
    )
    
    await new_user.insert()
    
    return UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        username=new_user.username,
        role=new_user.role,
        age=new_user.age,
        language_preference=new_user.language_preference,
        regional_language=new_user.regional_language,
        is_active=new_user.is_active,
        created_at=new_user.created_at
    )

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login with email and password"""
    # Find user by email (username field contains email in OAuth2 form)
    user = await User.find_one(User.email == form_data.username)
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is inactive"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": str(user.id)},
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")

@router.post("/login/json", response_model=Token)
async def login_json(login_data: LoginRequest):
    """Login with JSON payload"""
    user = await User.find_one(User.email == login_data.email)
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is inactive"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": str(user.id)},
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        username=current_user.username,
        role=current_user.role,
        age=current_user.age,
        language_preference=current_user.language_preference,
        regional_language=current_user.regional_language,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        avatar_url=current_user.avatar_url
    )

@router.put("/me", response_model=UserResponse)
async def update_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Update current user profile"""
    update_data = user_update.model_dump(exclude_unset=True)
    print(f"DEBUG: Received update data: {update_data}")
    
    if update_data:
        # Update fields
        for field, value in update_data.items():
            if hasattr(current_user, field):
                print(f"DEBUG: Updating {field} from {getattr(current_user, field)} to {value}")
                setattr(current_user, field, value)
        
        await current_user.save()
        print("DEBUG: User saved successfully")
        
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        username=current_user.username,
        role=current_user.role,
        age=current_user.age,
        language_preference=current_user.language_preference,
        regional_language=current_user.regional_language,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        avatar_url=current_user.avatar_url
    )

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    """Logout current user (client should delete token)"""
    return {"message": "Successfully logged out"}

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_active_user)):
    """Refresh access token"""
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.email, "user_id": str(current_user.id)},
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")

@router.get("/stats", response_model=dict)
async def get_dashboard_stats(current_user: User = Depends(get_current_active_user)):
    """Get dashboard statistics for current user"""
    # Import here to avoid circular imports if any
    from src.database.models import Session, Progress
    
    user_id = str(current_user.id)
    
    # 1. Calculate basic stats from Sessions
    completed_sessions_count = await Session.find(
        Session.user_id == user_id, 
        Session.is_completed == True
    ).count()
    
    total_points_earned = 0
    # Aggregate points (simple loop for now, aggregation pipeline is better for large scale)
    async for session in Session.find(Session.user_id == user_id, Session.is_completed == True):
        total_points_earned += session.points_earned

    # 2. Get Recent Activity (last 3 sessions)
    recent_sessions = await Session.find(
        Session.user_id == user_id
    ).sort("-timestamp").limit(3).to_list()
    
    recent_activity = []
    for s in recent_sessions:
        if s.points_earned > 0:
             recent_activity.append({
                 "type": "achievement",
                 "title": "Exercise Completed",
                 "desc": f"Earned {s.points_earned} points",
                 "time": s.timestamp
             })
        elif s.overall_score and s.overall_score > 80:
             recent_activity.append({
                 "type": "improvement",
                 "title": "Great Score!",
                 "desc": f"Scored {int(s.overall_score)}% in practice",
                 "time": s.timestamp
             })
             
    # 3. Get Streak (Mock for now or check Progress)
    current_streak = 0
    # Check today's progress
    
    return {
        "completed_exercises": completed_sessions_count,
        "total_points": total_points_earned,
        "current_streak": current_streak,
        "recent_activity": recent_activity
    }
