"use client";

import { useEffect, useRef, useCallback } from "react";

interface InfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
  children: React.ReactNode;
}

export function InfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  threshold = 200,
  children,
}: InfiniteScrollProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedLoadMore = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (!loadingRef.current && hasMore && !loading) {
        loadingRef.current = true;
        Promise.resolve(onLoadMore()).finally(() => {
          loadingRef.current = false;
        });
      }
    }, 100); // 100ms debounce
  }, [onLoadMore, hasMore, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading && !loadingRef.current) {
          debouncedLoadMore();
        }
      },
      {
        root: null,
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    const currentTrigger = triggerRef.current;
    if (currentTrigger && hasMore) {
      observer.observe(currentTrigger);
    }

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasMore, loading, debouncedLoadMore, threshold]);

  return (
    <>
      {children}
      {hasMore && (
        <div
          ref={triggerRef}
          className="h-8 w-full flex items-center justify-center"
          aria-hidden="true"
        >
          {loading && (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              Đang tải...
            </div>
          )}
        </div>
      )}
      {!hasMore && (
        <div className="py-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-600 text-sm rounded-lg border">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Đã hiển thị tất cả sản phẩm
          </div>
        </div>
      )}
    </>
  );
}