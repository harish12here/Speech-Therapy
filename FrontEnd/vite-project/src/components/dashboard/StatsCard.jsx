import React from "react";

export default function StatsCard({ title, value, sub }) {
	return (
		<div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8, minWidth: 160 }}>
			<div style={{ fontSize: 12, color: "#666" }}>{title}</div>
			<div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
			{sub && <div style={{ fontSize: 12, color: "#999" }}>{sub}</div>}
		</div>
	);
}
//src/components/hooks/useLocalStorage.js