"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandResponse, SubCategoryResponse } from "@/types";
import { brandService, subCategoryService } from "@/lib/api";
import { toast } from "sonner";

export interface ProductFilterState {
  search: string;
  brandId: string;
  subCategoryId: string;
  status: string;
  priceRange: {
    min: string;
    max: string;
  };
  stockFilter: string;
}

interface AdvancedFiltersProps {
  filters: ProductFilterState;
  onFiltersChange: (filters: ProductFilterState) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
}: AdvancedFiltersProps) {
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFilterData();
  }, []);

  const loadFilterData = async () => {
    try {
      setLoading(true);
      const [brandsResponse, subCategoriesResponse] = await Promise.all([
        brandService.getAll(),
        subCategoryService.getAll(),
      ]);

      if (brandsResponse.code === 1000 && brandsResponse.result) {
        setBrands(brandsResponse.result);
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

  const handleFilterChange = (key: keyof ProductFilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handlePriceRangeChange = (type: "min" | "max", value: string) => {
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: value,
      },
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.brandId ||
      filters.subCategoryId ||
      filters.status ||
      filters.priceRange.min ||
      filters.priceRange.max ||
      filters.stockFilter
    );
  };

  return (
    <div className="pt-4 border-t border-border space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Brand Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Thương hiệu
          </label>
          <select
            value={filters.brandId}
            onChange={(e) => handleFilterChange("brandId", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
            disabled={loading}
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.brandName}
              </option>
            ))}
          </select>
        </div>

        {/* SubCategory Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Danh mục con
          </label>
          <select
            value={filters.subCategoryId}
            onChange={(e) =>
              handleFilterChange("subCategoryId", e.target.value)
            }
            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
            disabled={loading}
          >
            <option value="">Tất cả danh mục</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.subCategoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Trạng thái
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Ngưng hoạt động</option>
          </select>
        </div>

        {/* Stock Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Tồn kho</label>
          <select
            value={filters.stockFilter}
            onChange={(e) => handleFilterChange("stockFilter", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
          >
            <option value="">Tất cả</option>
            <option value="in-stock">Còn hàng (&gt; 0)</option>
            <option value="low-stock">Sắp hết (1-10)</option>
            <option value="out-of-stock">Hết hàng (= 0)</option>
            <option value="high-stock">Nhiều hàng (&gt; 50)</option>
          </select>
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Khoảng giá (VND)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Input
            type="number"
            placeholder="Giá từ"
            value={filters.priceRange.min}
            onChange={(e) => handlePriceRangeChange("min", e.target.value)}
            min="0"
          />
          <Input
            type="number"
            placeholder="Giá đến"
            value={filters.priceRange.max}
            onChange={(e) => handlePriceRangeChange("max", e.target.value)}
            min="0"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
        <Button onClick={onSearch} className="flex-1 order-1 sm:order-none">
          <Search className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Áp dụng bộ lọc</span>
          <span className="sm:hidden">Áp dụng</span>
        </Button>
        {hasActiveFilters() && (
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Xóa bộ lọc</span>
            <span className="sm:hidden">Xóa</span>
          </Button>
        )}
      </div>
    </div>
  );
}
