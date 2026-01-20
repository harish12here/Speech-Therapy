# Speech Therapy Backend - Quick Start Guide

## 🎯 What We've Set Up

Your AI-based children's speech therapy backend is now configured with:

✅ **MongoDB Database** - Modern NoSQL database for flexible data storage
✅ **FastAPI Framework** - High-performance async API framework
✅ **Beanie ODM** - Elegant MongoDB object-document mapper
✅ **JWT Authentication** - Secure user authentication system
✅ **Role-Based Access** - Child, Parent, Therapist, Admin roles
✅ **AI-Ready Architecture** - Prepared for Wav2Vec2 integration
✅ **Regional Language Support** - Tamil, Hindi, Telugu, English

## 📁 Project Structure

```
BackEnd/backend/
├── src/
│   ├── api/              # API route handlers
│   │   ├── auth.py       # ✅ Authentication endpoints (working)
│   │   ├── exercises.py  # ✅ Exercise CRUD (working)
│   │   ├── speech.py     # ⏳ Speech analysis (needs update)
│   │   ├── progress.py   # ⏳ Progress tracking (needs update)
│   │   └── users.py      # ⏳ User management (needs update)
│   ├── database/
│   │   ├── database.py   # ✅ MongoDB connection
│   │   ├── models.py     # ✅ MongoDB document models
│   │   └── schemas.py    # ✅ Pydantic validation schemas
│   ├── config.py         # ✅ Application configuration
│   └── main.py           # ✅ FastAPI application
├── requirements.txt      # ✅ Updated with MongoDB dependencies
├── .env.example          # ✅ Environment template
└── README.md             # ✅ Full documentation
```

## 🚀 Next Steps

### 1. Install Dependencies

```bash
# Navigate to backend directory
cd BackEnd/backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows CMD:
venv\Scripts\activate.bat

# Install packages
pip install -r requirements.txt
```

### 2. Setup MongoDB

**Option A - Local MongoDB (Recommended for Development):**
- Download from: https://www.mongodb.com/try/download/community
- Install and ensure MongoDB service is running

**Option B - MongoDB Atlas (Cloud - Free Tier):**
- Go to: https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string

### 3. Configure Environment

```bash
# Copy the example file
copy .env.example .env

# Edit .env and update:
# - MONGODB_URL (your connection string)
# - SECRET_KEY (generate a strong key)
```

### 4. Run the Application

```bash
# Start the server
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Test the API

Open in browser:
- **Interactive Docs**: http://localhost:8000/api/docs
- **API Info**: http://localhost:8000/api/v1/info
- **Health Check**: http://localhost:8000/health

## 🧪 Testing the Authentication Flow

### 1. Register a User

Using the Interactive Docs (http://localhost:8000/api/docs):

1. Click on `POST /api/auth/register`
2. Click "Try it out"
3. Use this sample data:
```json
{
  "email": "child@example.com",
  "username": "Little Learner",
  "password": "test123",
  "role": "child",
  "age": 6,
  "language_preference": "en",
  "regional_language": "ta"
}
```
4. Click "Execute"

### 2. Login

1. Click on `POST /api/auth/login`
2. Click "Try it out"
3. Enter:
   - username: `child@example.com`
   - password: `test123`
4. Copy the `access_token` from response

### 3. Access Protected Endpoint

1. Click the "Authorize" button (top right)
2. Paste your token
3. Now you can access protected endpoints like `GET /api/auth/me`

## 📊 Database Models

### User Model
- Email, username, password (hashed)
- Role: child, parent, therapist, admin
- Language preferences
- Profile settings

### Exercise Model
- Title, description, target word/phoneme
- Difficulty levels: easy, medium, hard
- Exercise types: word, sentence, phoneme, story
- Media URLs (audio, visual aids, animations)
- Gamification (points, badges)

### Session Model
- User practice sessions
- AI analysis results (pronunciation, pitch, fluency scores)
- Phoneme-level feedback
- Progress tracking

### Progress Model
- Daily/weekly statistics
- Phoneme mastery tracking
- Streaks and achievements
- Badges and points

## 🎮 Features Ready to Implement

### Already Working:
✅ User registration & authentication
✅ JWT token management
✅ Exercise CRUD operations
✅ Role-based access control
✅ MongoDB async operations

### Next to Implement:
⏳ Speech analysis with Wav2Vec2
⏳ Progress tracking dashboards
⏳ Parent/Therapist monitoring
⏳ File upload for audio
⏳ Real-time feedback generation

## 🔧 MongoDB Management

### Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Browse your `speech_therapy_db` database
4. View collections: users, exercises, sessions, progress

### Using mongosh (CLI)
```bash
# Connect
mongosh

# Switch to database
use speech_therapy_db

# View collections
show collections

# Query users
db.users.find().pretty()

# Query exercises  
db.exercises.find().pretty()
```

## 🎨 Gamification Elements Included

- **Points System**: Exercises award points
- **Badges**: Achievement-based rewards
- **Streaks**: Daily practice tracking
- **Levels**: Based on phoneme mastery
- **Leaderboards**: Coming soon

## 🌏 Regional Language Support

Currently configured for:
- **English** (en)
- **Tamil** (ta)
- **Hindi** (hi)
- **Telugu** (te)
- **Kannada** (kn) - Ready to add

## 📱 Frontend Integration

Your backend is ready to connect with the frontend at:
`c:\Users\jayas\Desktop\project\A3\FrontEnd`

**API Base URL**: `http://localhost:8000/api`

**CORS Enabled** for:
- http://localhost:3000
- http://localhost:3001

## 🐛 Common Issues & Solutions

### "ModuleNotFoundError: No module named 'motor'"
```bash
pip install -r requirements.txt
```

### "Connection refused" MongoDB error
```bash
# Start MongoDB service
# Windows: Check Services app
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
```

### "Token expired" error
- Request a new token from `/api/auth/refresh` endpoint

## 📚 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Exercises
- `GET /api/exercises/` - List all exercises (with filters)
- `GET /api/exercises/{id}` - Get exercise details
- `POST /api/exercises/` - Create exercise (therapist+)
- `PUT /api/exercises/{id}` - Update exercise (therapist+)
- `DELETE /api/exercises/{id}` - Delete exercise (admin)

## 🎯 Migration from SQLAlchemy

**Key Changes Made:**
1. ✅ Replaced SQLAlchemy → Beanie ODM
2. ✅ Replaced PyMySQL → Motor (async MongoDB)
3. ✅ Updated models from ORM to Document classes
4. ✅ Changed relationships from ForeignKey → string references
5. ✅ Updated queries from SQL → MongoDB syntax

**Benefits:**
- ⚡ Async/await support out of the box
- 🚀 Better scalability for unstructured data
- 💪 Flexible schema for AI analysis results
- 🌐 Cloud-ready with MongoDB Atlas

## 📞 Need Help?

1. **Interactive Docs**: http://localhost:8000/api/docs
2. **Check logs** in terminal for errors
3. **MongoDB logs**: Check MongoDB service logs
4. **Verify .env** configuration

---

**🎉 Your backend is ready! Start the server and test the API endpoints.**
