"use client";

import { useState } from "react";
import { PcBuildResponse } from "@/types";
import { PcBuildTable } from "./pc-build-table-infinite";
import { LoadMoreButton } from "../products/load-more-button";
import { InfiniteScroll } from "../products/infinite-scroll";

interface PcBuildListProps {
  pcBuilds: PcBuildResponse[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  totalItems: number;
  onLoadMore: () => void;
  onEdit: (pcBuild: PcBuildResponse) => void;
  onViewDetail: (pcBuild: PcBuildResponse) => void;
  enableInfiniteScroll?: boolean;
}

export function PcBuildList({
  pcBuilds,
  loading,
  loadingMore,
  hasMore,
  totalItems,
  onLoadMore,
  onEdit,
  onViewDetail,
  enableInfiniteScroll = false,
}: PcBuildListProps) {
  const [scrollMode, setScrollMode] = useState<"button" | "infinite">(
    enableInfiniteScroll ? "infinite" : "button"
  );

  if (loading && pcBuilds.length === 0) {
    return (
      <div className="space-y-4">
        <PcBuildTableSkeleton />
      </div>
    );
  }

  const tableContent = (
    <PcBuildTable
      pcBuilds={pcBuilds}
      loading={loading}
      onEdit={onEdit}
      onViewDetail={onViewDetail}
    />
  );

  return (
    <div className="space-y-4">
      {/* Toggle between scroll modes - only show if hasMore */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Hiển thị {pcBuilds.length} trong số {totalItems} PC Build
        </div>
        
        {hasMore && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Chế độ tải:</span>
            <button
              onClick={() => setScrollMode("button")}
              className={`px-2 py-1 rounded text-xs ${
                scrollMode === "button"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Nút bấm
            </button>
            <button
              onClick={() => setScrollMode("infinite")}
              className={`px-2 py-1 rounded text-xs ${
                scrollMode === "infinite"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tự động
            </button>
          </div>
        )}

        {!hasMore && pcBuilds.length > 0 && totalItems === 0 && (
          <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            API này không hỗ trợ phân trang
          </div>
        )}
      </div>

      {/* Content with appropriate scroll behavior */}
      {scrollMode === "infinite" ? (
        <InfiniteScroll
          loading={loadingMore}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
        >
          {tableContent}
        </InfiniteScroll>
      ) : (
        tableContent
      )}

      {/* Load more button for button mode */}
      {scrollMode === "button" && (
        <LoadMoreButton
          loading={loadingMore}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          totalItems={totalItems}
          currentCount={pcBuilds.length}
        />
      )}
      
      {/* End message for button mode when no more data */}
      {scrollMode === "button" && !hasMore && pcBuilds.length > 0 && (
        <div className="py-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Đã hiển thị tất cả {totalItems > 0 ? totalItems : pcBuilds.length} PC Build
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton component for loading state
function PcBuildTableSkeleton() {
  return (
    <div className="border rounded-lg">
      <div className="p-4 border-b bg-gray-50">
        <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}