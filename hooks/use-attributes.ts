"use client";

import { useState, useEffect, useCallback } from "react";
import { attributesService } from "@/lib/api/attributes";
import { categoryService } from "@/lib/api/category";
import { AttributesResponse, CategoryResponse } from "@/types";
import { toast } from "@/hooks/use-toast";

export interface AttributeWithCategory extends AttributesResponse {
  categoryName?: string;
}

export function useAttributes() {
  const [attributes, setAttributes] = useState<AttributeWithCategory[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAll();
      if (response.result) {
        setCategories(response.result);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách danh mục",
        variant: "destructive",
      });
    }
  }, []);

  // Load all attributes
  const loadAttributes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await attributesService.getAll();
      if (response.result) {
        // Enrich attributes with category names
        const enrichedAttributes = response.result.map((attr) => ({
          ...attr,
          categoryName:
            categories.find((cat) => cat.id === attr.categoryId)
              ?.categoryName || "Unknown",
        }));
        setAttributes(enrichedAttributes);
      }
    } catch (error) {
      console.error("Error loading attributes:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách thuộc tính",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [categories]);

  // Load attributes by category
  const loadAttributesByCategory = useCallback(
    async (categoryId: string) => {
      setLoading(true);
      try {
        const response = await attributesService.getByCategoryId(categoryId);
        if (response.result) {
          const categoryName =
            categories.find((cat) => cat.id === categoryId)?.categoryName ||
            "Unknown";
          const enrichedAttributes = response.result.map((attr) => ({
            ...attr,
            categoryName,
          }));
          setAttributes(enrichedAttributes);
        }
      } catch (error) {
        console.error("Error loading attributes by category:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách thuộc tính theo danh mục",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [categories]
  );

  // Create attribute
  const createAttribute = useCallback(
    async (categoryId: string, attributeName: string) => {
      setCreating(true);
      try {
        const response = await attributesService.create(categoryId, {
          attributeName,
          categoryId,
        });

        if (response.result) {
          toast({
            title: "Thành công",
            description: "Đã tạo thuộc tính mới",
          });

          // Reload attributes
          if (selectedCategoryId) {
            loadAttributesByCategory(selectedCategoryId);
          } else {
            loadAttributes();
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error creating attribute:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tạo thuộc tính",
          variant: "destructive",
        });
        return false;
      } finally {
        setCreating(false);
      }
    },
    [selectedCategoryId, loadAttributes, loadAttributesByCategory]
  );

  // Update attribute
  const updateAttribute = useCallback(
    async (
      attributeId: string,
      categoryId?: string,
      attributeName?: string
    ) => {
      setUpdating(true);
      try {
        const response = await attributesService.update(
          attributeId,
          categoryId,
          attributeName ? { attributeName } : undefined
        );

        if (response.result) {
          toast({
            title: "Thành công",
            description: "Đã cập nhật thuộc tính",
          });

          // Reload attributes
          if (selectedCategoryId) {
            loadAttributesByCategory(selectedCategoryId);
          } else {
            loadAttributes();
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error updating attribute:", error);
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật thuộc tính",
          variant: "destructive",
        });
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [selectedCategoryId, loadAttributes, loadAttributesByCategory]
  );

  // Delete attribute
  const deleteAttribute = useCallback(
    async (attributeId: string) => {
      setDeleting(attributeId);
      try {
        await attributesService.delete(attributeId);
        toast({
          title: "Thành công",
          description: "Đã xóa thuộc tính",
        });

        // Reload attributes
        if (selectedCategoryId) {
          loadAttributesByCategory(selectedCategoryId);
        } else {
          loadAttributes();
        }
        return true;
      } catch (error) {
        console.error("Error deleting attribute:", error);
        toast({
          title: "Lỗi",
          description: "Không thể xóa thuộc tính",
          variant: "destructive",
        });
        return false;
      } finally {
        setDeleting(null);
      }
    },
    [selectedCategoryId, loadAttributes, loadAttributesByCategory]
  );

  // Filter by category
  const filterByCategory = useCallback(
    (categoryId: string) => {
      setSelectedCategoryId(categoryId);
      if (categoryId && categoryId !== "all") {
        loadAttributesByCategory(categoryId);
      } else {
        loadAttributes();
      }
    },
    [loadAttributes, loadAttributesByCategory]
  );

  // Initialize
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (categories.length > 0) {
      loadAttributes();
    }
  }, [categories, loadAttributes]);

  return {
    attributes,
    categories,
    loading,
    creating,
    updating,
    deleting,
    selectedCategoryId,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    filterByCategory,
    loadAttributes,
    loadCategories,
  };
}
