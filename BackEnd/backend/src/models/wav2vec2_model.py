# backend\src\models\wav2vec2_model.py
"""
Wav2Vec2 Model for Speech Therapy

This module implements a state-of-the-art Wav2Vec2 model optimized for speech therapy.
It supports multiple languages (English, Tamil, etc.) using XLSR-53 and provides
high-accuracy transcription and pronunciation scoring.
"""

import torch
import torch.nn as nn
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC, Wav2Vec2Model
import numpy as np
import librosa
from typing import Optional, Dict, List, Tuple, Union
import logging
from difflib import SequenceMatcher
import re

# Optional: for cleaner Tamil comparison if installed
try:
    from indic_transliteration import sanscript
    from indic_transliteration.sanscript import SchemeMap, SCHEMES, transliterate
    HAS_INDIC = True
except ImportError:
    HAS_INDIC = False

logger = logging.getLogger(__name__)

class Wav2Vec2SpeechModel:
    """
    Advanced Wav2Vec2 model for multi-lingual speech therapy analysis.
    
    Features:
    - Multi-lingual support (XLSR-53)
    - Pronunciation accuracy scoring
    - Phoneme-level feature extraction
    - Support for both English and Indian languages (Tamil)
    """

    def __init__(
        self,
        model_name: str = "facebook/wav2vec2-large-xlsr-53",
        device: Optional[str] = None,
        cache_dir: Optional[str] = None
    ):
        """
        Initialize the Wav2Vec2 model.
        """
        self.model_name = model_name
        self.device = device or ('cuda' if torch.cuda.is_available() else 'cpu')
        
        logger.info(f"Loading Wav2Vec2 model: {model_name} on {self.device}")

        try:
            # Load processor and model
            # Note: For XLSR-53, we use Wav2Vec2ForCTC for transcription
            self.processor = Wav2Vec2Processor.from_pretrained(
                model_name,
                cache_dir=cache_dir
            )
            self.model = Wav2Vec2ForCTC.from_pretrained(
                model_name,
                cache_dir=cache_dir
            ).to(self.device)

            # Set to evaluation mode
            self.model.eval()

            logger.info("Wav2Vec2 model loaded successfully")

        except Exception as e:
            logger.error(f"Failed to load Wav2Vec2 model: {e}")
            # Fallback to a simpler model if XLSR-53 fails to load
            if model_name != "facebook/wav2vec2-base-960h":
                logger.warning("Attempting to load fallback model: facebook/wav2vec2-base-960h")
                self.__init__("facebook/wav2vec2-base-960h", device, cache_dir)
            else:
                raise

    def preprocess_audio(
        self,
        audio: Union[np.ndarray, str],
        sample_rate: int = 16000
    ) -> torch.Tensor:
        """
        Prepare audio for the model. Ensure 16kHz mono.
        """
        if isinstance(audio, str):
            audio, sr = librosa.load(audio, sr=16000)
        else:
            audio = np.array(audio)
            if len(audio.shape) > 1:
                audio = librosa.to_mono(audio)
            if sample_rate != 16000:
                audio = librosa.resample(audio, orig_sr=sample_rate, target_sr=16000)

        # Normalize volume
        audio = librosa.util.normalize(audio)
        
        return torch.tensor(audio, dtype=torch.float32)

    def transcribe(
        self,
        audio: Union[np.ndarray, str],
        sample_rate: int = 16000
    ) -> Dict[str, Union[str, float]]:
        """
        Transcribe audio and return text with confidence score.
        """
        try:
            audio_tensor = self.preprocess_audio(audio, sample_rate)
            
            inputs = self.processor(
                audio_tensor.numpy(),
                sampling_rate=16000,
                return_tensors="pt",
                padding=True
            ).to(self.device)

            with torch.no_grad():
                logits = self.model(**inputs).logits

            # Get predicted ids
            predicted_ids = torch.argmax(logits, dim=-1)
            
            # Decode transcription
            transcription = self.processor.batch_decode(predicted_ids)[0]
            
            # Calculate confidence (mean of max probabilities)
            probs = torch.nn.functional.softmax(logits, dim=-1)
            confidence = torch.mean(torch.max(probs, dim=-1).values).item()

            return {
                "text": transcription.lower().strip(),
                "confidence": float(confidence),
                "logits": logits # returning raw logits for further analysis if needed
            }

        except Exception as e:
            logger.error(f"Transcription failed: {e}")
            return {"text": "", "confidence": 0.0}

    def analyze_pronunciation(
        self,
        audio: Union[np.ndarray, str],
        target_text: str,
        language: str = "english"
    ) -> Dict:
        """
        Compare audio against a target text to provide a detailed pronunciation report.
        Highly optimized for speech therapy feedback.
        """
        result = self.transcribe(audio)
        transcription = result["text"]
        confidence = result["confidence"]
        
        # Normalize both strings
        target_norm = self._normalize_text(target_text, language)
        trans_norm = self._normalize_text(transcription, language)
        
        # Calculate similarity score using SequenceMatcher (Levenshtein-based)
        matcher = SequenceMatcher(None, target_norm, trans_norm)
        match_ratio = matcher.ratio()
        
        # Detailed phoneme/character analysis
        phoneme_reports = []
        for tag, i1, i2, j1, j2 in matcher.get_opcodes():
            # target_norm[i1:i2] is the expected part
            # trans_norm[j1:j2] is what was actually said
            
            part_expected = target_norm[i1:i2]
            part_actual = trans_norm[j1:j2]
            
            if tag == 'equal':
                score = 1.0
                status = "correct"
            elif tag == 'replace':
                score = 0.4
                status = "distorted"
            elif tag == 'delete':
                score = 0.0
                status = "omitted"
            elif tag == 'insert':
                # Unexpected sounds added
                continue 
                
            if part_expected.strip():
                phoneme_reports.append({
                    "expected": part_expected,
                    "actual": part_actual,
                    "score": score,
                    "status": status
                })

        # Calculate weighted overall score
        # Combination of match ratio and model's acoustic confidence
        overall_score = (match_ratio * 0.7) + (confidence * 0.3)
        overall_score = round(overall_score * 100, 1)

        return {
            "overall_score": overall_score,
            "transcription": transcription,
            "target_text": target_text,
            "match_ratio": round(match_ratio, 2),
            "acoustic_confidence": round(confidence, 2),
            "phoneme_reports": phoneme_reports,
            "is_accurate": overall_score > 80
        }

    def _normalize_text(self, text: str, language: str) -> str:
        """
        Normalize text based on language rules.
        """
        text = text.lower().strip()
        
        if language.lower() == "tamil":
            # For Tamil, we might want to transliterate to Latin for more robust comparison
            # if the model outputs Latin or if we want to compare phonetically
            if HAS_INDIC and any(ord(c) > 127 for c in text): # If contains non-ascii
                try:
                    return transliterate(text, SCHEMES[sanscript.TAMIL], SCHEMES[sanscript.ITRANS]).lower()
                except:
                    pass
        
        # Remove punctuation
        text = re.sub(r'[^\w\s]', '', text)
        return text

    def extract_features(
        self,
        audio: Union[np.ndarray, str],
        sample_rate: int = 16000,
        layer: int = -1
    ) -> np.ndarray:
        """
        Extract deep acoustic features from the transformer's hidden states.
        """
        try:
            audio_tensor = self.preprocess_audio(audio, sample_rate)
            inputs = self.processor(audio_tensor.numpy(), sampling_rate=16000, return_tensors="pt").to(self.device)
            
            with torch.no_grad():
                # Get hidden states and select layer
                outputs = self.model.wav2vec2(**inputs, output_hidden_states=True)
                hidden_states = outputs.hidden_states
                features = hidden_states[layer]
            
            return features.squeeze(0).cpu().numpy()
        except Exception as e:
            logger.error(f"Feature extraction failed: {e}")
            return np.array([])

    def get_model_info(self) -> Dict:
        """Return metadata about the loaded model."""
        return {
            "model_name": self.model_name,
            "device": self.device,
            "is_cuda": self.device == "cuda",
            "parameters": sum(p.numel() for p in self.model.parameters())
        }

# Singleton instance management
_model_instance: Optional[Wav2Vec2SpeechModel] = None

def get_wav2vec2_model(force_reload: bool = False) -> Wav2Vec2SpeechModel:
    """
    Access the global Wav2Vec2 model instance.
    Downloads the model on first call.
    """
    global _model_instance
    if _model_instance is None or force_reload:
        # Check environment for model name override
        import os
        model_name = os.getenv("WAV2VEC2_MODEL_NAME", "facebook/wav2vec2-large-xlsr-53")
        _model_instance = Wav2Vec2SpeechModel(model_name=model_name)
    return _model_instance
