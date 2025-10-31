"use client";

import { useState, useEffect } from "react";
import { CategoryResponse } from "@/types";
import { categoryService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useCategories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getAll();

      if (response.code === 1000 && response.result) {
        setCategories(response.result);
      } else {
        setCategories([]);
        console.warn(
          "API returned non-success code:",
          response.code,
          response.message
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch categories");
      setCategories([]);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách danh mục",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}
