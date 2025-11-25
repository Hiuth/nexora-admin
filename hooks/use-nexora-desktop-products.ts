"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductResponse, CategoryResponse } from "@/types";
import { useProductsInfinite, useCategories } from "@/hooks";

// Hook để lấy sản phẩm chỉ từ danh mục máy bộ nexora
export function useNexoraDesktopProducts() {
  const { categories, loading: categoriesLoading } = useCategories();
  const {
    products,
    loading: productsLoading,
    loadingMore,
    hasMore,
    totalItems,
    fetchProducts,
    loadMoreProducts,
    reset,
  } = useProductsInfinite();

  const [nexoraCategoryId, setNexoraCategoryId] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<ProductResponse[]>([]);

  // Tìm category "máy bộ nexora" hoặc tương tự
  useEffect(() => {
    if (categories.length > 0) {
      const nexoraCategory = categories.find(
        (cat) =>
          cat.categoryName.toLowerCase().includes("máy bộ") ||
          cat.categoryName.toLowerCase().includes("desktop") ||
          cat.categoryName.toLowerCase().includes("pc") ||
          cat.categoryName.toLowerCase().includes("nexora")
      );

      if (nexoraCategory) {
        setNexoraCategoryId(nexoraCategory.id);
        console.log("Found Nexora Desktop Category:", nexoraCategory);
      } else {
        console.warn("Nexora Desktop Category not found in:", categories);
      }
    }
  }, [categories]);

  // Filter products theo category
  useEffect(() => {
    if (nexoraCategoryId && products.length > 0) {
      const filtered = products.filter(
        (product) => product.categoryId === nexoraCategoryId
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [products, nexoraCategoryId]);

  // Fetch products ban đầu
  const fetchNexoraProducts = useCallback(
    (searchFilters?: { search?: string }) => {
      const filters: any = { ...searchFilters };
      
      // Có thể thêm filter theo category nếu API hỗ trợ
      // if (nexoraCategoryId) {
      //   filters.categoryId = nexoraCategoryId;
      // }

      fetchProducts(filters);
    },
    [fetchProducts, nexoraCategoryId]
  );

  // Load more với filter
  const loadMoreNexoraProducts = useCallback(() => {
    loadMoreProducts();
  }, [loadMoreProducts]);

  // Reset với category filter
  const resetNexoraProducts = useCallback(() => {
    reset();
  }, [reset]);

  return {
    // Data
    products: filteredProducts, // Chỉ trả về sản phẩm đã filter
    allProducts: products, // Tất cả sản phẩm (backup)
    nexoraCategoryId,
    nexoraCategory: categories.find(cat => cat.id === nexoraCategoryId),
    
    // Loading states
    loading: categoriesLoading || productsLoading,
    loadingMore,
    hasMore,
    totalItems: filteredProducts.length, // Total của filtered products
    
    // Actions
    fetchProducts: fetchNexoraProducts,
    loadMoreProducts: loadMoreNexoraProducts,
    reset: resetNexoraProducts,
  };
}