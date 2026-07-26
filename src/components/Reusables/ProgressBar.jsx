const ProgressBar = ({ value = 0, indeterminate = false, className = "" }) => (
  <div className={`w-full h-2 bg-surface-elevated rounded-full overflow-hidden ${className}`}>
    {indeterminate ? (
      <div
        className="h-full w-2/5 animate-pulse rounded-full bg-primary"
        role="progressbar"
        aria-busy="true"
        aria-valuetext="Preparing"
      />
    ) : (
      <div
        className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    )}
  </div>
);

export default ProgressBar;
