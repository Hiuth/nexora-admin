"use client";

import { BrandResponse, SubCategoryResponse } from "@/types";
import { ProductFilterState } from "./advanced-filters";

interface ActiveFiltersProps {
  filters: ProductFilterState;
  brands: BrandResponse[];
  subCategories: SubCategoryResponse[];
}

export function ActiveFilters({
  filters,
  brands,
  subCategories,
}: ActiveFiltersProps) {
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

  if (!hasActiveFilters()) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
      <span className="text-sm text-muted-foreground w-full sm:w-auto mb-1 sm:mb-0">
        Bộ lọc đang áp dụng:
      </span>
      {filters.search && (
        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs sm:text-sm">
          Tìm kiếm: {filters.search}
        </span>
      )}
      {filters.brandId && (
        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs sm:text-sm">
          TH: {brands.find((b) => b.id === filters.brandId)?.brandName}
        </span>
      )}
      {filters.subCategoryId && (
        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs sm:text-sm">
          DM:{" "}
          {
            subCategories.find((s) => s.id === filters.subCategoryId)
              ?.subCategoryName
          }
        </span>
      )}
      {filters.status && (
        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs sm:text-sm">
          {filters.status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động"}
        </span>
      )}
      {(filters.priceRange.min || filters.priceRange.max) && (
        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs sm:text-sm">
          {filters.priceRange.min || "0"} - {filters.priceRange.max || "∞"} VND
        </span>
      )}
      {filters.stockFilter && (
        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs sm:text-sm">
          {filters.stockFilter === "in-stock"
            ? "Còn hàng"
            : filters.stockFilter === "low-stock"
            ? "Sắp hết"
            : filters.stockFilter === "out-of-stock"
            ? "Hết hàng"
            : "Nhiều hàng"}
        </span>
      )}
    </div>
  );
}
