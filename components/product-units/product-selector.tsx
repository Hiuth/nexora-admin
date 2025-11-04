"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { CategoryResponse, ProductResponse } from "@/types";
import { useCategories, useProducts } from "@/hooks";

interface ProductSelectorProps {
  onProductSelect: (product: ProductResponse) => void;
  selectedProduct: ProductResponse | null;
}

export function ProductSelector({
  onProductSelect,
  selectedProduct,
}: ProductSelectorProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { categories, loading: categoriesLoading } = useCategories();
  const { products, fetchProducts, loading: productsLoading } = useProducts();

  // Load all products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    // Reset search when category changes
    setSearchTerm("");

    // Always load all products, filtering will be done client-side
    await fetchProducts();
  };

  const handleProductChange = (productId: string) => {
    if (!Array.isArray(products)) return;

    const product = products.find((p: ProductResponse) => p.id === productId);
    if (product) {
      onProductSelect(product);
    }
  };

  // Filter products based on search term and category
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products.filter((product: ProductResponse) => {
      // Only show products with serial numbers
      const hasSerial = product.isSerial === true;

      // Filter by search term
      const matchesSearch =
        searchTerm === "" ||
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brandName?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by category (if not "all")
      const matchesCategory =
        selectedCategoryId === "all" ||
        product.categoryId === selectedCategoryId;

      return hasSerial && matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategoryId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chọn Sản Phẩm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Danh Mục</label>
          <Select
            onValueChange={handleCategoryChange}
            value={selectedCategoryId}
            disabled={categoriesLoading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  categoriesLoading ? "Đang tải..." : "Chọn danh mục"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {Array.isArray(categories) && categories.length > 0
                ? categories.map((category: CategoryResponse) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </SelectItem>
                  ))
                : !categoriesLoading && (
                    <div className="p-2 text-sm text-muted-foreground">
                      Không có danh mục nào
                    </div>
                  )}
            </SelectContent>
          </Select>
        </div>

        {/* Search Products */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Tìm kiếm sản phẩm có serial
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên sản phẩm hoặc thương hiệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Chỉ hiển thị sản phẩm có quản lý serial/IMEI
          </p>
        </div>

        {/* Product Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Sản phẩm có serial ({filteredProducts.length} sản phẩm)
          </label>
          <Select
            onValueChange={handleProductChange}
            value={selectedProduct?.id || ""}
            disabled={productsLoading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={productsLoading ? "Đang tải..." : "Chọn sản phẩm"}
              />
            </SelectTrigger>
            <SelectContent>
              {filteredProducts.length > 0
                ? filteredProducts.map((product: ProductResponse) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{product.productName}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          Tồn kho: {product.stockQuantity}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                : !productsLoading && (
                    <div className="p-2 text-sm text-muted-foreground">
                      {searchTerm || selectedCategoryId !== "all"
                        ? "Không tìm thấy sản phẩm có serial nào"
                        : "Không có sản phẩm có serial nào"}
                    </div>
                  )}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Product Info */}
        {selectedProduct && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Sản Phẩm Đã Chọn</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Tên:</span>{" "}
                {selectedProduct.productName}
              </div>
              <div>
                <span className="text-muted-foreground">Tồn kho:</span>{" "}
                {selectedProduct.stockQuantity}
              </div>
              <div>
                <span className="text-muted-foreground">Thương hiệu:</span>{" "}
                {selectedProduct.brandName}
              </div>
              <div>
                <span className="text-muted-foreground">Giá:</span>{" "}
                {selectedProduct.price?.toLocaleString()} VNĐ
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
