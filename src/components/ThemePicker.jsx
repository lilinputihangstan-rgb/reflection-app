export default function ThemePicker({
  themes,
  scenes,
  fonts,
  themeKey,
  sceneKey,
  fontKey,
  onSelectTheme,
  onSelectScene,
  onSelectFont,
  labelTheme,
  labelScene,
  labelFont,
  lang,
}) {
  return (
    <div className="rf-card" style={{ padding: 16, marginTop: 14 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", margin: "0 0 8px" }}>{labelTheme}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        {Object.entries(themes).map(([key, th]) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelectTheme(key)}
            title={lang === "id" ? th.label_id : th.label_en}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              borderRadius: 999,
              cursor: "pointer",
              background: "var(--paper-card)",
              border: themeKey === key ? "2px solid var(--clay)" : "1px solid var(--line)",
            }}
          >
            <span style={{ width: 16, height: 16, borderRadius: "50%", background: th.paper, border: `1px solid ${th.line}`, display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{lang === "id" ? th.label_id : th.label_en}</span>
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", margin: "0 0 8px" }}>{labelScene}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        {scenes.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => onSelectScene(s.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              borderRadius: 999,
              cursor: "pointer",
              background: "var(--paper-card)",
              border: sceneKey === s.key ? "2px solid var(--clay)" : "1px solid var(--line)",
            }}
          >
            <span style={{ fontSize: 14 }}>{s.icon}</span>
            <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{s.labelKey ? (lang === "id" ? s.labelKey : s.labelKey) : ""}</span>
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", margin: "0 0 8px" }}>{labelFont}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {fonts.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => onSelectFont(f.key)}
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              cursor: "pointer",
              background: "var(--paper-card)",
              border: fontKey === f.key ? "2px solid var(--clay)" : "1px solid var(--line)",
              fontFamily: f.family,
              fontSize: 13,
              color: "var(--ink)",
            }}
          >
            {f.labelKey}
          </button>
        ))}
      </div>
    </div>
  );
}
