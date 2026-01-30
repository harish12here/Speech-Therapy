#backend\src\database\database.py
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from src.config import settings
from src.database.models import User, Exercise, Session, Progress

class Database:
    client: AsyncIOMotorClient = None
    
db = Database()

async def connect_to_mongo():
    """Connect to MongoDB and initialize Beanie ODM"""
    try:
        # Create MongoDB client
        db.client = AsyncIOMotorClient(settings.MONGODB_URL)
        
        # Initialize Beanie with document models
        await init_beanie(
            database=db.client[settings.MONGODB_DATABASE],
            document_models=[
                User,
                Exercise,
                Session,
                Progress,
            ]
        )
        
        print(f"✅ Connected to MongoDB: {settings.MONGODB_DATABASE}")
        
    except Exception as e:
        print(f"❌ Error connecting to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        print("🔌 MongoDB connection closed")

async def get_database():
    """Dependency to get database"""
    return db.client[settings.MONGODB_DATABASE]
