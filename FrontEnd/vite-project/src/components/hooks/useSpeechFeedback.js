import { useState } from "react";

// This hook is a thin client wrapper to call backend speech analysis APIs.
// It expects an `api` object with `analyzeAudio` method that accepts a Float32Array or Blob.

export default function useSpeechFeedback(api) {
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);

	async function analyze(audioData) {
		setLoading(true);
		setError(null);
		try {
			const res = await api.analyzeAudio(audioData);
			setResult(res);
			return res;
		} catch (e) {
			setError(e.message || String(e));
			throw e;
		} finally {
			setLoading(false);
		}
	}

	return { loading, result, error, analyze };
}
//src/components/hooks/useLocalStorage.js