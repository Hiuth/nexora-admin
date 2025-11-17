"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  totalItems: number;
  currentCount: number;
}

export function LoadMoreButton({
  loading,
  hasMore,
  onLoadMore,
  totalItems,
  currentCount,
}: LoadMoreButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll into view when loading more
  useEffect(() => {
    if (loading && buttonRef.current) {
      buttonRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }
  }, [loading]);

  if (!hasMore && currentCount === totalItems && totalItems > 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center text-gray-500">
          <div className="text-sm">
            Đã hiển thị tất cả {totalItems} sản phẩm
          </div>
        </div>
      </div>
    );
  }

  if (!hasMore) {
    return null;
  }

  return (
    <div className="flex justify-center py-6">
      <Button
        ref={buttonRef}
        onClick={onLoadMore}
        disabled={loading}
        variant="outline"
        className="min-w-[200px]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang tải...
          </>
        ) : (
          <>
            Tải thêm sản phẩm
            {totalItems > 0 && (
              <span className="ml-2 text-xs text-gray-500">
                ({currentCount}/{totalItems})
              </span>
            )}
          </>
        )}
      </Button>
    </div>
  );
}