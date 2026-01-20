import requests
import time

def debug_endpoint():
    # 1. Get an exercise ID
    try:
        r = requests.get("http://localhost:8000/api/exercises/")
        exercises = r.json()
        if not exercises:
            print("No exercises found.")
            return
        exercise_id = exercises[0]['id']
        print(f"Using Exercise ID: {exercise_id}")
    except Exception as e:
        print(f"Failed to fetch exercises: {e}")
        return

    # 2. Upload dummy audio
    # Create a dummy file. 
    # Note: 'librosa' will definitely fail to load this text file as audio,
    # but we want to see if we get a 500 JSON response or a Connection Error.
    files = {
        'audio': ('test.wav', b'RIFF....WAVEfmt ... data....', 'audio/wav') 
    }
    data = {'exercise_id': exercise_id}
    
    print("Sending request...")
    try:
        start = time.time()
        r = requests.post("http://localhost:8000/api/speech/analyze", files=files, data=data)
        print(f"Status Code: {r.status_code}")
        print(f"Response: {r.text}")
        print(f"Time taken: {time.time() - start:.2f}s")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    debug_endpoint()
