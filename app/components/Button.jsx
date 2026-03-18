export default function Button({ children, variant = "primary", onClick, className = "", disabled = false, type = "button" }) {
  const base = "inline-flex items-center justify-center gap-2 font-medium text-sm px-6 py-3 rounded-full border-none cursor-pointer transition-all duration-[260ms] focus-visible:outline-none";

  const variants = {
    primary: "text-white hover:-translate-y-0.5",
    brand: "text-white hover:-translate-y-0.5",
    outline: "border",
    ghost: "border hover:shadow-md",
  };

  const styles = {
    primary: { background: "var(--color-accent)", boxShadow: "none" },
    brand: { background: "var(--color-brand)" },
    outline: { background: "transparent", color: "var(--color-accent)", borderColor: "var(--color-accent)" },
    ghost: { background: "transparent", color: "var(--color-text-muted)", borderColor: "rgba(45,55,72,0.18)" },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      style={styles[variant]}
    >
      {children}
    </button>
  );
}