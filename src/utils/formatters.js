export function formatDate(value, locale = "id-ID") {
  if (!value) return "—";

  try {
    const date = new Date(value);
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return "—";
  }
}

export function truncateText(value = "", maxLength = 120) {
  const text = String(value ?? "").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export function toMoodLabel(mood, lang = "id") {
  const labels = {
    calm: { id: "Tenang", en: "Calm" },
    grateful: { id: "Syukur", en: "Grateful" },
    heavy: { id: "Berat", en: "Heavy" },
    confused: { id: "Bingung", en: "Confused" },
    happy: { id: "Bahagia", en: "Happy" },
  };

  const next = labels[mood] || { id: mood || "Umum", en: mood || "General" };
  return lang === "id" ? next.id : next.en;
}
