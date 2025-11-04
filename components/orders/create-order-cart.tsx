"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="text-white p-6">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              Giỏ Hàng
            </h2>
            <p className="text-blue-100 mt-1">
              {cartItems.length === 0
                ? "Chưa có sản phẩm nào trong giỏ hàng"
                : `${
                    cartItems.length
                  } sản phẩm • ${totalQuantity} items • ${totalAmount.toLocaleString(
                    "vi-VN"
                  )} VND`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={onAddProduct}
              disabled={disabled}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
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
      <div className="bg-white p-6 rounded-b-lg">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Giỏ hàng trống
            </h3>
            <p className="text-muted-foreground mb-6">
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
            {/* Cart Items Table */}
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
