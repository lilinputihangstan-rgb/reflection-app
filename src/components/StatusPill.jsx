export default function StatusPill({ label, tone = "neutral" }) {
  const palette = {
    neutral: { bg: "var(--paper)", color: "var(--ink-soft)", border: "var(--line)" },
    clay: { bg: "var(--clay)", color: "#fff", border: "var(--clay)" },
    moss: { bg: "var(--moss)", color: "#fff", border: "var(--moss)" },
    gold: { bg: "var(--gold)", color: "#fff", border: "var(--gold)" },
  };

  const style = palette[tone] || palette.neutral;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}
    >
      {label}
    </span>
  );
}
