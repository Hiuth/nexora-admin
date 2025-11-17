"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  Package,
  Calculator,
  Trash2,
} from "lucide-react";
import { ProductResponse } from "@/types";

export interface CartItem {
  id: string;
  product: ProductResponse;
  quantity: number;
  unitPrice: number;
}

interface CreateOrderCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onAddProduct: () => void;
  disabled?: boolean;
}

export function CreateOrderCart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddProduct,
  disabled = false,
}: CreateOrderCartProps) {
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-blue-600 rounded-lg shadow-lg">
      <div className="text-white p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
              Giỏ Hàng
            </h2>
            <p className="text-blue-100 mt-1 text-sm md:text-base">
              {cartItems.length === 0
                ? "Chưa có sản phẩm nào trong giỏ hàng"
                : `${
                    cartItems.length
                  } sản phẩm • ${totalQuantity} items • ${totalAmount.toLocaleString(
                    "vi-VN"
                  )} VND`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={onAddProduct}
              disabled={disabled}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Thêm sản phẩm</span>
              <span className="sm:hidden">Thêm</span>
            </Button>
            {cartItems.length > 0 && (
              <Button
                size="sm"
                variant="destructive"
                onClick={onClearCart}
                disabled={disabled}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white p-4 md:p-6 rounded-b-lg">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <div className="w-16 md:w-20 h-16 md:h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-8 md:h-10 w-8 md:w-10 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Giỏ hàng trống
            </h3>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục
            </p>
            <Button
              onClick={onAddProduct}
              disabled={disabled}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mobile Card Layout */}
            <div className="block md:hidden space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {item.product.thumbnail ? (
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                        ) : null}
                        <Package
                          className={`h-6 w-6 text-blue-600 ${
                            item.product.thumbnail ? "hidden" : ""
                          }`}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.product.productName}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2">
                          Mã: {item.product.id}
                        </p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {item.unitPrice.toLocaleString("vi-VN")} ₫
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            SL: {item.product.stockQuantity}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0"
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              disabled={disabled || item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="min-w-[3rem] text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0"
                              onClick={() => onUpdateQuantity(item.id, Math.min(item.product.stockQuantity, item.quantity + 1))}
                              disabled={disabled || item.quantity >= item.product.stockQuantity}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-semibold text-sm">
                              {(item.quantity * item.unitPrice).toLocaleString("vi-VN")} ₫
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-6 w-6 p-0 mt-1"
                              onClick={() => onRemoveItem(item.id)}
                              disabled={disabled}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-center">Số lượng</TableHead>
                  <TableHead className="text-right">Đơn giá</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id} className="border-b">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {item.product.thumbnail ? (
                            <img
                              src={item.product.thumbnail}
                              alt={item.product.productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                target.nextElementSibling?.classList.remove(
                                  "hidden"
                                );
                              }}
                            />
                          ) : null}
                          <Package
                            className={`h-6 w-6 text-blue-600 ${
                              item.product.thumbnail ? "hidden" : ""
                            }`}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.product.productName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.product.brandName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={disabled || item.quantity <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={
                            disabled ||
                            item.quantity >= item.product.stockQuantity
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.unitPrice.toLocaleString("vi-VN")} ₫
                    </TableCell>
                    <TableCell className="text-right font-bold text-blue-600">
                      {(item.quantity * item.unitPrice).toLocaleString("vi-VN")}{" "}
                      ₫
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveItem(item.id)}
                        disabled={disabled}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>

            <Separator />

            {/* Cart Summary */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Tổng Kết Giỏ Hàng
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {cartItems.length}
                  </div>
                  <div className="text-sm text-gray-600">Loại sản phẩm</div>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {totalQuantity}
                  </div>
                  <div className="text-sm text-gray-600">Tổng số lượng</div>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {totalAmount.toLocaleString("vi-VN")} ₫
                  </div>
                  <div className="text-sm text-gray-600">Tổng giá trị</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
