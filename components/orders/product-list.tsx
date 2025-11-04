"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  ShoppingCart,
  Package2,
  Tag,
  Box,
  CheckCircle2,
} from "lucide-react";
import { ProductResponse } from "@/types";
import { CartItem } from "./create-order-cart";

interface ProductListProps {
  products: ProductResponse[];
  loading: boolean;
  selectedProduct: ProductResponse | null;
  onSelectProduct: (product: ProductResponse) => void;
  cartItems: CartItem[];
}

export function ProductList({
  products,
  loading,
  selectedProduct,
  onSelectProduct,
  cartItems,
}: ProductListProps) {
  if (loading) {
    return (
      <div className="h-full bg-blue-50 rounded-lg p-8 flex flex-col items-center justify-center">
        <div className="relative mb-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-400 rounded-full animate-spin"></div>
          <Package2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
        </div>
        <div className="text-center">
          <h3 className="font-medium text-blue-800 mb-1">Đang tải sản phẩm</h3>
          <p className="text-sm text-blue-600">
            Vui lòng chờ trong giây lát...
          </p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="h-full bg-blue-50 rounded-lg p-8 flex flex-col items-center justify-center text-center shadow-md">
        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mb-4">
          <ShoppingCart className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="font-semibold text-blue-800 mb-2">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-sm text-blue-600 max-w-sm">
          {cartItems.length > 0
            ? "Tất cả sản phẩm phù hợp đã có trong giỏ hàng hoặc thử điều chỉnh bộ lọc"
            : "Thử sử dụng từ khóa khác hoặc điều chỉnh bộ lọc"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold flex items-center gap-2 text-blue-900 mb-3">
        <Package2 className="h-4 w-4 text-blue-600" />
        Danh sách sản phẩm ({products.length})
      </Label>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {products.map((product: ProductResponse) => (
          <Card
            key={product.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedProduct?.id === product.id
                ? "ring-2 ring-blue-500 bg-blue-100 shadow-md"
                : "hover:bg-blue-50 border-blue-200"
            }`}
            onClick={() => onSelectProduct(product)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* Product Image */}
                  <div
                    className={`relative w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center ${
                      selectedProduct?.id === product.id
                        ? "ring-2 ring-blue-400 bg-blue-200"
                        : "bg-blue-200"
                    }`}
                  >
                    {product.thumbnail ? (
                      <>
                        <img
                          src={product.thumbnail}
                          alt={product.productName}
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
                    {selectedProduct?.id === product.id && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-medium text-sm mb-1 truncate ${
                        selectedProduct?.id === product.id
                          ? "text-blue-900"
                          : "text-gray-900"
                      }`}
                    >
                      {product.productName}
                    </h3>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-blue-600" />
                        <span className="text-blue-700 font-medium truncate max-w-20">
                          {product.brandName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Box className="h-3 w-3 text-blue-600" />
                        <span className="text-blue-700 truncate max-w-20">
                          {product.subCategoryName}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-blue-600">Tồn:</span>
                      <Badge
                        variant={
                          product.stockQuantity > 0 ? "default" : "destructive"
                        }
                        className={`text-xs h-5 ${
                          product.stockQuantity > 0
                            ? "bg-blue-100 text-blue-700 border-blue-300"
                            : ""
                        }`}
                      >
                        {product.stockQuantity}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right ml-2">
                  <div
                    className={`text-sm font-bold ${
                      selectedProduct?.id === product.id
                        ? "text-blue-600"
                        : "text-gray-900"
                    }`}
                  >
                    {product.price.toLocaleString("vi-VN")}₫
                  </div>
                  {product.stockQuantity === 0 && (
                    <Badge variant="destructive" className="mt-1 text-xs">
                      Hết hàng
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
