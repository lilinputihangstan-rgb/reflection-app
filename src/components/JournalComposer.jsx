export default function JournalComposer({
  prompt,
  onPromptChange,
  mood,
  onMoodChange,
  moodIntensity,
  onMoodIntensityChange,
  text,
  onTextChange,
  title,
  onTitleChange,
  onSave,
  saveDisabled,
  saveState,
  saveMessage,
  draftMessage,
  mediaInput,
  onMediaInput,
}) {
  return (
    <div className="rf-card" style={{ padding: 22, marginTop: 14 }}>
      <p className="rf-mono" style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--clay)", margin: "0 0 8px" }}>
        Renungan hari ini
      </p>
      <p className="rf-display" style={{ fontSize: 20, lineHeight: 1.4, margin: "0 0 14px" }}>{prompt}</p>

      <button type="button" className="rf-btn" onClick={onPromptChange} style={{ background: "transparent", border: "1px solid var(--line)", padding: "6px 14px", fontSize: 13, color: "var(--ink-soft)" }}>
        Ganti renungan
      </button>

      <div style={{ marginTop: 20 }}>
        <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px", color: "var(--ink-soft)" }}>Bagaimana perasaanmu?</p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {Array.isArray(mood) ? null : null}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <textarea className="rf-textarea" placeholder="Tulis apa yang sedang kamu rasakan…" value={text} onChange={onTextChange} />
      </div>

      <div style={{ marginTop: 12 }}>
        <input className="rf-input" style={{ width: "100%", boxSizing: "border-box" }} placeholder="Judul / topik (opsional)" value={title} onChange={onTitleChange} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label className="rf-btn" style={{ display: "inline-flex", background: "transparent", border: "1px dashed var(--line)", color: "var(--ink-soft)", padding: "9px 16px", fontSize: 13, cursor: "pointer" }}>
          📎 Tambah foto/video (opsional)
          <input type="file" accept="image/*,video/*" onChange={onMediaInput} style={{ display: "none" }} />
        </label>
      </div>

      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <button className="rf-btn" onClick={onSave} disabled={saveDisabled} style={{ background: "var(--clay)", color: "var(--paper)", padding: "12px 26px", fontSize: 14, opacity: saveDisabled ? 0.6 : 1 }}>
          Simpan refleksi
        </button>
        {saveState === "saved" && <span style={{ fontSize: 13, color: "var(--moss)" }}>{saveMessage}</span>}
        {draftMessage && <span style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{draftMessage}</span>}
      </div>
    </div>
  );
}
