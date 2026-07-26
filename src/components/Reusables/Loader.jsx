const RING_SIZE = {
  sm: "size-6",
  md: "size-10",
  lg: "size-14",
};

const BORDER_WIDTH = {
  sm: "border-2",
  md: "border-2",
  lg: "border-[3px]",
};

const Loader = ({ size = "md", label, className = "" }) => {
  const ring = RING_SIZE[size] ?? RING_SIZE.md;
  const border = BORDER_WIDTH[size] ?? BORDER_WIDTH.md;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className={`relative ${ring} loader-glow`} aria-hidden>
        <div className={`absolute inset-0 rounded-full ${border} border-white/10`} />
        <div
          className={`absolute inset-0 rounded-full ${border} border-transparent border-t-primary border-r-accent animate-spin`}
        />
        <div className="absolute inset-[38%] rounded-full bg-primary/90 animate-pulse" />
      </div>
      {label ? (
        <p className="apple-footnote">{label}</p>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );
};

export default Loader;
