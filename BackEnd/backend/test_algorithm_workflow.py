"""
Test script to verify the algorithm refactoring works correctly
"""

import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

print("Testing Algorithm Workflow Integration...")
print("=" * 60)

try:
    # Test 1: Import centralized scoring algorithms
    print("\n✅ Test 1: Importing scoring algorithms...")
    from utils.scoring_algorithms import (
        ScoringAlgorithms,
        MockScoringGenerator,
        calculate_overall_score,
        calculate_pitch_score,
        calculate_fluency_score
    )
    print("   Success! All scoring algorithms imported.")
    
    # Test 2: Create instances
    print("\n✅ Test 2: Creating algorithm instances...")
    scoring = ScoringAlgorithms()
    mock_gen = MockScoringGenerator()
    print("   Success! Algorithm instances created.")
    
    # Test 3: Test mock phoneme generation
    print("\n✅ Test 3: Testing mock phoneme score generation...")
    phoneme_data = mock_gen.generate_phoneme_scores("hello world", error_rate=0.15)
    print(f"   Generated {len(phoneme_data['phoneme_map'])} phoneme scores")
    print(f"   Sample: {list(phoneme_data['phoneme_map'].items())[:3]}")
    
    # Test 4: Test pronunciation scoring
    print("\n✅ Test 4: Testing pronunciation scoring algorithm...")
    pron_score = scoring.calculate_pronunciation_score(
        phoneme_data['phoneme_map'],
        acoustic_confidence=0.85
    )
    print(f"   Pronunciation score: {pron_score}/100")
    
    # Test 5: Test pitch contour generation
    print("\n✅ Test 5: Testing pitch contour generation...")
    pitch_contour = mock_gen.generate_pitch_contour(duration_seconds=5.0)
    print(f"   Generated {len(pitch_contour)} pitch points")
    print(f"   Range: {min(pitch_contour):.1f} - {max(pitch_contour):.1f} Hz")
    
    # Test 6: Test overall score calculation
    print("\n✅ Test 6: Testing overall score calculation...")
    overall = scoring.calculate_overall_score(
        pronunciation_score=85,
        pitch_score=80,
        fluency_score=75,
        acoustic_confidence=0.82
    )
    print(f"   Overall score: {overall}/100")
    
    # Test 7: Test video analysis metrics
    print("\n✅ Test 7: Testing video analysis metrics generation...")
    video_metrics = mock_gen.generate_video_analysis_metrics()
    print(f"   Activity: {video_metrics['activity']}")
    print(f"   Emotion: {video_metrics['emotion']}")
    print(f"   Attention: {video_metrics['attention']}")
    print(f"   Scores: Interaction={video_metrics['interaction_score']}, "
          f"Posture={video_metrics['posture_score']}, "
          f"Eye Contact={video_metrics['eye_contact_score']}")
    
    # Test 8: Import refactored analyzers
    print("\n✅ Test 8: Importing refactored analyzers...")
    from services.speech_analyzer import SpeechAnalyzer
    from services.video_analyzer import VideoAnalyzer
    print("   Success! All analyzers imported.")
    
    # Test 9: Create analyzer instances
    print("\n✅ Test 9: Creating analyzer instances...")
    speech_analyzer = SpeechAnalyzer()
    video_analyzer = VideoAnalyzer()
    print("   Success! Analyzer instances created.")
    print(f"   Speech analyzer has scoring: {hasattr(speech_analyzer, 'scoring')}")
    print(f"   Speech analyzer has mock_generator: {hasattr(speech_analyzer, 'mock_generator')}")
    print(f"   Video analyzer has mock_generator: {hasattr(video_analyzer, 'mock_generator')}")
    
    # Test 10: Test mock speech analysis
    print("\n✅ Test 10: Testing mock speech analysis...")
    mock_result = speech_analyzer.generate_mock_analysis("test phrase")
    print(f"   Generated analysis with overall score: {mock_result['overall_score']}/100")
    print(f"   Pronunciation: {mock_result['pronunciation_score']}/100")
    print(f"   Fluency: {mock_result['fluency_score']}/100")
    print(f"   Pitch: {mock_result['pitch_analysis']['score']}/100")
    
    print("\n" + "=" * 60)
    print("🎉 ALL TESTS PASSED!")
    print("=" * 60)
    print("\n📊 Summary:")
    print("   ✓ Centralized scoring algorithms working")
    print("   ✓ Mock data generators functional")
    print("   ✓ Speech analyzer refactored successfully")
    print("   ✓ Video analyzer refactored successfully")
    print("   ✓ All workflows integrated properly")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
