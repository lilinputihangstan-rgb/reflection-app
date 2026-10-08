export default function NavigationTabs({ items = [], active, onChange }) {
  return (
    <nav style={{ display: "flex", gap: 20, marginTop: 22, borderBottom: "1px solid var(--line)" }}>
      {items.map(([key, label]) => (
        <button
          key={key}
          type="button"
          className={`rf-tab ${active === key ? "active" : ""}`}
          onClick={() => onChange(key)}
          style={{
            fontFamily: "'Work Sans', sans-serif",
            fontWeight: 500,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px 4px",
            borderBottom: active === key ? "2px solid var(--clay)" : "2px solid transparent",
            color: active === key ? "var(--clay-dark)" : "var(--ink-soft)",
          }}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
