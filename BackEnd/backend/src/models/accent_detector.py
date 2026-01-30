"""
backend\src\models\accent_detector.py

Lightweight accent detector API.

This module provides a simple, production-ready wrapper around an ML
accent detector. It focuses on a clean interface: loading a persisted
sklearn-compatible model and predicting accent labels and confidence
from input audio (file path or numpy array). Feature extraction uses
MFCCs (stable and efficient for accent detection).

The model file is expected to be a joblib pickle of a scikit-learn
estimator (e.g., RandomForestClassifier, SVC with probability=True,
or KNeighborsClassifier).
"""

from typing import Optional, Tuple, List
import numpy as np
import librosa
import joblib
import os
import logging

logger = logging.getLogger(__name__)


class AccentDetector:
	def __init__(self, model_path: Optional[str] = None, sample_rate: int = 16000):
		"""Create an AccentDetector.

		Args:
			model_path: Optional path to a saved sklearn model (joblib).
			sample_rate: Audio sample rate to resample to.
		"""
		self.model = None
		self.sample_rate = sample_rate
		if model_path:
			self.load_model(model_path)

	def load_model(self, model_path: str):
		"""Load a persisted sklearn model via joblib.

		Raises FileNotFoundError if the file doesn't exist.
		"""
		if not os.path.exists(model_path):
			raise FileNotFoundError(f"Model file not found: {model_path}")
		self.model = joblib.load(model_path)
		logger.info(f"Accent model loaded from {model_path}")

	def _extract_features(self, audio: np.ndarray) -> np.ndarray:
		"""Extract compact features suitable for accent detection.

		Uses MFCC + deltas averaged over time (robust and lightweight).
		Returns a 1D feature vector.
		"""
		# Ensure 1D float32
		audio = np.asarray(audio, dtype=np.float32)
		if audio.ndim > 1:
			audio = librosa.to_mono(audio)

		# Compute MFCCs
		mfcc = librosa.feature.mfcc(y=audio, sr=self.sample_rate, n_mfcc=13)
		delta = librosa.feature.delta(mfcc)
		delta2 = librosa.feature.delta(mfcc, order=2)

		# Aggregate statistics across time: mean + std for stability
		feats = np.concatenate([
			np.mean(mfcc, axis=1),
			np.std(mfcc, axis=1),
			np.mean(delta, axis=1),
			np.mean(delta2, axis=1),
		])
		return feats

	def _load_audio(self, audio: object) -> Tuple[np.ndarray, int]:
		"""Load audio either from numpy array or path. Returns (y, sr)."""
		if isinstance(audio, str):
			y, sr = librosa.load(audio, sr=self.sample_rate)
		else:
			y = np.asarray(audio, dtype=np.float32)
			sr = self.sample_rate
			if y.ndim > 1:
				y = librosa.to_mono(y)
		return y, sr

	def predict(self, audio: object) -> Tuple[Optional[str], float]:
		"""Predict accent label and confidence.

		Returns (label, confidence) where label may be None if model is not loaded.
		Confidence is in [0.0, 1.0].
		"""
		if self.model is None:
			logger.warning("Accent model not loaded; returning (None, 0.0)")
			return None, 0.0

		y, _ = self._load_audio(audio)
		feats = self._extract_features(y)
		feats = feats.reshape(1, -1)

		# If the model supports predict_proba use it for confidence
		try:
			if hasattr(self.model, "predict_proba"):
				probs = self.model.predict_proba(feats)[0]
				idx = int(np.argmax(probs))
				label = self.model.classes_[idx]
				confidence = float(probs[idx])
			else:
				label = self.model.predict(feats)[0]
				confidence = 1.0
		except Exception as e:
			logger.error(f"Accent prediction failed: {e}")
			return None, 0.0

		return str(label), float(confidence)


# convenience factory
_global_detector: Optional[AccentDetector] = None


def get_accent_detector(model_path: Optional[str] = None) -> AccentDetector:
	global _global_detector
	if _global_detector is None:
		_global_detector = AccentDetector(model_path=model_path)
	elif model_path and _global_detector.model is None:
		_global_detector.load_model(model_path)
	return _global_detector
