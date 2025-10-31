"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CategoryResponse, SubCategoryResponse } from "@/types";
import { categoryService, subCategoryService } from "@/lib/api";

export function usePcBuildCategories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.code === 1000 && response.result) {
        setCategories(response.result);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách danh mục");
    }
  };

  const loadSubCategories = async () => {
    try {
      const response = await subCategoryService.getAll();
      if (response.code === 1000 && response.result) {
        setSubCategories(response.result);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách danh mục con");
    }
  };

  useEffect(() => {
    loadCategories();
    loadSubCategories();
  }, []);

  return {
    categories,
    subCategories,
    loadCategories,
    loadSubCategories,
  };
}
