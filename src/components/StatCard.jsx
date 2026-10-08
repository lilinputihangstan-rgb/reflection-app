export default function StatCard({ label, value, accent = "#B5654A" }) {
  return (
    <div
      style={{
        flex: "1 1 120px",
        minWidth: 120,
        background: "var(--paper-card)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: "14px 16px",
        boxShadow: "0 6px 18px -14px rgba(59, 47, 38, 0.35)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 26,
          fontWeight: 700,
          color: accent,
          lineHeight: 1.2,
        }}
      >
        {value}
      </p>
      <p
        style={{
          margin: "6px 0 0",
          fontSize: 12,
          color: "var(--ink-soft)",
        }}
      >
        {label}
      </p>
    </div>
  );
}
