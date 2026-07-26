import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const LazyImage = ({
  src,
  alt,
  className = "",
  eager = false,
  rootMargin = "200px",
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: rootMargin });
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldLoad = eager || isInView;

  return (
    <>
      {shouldLoad && !isLoaded && (
        <div
          className="absolute inset-0 bg-surface-elevated animate-pulse pointer-events-none"
          aria-hidden
        />
      )}
      <motion.img
        ref={ref}
        src={shouldLoad ? src : undefined}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className={className}
        {...props}
      />
    </>
  );
};

export default LazyImage;
