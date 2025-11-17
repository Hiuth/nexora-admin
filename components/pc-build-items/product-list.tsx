"use client";

import { useRef, useEffect, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Loader2 } from "lucide-react";
import { ProductResponse } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ProductListProps {
  products: ProductResponse[];
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  totalItems?: number;
  onLoadMore?: () => void;
  emptyMessage?: string;
}

export function ProductList({
  products,
  selectedProductId,
  onProductSelect,
  loading = false,
  loadingMore = false,
  hasMore = true,
  totalItems = 0,
  onLoadMore,
  emptyMessage = "Không có sản phẩm nào",
}: ProductListProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useRef<HTMLDivElement | null>(null);

  // Setup intersection observer for infinite scroll
  const lastProductCallbackRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && onLoadMore) {
        onLoadMore();
      }
    }, {
      threshold: 0.1,
    });
    if (node) {
      observerRef.current.observe(node);
      lastProductElementRef.current = node;
    }
  }, [loadingMore, hasMore, onLoadMore]);

  // Cleanup observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  if (loading && products.length === 0) {
    return (
      <div className="h-64 border rounded-md flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Đang tải sản phẩm...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Chọn Sản Phẩm</label>
        {totalItems > 0 && (
          <span className="text-xs text-muted-foreground">
            {products.length} / {totalItems} sản phẩm
          </span>
        )}
      </div>
      
      <ScrollArea className="h-64 border rounded-md p-2">
        <div className="space-y-2">
          {products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            products.map((product, index) => {
              const isLast = index === products.length - 1;
              return (
                <Card
                  key={product.id}
                  ref={isLast ? lastProductCallbackRef : undefined}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedProductId === product.id
                      ? "ring-2 ring-primary border-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => onProductSelect(product.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      {product.thumbnail && (
                        <img
                          src={product.thumbnail}
                          alt={product.productName}
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {product.productName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="font-medium text-primary">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0"
                          >
                            SL: {product.stockQuantity}
                          </Badge>
                          {product.brandName && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0"
                            >
                              {product.brandName}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
          
          {/* Loading more indicator */}
          {loadingMore && (
            <div className="text-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              <p className="text-xs text-muted-foreground mt-1">
                Đang tải thêm...
              </p>
            </div>
          )}
          
          {/* End of list indicator */}
          {!hasMore && products.length > 0 && (
            <div className="text-center py-4 text-xs text-muted-foreground">
              Đã tải tất cả sản phẩm
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
