import { useEffect, useRef, useState } from "react";
import { blobToFloat32Array, downsampleBuffer } from "../utils/audioUtils";

export default function useAudioRecorder({ sampleRate = 16000 } = {}) {
	const mediaRef = useRef(null);
	const recorderRef = useRef(null);
	const [recording, setRecording] = useState(false);
	const [audioBlob, setAudioBlob] = useState(null);

	useEffect(() => {
		return () => {
			if (mediaRef.current) {
				mediaRef.current.getTracks().forEach((t) => t.stop());
			}
		};
	}, []);

	async function start() {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		mediaRef.current = stream;
		const mediaRecorder = new MediaRecorder(stream);
		const chunks = [];
		mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
		mediaRecorder.onstop = async () => {
			const blob = new Blob(chunks, { type: "audio/webm" });
			setAudioBlob(blob);
		};
		mediaRecorder.start();
		recorderRef.current = mediaRecorder;
		setRecording(true);
	}

	function stop() {
		if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
		setRecording(false);
		if (mediaRef.current) {
			mediaRef.current.getTracks().forEach((t) => t.stop());
			mediaRef.current = null;
		}
	}

	async function getFloat32Array() {
		if (!audioBlob) return null;
		const floatData = await blobToFloat32Array(audioBlob);
		const down = downsampleBuffer(floatData, 48000, sampleRate);
		return down;
	}

	return { start, stop, recording, audioBlob, getFloat32Array };
}
