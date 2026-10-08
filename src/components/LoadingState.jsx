export default function LoadingState({ message = "Memuat…" }) {
  return (
    <div
      style={{
        minHeight: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--ink-soft)",
        fontSize: 14,
        background: "var(--paper-card)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: 18,
      }}
    >
      {message}
    </div>
  );
}
