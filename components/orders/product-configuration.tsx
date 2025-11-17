"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package2, Tag, Box, Star, Minus, Plus, Settings } from "lucide-react";
import { ProductResponse } from "@/types";

interface ProductConfigurationProps {
  selectedProduct: ProductResponse | null;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  unitPrice: number;
  onUnitPriceChange: (price: number) => void;
  loading: boolean;
  errors: { [key: string]: string };
}

export function ProductConfiguration({
  selectedProduct,
  quantity,
  onQuantityChange,
  unitPrice,
  onUnitPriceChange,
  loading,
  errors,
}: ProductConfigurationProps) {
  if (!selectedProduct) {
    return (
      <div className="h-full bg-blue-50 rounded-lg p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Settings className="h-8 w-8 text-blue-400" />
        </div>
        <h3 className="font-semibold text-blue-700 mb-2">Chưa chọn sản phẩm</h3>
        <p className="text-sm text-blue-600 max-w-sm">
          Vui lòng chọn một sản phẩm từ danh sách bên trái để cấu hình
        </p>
      </div>
    );
  }

  const totalPrice = quantity * unitPrice;

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold flex items-center gap-2 text-blue-700">
        <Settings className="h-4 w-4 text-blue-500" />
        Cấu hình sản phẩm
      </Label>

      <Card className="bg-blue-50 border-2 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-blue-100 flex items-center justify-center shadow-sm">
              {selectedProduct.thumbnail ? (
                <>
                  <img
                    src={selectedProduct.thumbnail}
                    alt={selectedProduct.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      (
                        target.nextElementSibling as HTMLElement
                      )?.classList.remove("hidden");
                    }}
                  />
                  <Package2 className="absolute inset-0 hidden h-6 w-6 text-gray-400 m-auto" />
                </>
              ) : (
                <Package2 className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">
                {selectedProduct.productName}
              </h3>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="h-3 w-3 text-blue-400" />
                  <span className="text-gray-600">
                    <span className="font-medium">Thương hiệu:</span>{" "}
                    <span className="text-blue-500 font-medium">
                      {selectedProduct.brandName}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Box className="h-3 w-3 text-blue-400" />
                  <span className="text-gray-600">
                    <span className="font-medium">Danh mục:</span>{" "}
                    <span className="text-blue-500 font-medium">
                      {selectedProduct.subCategoryName}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package2 className="h-3 w-3 text-green-500" />
                  <span className="text-gray-600">
                    <span className="font-medium">Tồn kho:</span>{" "}
                    <span className={`font-bold ${
                      selectedProduct.stockQuantity > 10 
                        ? 'text-green-600' 
                        : selectedProduct.stockQuantity > 0 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {selectedProduct.stockQuantity} sản phẩm
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-blue-400" />
                  <span className="text-gray-600">
                    <span className="font-medium">Giá gốc:</span>{" "}
                    <span className="text-blue-500 font-bold">
                      {selectedProduct.price.toLocaleString("vi-VN")} ₫
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package2 className="h-3 w-3 text-blue-400" />
                  <span className="text-gray-600">
                    <span className="font-medium">Tồn kho:</span>{" "}
                    <Badge
                      variant={
                        selectedProduct.stockQuantity > 0
                          ? "default"
                          : "destructive"
                      }
                      className={
                        selectedProduct.stockQuantity > 0
                          ? "bg-blue-100 text-blue-600 border-blue-200 text-xs h-5"
                          : "text-xs h-5"
                      }
                    >
                      {selectedProduct.stockQuantity}
                    </Badge>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator className="border-blue-200" />
          {/* Quantity Configuration */}
          <div className="space-y-3">
            <Label
              htmlFor="quantity"
              className="text-sm font-bold text-blue-700"
            >
              Số lượng *
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={loading || quantity <= 1}
                className="h-9 w-9 rounded-lg border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) =>
                  onQuantityChange(Math.max(1, Number(e.target.value)))
                }
                min="1"
                max={selectedProduct.stockQuantity}
                disabled={loading}
                className="text-center font-bold h-9 border-2 border-blue-300 focus:border-blue-500"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onQuantityChange(
                    Math.min(selectedProduct.stockQuantity, quantity + 1)
                  )
                }
                disabled={loading || quantity >= selectedProduct.stockQuantity}
                className="h-9 w-9 rounded-lg border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Stock quantity info and warnings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Có thể chọn tối đa:</span>
                <Badge variant={selectedProduct.stockQuantity > 10 ? "secondary" : "destructive"}>
                  {selectedProduct.stockQuantity} sản phẩm
                </Badge>
              </div>
              
              {quantity > selectedProduct.stockQuantity && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                  <p className="text-xs text-red-600 font-medium">
                    ⚠️ Số lượng vượt quá tồn kho! Chỉ còn {selectedProduct.stockQuantity} sản phẩm trong kho.
                  </p>
                </div>
              )}
              
              {selectedProduct.stockQuantity <= 5 && selectedProduct.stockQuantity > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                  <p className="text-xs text-yellow-600 font-medium">
                    ⚠️ Sản phẩm sắp hết hàng! Chỉ còn {selectedProduct.stockQuantity} sản phẩm.
                  </p>
                </div>
              )}
              
              {selectedProduct.stockQuantity === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                  <p className="text-xs text-red-600 font-medium">
                    ❌ Sản phẩm đã hết hàng! Không thể thêm vào giỏ hàng.
                  </p>
                </div>
              )}
            </div>
            
            {errors.quantity && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                {errors.quantity}
              </p>
            )}
          </div>
          {/* Price Configuration */}
          <div className="space-y-3">
            <Label
              htmlFor="unitPrice"
              className="text-sm font-bold text-blue-700"
            >
              Đơn giá *
            </Label>
            <div className="relative">
              <Input
                id="unitPrice"
                type="number"
                value={unitPrice}
                onChange={(e) => onUnitPriceChange(Number(e.target.value))}
                min="0"
                step="1000"
                disabled={loading}
                className="h-9 font-bold border-2 border-blue-300 focus:border-blue-500 pr-8"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold text-sm">
                ₫
              </span>
            </div>
            {errors.unitPrice && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                {errors.unitPrice}
              </p>
            )}
          </div>
          {/* Total Price Display */}
          {quantity > 0 && unitPrice > 0 && (
            <Card className="bg-blue-100 border-2 border-blue-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-blue-700">
                      Tổng thành tiền
                    </span>
                    <p className="text-xs text-blue-600">
                      {quantity} x {unitPrice.toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-blue-700">
                      {totalPrice.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
