export default function SectionCard({ children, title, accent = "var(--clay)", style = {} }) {
  return (
    <div
      style={{
        background: "var(--paper-card)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: 18,
        boxShadow: "0 8px 22px -18px rgba(59, 47, 38, 0.35)",
        ...style,
      }}
    >
      {title && (
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            color: accent,
          }}
        >
          {title}
        </p>
      )}
      {children}
    </div>
  );
}
