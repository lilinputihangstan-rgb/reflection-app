export default function MetaRow({ label, value, strong = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginTop: 8 }}>
      <span style={{ color: "var(--ink-soft)", fontSize: 12 }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: strong ? 700 : 500, color: "var(--ink)" }}>{value}</span>
    </div>
  );
}
