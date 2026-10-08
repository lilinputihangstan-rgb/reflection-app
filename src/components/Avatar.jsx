export default function Avatar({ profile, size = 40 }) {
  if (!profile) {
    return (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "var(--line)",
          display: "inline-block",
        }}
      />
    );
  }
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: profile.avatarColor || "var(--clay)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        flexShrink: 0,
      }}
    >
      {profile.avatarEmoji || "🌿"}
    </span>
  );
}