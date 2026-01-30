import React from "react";

export default function SessionHistory({ sessions = [] }) {
	if (!sessions || sessions.length === 0) return <div>No sessions yet</div>;

	return (
		<div style={{ display: "grid", gap: 8 }}>
			{sessions.map((s, idx) => (
				<div key={idx} style={{ padding: 10, border: "1px solid #eee", borderRadius: 6 }}>
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<div style={{ fontWeight: 600 }}>{s.title || `Session ${idx + 1}`}</div>
						<div style={{ color: "#999" }}>{s.date || "-"}</div>
					</div>
					<div style={{ fontSize: 12, color: "#666" }}>{s.summary || "No summary"}</div>
				</div>
			))}
		</div>
	);
}
