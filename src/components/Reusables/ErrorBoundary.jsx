import { Component } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoHomeOutline, IoRefreshOutline, IoWarningOutline } from "react-icons/io5";
import { useLocale } from "../../context/LocaleContext";

const ErrorFallback = ({ onRetry, errorMessage }) => {
  const { t } = useLocale();

  return (
    <section
      className="relative mx-auto w-full max-w-md"
      role="alert"
      aria-live="assertive"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="bento-card-featured glow-ring px-6 py-10 text-center sm:px-10"
      >
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-accent/25 blur-2xl"
          />
          <div className="glass-pill relative flex h-20 w-20 items-center justify-center rounded-full">
            <IoWarningOutline className="h-9 w-9 text-accent" aria-hidden="true" />
          </div>
        </div>

        <span className="apple-chip mx-auto mb-4 gap-1.5 text-secondary">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-pulse"
            aria-hidden="true"
          />
          {t("errorBoundary.badge")}
        </span>

        <h1 className="apple-title-1 text-text">{t("errorBoundary.title")}</h1>
        <p className="apple-subheadline mx-auto mt-3 max-w-xs">{t("errorBoundary.description")}</p>

        {import.meta.env.DEV && errorMessage && (
          <pre
            className="glass-card mx-auto mt-5 max-w-full overflow-x-auto rounded-xl px-3 py-2 text-left text-xs text-text/80 break-words whitespace-pre-wrap font-mono"
          >
            {errorMessage}
          </pre>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <motion.button
            type="button"
            onClick={onRetry}
            whileTap={{ scale: 0.97 }}
            className="btn-primary w-full gap-2 sm:w-auto"
          >
            <IoRefreshOutline className="h-5 w-5 shrink-0" aria-hidden="true" />
            {t("errorBoundary.tryAgain")}
          </motion.button>
          <Link to="/home" className="btn-ghost w-full gap-2 sm:w-auto">
            <IoHomeOutline className="h-5 w-5 shrink-0" aria-hidden="true" />
            {t("common.goHome")}
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: null, resetKey: 0 };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message ?? String(error),
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry() {
    this.setState((prev) => ({
      hasError: false,
      errorMessage: null,
      resetKey: prev.resetKey + 1,
    }));
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-1 items-center justify-center px-4 py-10 min-h-[min(60vh,28rem)]">
          <ErrorFallback onRetry={this.handleRetry} errorMessage={this.state.errorMessage} />
        </div>
      );
    }

    return <div key={this.state.resetKey}>{this.props.children}</div>;
  }
}

export default ErrorBoundary;
