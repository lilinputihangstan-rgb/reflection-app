export default function ActionButton({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  style = {},
  type = "button",
}) {
  const variants = {
    primary: {
      background: "var(--clay)",
      color: "#fff",
      border: "1px solid var(--clay)",
    },
    secondary: {
      background: "var(--paper-card)",
      color: "var(--ink)",
      border: "1px solid var(--line)",
    },
    ghost: {
      background: "transparent",
      color: "var(--ink-soft)",
      border: "1px solid var(--line)",
    },
  };

  const sizes = {
    sm: { padding: "7px 12px", fontSize: 12 },
    md: { padding: "10px 16px", fontSize: 13 },
    lg: { padding: "12px 20px", fontSize: 14 },
  };

  const selected = variants[variant] || variants.primary;
  const selectedSize = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        borderRadius: 999,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        fontWeight: 600,
        transition: "all 0.2s ease",
        ...selected,
        ...selectedSize,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
