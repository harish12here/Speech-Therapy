import React from "react";

// Minimal phoneme timeline viewer. Expects `segments` prop:
// [{ phoneme, start, end, confidence }, ...]

export default function PhonemeViewer({ segments = [], maxWidth = "100%" }) {
	return (
		<div style={{ width: maxWidth, border: "1px solid #e6e6e6", padding: 8, borderRadius: 6 }}>
			{segments.length === 0 ? (
				<div style={{ color: "#666" }}>No phoneme data</div>
			) : (
				<div style={{ display: "flex", gap: 6, alignItems: "center", flexDirection: "column" }}>
					{segments.map((s, idx) => (
						<div key={idx} style={{ width: "100%" }}>
							<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
								<div>{s.phoneme}</div>
								<div style={{ color: "#999" }}>{(s.end - s.start).toFixed(2)}s</div>
							</div>
							<div style={{ height: 8, background: "#f3f3f3", borderRadius: 4, overflow: "hidden", marginTop: 4 }}>
								<div style={{ width: `${Math.min(100, Math.round(s.confidence * 100))}%`, height: "100%", background: "#6ea8fe" }} />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
