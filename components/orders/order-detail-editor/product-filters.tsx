"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface FilterState {
  searchTerm: string;
  selectedBrand: string;
  selectedSubCategory: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  brands: any[];
  subCategories: any[];
}

export function ProductFilters({
  filters,
  onFiltersChange,
  brands,
  subCategories,
}: ProductFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={filters.searchTerm}
          onChange={(e) =>
            onFiltersChange({ ...filters, searchTerm: e.target.value })
          }
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          value={filters.selectedBrand || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              selectedBrand: value === "all" ? "" : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Tất cả thương hiệu" />
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

        <Select
          value={filters.selectedSubCategory || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              selectedSubCategory: value === "all" ? "" : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {subCategories.map((subCategory) => (
              <SelectItem key={subCategory.id} value={subCategory.id}>
                {subCategory.subCategoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
