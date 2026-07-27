import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const LazyImage = ({
  src,
  alt,
  className = "",
  eager = false,
  rootMargin = "200px",
  width,
  height,
  sizes,
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: rootMargin });
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldLoad = eager || isInView;

  const sharedProps = {
    ref,
    src: shouldLoad ? src : undefined,
    alt,
    loading: eager ? "eager" : "lazy",
    fetchPriority: eager ? "high" : "auto",
    decoding: eager ? "sync" : "async",
    width,
    height,
    sizes,
    onLoad: () => setIsLoaded(true),
    className,
    ...props,
  };

  if (eager) {
    return <img {...sharedProps} />;
  }

  return (
    <>
      {shouldLoad && !isLoaded && (
        <div
          className="absolute inset-0 bg-surface-elevated animate-pulse pointer-events-none"
          aria-hidden
        />
      )}
      <motion.img
        {...sharedProps}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />
    </>
  );
};

export default LazyImage;
