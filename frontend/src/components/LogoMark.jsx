// Official NEXCARE logo (provided full logo asset)
export const LogoMark = ({ className = "w-9 h-9" }) => (
  <img
    src="/logo.png"
    alt="NEXCARE — Healthcare Consulting"
    className={`${className} object-contain`}
    data-testid="logo-mark"
  />
);

export const LogoWordmark = ({ className = "" }) => (
  <span className={`font-display font-extrabold tracking-tight ${className}`}>
    NEX<span style={{ color: "#3FB549" }}>CARE</span>
  </span>
);
