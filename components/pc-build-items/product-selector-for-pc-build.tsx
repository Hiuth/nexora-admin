"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2, RefreshCw, Package, Cpu } from "lucide-react";
import { ProductResponse } from "@/types";
import { useNexoraDesktopProducts } from "@/hooks/use-nexora-desktop-products";

interface ProductSelectorForPcBuildProps {
  onProductSelect: (product: ProductResponse | null) => void;
  selectedProduct: ProductResponse | null;
  title?: string;
  description?: string;
}

export function ProductSelectorForPcBuild({
  onProductSelect,
  selectedProduct,
  title = "Chọn linh kiện",
  description = "Tìm kiếm và chọn linh kiện từ danh mục máy bộ Nexora",
}: ProductSelectorForPcBuildProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    products,
    nexoraCategoryId,
    nexoraCategory,
    loading,
    loadingMore,
    hasMore,
    totalItems,
    fetchProducts,
    loadMoreProducts,
    reset,
  } = useNexoraDesktopProducts();

  // Intersection Observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load products when search changes
  useEffect(() => {
    const filters: any = {};

    if (debouncedSearchTerm) {
      filters.search = debouncedSearchTerm;
    }

    fetchProducts(filters);
  }, [debouncedSearchTerm, fetchProducts]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore || loadingMore || loading || !isOpen) return;

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
  }, [hasMore, loadingMore, loading, loadMoreProducts, isOpen]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleProductSelect = useCallback((product: ProductResponse) => {
    onProductSelect(product);
    setIsOpen(false);
  }, [onProductSelect]);

  const handleClearSelection = useCallback(() => {
    onProductSelect(null);
  }, [onProductSelect]);

  const handleRefresh = useCallback(() => {
    reset();
    setSearchTerm("");
  }, [reset]);

  // Check if we have Nexora category
  const hasNexoraCategory = nexoraCategoryId && nexoraCategory;

  if (!hasNexoraCategory && !loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-600">Cảnh báo</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
            <Cpu className="h-12 w-12 mx-auto text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Không tìm thấy danh mục máy bộ Nexora
            </h3>
            <p className="text-red-600 text-sm">
              Vui lòng kiểm tra lại cấu hình danh mục sản phẩm hoặc liên hệ quản trị viên.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            <CardTitle>{title}</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="space-y-1">
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {hasNexoraCategory && (
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary" className="text-xs">
                Danh mục: {nexoraCategory?.categoryName}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {totalItems} linh kiện
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Selection */}
        {selectedProduct ? (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{selectedProduct.productName}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedProduct.brandName}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {selectedProduct.price?.toLocaleString()} VND
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    SL: {selectedProduct.stockQuantity}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? 'Đóng' : 'Thay đổi'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClearSelection}
                >
                  Bỏ chọn
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/50 rounded-lg border-2 border-dashed">
            <Cpu className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-4">Chưa chọn linh kiện nào</p>
            <Button onClick={() => setIsOpen(true)} disabled={!hasNexoraCategory}>
              Chọn linh kiện
            </Button>
          </div>
        )}

        {/* Product Selection Modal */}
        {isOpen && hasNexoraCategory && (
          <div className="space-y-4 p-4 border rounded-lg bg-background">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tìm kiếm linh kiện</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên linh kiện..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Linh kiện máy bộ Nexora</h4>
                <Badge variant="secondary" className="text-xs">
                  {products.length} linh kiện
                </Badge>
              </div>

              <ScrollArea className="h-64 w-full border rounded-md">
                <div className="p-4 space-y-2">
                  {loading && products.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Đang tải linh kiện...</span>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Cpu className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Không tìm thấy linh kiện phù hợp</p>
                    </div>
                  ) : (
                    <>
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                          onClick={() => handleProductSelect(product)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{product.productName}</h5>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {product.brandName}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {product.price?.toLocaleString()} VND
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  SL: {product.stockQuantity}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Load More Trigger */}
                      {hasMore && (
                        <div 
                          ref={loadMoreRef} 
                          className="flex items-center justify-center py-4"
                        >
                          {loadingMore && (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="ml-2 text-sm text-muted-foreground">
                                Đang tải thêm...
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}