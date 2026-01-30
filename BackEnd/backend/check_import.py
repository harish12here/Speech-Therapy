# check_import.py
import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.getcwd())

try:
    from src.api import progress
    print("Import successful")
except Exception as e:
    print(f"Import failed: {e}")
    import traceback
    traceback.print_exc()
