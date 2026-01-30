// Lightweight i18n helper used by components

const translations = {
	en: {
		start_session: "Start Session",
		stop_session: "Stop Session",
		score: "Score",
		session_history: "Session History",
	},
	hi: {
		start_session: "सत्र प्रारम्भ करें",
		stop_session: "सत्र रोकें",
		score: "स्कोर",
		session_history: "सत्र इतिहास",
	},
};

let current = "en";

export function setLocale(locale) {
	current = translations[locale] ? locale : "en";
}

export function t(key) {
	return (translations[current] && translations[current][key]) || translations.en[key] || key;
}

export default { t, setLocale };
