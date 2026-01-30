# seed_db.py
import asyncio
import os
import sys

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from src.database.database import connect_to_mongo
from src.database.models import Exercise, ExerciseType, DifficultyLevel, LanguageCode

async def seed():
    try:
        await connect_to_mongo()
        
        # Check if we should clear
        # await Exercise.delete_all()
        # print("Cleared existing exercises")

        # Define data
        exercises_data = [
            {
                "title": "Amma (Mother)",
                "description": "Practice saying 'Amma' - the word for Mother in Tamil",
                "target_word": "அம்மா",
                "target_phoneme": "m",
                "difficulty": DifficultyLevel.EASY,
                "exercise_type": ExerciseType.WORD,
                "language": LanguageCode.TAMIL,
                "visual_aid_url": "👩‍👧",
                "tips": ["Open mouth wide for 'A'", "Press lips together for 'mm'"],
                "points": 10
            },
            {
                "title": "Appa (Father)",
                "description": "Practice saying 'Appa' - the word for Father in Tamil",
                "target_word": "அப்பா",
                "target_phoneme": "p",
                "difficulty": DifficultyLevel.EASY,
                "exercise_type": ExerciseType.WORD,
                "language": LanguageCode.TAMIL,
                "visual_aid_url": "👨‍👧",
                "tips": ["Press lips for 'pp'", "Release air suddenly"],
                "points": 10
            },
            {
                "title": "Poo (Flower)",
                "description": "Say 'Poo' clearly",
                "target_word": "பூ",
                "target_phoneme": "p",
                "difficulty": DifficultyLevel.EASY,
                "exercise_type": ExerciseType.WORD,
                "language": LanguageCode.TAMIL,
                "visual_aid_url": "🌸",
                "tips": ["Round your lips", "Blow air out"],
                "points": 10
            },
            {
                "title": "Say 'Hello'",
                "description": "Basic greeting",
                "target_word": "Hello",
                "target_phoneme": "h",
                "difficulty": DifficultyLevel.EASY,
                "exercise_type": ExerciseType.WORD,
                "language": LanguageCode.ENGLISH,
                "visual_aid_url": "👋",
                "tips": ["Exhale gently"],
                "points": 10
            },
             {
                "title": "Cat",
                "description": "Say 'Cat'",
                "target_word": "Cat",
                "target_phoneme": "k",
                "difficulty": DifficultyLevel.MEDIUM,
                "exercise_type": ExerciseType.WORD,
                "language": LanguageCode.ENGLISH,
                "visual_aid_url": "🐱",
                "tips": ["Back of tongue touches roof of mouth"],
                "points": 15
            }
        ]

        # Insert if not exists (by title)
        for data in exercises_data:
            existing = await Exercise.find_one(Exercise.title == data["title"])
            if not existing:
                ex = Exercise(**data)
                await ex.insert()
                print(f"Inserted: {data['title']}")
            else:
                print(f"Skipped (Exists): {data['title']}")

        print("Seeding complete!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Windows SelectorPolicy fix for asyncio
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(seed())
