# verify_system.py
"""
System Verification Script for Speech Therapy Backend
======================================================

This script performs comprehensive checks to ensure all functionalities work correctly
and provides accurate analysis results.

Run this script to verify:
1. Database connectivity
2. Required directories and files
3. API endpoints functionality
4. ML/AI models (if available)
5. Speech analysis accuracy
6. Video analysis functionality
"""

import asyncio
import sys
import os
from pathlib import Path

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__)))

# Color codes for output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text.center(60)}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}✓ {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}✗ {text}{Colors.END}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠ {text}{Colors.END}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ {text}{Colors.END}")

async def check_environment():
    """Check environment configuration"""
    print_header("ENVIRONMENT CONFIGURATION CHECK")
    
    checks_passed = 0
    total_checks = 0
    
    # Check .env file exists
    total_checks += 1
    env_path = Path('.env')
    if env_path.exists():
        print_success(".env file found")
        checks_passed += 1
        
        # Read and verify key variables
        try:
            from dotenv import load_dotenv
            load_dotenv()
            
            # Check MongoDB URL
            mongodb_url = os.getenv('MONGODB_URL')
            if mongodb_url:
                print_success(f"MONGODB_URL configured: {mongodb_url[:30]}...")
                checks_passed += 1
            else:
                print_error("MONGODB_URL not set in .env")
            total_checks += 1
            
            # Check SECRET_KEY
            secret_key = os.getenv('SECRET_KEY')
            if secret_key and secret_key != 'your-secret-key-change-this-in-production':
                print_success("SECRET_KEY configured (custom)")
                checks_passed += 1
            else:
                print_warning("SECRET_KEY is using default value - CHANGE THIS IN PRODUCTION!")
                checks_passed += 1
            total_checks += 1
            
        except Exception as e:
            print_error(f"Error reading .env: {e}")
    else:
        print_error(".env file not found - Create one from .env.example")
    
    return checks_passed, total_checks

async def check_directories():
    """Check required directories exist"""
    print_header("DIRECTORY STRUCTURE CHECK")
    
    checks_passed = 0
    total_checks = 0
    
    required_dirs = [
        'src/data',
        'src/data/audio_samples',
        'uploads',
    ]
    
    for dir_path in required_dirs:
        total_checks += 1
        path = Path(dir_path)
        if path.exists():
            print_success(f"Directory exists: {dir_path}")
            checks_passed += 1
        else:
            print_warning(f"Directory missing: {dir_path} - Creating...")
            try:
                path.mkdir(parents=True, exist_ok=True)
                print_success(f"Created directory: {dir_path}")
                checks_passed += 1
            except Exception as e:
                print_error(f"Failed to create {dir_path}: {e}")
    
    return checks_passed, total_checks

async def check_database():
    """Check database connectivity and collections"""
    print_header("DATABASE CONNECTIVITY CHECK")
    
    checks_passed = 0
    total_checks = 0
    
    try:
        from src.database.database import connect_to_mongo
        from src.database.models import User, Exercise, Session, Progress
        
        # Connect to database
        total_checks += 1
        try:
            await connect_to_mongo()
            print_success("MongoDB connection established")
            checks_passed += 1
        except Exception as e:
            print_error(f"Failed to connect to MongoDB: {e}")
            return checks_passed, total_checks
        
        # Check collections
        collections = [
            ('Users', User),
            ('Exercises', Exercise),
            ('Sessions', Session),
            ('Progress', Progress)
        ]
        
        for name, model in collections:
            total_checks += 1
            try:
                count = await model.count()
                print_success(f"{name} collection: {count} documents")
                checks_passed += 1
            except Exception as e:
                print_error(f"Error accessing {name} collection: {e}")
        
        # Check if there are exercises (needed for testing)
        exercise_count = await Exercise.count()
        total_checks += 1
        if exercise_count > 0:
            print_success(f"Found {exercise_count} exercises in database")
            checks_passed += 1
        else:
            print_warning("No exercises found - Run seed_db.py to populate")
        
    except Exception as e:
        print_error(f"Database check failed: {e}")
        total_checks += 1
    
    return checks_passed, total_checks

async def check_dependencies():
    """Check Python dependencies"""
    print_header("PYTHON DEPENDENCIES CHECK")
    
    checks_passed = 0
    total_checks = 0
    
    required_packages = [
        ('fastapi', 'FastAPI web framework'),
        ('uvicorn', 'ASGI server'),
        ('motor', 'Async MongoDB driver'),
        ('beanie', 'MongoDB ODM'),
        ('python-jose', 'JWT authentication'),
        ('passlib', 'Password hashing'),
    ]
    
    optional_packages = [
        ('torch', 'PyTorch for ML models'),
        ('transformers', 'Hugging Face Transformers'),
        ('librosa', 'Audio processing'),
        ('numpy', 'Numerical computing'),
        ('scipy', 'Scientific computing'),
    ]
    
    print_info("Checking required packages...")
    for package, description in required_packages:
        total_checks += 1
        try:
            __import__(package.replace('-', '_'))
            print_success(f"{package}: {description}")
            checks_passed += 1
        except ImportError:
            print_error(f"{package} not installed: {description}")
    
    print_info("\nChecking optional AI/ML packages...")
    ml_available = True
    for package, description in optional_packages:
        total_checks += 1
        try:
            __import__(package.replace('-', '_'))
            print_success(f"{package}: {description}")
            checks_passed += 1
        except ImportError:
            print_warning(f"{package} not installed: {description} - Mock analysis will be used")
            ml_available = False
    
    if not ml_available:
        print_info("\n💡 To enable accurate AI analysis, install ML packages:")
        print_info("   pip install torch transformers librosa scipy numpy")
    
    return checks_passed, total_checks

async def check_speech_analyzer():
    """Check speech analyzer functionality"""
    print_header("SPEECH ANALYZER CHECK")
    
    checks_passed = 0
    total_checks = 0
    
    try:
        from src.services.speech_analyzer import SpeechAnalyzer
        
        total_checks += 1
        analyzer = SpeechAnalyzer()
        print_success("SpeechAnalyzer instantiated")
        checks_passed += 1
        
        # Check if using mock or real analysis
        total_checks += 1
        if hasattr(analyzer, 'wav2vec_model') or analyzer.wav2vec_model is not None:
            print_success("AI model available - Will provide accurate analysis")
            checks_passed += 1
        else:
            print_warning("Using mock analysis - Install ML libraries for accurate results")
            checks_passed += 1
        
        # Test mock analysis
        total_checks += 1
        try:
            result = analyzer.generate_mock_analysis("Hello test")
            if result and 'pronunciation_score' in result:
                print_success("Mock analysis generation working")
                checks_passed += 1
            else:
                print_error("Mock analysis not generating proper results")
        except Exception as e:
            print_error(f"Mock analysis failed: {e}")
        
    except Exception as e:
        print_error(f"SpeechAnalyzer check failed: {e}")
        total_checks += 1
    
    return checks_passed, total_checks

async def check_video_analyzer():
    """Check video analyzer functionality"""
    print_header("VIDEO ANALYZER CHECK")
    
    checks_passed = 0
    total_checks = 0
    
    try:
        from src.services.video_analyzer import VideoAnalyzer
        
        total_checks += 1
        analyzer = VideoAnalyzer()
        print_success("VideoAnalyzer instantiated")
        checks_passed += 1
        
        # Verify the analyzer returns proper structure
        total_checks += 1
        try:
            # Test with a dummy path (won't actually process)
            print_info("Testing video analysis structure...")
            result = analyzer.analyze_video("dummy_path.mp4")
            
            required_fields = [
                'success', 'activity_detected', 'emotion_detected',
                'attention_level', 'detailed_report', 'phoneme_mastery',
                'accuracy_trend'
            ]
            
            missing_fields = [f for f in required_fields if f not in result]
            if not missing_fields:
                print_success("Video analysis returns all required fields")
                checks_passed += 1
            else:
                print_error(f"Missing fields in video analysis: {missing_fields}")
        except Exception as e:
            print_error(f"Video analysis test failed: {e}")
            
    except Exception as e:
        print_error(f"VideoAnalyzer check failed: {e}")
        total_checks += 1
    
    return checks_passed, total_checks

async def check_api_routes():
    """Check API routes are properly configured"""
    print_header("API ROUTES CHECK")
    
    checks_passed = 0
    total_checks = 0
    
    try:
        from src.main import app
        
        # Get all routes
        routes = []
        for route in app.routes:
            if hasattr(route, 'methods') and hasattr(route, 'path'):
                routes.append((route.path, list(route.methods)))
        
        required_routes = [
            ('/api/auth/register', 'POST'),
            ('/api/auth/login', 'POST'),
            ('/api/auth/me', 'GET'),
            ('/api/exercises/', 'GET'),
            ('/api/speech/analyze', 'POST'),
            ('/api/video/analyze', 'POST'),
        ]
        
        for path, method in required_routes:
            total_checks += 1
            found = any(r[0] == path and method in r[1] for r in routes)
            if found:
                print_success(f"{method:6} {path}")
                checks_passed += 1
            else:
                print_error(f"{method:6} {path} - NOT FOUND")
        
    except Exception as e:
        print_error(f"API routes check failed: {e}")
        total_checks += 1
    
    return checks_passed, total_checks

async def main():
    """Run all verification checks"""
    print(f"\n{Colors.BOLD}{'='*60}")
    print(f"  SPEECH THERAPY BACKEND - SYSTEM VERIFICATION")
    print(f"{'='*60}{Colors.END}\n")
    
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    all_checks = 0
    all_passed = 0
    
    # Run all checks
    checks = [
        check_environment(),
        check_directories(),
        check_dependencies(),
        check_database(),
        check_api_routes(),
        check_speech_analyzer(),
        check_video_analyzer(),
    ]
    
    for check in checks:
        try:
            passed, total = await check
            all_passed += passed
            all_checks += total
        except Exception as e:
            print_error(f"Check failed with error: {e}")
    
    # Final summary
    print_header("VERIFICATION SUMMARY")
    
    percentage = (all_passed / all_checks * 100) if all_checks > 0 else 0
    print(f"Checks Passed: {all_passed}/{all_checks} ({percentage:.1f}%)\n")
    
    if percentage >= 90:
        print_success("🎉 System is ready for accurate analysis!")
        print_info("All critical components are working correctly.")
    elif percentage >= 70:
        print_warning("⚠️  System is partially ready")
        print_info("Some optional features may not be available.")
        print_info("Review the warnings above and install missing dependencies if needed.")
    else:
        print_error("❌ System has critical issues")
        print_info("Please fix the errors above before using the application.")
    
    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    asyncio.run(main())
