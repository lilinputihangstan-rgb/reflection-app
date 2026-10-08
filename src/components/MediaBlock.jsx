export default function MediaBlock({ url, type, alt = "" }) {
  if (!url) return null;
  return (
    <div
      style={{
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid var(--line)",
      }}
    >
      {type === "video" ? (
        <video
          src={url}
          controls
          style={{
            width: "100%",
            display: "block",
            maxHeight: 420,
            background: "#000",
          }}
        />
      ) : (
        <img
          src={url}
          alt={alt}
          style={{
            width: "100%",
            display: "block",
            maxHeight: 420,
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
}