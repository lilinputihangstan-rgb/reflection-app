export default function MetricStack({ items = [] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            flex: "1 1 120px",
            minWidth: 120,
            background: "var(--paper-card)",
            border: "1px solid var(--line)",
            borderRadius: 14,
            padding: "12px 14px",
          }}
        >
          <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 4 }}>{item.label}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: item.accent || "var(--clay-dark)" }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}
