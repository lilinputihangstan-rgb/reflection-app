export default function ErrorState({ title = "Ada Masalah", message, action }) {
  return (
    <div
      style={{
        padding: 18,
        border: "1px solid #B5654A",
        borderRadius: 12,
        background: "rgba(181, 101, 74, 0.08)",
        color: "#B5654A",
      }}
    >
      <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{title}</p>
      {message && <p style={{ margin: "8px 0 0", fontSize: 13 }}>{message}</p>}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  );
}