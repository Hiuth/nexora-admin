"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2, Trash2, Eye, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrandResponse } from "@/types";

interface BrandTableProps {
  brands: BrandResponse[];
  onEdit: (brand: BrandResponse) => void;
  onDelete: (id: string) => void;
  onView: (brand: BrandResponse) => void;
}

export function BrandTable({
  brands,
  onEdit,
  onDelete,
  onView,
}: BrandTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Lấy danh sách danh mục unique từ brands
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        brands
          .map((brand) => brand.categoryName)
          .filter((name): name is string => Boolean(name))
      )
    ).sort();
    return uniqueCategories;
  }, [brands]);

  // Lọc brands theo danh mục được chọn
  const filteredBrands = useMemo(() => {
    if (selectedCategory === "all") {
      return brands;
    }
    return brands.filter((brand) => brand.categoryName === selectedCategory);
  }, [brands, selectedCategory]);

  return (
    <Card className="border-border">
      {/* Filter Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Lọc theo danh mục:
            </span>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCategory !== "all" && (
            <span className="text-sm text-muted-foreground">
              ({filteredBrands.length} / {brands.length} thương hiệu)
            </span>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Tên thương hiệu
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Danh mục
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <tr
                  key={brand.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-foreground font-medium">
                    {brand.brandName}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {brand.categoryName || "Không xác định"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(brand)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(brand)}
                        className="text-primary hover:bg-primary/10"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(brand.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  {selectedCategory === "all"
                    ? "Không có thương hiệu nào"
                    : `Không có thương hiệu nào trong danh mục "${selectedCategory}"`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
