export default function FilterChips({ items = [], activeKey, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          style={{
            borderRadius: 999,
            padding: "7px 12px",
            fontSize: 12,
            cursor: "pointer",
            background: activeKey === item.key ? "var(--paper-card)" : "transparent",
            border: activeKey === item.key ? "1px solid var(--clay)" : "1px solid var(--line)",
            color: activeKey === item.key ? "var(--clay-dark)" : "var(--ink-soft)",
            fontWeight: activeKey === item.key ? 700 : 500,
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
