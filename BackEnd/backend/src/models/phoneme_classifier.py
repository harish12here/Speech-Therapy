"""
backend\src\models\phoneme_classifier.py

Phoneme classifier wrapper.

This module provides a thin, production-oriented wrapper around a
frame-level phoneme classifier. It reuses `Wav2Vec2SpeechModel` for
feature extraction and expects a scikit-learn compatible classifier
persisted with joblib. The API focuses on ease-of-use from higher
level services/controllers.
"""

from typing import Optional, List, Dict, Tuple
import numpy as np
import joblib
import os
import logging

from src.models.wav2vec2_model import get_wav2vec2_model, Wav2Vec2SpeechModel

logger = logging.getLogger(__name__)


class PhonemeClassifier:
	def __init__(self, model_path: Optional[str] = None):
		"""Initialize the phoneme classifier.

		Args:
			model_path: Optional joblib path to a trained classifier.
		"""
		self.model = None
		self.model_path = model_path
		self.wav_model = get_wav2vec2_model()
		if model_path:
			self.load_model(model_path)

	def load_model(self, model_path: str):
		if not os.path.exists(model_path):
			raise FileNotFoundError(f"Phoneme model not found: {model_path}")
		self.model = joblib.load(model_path)
		logger.info(f"Phoneme classifier loaded from {model_path}")

	def predict_phonemes(self, audio: object, sample_rate: int = 16000) -> List[Dict]:
		"""Predict phoneme sequence for input audio.

		Returns a list of dicts: [{"phoneme": str, "start": float, "end": float, "confidence": float}, ...]
		Time is in seconds. This implementation segments features by frame indices
		and produces frame-level predictions aggregated into runs.
		"""
		# Extract frame-level features from wav2vec model
		features = self.wav_model.extract_features(audio, sample_rate)
		if features.size == 0:
			return []

		if self.model is None:
			logger.warning("Phoneme model not loaded. Returning empty prediction list.")
			return []

		# features shape: (time, dim)
		X = features.astype(np.float32)

		try:
			probs = None
			if hasattr(self.model, "predict_proba"):
				probs = self.model.predict_proba(X)
				preds = np.argmax(probs, axis=1)
			else:
				preds = self.model.predict(X)

			labels = [str(l) for l in self.model.classes_[preds]] if hasattr(self.model, "classes_") else [str(p) for p in preds]

			# Consolidate consecutive frames with the same label into segments
			segments = []
			start_idx = 0
			current_label = labels[0]
			for i in range(1, len(labels)):
				if labels[i] != current_label:
					# create segment
					segment_probs = probs[start_idx:i] if probs is not None else None
					confidence = float(np.max(np.mean(segment_probs, axis=0))) if segment_probs is not None else 1.0
					segments.append({
						"phoneme": current_label,
						"start": start_idx / 50.0,
						"end": i / 50.0,
						"confidence": confidence,
					})
					start_idx = i
					current_label = labels[i]

			# last segment
			segment_probs = probs[start_idx:len(labels)] if probs is not None else None
			confidence = float(np.max(np.mean(segment_probs, axis=0))) if segment_probs is not None else 1.0
			segments.append({
				"phoneme": current_label,
				"start": start_idx / 50.0,
				"end": len(labels) / 50.0,
				"confidence": confidence,
			})

			return segments

		except Exception as e:
			logger.error(f"Phoneme prediction failed: {e}")
			return []


# Global convenience instance
_global_phoneme_classifier: Optional[PhonemeClassifier] = None


def get_phoneme_classifier(model_path: Optional[str] = None) -> PhonemeClassifier:
	global _global_phoneme_classifier
	if _global_phoneme_classifier is None:
		_global_phoneme_classifier = PhonemeClassifier(model_path=model_path)
	elif model_path and _global_phoneme_classifier.model is None:
		_global_phoneme_classifier.load_model(model_path)
	return _global_phoneme_classifier
