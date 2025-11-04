"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, FilterX, Tag, Box } from "lucide-react";

interface ProductSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedBrand: string;
  onBrandChange: (value: string) => void;
  selectedSubCategory: string;
  onSubCategoryChange: (value: string) => void;
  brands: any[];
  subCategories: any[];
  filteredCount: number;
  cartCount: number;
}

export function ProductSearchFilters({
  searchTerm,
  onSearchChange,
  selectedBrand,
  onBrandChange,
  selectedSubCategory,
  onSubCategoryChange,
  brands,
  subCategories,
  filteredCount,
  cartCount,
}: ProductSearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = () => {
    onBrandChange("all");
    onSubCategoryChange("all");
  };

  const hasActiveFilters =
    (selectedBrand && selectedBrand !== "all") ||
    (selectedSubCategory && selectedSubCategory !== "all");

  return (
    <Card className="bg-blue-100 border-blue-300">
      <CardContent className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600">
            <Search className="h-4 w-4" />
          </div>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-blue-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 text-xs ${
                showFilters
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-blue-400 text-blue-700 hover:bg-blue-50"
              }`}
            >
              <Filter className="h-3 w-3" />
              Bộ lọc
              {hasActiveFilters && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-white text-blue-700 text-xs"
                >
                  {(selectedBrand && selectedBrand !== "all" ? 1 : 0) +
                    (selectedSubCategory && selectedSubCategory !== "all"
                      ? 1
                      : 0)}
                </Badge>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100"
              >
                <FilterX className="h-3 w-3 mr-1" />
                Xóa
              </Button>
            )}
          </div>

          <div className="text-xs text-gray-700">
            <span className="font-medium text-blue-700">{filteredCount}</span>{" "}
            sản phẩm
            {cartCount > 0 && (
              <span className="ml-1">• Đã loại {cartCount}</span>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="p-3 bg-white rounded-lg border border-blue-300 shadow-sm space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-blue-800 flex items-center gap-1.5">
                  <Tag className="h-3 w-3" />
                  Thương hiệu
                </Label>
                <Select value={selectedBrand} onValueChange={onBrandChange}>
                  <SelectTrigger className="h-9 text-xs border-blue-300 focus:border-blue-500">
                    <SelectValue placeholder="Chọn thương hiệu..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.brandName}>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          <span className="text-xs">{brand.brandName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-blue-800 flex items-center gap-1.5">
                  <Box className="h-3 w-3" />
                  Danh mục
                </Label>
                <Select
                  value={selectedSubCategory}
                  onValueChange={onSubCategoryChange}
                >
                  <SelectTrigger className="h-9 text-xs border-blue-300 focus:border-blue-500">
                    <SelectValue placeholder="Chọn danh mục..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {subCategories.map((subCategory) => (
                      <SelectItem
                        key={subCategory.id}
                        value={subCategory.subCategoryName}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          <span className="text-xs">
                            {subCategory.subCategoryName}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
