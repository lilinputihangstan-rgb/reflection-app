export default function ThemeSwatch({ theme, active, onClick, label }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        border: active ? "2px solid var(--ink)" : "1px solid var(--line)",
        background: theme.paperCard || "var(--paper-card)",
        color: theme.ink || "var(--ink)",
        borderRadius: 14,
        padding: "10px 12px",
        minWidth: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${theme.clay}, ${theme.moss})`,
            display: "inline-block",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        />
        <span style={{ fontWeight: 600, fontSize: 13 }}>{label}</span>
      </span>
      <span style={{ fontSize: 12, opacity: 0.7 }}>{active ? "Dipilih" : "Pilih"}</span>
    </button>
  );
}
