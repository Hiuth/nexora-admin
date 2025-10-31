"use client";

import { useState, useEffect, useCallback } from "react";
import { pcBuildService } from "@/lib/api/pc-build";
import { categoryService, subCategoryService } from "@/lib/api";
import {
  PcBuildResponse,
  CategoryResponse,
  SubCategoryResponse,
  CreatePcBuildRequest,
  UpdatePcBuildRequest,
  PaginatedResponse,
} from "@/types";
import { toast } from "@/hooks/use-toast";

export function usePcBuilds() {
  const [pcBuilds, setPcBuilds] = useState<PcBuildResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Load PC Builds
  const loadPcBuilds = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      try {
        const response = await pcBuildService.getAll(page, pageSize);
        if (response.code === 1000 && response.result) {
          const paginatedData =
            response.result as PaginatedResponse<PcBuildResponse>;
          setPcBuilds(paginatedData.items || []);
          setCurrentPage(paginatedData.currentPage || 1);
          setTotalPages(paginatedData.totalPages || 1);
          setTotalCount(paginatedData.totalCount || 0);
        } else {
          setPcBuilds([]);
        }
      } catch (error) {
        console.error("Error loading PC builds:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách PC Build",
          variant: "destructive",
        });
        setPcBuilds([]);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAll();
      if (response.code === 1000 && response.result) {
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

  // Load subcategories
  const loadSubCategories = useCallback(async () => {
    try {
      const response = await subCategoryService.getAll();
      if (response.code === 1000 && response.result) {
        setSubCategories(response.result);
      }
    } catch (error) {
      console.error("Error loading subcategories:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách danh mục con",
        variant: "destructive",
      });
    }
  }, []);

  // Load subcategories by category ID
  const loadSubCategoriesByCategoryId = useCallback(
    async (categoryId: string) => {
      try {
        const response = await subCategoryService.getByCategoryId(categoryId);
        if (response.code === 1000 && response.result) {
          setSubCategories(response.result);
        } else {
          setSubCategories([]);
        }
      } catch (error) {
        console.error("Error loading subcategories by category:", error);
        setSubCategories([]);
      }
    },
    []
  );

  // Create PC Build
  const createPcBuild = useCallback(
    async (
      categoryId: string,
      subCategoryId: string | null,
      data: CreatePcBuildRequest,
      file: File
    ) => {
      setCreating(true);
      try {
        const response = await pcBuildService.create(
          categoryId,
          subCategoryId,
          data,
          file
        );
        if (response.code === 1000) {
          toast({
            title: "Thành công",
            description: "Đã tạo PC Build mới",
          });
          await loadPcBuilds(currentPage);
          return true;
        } else {
          toast({
            title: "Lỗi",
            description: response.message || "Không thể tạo PC Build",
            variant: "destructive",
          });
          return false;
        }
      } catch (error) {
        console.error("Error creating PC build:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tạo PC Build",
          variant: "destructive",
        });
        return false;
      } finally {
        setCreating(false);
      }
    },
    [currentPage, loadPcBuilds]
  );

  // Update PC Build
  const updatePcBuild = useCallback(
    async (
      pcBuildId: string,
      categoryId?: string,
      subCategoryId?: string,
      data?: UpdatePcBuildRequest,
      file?: File
    ) => {
      setUpdating(true);
      try {
        const response = await pcBuildService.update(
          pcBuildId,
          categoryId,
          subCategoryId,
          data,
          file
        );
        if (response.code === 1000) {
          toast({
            title: "Thành công",
            description: "Đã cập nhật PC Build",
          });
          await loadPcBuilds(currentPage);
          return true;
        } else {
          toast({
            title: "Lỗi",
            description: response.message || "Không thể cập nhật PC Build",
            variant: "destructive",
          });
          return false;
        }
      } catch (error) {
        console.error("Error updating PC build:", error);
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật PC Build",
          variant: "destructive",
        });
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [currentPage, loadPcBuilds]
  );

  // Delete PC Build
  const deletePcBuild = useCallback(
    async (pcBuildId: string) => {
      setDeleting(pcBuildId);
      try {
        const response = await pcBuildService.delete(pcBuildId);
        if (response.code === 1000) {
          toast({
            title: "Thành công",
            description: "Đã xóa PC Build",
          });
          await loadPcBuilds(currentPage);
          return true;
        } else {
          toast({
            title: "Lỗi",
            description: response.message || "Không thể xóa PC Build",
            variant: "destructive",
          });
          return false;
        }
      } catch (error) {
        console.error("Error deleting PC build:", error);
        toast({
          title: "Lỗi",
          description: "Không thể xóa PC Build",
          variant: "destructive",
        });
        return false;
      } finally {
        setDeleting(null);
      }
    },
    [currentPage, loadPcBuilds]
  );

  // Get PC Build by ID
  const getPcBuildById = useCallback(async (pcBuildId: string) => {
    try {
      const response = await pcBuildService.getById(pcBuildId);
      if (response.code === 1000 && response.result) {
        return response.result;
      }
      return null;
    } catch (error) {
      console.error("Error getting PC build by ID:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin PC Build",
        variant: "destructive",
      });
      return null;
    }
  }, []);

  // Change page
  const changePage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        loadPcBuilds(page);
      }
    },
    [totalPages, loadPcBuilds]
  );

  // Initialize
  useEffect(() => {
    loadPcBuilds();
    loadCategories();
    loadSubCategories();
  }, [loadPcBuilds, loadCategories, loadSubCategories]);

  return {
    pcBuilds,
    categories,
    subCategories,
    loading,
    creating,
    updating,
    deleting,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    createPcBuild,
    updatePcBuild,
    deletePcBuild,
    getPcBuildById,
    loadPcBuilds,
    loadSubCategoriesByCategoryId,
    changePage,
  };
}
