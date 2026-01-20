"""
Seed script to populate MongoDB with sample speech therapy data
Run this after setting up the database to get started with sample exercises
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from src.config import settings
from datetime import datetime

# Sample exercises data for children's speech therapy
SAMPLE_EXERCISES = [
    # Tamil Exercises - Easy Level
    {
        "title": "அம்மா - Say 'Amma' (Mother)",
        "description": "Practice saying the word for mother in Tamil",
        "target_word": "அம்மா",
        "target_phoneme": "m",
        "difficulty": "easy",
        "exercise_type": "word",
        "language": "ta",
        "instructions": [
            "Look at the picture of a mother",
            "Listen to the correct pronunciation",
            "Say 'அம்மா' clearly",
            "Try to match the sound"
        ],
        "tips": [
            "Press your lips together for 'mm' sound",
            "Make sure your lips touch",
            "Keep it soft and gentle"
        ],
        "mouth_position_guide": "Close your lips completely and make the sound through your nose",
        "tags": ["tamil", "family", "basic"],
        "points": 10,
        "is_active": True
    },
    {
        "title": "பூ - Say 'Poo' (Flower)",
        "description": "Practice the 'p' sound with the Tamil word for flower",
        "target_word": "பூ",
        "target_phoneme": "p",
        "difficulty": "easy",
        "exercise_type": "word",
        "language": "ta",
        "instructions": [
            "Take a deep breath",
            "Build up air behind your lips",
            "Release with a gentle 'p' sound"
        ],
        "tips": [
            "Make a small explosion of air",
            "Don't forget the long 'oo' sound"
        ],
        "mouth_position_guide": "Close lips tightly, then release air suddenly",
        "tags": ["tamil", "nature", "basic"],
        "points": 10,
        "is_active": True
    },
    
    # English Exercises - Easy Level
    {
        "title": "Ball - Practice 'B' Sound",
        "description": "Learn to pronounce the 'b' sound correctly",
        "target_word": "ball",
        "target_phoneme": "b",
        "difficulty": "easy",
        "exercise_type": "word",
        "language": "en",
        "instructions": [
            "Press your lips together",
            "Build up air",
            "Release with voice: 'b'",
            "Add 'all' sound: ball"
        ],
        "tips": [
            "Feel your lips vibrate",
            "Make sure it's voiced (feel your throat)",
            "Not like 'p' which is quieter"
        ],
        "mouth_position_guide": "Lips together, then pop them open with voice",
        "tags": ["english", "objects", "basic"],
        "points": 10,
        "is_active": True
    },
    {
        "title": "Cat - Practice 'K' Sound",
        "description": "Master the 'k' sound at the beginning of words",
        "target_word": "cat",
        "target_phoneme": "k",
        "difficulty": "easy",
        "exercise_type": "word",
        "language": "en",
        "instructions": [
            "Lift the back of your tongue",
            "Touch it to the roof of your mouth",
            "Release air suddenly: 'k'",
            "Add 'at': cat"
        ],
        "tips": [
            "The sound comes from the back of your mouth",
            "It should be sharp and quick",
            "Not from the front like 't'"
        ],
        "mouth_position_guide": "Back of tongue touches soft palate, then releases",
        "tags": ["english", "animals", "basic"],
        "points": 10,
        "is_active": True
    },
    
    # Medium Level Exercises
    {
        "title": "Rainbow - Practice 'R' Sound",
        "description": "Learn the challenging 'r' sound",
        "target_word": "rainbow",
        "target_phoneme": "r",
        "difficulty": "medium",
        "exercise_type": "word",
        "language": "en",
        "instructions": [
            "Curl your tongue slightly back",
            "Don't touch the roof of your mouth",
            "Make your voice rumble: 'rrr'",
            "Practice slowly first"
        ],
        "tips": [
            "Your tongue should float in your mouth",
            "Feel the vibration",
            "Common mistake: touching your tongue to roof"
        ],
        "mouth_position_guide": "Tongue curled back without touching anything, lips slightly rounded",
        "tags": ["english", "nature", "challenging"],
        "points": 15,
        "is_active": True
    },
    {
        "title": "விளையாட்டு - Say 'Vilaiyaattu' (Game)",
        "description": "Multi-syllable Tamil word practice",
        "target_word": "விளையாட்டு",
        "target_phoneme": "l",
        "difficulty": "medium",
        "exercise_type": "word",
        "language": "ta",
        "instructions": [
            "Break it into parts: Vi-lai-yaat-tu",
            "Practice each part separately",
            "Slowly combine them",
            "Speed up gradually"
        ],
        "tips": [
            "Don't rush",
            "Focus on the 'l' sound in 'lai'",
            "Keep it smooth"
        ],
        "tags": ["tamil", "activities", "multi-syllable"],
        "points": 15,
        "is_active": True
    },
    
    # Sentence Level - Hard
    {
        "title": "Sentence: The Sun Shines",
        "description": "Practice a complete sentence with 's' and 'sh' sounds",
        "target_word": "The sun shines",
        "target_phoneme": "s",
        "difficulty": "hard",
        "exercise_type": "sentence",
        "language": "en",
        "instructions": [
            "Practice 's' in 'sun'",
            "Practice 'sh' in 'shines'",
            "Notice they're different",
            "Say the whole sentence smoothly"
        ],
        "tips": [
            "'s' is sharp and thin",
            "'sh' is softer and wider",
            "Don't confuse them"
        ],
        "tags": ["english", "sentences", "s-sounds"],
        "points": 20,
        "is_active": True
    },
    
    # Phoneme-Focused Exercises
    {
        "title": "த - 'Tha' Sound Practice",
        "description": "Master the Tamil 'த' phoneme",
        "target_word": "த",
        "target_phoneme": "th",
        "difficulty": "medium",
        "exercise_type": "phoneme",
        "language": "ta",
        "instructions": [
            "Place tongue tip behind upper teeth",
            "Gently push air",
            "Make the 'th' sound",
            "Practice: tha, thi, thu"
        ],
        "tips": [
            "Soft dental sound",
            "Tongue touches teeth gently",
            "Different from English 'th'"
        ],
        "mouth_position_guide": "Tongue tip at upper teeth, gentle airflow",
        "tags": ["tamil", "phoneme", "dental"],
        "points": 15,
        "is_active": True
    }
]

async def seed_database():
    """Seed the database with sample exercises"""
    
    print("🌱 Starting database seeding...")
    
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.MONGODB_DATABASE]
        
        print(f"✅ Connected to MongoDB: {settings.MONGODB_DATABASE}")
        
        # Clear existing exercises (optional - comment out if you want to keep existing)
        # await db.exercises.delete_many({})
        # print("🗑️  Cleared existing exercises")
        
        # Insert sample exercises
        exercises_collection = db.exercises
        
        # Add timestamps to each exercise
        for exercise in SAMPLE_EXERCISES:
            exercise['created_at'] = datetime.utcnow()
        
        result = await exercises_collection.insert_many(SAMPLE_EXERCISES)
        
        print(f"✅ Inserted {len(result.inserted_ids)} sample exercises")
        
        # Create indexes
        await exercises_collection.create_index("language")
        await exercises_collection.create_index("difficulty")
        await exercises_collection.create_index("exercise_type")
        await exercises_collection.create_index("target_phoneme")
        await exercises_collection.create_index("is_active")
        
        print("✅ Created database indexes")
        
        # Print summary
        print("\n📊 Database Seed Summary:")
        print(f"   Total Exercises: {len(SAMPLE_EXERCISES)}")
        
        # Count by language
        ta_count = len([e for e in SAMPLE_EXERCISES if e['language'] == 'ta'])
        en_count = len([e for e in SAMPLE_EXERCISES if e['language'] == 'en'])
        
        print(f"   Tamil Exercises: {ta_count}")
        print(f"   English Exercises: {en_count}")
        
        # Count by difficulty
        easy = len([e for e in SAMPLE_EXERCISES if e['difficulty'] == 'easy'])
        medium = len([e for e in SAMPLE_EXERCISES if e['difficulty'] == 'medium'])
        hard = len([e for e in SAMPLE_EXERCISES if e['difficulty'] == 'hard'])
        
        print(f"   Easy: {easy}, Medium: {medium}, Hard: {hard}")
        
        print("\n🎉 Database seeding completed successfully!")
        print("🚀 You can now start the API server and test the exercises")
        
        # Close connection
        client.close()
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        raise

if __name__ == "__main__":
    print("=" * 60)
    print("Speech Therapy Database Seeder")
    print("=" * 60)
    
    asyncio.run(seed_database())
