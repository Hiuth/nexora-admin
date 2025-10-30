"use client";

import { useState, useEffect } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BrandResponse, SubCategoryResponse } from "@/types";
import { brandService, subCategoryService } from "@/lib/api";
import { toast } from "sonner";
import { BasicSearch } from "./filters/basic-search";
import {
  AdvancedFilters,
  ProductFilterState,
} from "./filters/advanced-filters";
import { ActiveFilters } from "./filters/active-filters";

// Re-export the interface for backward compatibility
export type { ProductFilterState };

interface ProductFilterProps {
  filters: ProductFilterState;
  onFiltersChange: (filters: ProductFilterState) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function ProductFilter({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
}: ProductFilterProps) {
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
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

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value,
    });
  };

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      {/* Basic Search */}
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
        <div className="flex-1">
          <BasicSearch
            searchValue={filters.search}
            onSearchChange={handleSearchChange}
            onSearch={onSearch}
            onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
            showAdvanced={showAdvanced}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 w-full lg:w-auto"
        >
          <Filter className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Lọc nâng cao</span>
          <span className="sm:hidden">Lọc</span>
          <ChevronDown
            className={`w-4 h-4 ml-2 transition-transform ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <AdvancedFilters
          filters={filters}
          onFiltersChange={onFiltersChange}
          onSearch={onSearch}
          onReset={onReset}
        />
      )}

      {/* Active Filters Display */}
      <ActiveFilters
        filters={filters}
        brands={brands}
        subCategories={subCategories}
      />
    </Card>
  );
}
