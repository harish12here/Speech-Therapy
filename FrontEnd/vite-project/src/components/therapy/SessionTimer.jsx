import React, { useEffect, useState } from "react";

export default function SessionTimer({ running = false, onTick = () => {} }) {
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		let interval = null;
		if (running) {
			interval = setInterval(() => {
				setSeconds((s) => {
					const ns = s + 1;
					onTick(ns);
					return ns;
				});
			}, 1000);
		} else if (!running && interval) {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [running]);

	function reset() {
		setSeconds(0);
	}

	const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
	const ss = String(seconds % 60).padStart(2, "0");

	return (
		<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
			<div style={{ fontFamily: "monospace", fontSize: 18 }}>{mm}:{ss}</div>
			<button onClick={reset} style={{ padding: "6px 10px" }}>Reset</button>
		</div>
	);
}
