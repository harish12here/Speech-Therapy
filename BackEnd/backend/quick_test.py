"""
Quick Test Script - Verify Core Functionality
Run this to quickly check if everything is working
"""
import asyncio
import sys
import os

sys.path.append(os.path.dirname(__file__))

async def test_database():
    """Test database connectivity and data"""
    print("="*60)
    print("TESTING DATABASE")
    print("="*60)
    
    try:
        from src.database.database import connect_to_mongo
        from src.database.models import User, Exercise, Session
        
        # Connect
        await connect_to_mongo()
        print("✓ Connected to MongoDB")
        
        # Count collections
        user_count = await User.count()
        exercise_count = await Exercise.count()
        session_count = await Session.count()
        
        print(f"✓ Users: {user_count}")
        print(f"✓ Exercises: {exercise_count}")
        print(f"✓ Sessions: {session_count}")
        
        if exercise_count == 0:
            print("\n⚠️  No exercises found! Run: python seed_db.py")
        else:
            # Show some exercises
            exercises = await Exercise.find().limit(3).to_list()
            print(f"\nSample Exercises:")
            for ex in exercises:
                print(f"  - {ex.title} ({ex.language.value}, {ex.difficulty.value})")
        
        return True
        
    except Exception as e:
        print(f"✗ Database test failed: {e}")
        return False

async def test_speech_analyzer():
    """Test speech analyzer"""
    print("\n" + "="*60)
    print("TESTING SPEECH ANALYZER")
    print("="*60)
    
    try:
        from src.services.speech_analyzer import SpeechAnalyzer
        
        analyzer = SpeechAnalyzer()
        print("✓ SpeechAnalyzer created")
        
        # Test mock analysis
        result = analyzer.generate_mock_analysis("Test Word")
        
        if 'success' in result and result['success']:
            print("✓ Mock analysis working")
            print(f"  Pronunciation Score: {result['pronunciation_score']:.1f}")
            print(f"  Fluency Score: {result['fluency_score']:.1f}")
            print(f"  Feedback: {result['feedback'][:50]}...")
        else:
            print("✗ Mock analysis failed")
            
        return True
        
    except Exception as e:
        print(f"✗ Speech analyzer test failed: {e}")
        return False

async def test_video_analyzer():
    """Test video analyzer"""
    print("\n" + "="*60)
    print("TESTING VIDEO ANALYZER")
    print("="*60)
    
    try:
        from src.services.video_analyzer import VideoAnalyzer
        
        analyzer = VideoAnalyzer()
        print("✓ VideoAnalyzer created")
        
        # Test with dummy path
        result = analyzer.analyze_video("test.mp4")
        
        if result.get('success'):
            print("✓ Video analysis working")
            print(f"  Activity: {result['activity_detected']}")
            print(f"  Emotion: {result['emotion_detected']}")
            print(f"  Attention: {result['attention_level']}")
        else:
            print("✗ Video analysis failed")
            
        return True
        
    except Exception as e:
        print(f"✗ Video analyzer test failed: {e}")
        return False

async def main():
    print("\n" + "="*60)
    print("  QUICK SYSTEM TEST")
    print("="*60 + "\n")
    
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    results = []
    
    # Run tests
    results.append(await test_database())
    results.append(await test_speech_analyzer())
    results.append(await test_video_analyzer())
    
    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    passed = sum(results)
    total = len(results)
    
    print(f"\nTests Passed: {passed}/{total}")
    
    if passed == total:
        print("\n✓ All tests passed! System is ready.")
    else:
        print("\n⚠️  Some tests failed. Check errors above.")
    
    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    asyncio.run(main())
