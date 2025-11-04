"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import { ProductResponse } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ProductListProps {
  products: ProductResponse[];
  loading: boolean;
  selectedProduct: ProductResponse | null;
  onProductSelect: (product: ProductResponse) => void;
  onRefresh?: () => void;
}

export function ProductList({
  products,
  loading,
  selectedProduct,
  onProductSelect,
  onRefresh,
}: ProductListProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-2 flex items-center justify-between">
        <h3 className="font-medium">Sản phẩm khả dụng ({products.length})</h3>
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        )}
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Không tìm thấy sản phẩm nào
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedProduct?.id === product.id
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onProductSelect(product)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    {/* Product Thumbnail */}
                    <div className="flex-shrink-0">
                      <img
                        src={product.thumbnail || "/placeholder.jpg"}
                        alt={product.productName}
                        className="w-16 h-16 object-cover rounded-md border transition-transform hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.jpg";
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {product.productName}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {product.brandName} - {product.categoryName}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          Kho: {product.stockQuantity}
                        </Badge>
                        <span className="text-sm font-semibold text-blue-600">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
