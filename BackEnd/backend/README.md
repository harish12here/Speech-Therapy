# 🚀 Speech Therapy Backend - MongoDB Setup Guide

## Overview
This backend is built with **FastAPI** and **MongoDB** to power an AI-based children's speech therapy application with regional language support.

## 🛠️ Technology Stack
- **Framework**: FastAPI 0.104.1
- **Database**: MongoDB with Motor (async driver) & Beanie ODM
- **Authentication**: JWT with OAuth2
- **AI/ML**: PyTorch, Transformers (Wav2Vec2), Librosa
- **Language Support**: English, Tamil, Hindi, Telugu

## 📋 Prerequisites
- Python 3.8+
- MongoDB (local or MongoDB Atlas)
- pip package manager

## 🔧 Installation

### 1. Install MongoDB

#### Option A: Local MongoDB
**Windows:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Install and ensure MongoDB service is running
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string

### 2. Setup Python Environment

```bash
# Navigate to backend directory
cd BackEnd/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configurations
# For local MongoDB:
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=speech_therapy_db

# For MongoDB Atlas:
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=speech_therapy_db

# Generate a strong secret key
SECRET_KEY=your-super-secret-key-here
```

### 4. Create Required Directories

```bash
# Create audio samples directory
mkdir -p src/data/audio_samples
```

## 🚀 Running the Application

### Development Mode
```bash
# Make sure virtual environment is activated
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## 📊 Database Schema

### Collections

#### 1. **users**
- Stores user accounts (children, parents, therapists, admins)
- Fields: email, username, password_hash, role, age, language preferences
- Indexes: email (unique), role, parent_id

#### 2. **exercises**
- Speech therapy exercises with multimedia content
- Fields: title, target_word, target_phoneme, difficulty, language, media URLs
- Indexes: language, difficulty, exercise_type, target_phoneme

#### 3. **sessions**
- User practice sessions with AI analysis results
- Fields: user_id, exercise_id, scores, feedback, phoneme analysis
- Indexes: user_id, exercise_id, timestamp

#### 4. **progress**
- Daily/weekly progress tracking with gamification
- Fields: user_id, scores, streaks, badges, phoneme mastery
- Indexes: user_id, date

## 🔑 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login (OAuth2 form)
- `POST /login/json` - Login (JSON)
- `GET /me` - Get current user
- `POST /refresh` - Refresh token

### Exercises (`/api/exercises`)
- `GET /` - List exercises (with filters)
- `GET /{id}` - Get exercise details
- `POST /` - Create exercise (therapist/admin)
- `PUT /{id}` - Update exercise (therapist/admin)
- `DELETE /{id}` - Delete exercise (admin)

### Speech Analysis (`/api/speech`)
- `POST /analyze` - Analyze speech audio
- `POST /upload` - Upload audio file

### Progress (`/api/progress`)
- `GET /` - Get user progress
- `GET /stats` - Get statistics
- `GET /phonemes` - Get phoneme progress

### Users (`/api/users`)
- `GET /` - List users (admin)
- `GET /{id}` - Get user details
- `PUT /{id}` - Update user profile

## 🧪 Testing the API

### Using Interactive Docs
1. Navigate to http://localhost:8000/api/docs
2. Try the endpoints directly in the browser

### Using curl

**Register a user:**
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "child@example.com",
    "username": "Little Learner",
    "password": "securepass123",
    "role": "child",
    "age": 6,
    "regional_language": "ta"
  }'
```

**Login:**
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=child@example.com&password=securepass123"
```

## 📦 Database Migration from SQLAlchemy

If you have existing data in SQL database:

1. **Export data from SQL**
2. **Transform schema to MongoDB format**
3. **Import using MongoDB tools or Python script**

Example migration script structure:
```python
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy import create_engine
from src.database.models import User, Exercise

async def migrate_users():
    # Connect to both databases
    # Fetch from SQL
    # Transform and insert into MongoDB
    pass
```

## 🔒 Security Best Practices

1. **Never commit .env file**
2. **Use strong SECRET_KEY** (generate with `openssl rand -hex 32`)
3. **Enable HTTPS in production**
4. **Implement rate limiting**
5
. **Validate and sanitize all inputs**
6. **Use MongoDB Atlas with IP whitelisting**

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Linux/Mac:
sudo systemctl status mongodb
# Windows: Check Services

# Test connection
mongosh
```

### Import Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Port Already in Use
```bash
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8000 | xargs kill -9
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Beanie ODM](https://beanie-odm.dev/)
- [Motor Documentation](https://motor.readthedocs.io/)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📝 License

[Your License Here]

---

**Need Help?** Check the logs or create an issue in the repository.
