#backend\src\services\speech_analyzer.py
import json
from typing import Dict, List, Tuple
import random
from difflib import SequenceMatcher

try:
    import numpy as np
    import librosa
    import torch
    from scipy.spatial.distance import cosine
    from scipy.signal import find_peaks
    from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
    HAS_AI_LIBS = True
except ImportError as e:
    print(f"⚠️ AI Libraries missing: {e}. Using Mock Analysis.")
    HAS_AI_LIBS = False

from src.models.wav2vec2_model import get_wav2vec2_model

class SpeechAnalyzer:
    def __init__(self):
        self.sample_rate = 16000
        self.model_wrapper = None
        
    def ensure_models_loaded(self):
        if HAS_AI_LIBS and self.model_wrapper is None:
            self.load_models()

    def load_models(self):
        """Load the accurate Wav2Vec2 model via the model utility"""
        if not HAS_AI_LIBS:
            return
            
        try:
            self.model_wrapper = get_wav2vec2_model()
            print("✅ Accurate Wav2Vec2 model loaded")
        except Exception as e:
            print(f"⚠️  Could not load Wav2Vec2: {e}")
            self.model_wrapper = None
    
    def analyze_audio(self, audio_path: str, reference_text: str) -> Dict:
        """
        Analyze child's speech audio
        Returns: Comprehensive analysis results
        """
        if not HAS_AI_LIBS:
            return self.generate_mock_analysis(reference_text)

        self.ensure_models_loaded()
        try:
            # 1. New Accurate Analysis using the Model Wrapper
            language = "tamil" if any(ord(c) > 127 for c in reference_text) else "english"
            analysis = self.model_wrapper.analyze_pronunciation(audio_path, reference_text, language=language)
            
            transcription = analysis["transcription"]
            pronunciation_score = analysis["overall_score"]
            phoneme_reports = analysis["phoneme_reports"]
            
            # Load audio for other analyses
            audio, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            # 2. Pitch analysis
            pitch_results = self.analyze_pitch(audio)
            
            # 3. Fluency analysis
            fluency_score = self.analyze_fluency(audio)
            
            # 4. Feature extraction
            features = self.model_wrapper.extract_features(audio)
            
            # Map phoneme reports to the format expected by the frontend
            phoneme_scores = {}
            for report in phoneme_reports:
                char = report["expected"]
                if char not in phoneme_scores:
                    phoneme_scores[char] = {"score": report["score"] * 100, "status": report["status"]}
            
            # Calculate final overall score (blend of pronunciation, pitch, and fluency)
            # Pronunciation is weighted most heavily (60%)
            final_score = (pronunciation_score * 0.6) + (pitch_results['score'] * 0.15) + (fluency_score * 0.25)
            final_score = int(min(100, final_score))

            # Generate feedback
            feedback = self.generate_feedback(
                final_score,
                phoneme_scores,
                pitch_results,
                fluency_score
            )
            
            return {
                "success": True,
                "overall_score": final_score,
                "pronunciation_score": final_score,
                "phoneme_scores": phoneme_scores,
                "pitch_analysis": pitch_results,
                "fluency_score": fluency_score,
                "feature_vector": features.tolist() if hasattr(features, 'tolist') else [],
                "feedback": feedback,
                "mispronounced_phonemes": [p["expected"] for p in phoneme_reports if p["score"] < 0.5],
                "suggestions": self.get_suggestions(phoneme_scores, pitch_results),
                "transcription": transcription,
                "acoustic_confidence": analysis.get("acoustic_confidence", 0),
                "strengths": self.get_strengths(final_score, pitch_results, fluency_score),
                "areas_to_improve": self.get_improvements(phoneme_scores, pitch_results, fluency_score)
            }
            
        except Exception as e:
            print(f"Analysis Failed: {e}")
            import traceback
            traceback.print_exc()
            return self.generate_mock_analysis(reference_text)

    def generate_mock_analysis(self, reference_text):
        """Generate fake analysis data for testing/fallback"""
        score = random.randint(65, 95)
        
        # Mock logic preserved for graceful degradation
        features = []
        mispronounced = []
        if score < 85:
            chars = list(set([c for c in reference_text if c.isalnum()]))
            if chars:
                mispronounced = random.sample(chars, k=min(len(chars), random.randint(1, 3)))
        
        possible_strengths = ["Good vocal energy", "Clear articulation", "Steady pace"]
        possible_improvements = ["Focus on specific sounds", "Watch pauses", "Maintain pitch"]
        
        strengths = random.sample(possible_strengths, k=random.randint(2, 3))
        improvements = random.sample(possible_improvements, k=random.randint(1, 2)) if score < 90 else []
        
        return {
            "success": True,
            "overall_score": score,
            "pronunciation_score": score,
            "phoneme_scores": {char: {"score": random.randint(70, 99)} for char in reference_text},
            "pitch_analysis": {
                "score": random.randint(70, 95), 
                "pitch_contour": [random.randint(100, 200) for _ in range(20)]
            },
            "fluency_score": random.randint(80, 100),
            "feature_vector": [],
            "feedback": "Simulation: Libs missing or format unsupported. Install torch/librosa and ffmpeg for real analysis.",
            "mispronounced_phonemes": mispronounced,
            "acoustic_confidence": 0.5,
            "suggestions": ["Ensure audio is in WAV format or install ffmpeg"],
            "strengths": strengths,
            "areas_to_improve": improvements
        }

    def transcribe_audio(self, audio) -> Tuple[str, float]:
        """Transcribe audio using accurate model"""
        if not self.model_wrapper:
            return "", 0.0
        
        result = self.model_wrapper.transcribe(audio)
        return result["text"], result["confidence"]

    def analyze_phonemes_real(self, transcription: str, reference_text: str, confidence: float) -> Dict:
        """
        Real phoneme/pronunciation analysis by comparing transcription to reference.
        Since we don't have a phoneme-aligned dictionary, we use character-level matching
        as a proxy for phonemes.
        """
        ref_norm = reference_text.lower()
        
        # Calculate similarity
        matcher = SequenceMatcher(None, ref_norm, transcription)
        
        scores = {}
        # Iterate over characters in reference text as "phonemes"
        for i, char in enumerate(ref_norm):
            if not char.isalnum():
                continue
                
            # Find if this character was matched in the opcodes
            # This is a heuristic: if the block containing this char is 'equal', high score.
            # If 'replace' or 'delete', low score.
            
            char_score = 0
            found = False
            for tag, i1, i2, j1, j2 in matcher.get_opcodes():
                if i1 <= i < i2:
                    if tag == 'equal':
                        char_score = 95 # High score for match
                    elif tag == 'replace':
                        char_score = 40 # Low score for wrong char
                    elif tag == 'delete':
                        char_score = 20 # Very low for missing
                    found = True
                    break
            
            if not found:
                char_score = 0
                
            # Adjust by global confidence of the model
            final_score = (char_score * 0.7) + (confidence * 100 * 0.3)
            
            # Key by character (handling duplicates is tricky, using index suffix if needed, but simplistic map here)
            key = f"{char}" 
            if key in scores:
                # Average if multiple occurrences
                scores[key]["score"] = (scores[key]["score"] + final_score) / 2
            else:
                scores[key] = {
                    "score": round(final_score, 1),
                    "confidence": round(confidence, 2)
                }
                
        return scores
    
    def extract_features(self, audio):
        """Extract MFCC and other audio features"""
        mfcc = librosa.feature.mfcc(y=audio, sr=self.sample_rate, n_mfcc=13)
        delta_mfcc = librosa.feature.delta(mfcc)
        return np.vstack([mfcc.mean(axis=1), delta_mfcc.mean(axis=1)]).flatten()
    
    def analyze_pitch(self, audio) -> Dict:
        """Analyze pitch using Librosa pYIN"""
        # pYIN is better than YIN for estimating F0
        f0, voiced_flag, voiced_probs = librosa.pyin(
            audio, 
            fmin=librosa.note_to_hz('C2'), 
            fmax=librosa.note_to_hz('C7'),
            sr=self.sample_rate
        )
        
        # Filter valid pitch
        valid_f0 = f0[~np.isnan(f0)]
        
        if len(valid_f0) == 0:
            return {"score": 0, "pitch_contour": [], "stability": 0}
            
        mean_pitch = np.mean(valid_f0)
        std_pitch = np.std(valid_f0)
        
        # Stability score calculation
        # High std dev -> unstable pitch (not always bad, but for steady text reading, instability might be an issue)
        # However, for intonation, variation is GOOD.
        # Monotone check: if std_pitch is very low (< 10 Hz), it's monotone.
        
        # Let's score based on "Voice Quality" - sustained phonation usually implies stability within a segment, 
        # but here we analyze the whole clip.
        
        # Score strategy:
        # 1. Monotone penalty: std < 5 Hz
        # 2. Extreme instability: std > 100 Hz (cracking voice)
        
        pitch_score = 85 # Base good score
        if std_pitch < 10:
            pitch_score -= 20 # Monotone
        elif std_pitch > 100:
            pitch_score -= 20 # Unstable/Jittery
            
        # Downsample contour for frontend
        contour = valid_f0[::10].tolist() # Every 10th frame
        
        return {
            "mean_pitch": round(float(mean_pitch), 2),
            "std_pitch": round(float(std_pitch), 2),
            "score": max(0, min(100, int(pitch_score))),
            "pitch_contour": contour
        }
    
    def analyze_fluency(self, audio) -> float:
        """Analyze fluency based on pauses and rate"""
        rms_energy = librosa.feature.rms(y=audio)[0]
        threshold = 0.02 # silence threshold
        
        # Detect silence
        is_silence = rms_energy < threshold
        silence_frames = np.sum(is_silence)
        total_frames = len(rms_energy)
        
        # Silence ratio
        silence_ratio = silence_frames / total_frames
        
        # Pause Frequency (number of silence segments > 200ms)
        # approx 200ms at 16000Hz with standard hop (512) -> ~6 frames
        min_pause_frames = 6
        pause_segments = 0
        current_run = 0
        for s in is_silence:
            if s:
                current_run += 1
            else:
                if current_run >= min_pause_frames:
                    pause_segments += 1
                current_run = 0
                
        # Scoring logic
        # Ideal silence ratio for speech: 10-20% (breathing)
        # > 40% -> too hesitant
        # Too many frequent pauses -> bad fluency
        
        fluency_base = 100
        if silence_ratio > 0.4:
            fluency_base -= (silence_ratio - 0.4) * 100 # penalize heavy silence
            
        fluency_base -= (pause_segments * 2) # penalize per pause
        
        return max(0, min(100, int(fluency_base)))
    
    def calculate_overall_score(self, phoneme_scores, pitch_results, fluency_score):
        # Weighted average
        p_scores = [d['score'] for d in phoneme_scores.values()]
        pronunciation = np.mean(p_scores) if p_scores else 0
        
        pitch = pitch_results['score']
        
        overall = (pronunciation * 0.5) + (pitch * 0.2) + (fluency_score * 0.3)
        return int(overall)
        
    def generate_feedback(self, overall, phoneme_scores, pitch, fluency):
        # Dynamic feedback construction
        parts = []
        if overall > 85:
            parts.append("Excellent performance!")
        elif overall > 70:
            parts.append("Good job, keep practicing.")
        else:
            parts.append("Good effort, but needs improvement.")
            
        if fluency < 60:
            parts.append("Try to speak more fluidly with fewer pauses.")
        
        if pitch['score'] < 70:
            if pitch['std_pitch'] < 10:
                parts.append("Try to vary your intonation more.")
                
        return " ".join(parts)

    def get_mispronounced_phonemes(self, phoneme_scores):
        return [p for p, d in phoneme_scores.items() if d['score'] < 60]
        
    def get_suggestions(self, phoneme_scores, pitch_results):
        sugg = []
        bad_phonemes = self.get_mispronounced_phonemes(phoneme_scores)
        if bad_phonemes:
            sugg.append(f"Focus on pronouncing: {', '.join(bad_phonemes[:3])}")
        return sugg

    def get_strengths(self, overall, pitch, fluency):
        s = []
        if overall > 80: s.append("Overall strong pronunciation")
        if pitch['score'] > 80: s.append("Good pitch control")
        if fluency > 80: s.append("Fluid speech flow")
        return s
        
    def get_improvements(self, phoneme_scores, pitch, fluency):
        i = []
        mis = self.get_mispronounced_phonemes(phoneme_scores)
        if mis: i.append("Phoneme accuracy")
        if pitch['score'] < 70: i.append("Pitch usage")
        if fluency < 70: i.append("Speech fluency")
        return i