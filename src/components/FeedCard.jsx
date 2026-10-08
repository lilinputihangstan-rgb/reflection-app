export default function FeedCard({ author, post, language, onOpenProfile, onToggleLike, liked, onSubmitComment, commentDraft, setCommentDraft, translations, onTranslate, moodColor }) {
  const tr = translations?.[`post-${post.id}`];
  const showingTr = tr?.showing && tr?.text;

  return (
    <div key={post.id} className="rf-card" style={{ padding: 18, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <button type="button" onClick={() => onOpenProfile(post.userId)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <span style={{ width: 36, height: 36, borderRadius: "50%", background: author?.avatarColor || "var(--clay)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
            {author?.avatarEmoji || "🌿"}
          </span>
        </button>
        <div style={{ flex: 1 }}>
          <button type="button" onClick={() => onOpenProfile(post.userId)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{author?.displayName || "…"}</p>
          </button>
          <p className="rf-mono" style={{ margin: 0, fontSize: 11, color: "var(--ink-soft)" }}>
            {author?.status ? `${author.status} · ` : ""}{new Date(post.ts).toLocaleDateString(language === "id" ? "id-ID" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: moodColor, display: "inline-block" }} />
      </div>

      {post.title && <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 16 }}>{showingTr && tr.title ? tr.title : post.title}</p>}
      {post.mediaUrl && <img src={post.mediaUrl} alt={post.title || "Reflection media"} style={{ width: "100%", display: "block", borderRadius: 12, marginBottom: 12, maxHeight: 420, objectFit: "cover" }} />}
      <p style={{ margin: "0 0 8px", lineHeight: 1.6, fontSize: 15, whiteSpace: "pre-wrap" }}>{showingTr ? tr.text : post.text}</p>
      <button
        type="button"
        onClick={() => onTranslate(`post-${post.id}`, post.title, post.text)}
        style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 12.5, cursor: "pointer", padding: 0, marginBottom: 10 }}
      >
        {tr?.loading ? "Menerjemahkan…" : tr?.error ? "Gagal menerjemahkan" : showingTr ? "Tampilkan teks asli" : "🌐 Terjemahkan"}
      </button>

      <div style={{ display: "flex", gap: 6, borderTop: "1px solid var(--line)", paddingTop: 10 }}>
        <button type="button" className="rf-icon-btn" onClick={() => onToggleLike(post)} style={{ color: liked ? "var(--clay-dark)" : "var(--ink-soft)" }}>
          {liked ? "♥" : "♡"} {post.likes.length > 0 ? post.likes.length : "Suka"}
        </button>
        <span className="rf-icon-btn" style={{ cursor: "default" }}>💬 {post.comments.length}</span>
      </div>

      {post.comments.length > 0 && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {post.comments.map((c, i) => (
            <p key={i} style={{ margin: 0, fontSize: 13.5, color: "var(--ink-soft)" }}>
              <strong style={{ color: "var(--ink)" }}>{c.username}</strong> {c.text}
            </p>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input
          className="rf-input"
          style={{ padding: "8px 12px", fontSize: 13 }}
          placeholder="Tulis komentar…"
          value={commentDraft || ""}
          onChange={(e) => setCommentDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmitComment(post)}
        />
        <button type="button" className="rf-btn" onClick={() => onSubmitComment(post)} style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "0 14px", fontSize: 13, color: "var(--ink)" }}>
          Kirim
        </button>
      </div>
    </div>
  );
}
