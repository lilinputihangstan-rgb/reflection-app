export default function LogCard({ title, date, summary, accent = "var(--clay)", onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        width: "100%",
        textAlign: "left",
        background: "var(--paper-card)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: 14,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <p style={{ margin: 0, fontWeight: 700, color: "var(--ink)" }}>{title || "Catatan"}</p>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent, display: "inline-block" }} />
      </div>
      <p style={{ margin: "8px 0 0", fontSize: 11, color: "var(--ink-soft)" }}>{date}</p>
      <p style={{ margin: "10px 0 0", lineHeight: 1.6, color: "var(--ink-soft)" }}>{summary}</p>
    </button>
  );
}
