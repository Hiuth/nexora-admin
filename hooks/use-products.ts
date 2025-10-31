"use client";

import { useState } from "react";
import { ProductResponse } from "@/types";
import { productService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useProducts() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async (brandId?: string, subCategoryId?: string) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (subCategoryId) {
        response = await productService.getBySubCategoryId(subCategoryId);
      } else if (brandId) {
        response = await productService.getByBrandId(brandId);
      } else {
        response = await productService.getAll();
      }

      if (response.code === 1000 && response.result) {
        const paginatedData = response.result;
        let filteredProducts =
          (paginatedData as any).items || paginatedData || [];

        // Handle both paginated response (with .items) and direct array response
        if (Array.isArray(paginatedData)) {
          filteredProducts = paginatedData;
        }

        setProducts(filteredProducts);
      } else {
        setProducts([]);
        console.warn(
          "API returned non-success code:",
          response.code,
          response.message
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch products");
      setProducts([]);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách sản phẩm",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
  };
}
