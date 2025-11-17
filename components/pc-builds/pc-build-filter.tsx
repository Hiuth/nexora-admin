"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryResponse, SubCategoryResponse } from "@/types";
import { categoryService, subCategoryService } from "@/lib/api";
import { toast } from "sonner";

export interface PcBuildFilterState {
  search: string;
  categoryId: string;
  subCategoryId: string;
  status: string;
}

interface PcBuildFilterProps {
  filters: PcBuildFilterState;
  onFiltersChange: (filters: PcBuildFilterState) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function PcBuildFilter({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
}: PcBuildFilterProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFilterData();
  }, []);

  const loadFilterData = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, subCategoriesResponse] = await Promise.all([
        categoryService.getAll(),
        subCategoryService.getAll(),
      ]);

      if (categoriesResponse.code === 1000 && categoriesResponse.result) {
        setCategories(categoriesResponse.result);
      }

      if (subCategoriesResponse.code === 1000 && subCategoriesResponse.result) {
        setSubCategories(subCategoriesResponse.result);
      }
    } catch (error) {
      toast.error("Không thể tải dữ liệu lọc");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PcBuildFilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const hasActiveFilters = 
    (filters.categoryId && filters.categoryId !== "all") ||
    (filters.subCategoryId && filters.subCategoryId !== "all") ||
    (filters.status && filters.status !== "all");

  // Filter subcategories based on selected category
  const filteredSubCategories = (filters.categoryId && filters.categoryId !== "all") 
    ? subCategories.filter(sub => sub.categoryId === filters.categoryId)
    : subCategories;

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm PC Build..."
                value={filters.search}
                onChange={(e) => handleInputChange("search", e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={onSearch} className="whitespace-nowrap">
                <Search className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Tìm kiếm</span>
                <span className="sm:hidden">Tìm</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="whitespace-nowrap"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Bộ lọc</span>
                <span className="sm:hidden">Lọc</span>
              </Button>
              {hasActiveFilters && (
                <Button variant="outline" onClick={onReset} className="whitespace-nowrap">
                  <X className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Xóa bộ lọc</span>
                  <span className="sm:hidden">Xóa</span>
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Danh mục</label>
                <Select
                  value={filters.categoryId}
                  onValueChange={(value) => {
                    handleInputChange("categoryId", value);
                    // Reset subcategory when category changes
                    if (value !== filters.categoryId) {
                      handleInputChange("subCategoryId", "all");
                    }
                  }}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* SubCategory Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Danh mục con</label>
                <Select
                  value={filters.subCategoryId}
                  onValueChange={(value) => handleInputChange("subCategoryId", value)}
                  disabled={loading || (filters.categoryId === "all" || !filters.categoryId)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả danh mục con" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục con</SelectItem>
                    {filteredSubCategories.map((subCategory) => (
                      <SelectItem key={subCategory.id} value={subCategory.id}>
                        {subCategory.subCategoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Trạng thái</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                    <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}