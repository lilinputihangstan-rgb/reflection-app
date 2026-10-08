export default function SearchBar({ value, placeholder, onChange, loading = false }) {
  return (
    <input
      className="rf-input"
      style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", fontSize: 15, marginBottom: 18 }}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus
      aria-label={placeholder}
    />
  );
}
