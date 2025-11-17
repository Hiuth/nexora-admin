"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X, Search, Loader2 } from "lucide-react";
import { BrandResponse, CategoryResponse, SubCategoryResponse } from "@/types";

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedBrandId: string;
  onBrandChange: (value: string) => void;
  selectedCategoryId: string;
  onCategoryChange: (value: string) => void;
  selectedSubCategoryId?: string;
  onSubCategoryChange?: (value: string) => void;
  priceRange: { min: string; max: string };
  onPriceRangeChange: (range: { min: string; max: string }) => void;
  brands: BrandResponse[];
  categories: CategoryResponse[];
  subCategories?: SubCategoryResponse[];
  disabled?: boolean;
  searchLoading?: boolean;
  resultCount: number;
}

export function ProductFilters({
  searchTerm,
  onSearchChange,
  selectedBrandId,
  onBrandChange,
  selectedCategoryId,
  onCategoryChange,
  selectedSubCategoryId = "all",
  onSubCategoryChange,
  priceRange,
  onPriceRangeChange,
  brands,
  categories,
  subCategories = [],
  disabled = false,
  searchLoading = false,
  resultCount,
}: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = () => {
    onBrandChange("all");
    onCategoryChange("all");
    onSubCategoryChange?.("all");
    onPriceRangeChange({ min: "", max: "" });
    onSearchChange("");
  };

  const hasActiveFilters =
    selectedBrandId !== "all" ||
    selectedCategoryId !== "all" ||
    selectedSubCategoryId !== "all" ||
    priceRange.min ||
    priceRange.max ||
    searchTerm;

  // Filter subcategories based on selected category
  const filteredSubCategories = selectedCategoryId && selectedCategoryId !== "all"
    ? subCategories.filter(sub => sub.categoryId === selectedCategoryId)
    : subCategories;

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          {searchLoading && searchTerm ? (
            <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          )}
          <Input
            placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`pl-10 transition-all duration-200 ${
              searchLoading && searchTerm 
                ? 'bg-blue-50 border-blue-200 focus:border-blue-400' 
                : ''
            }`}
            disabled={disabled}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-primary/10" : ""}
          disabled={disabled}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Bộ Lọc</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-auto p-1 text-xs"
              disabled={disabled}
            >
              <X className="h-3 w-3 mr-1" />
              Xóa bộ lọc
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium">Thương Hiệu</label>
              <Select
                value={selectedBrandId}
                onValueChange={onBrandChange}
                disabled={disabled}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.brandName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium">Danh Mục</label>
              <Select
                value={selectedCategoryId}
                onValueChange={(value) => {
                  onCategoryChange(value);
                  // Reset subcategory when category changes
                  if (value === "all") {
                    onSubCategoryChange?.("all");
                  }
                }}
                disabled={disabled}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Tất cả" />
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

            {/* Subcategory Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium">Danh Mục Con</label>
              <Select
                value={selectedSubCategoryId}
                onValueChange={(value) => onSubCategoryChange?.(value)}
                disabled={disabled || selectedCategoryId === "all"}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Tất cả" />
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

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-xs font-medium">Khoảng Giá (VNĐ)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Từ"
                  type="number"
                  value={priceRange.min}
                  onChange={(e) =>
                    onPriceRangeChange({ ...priceRange, min: e.target.value })
                  }
                  className="h-8"
                  disabled={disabled}
                />
                <Input
                  placeholder="Đến"
                  type="number"
                  value={priceRange.max}
                  onChange={(e) =>
                    onPriceRangeChange({ ...priceRange, max: e.target.value })
                  }
                  className="h-8"
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Active Filters and Result Count */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">
              Bộ lọc đang áp dụng:
            </span>
            {selectedBrandId !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Thương hiệu:{" "}
                {brands.find((b) => b.id === selectedBrandId)?.brandName}
              </Badge>
            )}
            {selectedCategoryId !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Danh mục:{" "}
                {
                  categories.find((c) => c.id === selectedCategoryId)
                    ?.categoryName
                }
              </Badge>
            )}
            {(priceRange.min || priceRange.max) && (
              <Badge variant="secondary" className="text-xs">
                Giá:{" "}
                {priceRange.min &&
                  `từ ${Number(priceRange.min).toLocaleString()}`}
                {priceRange.min && priceRange.max && " - "}
                {priceRange.max &&
                  `đến ${Number(priceRange.max).toLocaleString()}`}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {resultCount} sản phẩm
          </span>
        </div>
      )}
    </div>
  );
}
