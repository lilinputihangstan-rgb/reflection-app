export default function AppShell({ children, maxWidth = 640 }) {
  return (
    <div
      style={{
        maxWidth,
        margin: "0 auto",
        padding: "0 18px 40px",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}
