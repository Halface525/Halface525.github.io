export function MagDivider({ children, className = "" }) {
  return (
    <div className={`mag-divider my-16 ${className}`}>
      {children ? children : <span>&#10022;</span>}
    </div>
  );
}
