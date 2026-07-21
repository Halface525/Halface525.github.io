export function MagButton({ children, accent, active, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`mag-btn ${accent ? "accent" : ""} ${active ? "active" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
