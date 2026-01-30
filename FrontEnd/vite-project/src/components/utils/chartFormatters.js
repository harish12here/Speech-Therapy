// Chart formatter helpers for progress charts

export function formatPercent(value) {
	if (value === null || value === undefined) return "-";
	return `${Math.round(value * 100)}%`;
}

export function formatScore(value) {
	if (value === null || value === undefined) return "-";
	return `${Math.round(value)}`;
}

export function tooltipFormatter(label, value) {
	return `${label}: ${formatScore(value)}`;
}

export default { formatPercent, formatScore, tooltipFormatter };
