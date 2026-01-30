import React from "react";

export default function AchievementBadge({ title, subtitle, color = "#ffd966" }) {
	return (
		<div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: 8, borderRadius: 10, background: color }}>
			<div style={{ width: 36, height: 36, borderRadius: 18, background: "rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>🏆</div>
			<div>
				<div style={{ fontWeight: 700 }}>{title}</div>
				{subtitle && <div style={{ fontSize: 12, color: "#333" }}>{subtitle}</div>}
			</div>
		</div>
	);
}
