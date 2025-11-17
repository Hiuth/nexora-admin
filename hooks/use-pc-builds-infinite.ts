"use client";

import { useState, useCallback, useRef } from "react";
import { PcBuildResponse } from "@/types";
import { pcBuildService } from "@/lib/api/pc-build";
import { useToast } from "@/hooks/use-toast";

interface PcBuildFilterOptions {
  categoryId?: string;
  subCategoryId?: string;
  status?: string;
}

interface UsePcBuildsInfiniteReturn {
  pcBuilds: PcBuildResponse[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  totalItems: number;
  currentPage: number;
  fetchPcBuilds: (filters?: PcBuildFilterOptions) => Promise<void>;
  loadMorePcBuilds: () => Promise<void>;
  reset: () => void;
}

export function usePcBuildsInfinite(): UsePcBuildsInfiniteReturn {
  const [pcBuilds, setPcBuilds] = useState<PcBuildResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();
  
  // Store current filters to use for load more
  const filtersRef = useRef<PcBuildFilterOptions>({});
  const pageSize = 10; // Cố định pageSize = 10 cho tất cả requests
  
  // Flow pagination:
  // 1. fetchPcBuilds: pageNumber=1, pageSize=10 (load trang đầu)
  // 2. loadMorePcBuilds: pageNumber=2,3,4..., pageSize=10 (load thêm)

  const fetchPcBuilds = useCallback(
    async (filters: PcBuildFilterOptions = {}) => {
      setLoading(true);
      setError(null);
      filtersRef.current = filters;
      setCurrentPage(1); // Reset về trang 1
      
      try {
        let response;

        // Choose appropriate API endpoint based on filters
        // Luôn bắt đầu với pageNumber=1, pageSize=10
        if (filters.categoryId) {
          response = await pcBuildService.getByCategoryId(filters.categoryId, 1, pageSize);
        } else if (filters.subCategoryId) {
          response = await pcBuildService.getBySubCategoryId(filters.subCategoryId, 1, pageSize);
        } else {
          response = await pcBuildService.getAll(1, pageSize);
        }

        if (response.code === 1000 && response.result) {
          const result = response.result;
          
          // Backend trả về PaginatedResponse với cấu trúc: { Items, CurrentPage, PageSize, TotalPages, TotalCount }
          if ((result as any).items && Array.isArray((result as any).items)) {
            const paginatedData = result as any;
            setPcBuilds(paginatedData.items);
            setTotalItems(paginatedData.totalCount || 0);
            setCurrentPage(paginatedData.currentPage || 1);
            setHasMore((paginatedData.currentPage || 1) < (paginatedData.totalPages || 1));
          } else if (Array.isArray(result)) {
            // Fallback cho trường hợp trả về array trực tiếp
            setPcBuilds(result);
            setTotalItems(result.length);
            setHasMore(result.length === pageSize);
            setCurrentPage(1);
          } else {
            // Fallback
            setPcBuilds([]);
            setTotalItems(0);
            setHasMore(false);
            setCurrentPage(1);
          }
        } else {
          setPcBuilds([]);
          setTotalItems(0);
          setHasMore(false);
          setCurrentPage(1);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch PC builds");
        setPcBuilds([]);
        setTotalItems(0);
        setHasMore(false);
        setCurrentPage(1);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải danh sách PC Build",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast, pageSize]
  );

  const loadMorePcBuilds = useCallback(async () => {
    if (!hasMore || loadingMore || loading) return;

    setLoadingMore(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      const filters = filtersRef.current;
      let response;

      // Gọi API với pageNumber tăng dần, pageSize cố định = 10
      
      if (filters.categoryId) {
        response = await pcBuildService.getByCategoryId(filters.categoryId, nextPage, pageSize);
      } else if (filters.subCategoryId) {
        response = await pcBuildService.getBySubCategoryId(filters.subCategoryId, nextPage, pageSize);
      } else {
        response = await pcBuildService.getAll(nextPage, pageSize);
      }

      if (response && response.code === 1000 && response.result) {
        const result = response.result;
        
        if ((result as any).items && Array.isArray((result as any).items)) {
          const paginatedData = result as any;
          const newItems = paginatedData.items;
          
          if (newItems.length > 0) {
            // Kiểm tra xem có item nào trùng với danh sách hiện tại không
            const existingIds = new Set(pcBuilds.map(p => p.id));
            const duplicateItems = newItems.filter((item: PcBuildResponse) => existingIds.has(item.id));
            
            // Thêm PC builds mới vào danh sách hiện tại
            setPcBuilds(prev => {
              return [...prev, ...newItems];
            });
            setCurrentPage(nextPage); // Tăng trang sau khi load xong
            setTotalItems(paginatedData.totalCount || 0);
            setHasMore(nextPage < (paginatedData.totalPages || 1));
          } else {
            setHasMore(false);
          }
        } else if (Array.isArray(result)) {
          if (result.length > 0) {
            setPcBuilds(prev => [...prev, ...result]);
            setCurrentPage(nextPage); // Tăng trang sau khi load xong
            setHasMore(result.length === pageSize);
          } else {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load more PC builds");
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải thêm PC Build",
      });
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, loading, currentPage, pageSize, pcBuilds, toast]);

  const reset = useCallback(() => {
    setPcBuilds([]);
    setLoading(false);
    setLoadingMore(false);
    setError(null);
    setHasMore(true);
    setCurrentPage(1);
    setTotalItems(0);
    filtersRef.current = {};
  }, []);

  return {
    pcBuilds,
    loading,
    loadingMore,
    error,
    hasMore,
    totalItems,
    currentPage,
    fetchPcBuilds,
    loadMorePcBuilds,
    reset,
  };
}