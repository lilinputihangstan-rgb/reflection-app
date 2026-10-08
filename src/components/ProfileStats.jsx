export default function ProfileStats({ items = [] }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
      {items.map((item) => (
        <div key={item.label} className="rf-card" style={{ padding: "14px 16px", flex: "1 1 120px", minWidth: 120 }}>
          <p className="rf-display" style={{ fontSize: 26, margin: 0, color: "var(--clay-dark)" }}>{item.value}</p>
          <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "3px 0 0" }}>{item.label}</p>
        </div>
      ))}
    </div>
  );
}
