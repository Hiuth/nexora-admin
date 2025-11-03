"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { ProductResponse } from "@/types";

interface ProductListProps {
  products: ProductResponse[];
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function ProductList({
  products,
  selectedProductId,
  onProductSelect,
  loading = false,
  emptyMessage = "Không có sản phẩm nào",
}: ProductListProps) {
  if (loading) {
    return (
      <div className="h-64 border rounded-md flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          Đang tải sản phẩm...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Chọn Sản Phẩm</label>
      <ScrollArea className="h-64 border rounded-md p-2">
        <div className="space-y-2">
          {products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            products.map((product) => (
              <Card
                key={product.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedProductId === product.id
                    ? "ring-2 ring-primary border-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => onProductSelect(product.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {product.productName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Mã: {product.id}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.price)}
                        </Badge>
                        {product.stockQuantity !== undefined && (
                          <Badge
                            variant={
                              product.stockQuantity > 0
                                ? "default"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            Tồn: {product.stockQuantity}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
