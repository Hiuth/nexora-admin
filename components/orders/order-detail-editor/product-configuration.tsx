"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Loader2, Plus } from "lucide-react";
import { ProductResponse } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ProductConfigurationProps {
  selectedProduct: ProductResponse;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddProduct: () => void;
  loading: boolean;
}

export function ProductConfiguration({
  selectedProduct,
  quantity,
  onQuantityChange,
  onAddProduct,
  loading,
}: ProductConfigurationProps) {
  return (
    <div className="border rounded-lg">
      <div className="bg-muted px-4 py-2">
        <h3 className="font-medium">Cấu hình sản phẩm</h3>
      </div>
      <div className="p-4 space-y-4">
        {/* Product Info with Thumbnail */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <img
              src={selectedProduct.thumbnail || "/placeholder.jpg"}
              alt={selectedProduct.productName}
              className="w-20 h-20 object-cover rounded-md border shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.jpg";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm mb-2 line-clamp-2">
              {selectedProduct.productName}
            </h4>
            <p className="text-xs text-muted-foreground">
              {selectedProduct.brandName} - {selectedProduct.categoryName}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Kho: {selectedProduct.stockQuantity}
              </Badge>
              <span className="text-sm font-semibold text-blue-600">
                {formatCurrency(selectedProduct.price)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Số lượng</Label>
          <Input
            type="number"
            min="1"
            max={selectedProduct.stockQuantity}
            value={quantity}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            className="text-sm"
          />
          {selectedProduct.stockQuantity < quantity && (
            <div className="flex items-center gap-1 text-xs text-red-500">
              <AlertTriangle className="h-3 w-3" />
              Không đủ hàng trong kho
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Thành tiền</Label>
          <div className="text-lg font-bold text-blue-600">
            {formatCurrency(selectedProduct.price * quantity)}
          </div>
        </div>

        <Button
          onClick={onAddProduct}
          disabled={
            loading || quantity > selectedProduct.stockQuantity || quantity <= 0
          }
          className="w-full"
          size="sm"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Thêm vào giỏ hàng
        </Button>
      </div>
    </div>
  );
}
