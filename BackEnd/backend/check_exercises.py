# check_exercises.py
import asyncio
import sys
sys.path.append('.')

async def check_exercises():
    from src.database.database import connect_to_mongo
    from src.database.models import Exercise
    
    await connect_to_mongo()
    count = await Exercise.count()
    print(f"Exercises in database: {count}")
    
    if count > 0:
        exercises = await Exercise.find().limit(5).to_list()
        print("\nExercises:")
        for e in exercises:
            print(f"  - {e.title} ({e.language.value}, {e.difficulty.value})")
    else:
        print("\nNo exercises found. Run: python seed_db.py")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(check_exercises())
