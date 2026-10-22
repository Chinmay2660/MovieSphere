const formatCount = (count) => (count > 99 ? "99+" : String(count));

const NavCountBadge = ({ count, className = "", inverted = false }) => {
  if (!count || count < 1) return null;

  const tone = inverted
    ? "bg-primary-fg text-primary"
    : "bg-primary text-primary-fg";

  return (
    <span
      className={`pointer-events-none inline-flex h-[1.125rem] min-w-[1.125rem] shrink-0 items-center justify-center self-center rounded-full px-1 text-[0.625rem] font-semibold leading-none shadow-sm ${tone} ${className}`}
      aria-hidden
    >
      {formatCount(count)}
    </span>
  );
};

export default NavCountBadge;
