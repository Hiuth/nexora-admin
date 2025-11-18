"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, RefreshCw } from "lucide-react";
import { CategoryResponse, ProductResponse } from "@/types";
import { useCategories, useProductsInfinite } from "@/hooks";

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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const { categories, loading: categoriesLoading } = useCategories();
  const {
    products,
    loading: productsLoading,
    loadingMore,
    hasMore,
    totalItems,
    fetchProducts,
    loadMoreProducts,
    reset,
  } = useProductsInfinite();

  // Intersection Observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load products when category or search changes
  useEffect(() => {
    const filters: any = {};

    if (debouncedSearchTerm) {
      filters.search = debouncedSearchTerm;
    }

    if (selectedCategoryId && selectedCategoryId !== "all") {
      // Note: Nếu API hỗ trợ filter theo category, thêm vào đây
      // filters.categoryId = selectedCategoryId;
    }

    fetchProducts(filters);
  }, [debouncedSearchTerm, selectedCategoryId, fetchProducts]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore || loadingMore || productsLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          loadMoreProducts();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, productsLoading, loadMoreProducts]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
    // Reset search when category changes
    setSearchTerm("");
    setDebouncedSearchTerm("");
  }, []);

  const handleProductChange = useCallback((productId: string) => {
    if (!Array.isArray(products)) return;

    const product = products.find((p: ProductResponse) => p.id === productId);
    if (product) {
      onProductSelect(product);
    }
  }, [products, onProductSelect]);

  const handleRefresh = useCallback(() => {
    reset();
    const filters: any = {};
    if (debouncedSearchTerm) {
      filters.search = debouncedSearchTerm;
    }
    if (selectedCategoryId && selectedCategoryId !== "all") {
      // filters.categoryId = selectedCategoryId;
    }
    fetchProducts(filters);
  }, [reset, fetchProducts, debouncedSearchTerm, selectedCategoryId]);

  // Filter products based on search term and category (client-side for additional filtering)
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products.filter((product: ProductResponse) => {
      // Only show products with serial numbers
      const hasSerial = product.isSerial === true;

      // Filter by category (client-side additional filter if API doesn't support it)
      const matchesCategory =
        selectedCategoryId === "all" ||
        product.categoryId === selectedCategoryId;

      return hasSerial && matchesCategory;
    });
  }, [products, selectedCategoryId]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Chọn Sản Phẩm (Auto Load)</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {filteredProducts.length} / {totalItems} sản phẩm có serial
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={productsLoading}
            >
              <RefreshCw className={`h-4 w-4 ${productsLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
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
            {(productsLoading || loadingMore) && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Chỉ hiển thị sản phẩm có quản lý serial/IMEI • Auto search sau 0.5s
          </p>
        </div>

        {/* Product Selection with Infinite Scroll */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Danh sách sản phẩm có serial
          </label>
          <div className="border rounded-lg">
            <ScrollArea className="h-[300px] w-full">
              <div className="p-2 space-y-1">
                {filteredProducts.length > 0 ? (
                  <>
                    {filteredProducts.map((product: ProductResponse) => (
                      <div
                        key={product.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedProduct?.id === product.id
                            ? "bg-primary/10 border border-primary/20"
                            : "border border-transparent"
                        }`}
                        onClick={() => handleProductChange(product.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{product.productName}</div>
                            <div className="text-xs text-muted-foreground">
                              {product.brandName} • Tồn kho: {product.stockQuantity}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Giá: {product.price?.toLocaleString()} VNĐ
                            </div>
                          </div>
                          {selectedProduct?.id === product.id && (
                            <Badge variant="default" className="text-xs">
                              Đã chọn
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Infinite scroll trigger */}
                    <div ref={loadMoreRef} className="h-4" />
                    
                    {/* Loading more indicator */}
                    {loadingMore && (
                      <div className="flex justify-center py-4">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang tải thêm...
                        </div>
                      </div>
                    )}
                    
                    {/* No more items */}
                    {!hasMore && filteredProducts.length > 0 && (
                      <div className="text-center py-4">
                        <div className="text-sm text-muted-foreground">
                          Đã hiển thị tất cả {filteredProducts.length} sản phẩm
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {productsLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang tải sản phẩm...
                      </div>
                    ) : debouncedSearchTerm || selectedCategoryId !== "all" ? (
                      "Không tìm thấy sản phẩm có serial nào"
                    ) : (
                      "Không có sản phẩm có serial nào"
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
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