export default function ReflectionHeader({
  title,
  subtitle,
  onToggleTheme,
  onToggleLang,
  onSignOut,
  onOpenProfile,
  profile,
  lang,
  themeLabel,
  themeButtonLabel,
}) {
  return (
    <header style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="rf-display" style={{ fontSize: 30, fontWeight: 600, margin: 0, color: "var(--clay-dark)" }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ margin: "4px 0 0", color: "var(--ink-soft)", fontSize: 14, maxWidth: 380 }}>
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            className="rf-btn"
            onClick={onToggleTheme}
            aria-label={themeButtonLabel}
            style={{
              background: "var(--paper-card)",
              border: "1px solid var(--line)",
              width: 34,
              height: 34,
              borderRadius: "50%",
              fontSize: 15,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            🎨
          </button>

          <button
            type="button"
            className="rf-btn"
            onClick={onToggleLang}
            style={{
              background: "var(--paper-card)",
              border: "1px solid var(--line)",
              padding: "7px 13px",
              borderRadius: 999,
              color: "var(--ink)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {lang === "id" ? "EN" : "ID"}
          </button>

          <button
            type="button"
            className="rf-btn"
            onClick={onSignOut}
            title={lang === "id" ? "Keluar" : "Sign out"}
            style={{
              background: "var(--paper-card)",
              border: "1px solid var(--line)",
              width: 34,
              height: 34,
              borderRadius: "50%",
              fontSize: 14,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ⎋
          </button>

          <button type="button" onClick={onOpenProfile} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: profile?.avatarColor || "var(--clay)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                border: "1px solid var(--line)",
              }}
            >
              {profile?.avatarEmoji || "🌿"}
            </span>
          </button>
        </div>
      </div>

      {themeLabel && (
        <div style={{ marginTop: 14, fontSize: 12, color: "var(--ink-soft)" }}>{themeLabel}</div>
      )}
    </header>
  );
}
