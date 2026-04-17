# Speech Therapy Analysis Workflow Documentation

## Overview

This document explains the algorithmic workflow used throughout the backend for speech therapy analysis. All random math functions have been organized into a centralized scoring system for maintainability and consistency.

## Architecture

### Centralized Scoring Module
**Location**: `src/utils/scoring_algorithms.py`

This module contains all mathematical algorithms used for scoring and analysis:

1. **ScoringAlgorithms**: Main class containing production algorithms
2. **MockScoringGenerator**: Class for generating realistic mock data for testing/fallback

## Analysis Workflows

### 1. Speech Analysis Workflow (`speech_analyzer.py`)

**Main Flow:**
```
Audio Input
    ↓
1. Load AI Models (Wav2Vec2)
    ↓
2. Process Audio
    ↓
3. Extract Features & Phoneme Scores
    ↓
4. Calculate Pitch (using algorithm)
    ↓
5. Calculate Fluency (using algorithm)
    ↓
6. Calculate Overall Score (using weighted algorithm)
    ↓
7. Generate Comprehensive Feedback
    ↓
Result Output
```

**Key Algorithms:**

#### Pitch Analysis Algorithm
```python
def analyze_pitch(audio):
    """
    1. Extract pitch using pYIN
    2. Filter silence using energy masking
    3. Calculate statistics (mean, std deviation)
    4. Score using algorithm:
       - Ideal pitch variation: 20-40 Hz
       - Monotone (<12 Hz): -30 points
       - Unstable (>70 Hz): -20 points
       - Low voice activity: -15 points
    5. Return score + pitch contour
    """
```

#### Fluency Analysis Algorithm
```python
def analyze_fluency(audio):
    """
    1. Extract RMS energy
    2. Calculate adaptive threshold (15th percentile)
    3. Detect pauses (>250ms silence)
    4. Calculate metrics:
       - silence_ratio
       - pauses_per_second
    5. Score using algorithm:
       - Optimal silence ratio: 0.1-0.25
       - Optimal pause rate: 0.2-0.5/sec
       - Penalties for deviations
    6. Return fluency score
    """
```

#### Overall Score Algorithm
```python
def calculate_overall_score(pronunciation, pitch, fluency, confidence):
    """
    Weighted combination:
    - Pronunciation: 50%
    - Acoustic Confidence: 20%
    - Fluency: 20%
    - Pitch: 10%
    
    Formula:
    overall = (pronunciation × 0.50) + 
              (confidence × 100 × 0.20) + 
              (fluency × 0.20) + 
              (pitch × 0.10)
    """
```

### 2. Video Analysis Workflow (`video_analyzer.py`)

**Main Flow:**
```
Video Input
    ↓
1. Generate Activity Detection Metrics
    ↓
2. Calculate Engagement Scores (algorithmic)
    ↓
3. Analyze Phoneme Mastery Patterns
    ↓
4. Generate Temporal Accuracy Trends
    ↓
5. Analyze Posture & Eye Contact
    ↓
6. Compile Comprehensive Feedback
    ↓
Result Output
```

**Key Algorithms:**

#### Activity Detection
```python
def analyze_video(file_path):
    """
    1. Generate metrics using MockScoringGenerator
       - Activity type
       - Emotion detection
       - Attention level
       - Interaction scores
    
    2. Contextual Report Generation
       - Algorithm: Template selection based on attention level
       - High attention → Positive template
       - Low attention → Improvement-focused template
    
    3. Improvement Area Analysis
       - Algorithm: Threshold-based selection
       - Eye contact < 70 → Needs improvement
       - Interaction < 75 → Focus on pronunciation
       - Low attention → Improve rhythm
    """
```

#### Phoneme Mastery Algorithm
```python
def calculate_phoneme_mastery():
    """
    Uses normal distribution for realistic scoring:
    - Mean: 75
    - Std Dev: 15
    - Range: 40-100 (clamped)
    
    Status determination:
    - Score ≥ 80: "Mastered"
    - Score ≥ 60: "Developing"  
    - Score < 60: "Needs Practice"
    """
```

#### Accuracy Timeline Algorithm
```python
def generate_accuracy_timeline(num_points=10):
    """
    Random walk with upward bias:
    - Start: Random(50-80)
    - Step: Random(-3, 7)  # Slight upward bias
    - Range: Clamped to 0-100
    
    Simulates natural learning progression
    """
```

## Mock Data Generation

For testing and fallback scenarios, mock data is generated using controlled algorithms:

### Mock Phoneme Scores
```python
def generate_phoneme_scores(text, error_rate=0.15):
    """
    For each character:
    - 15% chance of error (default)
    - Error: score 30-60, status "distorted"
    - Success: score 80-100, status "correct"
    """
```

### Mock Pitch Contour
```python
def generate_pitch_contour(duration, base_pitch=140, variation=30):
    """
    - 5 points per second
    - Natural variation: ±variation/2
    - Trending around base_pitch
    - Range: [base-variation, base+variation]
    """
```

## Scoring Thresholds

### Performance Categories

| Score Range | Category | Feedback Level |
|------------|----------|----------------|
| 85-100 | Excellent | "Excellent performance!" |
| 70-84 | Good | "Good job, keep practicing." |
| 60-69 | Developing | "Good effort, needs improvement" |
| 0-59 | Needs Practice | Detailed improvement suggestions |

### Component Thresholds

**Pitch:**
- 80+: Good pitch control
- 60-79: Acceptable
- <60: Needs improvement

**Fluency:**
- 80+: Fluid speech flow
- 60-79: Acceptable fluency
- <60: Needs improvement in pacing

**Pronunciation:**
- Character score <60: Mispronounced
- Character score 60-79: Needs practice
- Character score 80+: Well pronounced

## API Integration

### Speech Analysis Endpoint (`/api/speech/analyze`)

**Request Flow:**
```
1. Upload audio file
2. Save temporarily
3. Call speech_analyzer.analyze_audio()
   ├─ AI Analysis (if available)
   │  ├─ Transcribe using Wav2Vec2
   │  ├─ Compare with reference text
   │  ├─ Calculate phoneme scores
   │  ├─ Analyze pitch (algorithm)
   │  ├─ Analyze fluency (algorithm)
   │  └─ Calculate overall score (algorithm)
   └─ Mock Analysis (fallback)
      ├─ Generate phoneme scores (algorithm)
      ├─ Generate pitch contour (algorithm)
      └─ Calculate overall score (algorithm)
4. Save session to database
5. Update user progress
6. Return results to frontend
```

## Frontend Integration

### TherapySession Component

**Analysis Display Flow:**
```
User Records Audio
    ↓
Send to Backend API
    ↓
Receive Analysis Results
    ├─ overall_score
    ├─ pronunciation_score
    ├─ pitch_analysis
    │  ├─ score
    │  ├─ pitch_contour (for visualization)
    │  └─ statistics
    ├─ fluency_score
    ├─ mispronounced_phonemes
    ├─ suggestions
    ├─ strengths
    └─ areas_to_improve
    ↓
Display in FeedbackPanel
```

## Benefits of Centralized Algorithms

1. **Maintainability**: All scoring logic in one place
2. **Consistency**: Same algorithms across all components
3. **Testability**: Easy to unit test individual algorithms
4. **Transparency**: Clear documentation of how scores are calculated
5. **Flexibility**: Easy to adjust weights and thresholds
6. **Scalability**: Can swap mock generators with real ML models without changing API

## Future Improvements

1. **Machine Learning Integration**: Replace mock algorithms with trained models
2. **Personalized Scoring**: Adapt thresholds based on user history
3. **Real-time Analysis**: Stream processing for live feedback
4. **Multi-language Support**: Language-specific phoneme analysis
5. **Advanced Metrics**: Voice quality, emotion detection, speaking rate

## Testing

All algorithms are deterministic given the same input (except mock data which uses controlled randomness). This allows for:

- Unit testing of individual algorithms
- Integration testing with known audio samples
- Regression testing to ensure consistent scoring
- Performance benchmarking

## Version History

- **v1.0**: Initial implementation with scattered random functions
- **v2.0**: Centralized algorithms in scoring_algorithms.py
- **v2.1**: Documented workflow and added algorithmic transparency
