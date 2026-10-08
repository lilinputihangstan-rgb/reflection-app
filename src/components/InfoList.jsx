export default function InfoList({ items = [] }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((item) => (
        <div
          key={item.label || item.key || item.value}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            padding: "8px 12px",
            borderRadius: 12,
            background: "var(--paper)",
            border: "1px solid var(--line)",
          }}
        >
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{item.label}</span>
          <strong style={{ fontSize: 12, color: "var(--ink)" }}>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}
