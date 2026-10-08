export default function MoodSelector({ moods, selectedMood, onSelect, label, lang }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
      {moods.map((m) => (
        <button
          type="button"
          key={m.key}
          onClick={() => onSelect(m.key)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 999,
            padding: "8px 14px",
            cursor: "pointer",
            background: selectedMood === m.key ? "var(--paper-card)" : "transparent",
            border: selectedMood === m.key ? "2px solid var(--clay)" : "1px solid var(--line)",
            color: "var(--ink)",
          }}
        >
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: m.color || "var(--clay)", display: "inline-block" }} />
          <span style={{ fontSize: 12 }}>{lang === "id" ? m.label_id || m.key : m.label_en || m.key}</span>
        </button>
      ))}
    </div>
  );
}
