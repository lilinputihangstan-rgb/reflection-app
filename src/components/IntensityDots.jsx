export default function IntensityDots({ value = 3, color = "var(--clay)" }) {
  return (
    <span style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: i <= value ? color : "var(--line)",
            display: "inline-block",
          }}
        />
      ))}
    </span>
  );
}