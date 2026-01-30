import React from "react";

// Simple progress chart using plain inline bars (keeps dependency-free)
export default function ProgressChart({ data = [] }) {
	if (!data || data.length === 0) return <div>No progress data</div>;

	return (
		<div style={{ display: "grid", gap: 8 }}>
			{data.map((d, i) => (
				<div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<div style={{ width: 120 }}>{d.label}</div>
					<div style={{ flex: 1, height: 12, background: "#f3f3f3", borderRadius: 6, overflow: "hidden" }}>
						<div style={{ width: `${Math.min(100, Math.round((d.value || 0) * 100))}%`, height: "100%", background: "#7bd389" }} />
					</div>
					<div style={{ width: 48, textAlign: "right" }}>{Math.round((d.value || 0) * 100)}%</div>
				</div>
			))}
		</div>
	);
}
