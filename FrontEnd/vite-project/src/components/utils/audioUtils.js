// Audio utilities used by recorder and analysis hooks

export async function blobToFloat32Array(blob) {
	const arrayBuffer = await blob.arrayBuffer();
	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
	const channelData = audioBuffer.getChannelData(0);
	return channelData;
}

export function downsampleBuffer(buffer, originalSampleRate, targetSampleRate = 16000) {
	if (targetSampleRate === originalSampleRate) return buffer;
	const sampleRateRatio = originalSampleRate / targetSampleRate;
	const newLength = Math.round(buffer.length / sampleRateRatio);
	const result = new Float32Array(newLength);
	let offsetResult = 0;
	let offsetBuffer = 0;
	while (offsetResult < result.length) {
		const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
		let accum = 0,
			count = 0;
		for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
			accum += buffer[i];
			count++;
		}
		result[offsetResult] = accum / count;
		offsetResult++;
		offsetBuffer = nextOffsetBuffer;
	}
	return result;
}

export function floatTo16BitPCM(float32Array) {
	const buffer = new ArrayBuffer(float32Array.length * 2);
	const view = new DataView(buffer);
	let offset = 0;
	for (let i = 0; i < float32Array.length; i++, offset += 2) {
		const s = Math.max(-1, Math.min(1, float32Array[i]));
		view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
	}
	return buffer;
}

export default { blobToFloat32Array, downsampleBuffer, floatTo16BitPCM };
