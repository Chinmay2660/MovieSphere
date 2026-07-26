import { useEffect, useRef } from "react";

export function useInfiniteScroll({ onLoadMore, hasMore, isLoading, rootMargin = "200px" }) {
  const sentinelRef = useRef(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoadingRef.current) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin, threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, rootMargin]);

  return sentinelRef;
}
