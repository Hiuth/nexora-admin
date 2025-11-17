"use client";

import { useState, useCallback, useRef } from "react";
import { ProductResponse } from "@/types";
import { productService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ProductFilterOptions {
  search?: string;
  brandId?: string;
  subCategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface UseProductsInfiniteReturn {
  products: ProductResponse[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  totalItems: number;
  currentPage: number;
  fetchProducts: (filters?: ProductFilterOptions) => Promise<void>;
  loadMoreProducts: () => Promise<void>;
  reset: () => void;
}

export function useProductsInfinite(): UseProductsInfiniteReturn {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();
  
  // Store current filters to use for load more
  const filtersRef = useRef<ProductFilterOptions>({});
  const pageSize = 10; // Cố định pageSize = 10 cho tất cả requests
  
  // Flow pagination:
  // 1. fetchProducts: pageNumber=1, pageSize=10 (load trang đầu)
  // 2. loadMoreProducts: pageNumber=2,3,4..., pageSize=10 (load thêm)

  const fetchProducts = useCallback(
    async (filters: ProductFilterOptions = {}) => {
      setLoading(true);
      setError(null);
      filtersRef.current = filters;
      setCurrentPage(1); // Reset về trang 1
      
      try {
        let response;

        // Choose appropriate API endpoint based on filters
        // Luôn bắt đầu với pageNumber=1, pageSize=10
        if (filters.search) {
          response = await productService.search(filters.search, 1, pageSize);
        } else if (filters.brandId) {
          response = await productService.getByBrandId(filters.brandId, 1, pageSize);
        } else if (filters.subCategoryId) {
          response = await productService.getBySubCategoryId(filters.subCategoryId, 1, pageSize);
        } else if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          const minPrice = filters.minPrice || 0;
          const maxPrice = filters.maxPrice || 999999999;
          response = await productService.getByPriceRange(minPrice, maxPrice, 1, pageSize);
        } else {
          response = await productService.getAll(1, pageSize);
        }

        if (response.code === 1000 && response.result) {
          const result = response.result;
          
          // Backend trả về PaginatedResponse với cấu trúc: { Items, CurrentPage, PageSize, TotalPages, TotalCount }
          if ((result as any).items && Array.isArray((result as any).items)) {
            const paginatedData = result as any;
            setProducts(paginatedData.items);
            setTotalItems(paginatedData.totalCount || 0);
            setCurrentPage(paginatedData.currentPage || 1);
            setHasMore((paginatedData.currentPage || 1) < (paginatedData.totalPages || 1));
          } else if (Array.isArray(result)) {
            // Fallback cho trường hợp trả về array trực tiếp
            setProducts(result);
            setTotalItems(result.length);
            setHasMore(result.length === pageSize);
            setCurrentPage(1);
          } else {
            // Fallback
            setProducts([]);
            setTotalItems(0);
            setHasMore(false);
            setCurrentPage(1);
          }
        } else {
          setProducts([]);
          setTotalItems(0);
          setHasMore(false);
          setCurrentPage(1);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
        setProducts([]);
        setTotalItems(0);
        setHasMore(false);
        setCurrentPage(1);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải danh sách sản phẩm",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast, pageSize]
  );

  const loadMoreProducts = useCallback(async () => {
    if (!hasMore || loadingMore || loading) return;

    setLoadingMore(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      const filters = filtersRef.current;
      let response;

      // Gọi API với pageNumber tăng dần, pageSize cố định = 10
      
      if (filters.search) {
        response = await productService.search(filters.search, nextPage, pageSize);
      } else if (filters.brandId) {
        response = await productService.getByBrandId(filters.brandId, nextPage, pageSize);
      } else if (filters.subCategoryId) {
        response = await productService.getBySubCategoryId(filters.subCategoryId, nextPage, pageSize);
      } else if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        const minPrice = filters.minPrice || 0;
        const maxPrice = filters.maxPrice || 999999999;
        response = await productService.getByPriceRange(minPrice, maxPrice, nextPage, pageSize);
      } else {
        response = await productService.getAll(nextPage, pageSize);
      }

      if (response && response.code === 1000 && response.result) {
        const result = response.result;
        
        if ((result as any).items && Array.isArray((result as any).items)) {
          const paginatedData = result as any;
          const newItems = paginatedData.items;
          
          if (newItems.length > 0) {
            // Kiểm tra xem có item nào trùng với danh sách hiện tại không
            const existingIds = new Set(products.map(p => p.id));
            const duplicateItems = newItems.filter((item: ProductResponse) => existingIds.has(item.id));
            
            // Thêm sản phẩm mới vào danh sách hiện tại
            setProducts(prev => {
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
            setProducts(prev => [...prev, ...result]);
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
      setError(err.message || "Failed to load more products");
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải thêm sản phẩm",
      });
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, loading, currentPage, pageSize, products, toast]);

  const reset = useCallback(() => {
    setProducts([]);
    setLoading(false);
    setLoadingMore(false);
    setError(null);
    setHasMore(true);
    setCurrentPage(1);
    setTotalItems(0);
    filtersRef.current = {};
  }, []);

  return {
    products,
    loading,
    loadingMore,
    error,
    hasMore,
    totalItems,
    currentPage,
    fetchProducts,
    loadMoreProducts,
    reset,
  };
}