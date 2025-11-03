"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/use-categories";
import { usePcBuildsByCategory } from "@/hooks/use-pc-builds-by-category";
import { CategoryResponse, PcBuildResponse } from "@/types";
import { Building2, Layers, Package } from "lucide-react";

interface PcBuildSelectorProps {
  selectedCategoryId: string;
  selectedPcBuildId: string;
  onCategoryChange: (categoryId: string) => void;
  onPcBuildChange: (pcBuildId: string, pcBuildName: string) => void;
  disabled?: boolean;
}

export function PcBuildSelector({
  selectedCategoryId,
  selectedPcBuildId,
  onCategoryChange,
  onPcBuildChange,
  disabled = false,
}: PcBuildSelectorProps) {
  const { categories, loading: categoriesLoading } = useCategories();
  const { pcBuilds, loading: pcBuildsLoading } =
    usePcBuildsByCategory(selectedCategoryId);

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryResponse | null>(null);
  const [selectedPcBuild, setSelectedPcBuild] =
    useState<PcBuildResponse | null>(null);

  useEffect(() => {
    if (categories.length > 0 && selectedCategoryId) {
      const category = categories.find((cat) => cat.id === selectedCategoryId);
      setSelectedCategory(category || null);
    }
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    if (pcBuilds.length > 0 && selectedPcBuildId) {
      const pcBuild = pcBuilds.find((build) => build.id === selectedPcBuildId);
      setSelectedPcBuild(pcBuild || null);
    }
  }, [pcBuilds, selectedPcBuildId]);

  const handleCategoryChange = (categoryId: string) => {
    onCategoryChange(categoryId);
    onPcBuildChange("", ""); // Reset PC build when category changes
    setSelectedPcBuild(null);
  };

  const handlePcBuildChange = (pcBuildId: string) => {
    const pcBuild = pcBuilds.find((build) => build.id === pcBuildId);
    if (pcBuild) {
      onPcBuildChange(pcBuildId, pcBuild.productName);
      setSelectedPcBuild(pcBuild);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Chọn Cấu Hình Máy Tính
        </h2>
        <p className="text-muted-foreground">
          Chọn danh mục và cấu hình máy tính để quản lý linh kiện
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Selection */}
        <Card className="relative overflow-hidden border-2 hover:border-blue-200 transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-bl-3xl flex items-center justify-center">
            <Layers className="h-8 w-8 text-blue-600" />
          </div>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Bước 1
              </Badge>
            </div>
            <CardTitle className="text-lg text-gray-800">
              Chọn Danh Mục
            </CardTitle>
            <CardDescription>
              Chọn danh mục cấu hình máy tính bạn muốn quản lý
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedCategoryId}
              onValueChange={handleCategoryChange}
              disabled={disabled || categoriesLoading}
            >
              <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                <SelectValue placeholder="Chọn danh mục..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">
                        {category.categoryName}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCategory && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">
                    {selectedCategory.categoryName}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PC Build Selection */}
        <Card className="relative overflow-hidden border-2 hover:border-green-200 transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-bl-3xl flex items-center justify-center">
            <Package className="h-8 w-8 text-green-600" />
          </div>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Bước 2
              </Badge>
            </div>
            <CardTitle className="text-lg text-gray-800">
              Chọn Cấu Hình
            </CardTitle>
            <CardDescription>
              Chọn cấu hình máy tính cụ thể để quản lý linh kiện
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedPcBuildId}
              onValueChange={handlePcBuildChange}
              disabled={disabled || pcBuildsLoading || !selectedCategoryId}
            >
              <SelectTrigger className="h-12 border-2 hover:border-green-300 transition-colors">
                <SelectValue placeholder="Chọn cấu hình..." />
              </SelectTrigger>
              <SelectContent>
                {pcBuilds.map((pcBuild) => (
                  <SelectItem
                    key={pcBuild.id}
                    value={pcBuild.id}
                    className="hover:bg-green-50 hover:text-green-700 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {pcBuild.productName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(pcBuild.price)}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedPcBuild && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">
                    {selectedPcBuild.productName}
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Giá:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(selectedPcBuild.price)}
                </p>
                {selectedPcBuild.description && (
                  <p className="text-sm text-green-600 mt-1">
                    {selectedPcBuild.description}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
