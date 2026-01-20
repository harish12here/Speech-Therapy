import asyncio
import os
import sys

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from src.database.database import connect_to_mongo
from src.database.models import User, UserRole, LanguageCode
from src.api.auth import get_password_hash

async def create_users():
    try:
        await connect_to_mongo()
        
        # User 1: The one from the screenshot
        email = "harishg@gmail.com"
        username = "Harish"
        password = "password123"
        
        existing = await User.find_one(User.email == email)
        if not existing:
            user = User(
                email=email,
                username=username,
                password_hash=get_password_hash(password),
                role=UserRole.CHILD,
                age=6,
                language_preference=LanguageCode.ENGLISH,
                regional_language=LanguageCode.TAMIL
            )
            await user.insert()
            print(f"✅ Created user: {email} / {password}")
        else:
            print(f"ℹ️  User already exists: {email}")
            # Optional: Update password
            # existing.password_hash = get_password_hash(password)
            # await existing.save()
            # print(f"✅ Updated password for: {email}")

        print("Done!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(create_users())
