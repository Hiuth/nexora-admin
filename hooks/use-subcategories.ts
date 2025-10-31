"use client";

import { useState } from "react";
import { SubCategoryResponse } from "@/types";
import { subCategoryService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useSubCategories() {
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSubCategories = async (categoryId: string) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await subCategoryService.getByCategoryId(categoryId);

      if (response.code === 1000 && response.result) {
        setSubCategories(response.result);
      } else {
        setSubCategories([]);
        console.warn(
          "API returned non-success code:",
          response.code,
          response.message
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch subcategories");
      setSubCategories([]);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách danh mục con",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    subCategories,
    loading,
    error,
    fetchSubCategories,
  };
}
