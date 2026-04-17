"""
backend/src/utils/scoring_algorithms.py

Centralized scoring algorithms for speech therapy analysis.
All scoring calculations are organized here to maintain consistency
and make the analysis workflow transparent and maintainable.
"""

import random
import numpy as np
from typing import Dict, List, Tuple, Optional
from difflib import SequenceMatcher


class ScoringAlgorithms:
    """
    Centralized scoring algorithms for speech analysis.
    Contains all mathematical functions for calculating scores.
    """
    
    @staticmethod
    def calculate_pronunciation_score(
        phoneme_scores: Dict[str, float],
        acoustic_confidence: float = 0.0
    ) -> int:
        """
        Calculate overall pronunciation score from phoneme-level scores.
        
        Args:
            phoneme_scores: Dictionary of phoneme -> score mappings
            acoustic_confidence: Model confidence (0.0 to 1.0)
            
        Returns:
            Pronunciation score (0-100)
        """
        if not phoneme_scores:
            return 0
            
        # Get all scores
        scores = [data['score'] if isinstance(data, dict) else data 
                  for data in phoneme_scores.values()]
        
        # Calculate weighted average
        avg_score = np.mean(scores)
        
        # Apply confidence weighting if available
        if acoustic_confidence > 0:
            final_score = (avg_score * 0.7) + (acoustic_confidence * 100 * 0.3)
        else:
            final_score = avg_score
            
        return int(max(0, min(100, final_score)))
    
    @staticmethod
    def calculate_pitch_score(
        pitch_values: np.ndarray,
        voiced_ratio: float = 1.0
    ) -> Tuple[int, Dict]:
        """
        Calculate pitch score based on pitch stability and variation.
        
        Args:
            pitch_values: Array of pitch values (Hz)
            voiced_ratio: Ratio of voiced segments
            
        Returns:
            Tuple of (score, analysis_dict)
        """
        if len(pitch_values) < 5:
            return 50, {
                "mean_pitch": 0,
                "std_pitch": 0,
                "stability": 0
            }
        
        # Filter out NaN values
        valid_pitch = pitch_values[~np.isnan(pitch_values)]
        
        if len(valid_pitch) < 5:
            return 50, {
                "mean_pitch": 0,
                "std_pitch": 0,
                "stability": 0
            }
        
        mean_pitch = float(np.mean(valid_pitch))
        std_pitch = float(np.std(valid_pitch))
        
        # Scoring algorithm:
        # - Ideal pitch variation: 20-40 Hz (natural speech)
        # - Too low (<12 Hz): Monotone
        # - Too high (>70 Hz): Unstable/nervous
        
        pitch_score = 90
        
        # Monotone penalty
        if std_pitch < 12:
            pitch_score -= 30
        # Unstable penalty
        elif std_pitch > 70:
            pitch_score -= 20
        # Slight deviation from ideal range
        elif std_pitch < 20 or std_pitch > 40:
            pitch_score -= 5
            
        # Voiced ratio penalty (low voice activity)
        if voiced_ratio < 0.2:
            pitch_score -= 15
        elif voiced_ratio < 0.4:
            pitch_score -= 5
            
        return max(0, min(100, int(pitch_score))), {
            "mean_pitch": round(mean_pitch, 2),
            "std_pitch": round(std_pitch, 2),
            "stability": round((1.0 - min(std_pitch / 100, 1.0)) * 100, 2)
        }
    
    @staticmethod
    def calculate_fluency_score(
        audio_energy: np.ndarray,
        sample_rate: int,
        adaptive_threshold: Optional[float] = None
    ) -> Tuple[int, Dict]:
        """
        Calculate fluency score based on pause detection and speech rhythm.
        
        Args:
            audio_energy: RMS energy values
            sample_rate: Audio sample rate
            adaptive_threshold: Optional threshold for silence detection
            
        Returns:
            Tuple of (score, analysis_dict)
        """
        if adaptive_threshold is None:
            # Adaptive threshold: 15th percentile + bias
            adaptive_threshold = float(np.percentile(audio_energy, 15) + 0.005)
        
        # Detect silence
        is_silence = audio_energy < adaptive_threshold
        total_seconds = len(audio_energy) * (512 / sample_rate)  # hop_length=512
        
        if total_seconds < 0.5:
            return 100, {"pauses": 0, "silence_ratio": 0}
        
        # Pause detection (minimum 250ms silence)
        min_pause_frames = 8
        pause_count = 0
        silence_duration = 0
        current_run = 0
        
        for is_silent in is_silence:
            if is_silent:
                current_run += 1
                silence_duration += 1
            else:
                if current_run >= min_pause_frames:
                    pause_count += 1
                current_run = 0
        
        # Calculate metrics
        silence_ratio = silence_duration / len(audio_energy)
        pauses_per_second = pause_count / total_seconds
        
        # Scoring algorithm:
        # - Ideal pauses_per_second: 0.2-0.5 (natural rhythm)
        # - Ideal silence_ratio: 0.1-0.25 (normal breathing pauses)
        
        fluency_score = 100
        
        # Too much silence penalty
        if silence_ratio > 0.35:
            fluency_score -= (silence_ratio - 0.35) * 120
        
        # Too many pauses penalty
        if pauses_per_second > 1.2:
            fluency_score -= (pauses_per_second - 1.2) * 30
        
        # Speaking too fast (no natural pauses)
        if silence_ratio < 0.05:
            fluency_score -= 15
        
        return max(0, min(100, int(fluency_score))), {
            "pause_count": pause_count,
            "silence_ratio": round(silence_ratio, 3),
            "pauses_per_second": round(pauses_per_second, 2)
        }
    
    @staticmethod
    def calculate_overall_score(
        pronunciation_score: float,
        pitch_score: float,
        fluency_score: float,
        acoustic_confidence: float = 0.0,
        weights: Optional[Dict[str, float]] = None
    ) -> int:
        """
        Calculate final overall score using weighted combination.
        
        Args:
            pronunciation_score: Pronunciation score (0-100)
            pitch_score: Pitch score (0-100)
            fluency_score: Fluency score (0-100)
            acoustic_confidence: Model confidence (0.0-1.0)
            weights: Optional custom weights
            
        Returns:
            Overall score (0-100)
        """
        if weights is None:
            # Default weighting scheme
            weights = {
                "pronunciation": 0.50,
                "acoustic": 0.20,
                "fluency": 0.20,
                "pitch": 0.10
            }
        
        # Calculate weighted score
        overall = (
            (pronunciation_score * weights["pronunciation"]) +
            (acoustic_confidence * 100 * weights["acoustic"]) +
            (fluency_score * weights["fluency"]) +
            (pitch_score * weights["pitch"])
        )
        
        return int(max(0, min(100, overall)))
    
    @staticmethod
    def calculate_phoneme_similarity(
        transcription: str,
        reference: str
    ) -> Dict[str, Dict]:
        """
        Calculate character-level similarity as phoneme proxy.
        
        Args:
            transcription: Transcribed text
            reference: Reference text
            
        Returns:
            Dictionary of character scores
        """
        ref_norm = reference.lower()
        trans_norm = transcription.lower()
        
        matcher = SequenceMatcher(None, ref_norm, trans_norm)
        scores = {}
        
        for i, char in enumerate(ref_norm):
            if not char.isalnum():
                continue
            
            char_score = 0
            for tag, i1, i2, j1, j2 in matcher.get_opcodes():
                if i1 <= i < i2:
                    if tag == 'equal':
                        char_score = 95
                    elif tag == 'replace':
                        char_score = 40
                    elif tag == 'delete':
                        char_score = 20
                    break
            
            if char in scores:
                scores[char]["score"] = (scores[char]["score"] + char_score) / 2
            else:
                scores[char] = {"score": round(char_score, 1)}
        
        return scores


class MockScoringGenerator:
    """
    Generates realistic mock scores for testing and fallback scenarios.
    Uses controlled randomness to simulate realistic variation.
    """
    
    @staticmethod
    def generate_pronunciation_score(
        difficulty_level: str = "medium",
        base_range: Tuple[int, int] = (75, 95)
    ) -> int:
        """
        Generate a realistic pronunciation score.
        
        Args:
            difficulty_level: "easy", "medium", or "hard"
            base_range: Tuple of (min_score, max_score)
            
        Returns:
            Mock pronunciation score
        """
        min_score, max_score = base_range
        
        # Adjust based on difficulty
        if difficulty_level == "easy":
            min_score = max(min_score, 80)
        elif difficulty_level == "hard":
            max_score = min(max_score, 85)
        
        return random.randint(min_score, max_score)
    
    @staticmethod
    def generate_phoneme_scores(
        reference_text: str,
        error_rate: float = 0.15
    ) -> Dict:
        """
        Generate mock phoneme scores with controlled errors.
        
        Args:
            reference_text: Reference text to analyze
            error_rate: Probability of phoneme error (0.0-1.0)
            
        Returns:
            Dictionary with phoneme scores
        """
        chars = [c for c in reference_text.lower() if c.isalnum()]
        phoneme_map = {}
        detailed = []
        
        for char in chars:
            # Introduce controlled errors
            has_error = random.random() < error_rate
            
            if has_error:
                char_score = random.randint(30, 60)
                status = "distorted"
            else:
                char_score = random.randint(80, 100)
                status = "correct"
            
            phoneme_map[char] = {"score": char_score, "status": status}
            detailed.append({
                "phoneme": char,
                "score": char_score,
                "status": status,
                "actual": char if status == "correct" else "?"
            })
        
        return {
            "phoneme_map": phoneme_map,
            "detailed": detailed
        }
    
    @staticmethod
    def generate_pitch_contour(
        duration_seconds: float = 5.0,
        base_pitch: int = 140,
        variation: int = 30
    ) -> List[float]:
        """
        Generate a realistic mock pitch contour.
        
        Args:
            duration_seconds: Duration in seconds
            base_pitch: Base pitch in Hz
            variation: Pitch variation range
            
        Returns:
            List of pitch values
        """
        num_points = int(duration_seconds * 5)  # 5 points per second
        contour = []
        
        current_pitch = base_pitch
        for _ in range(num_points):
            # Natural pitch variation with trending
            change = random.randint(-variation // 2, variation // 2)
            current_pitch = max(
                base_pitch - variation,
                min(base_pitch + variation, current_pitch + change)
            )
            contour.append(float(current_pitch))
        
        return contour
    
    @staticmethod
    def generate_video_analysis_metrics() -> Dict:
        """
        Generate mock metrics for video analysis.
        
        Returns:
            Dictionary with mock video analysis data
        """
        activities = [
            "Playing with blocks",
            "Drawing or Coloring",
            "Reading a book",
            "Social interaction with peers",
            "Physical exercise (Jump/Run)",
            "Solving a puzzle",
            "Speaking practice"
        ]
        
        emotions = ["Happy", "Focused", "Neutral", "Curious", "Frustrated"]
        attention_spans = ["High", "Medium", "Low", "Fluctuating"]
        
        return {
            "activity": random.choice(activities),
            "emotion": random.choice(emotions),
            "attention": random.choice(attention_spans),
            "interaction_score": random.randint(65, 95),
            "posture_score": random.randint(60, 95),
            "eye_contact_score": random.randint(50, 90)
        }


# Convenience functions for backward compatibility
def calculate_pronunciation_score(*args, **kwargs):
    return ScoringAlgorithms.calculate_pronunciation_score(*args, **kwargs)

def calculate_pitch_score(*args, **kwargs):
    return ScoringAlgorithms.calculate_pitch_score(*args, **kwargs)

def calculate_fluency_score(*args, **kwargs):
    return ScoringAlgorithms.calculate_fluency_score(*args, **kwargs)

def calculate_overall_score(*args, **kwargs):
    return ScoringAlgorithms.calculate_overall_score(*args, **kwargs)
