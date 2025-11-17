"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductResponse } from "@/types";
import { Loader2, ShoppingCart, X, Package } from "lucide-react";
import { CartItem } from "./create-order-cart";
import { ProductSelectorInfinite } from "./product-selector-infinite";
import { ProductConfiguration } from "./product-configuration";

interface AddToCartDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (cartItem: CartItem) => void;
  cartItems: CartItem[];
  loading?: boolean;
}

export function AddToCartDialog({
  isOpen,
  onOpenChange,
  onAddToCart,
  cartItems,
  loading = false,
}: AddToCartDialogProps) {
  // State
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset selection when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedProduct(null);
      setQuantity(1);
      setUnitPrice(0);
      setErrors({});
    }
  }, [isOpen]);

  // Update price when product is selected
  useEffect(() => {
    if (selectedProduct) {
      setUnitPrice(selectedProduct.price);
      setErrors({}); // Clear errors when product is selected
    }
  }, [selectedProduct]);

  const handleAddToCart = () => {
    // Validation
    const newErrors: { [key: string]: string } = {};
    
    if (!selectedProduct) {
      newErrors.product = "Vui lòng chọn sản phẩm";
    }
    
    if (quantity <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    }
    
    if (selectedProduct) {
      if (selectedProduct.stockQuantity === 0) {
        newErrors.quantity = "Sản phẩm đã hết hàng, không thể thêm vào giỏ hàng";
      } else if (quantity > selectedProduct.stockQuantity) {
        newErrors.quantity = `Chỉ còn ${selectedProduct.stockQuantity} sản phẩm trong kho. Vui lòng giảm số lượng.`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!selectedProduct) return;

    // Check if product already in cart
    const existingItem = cartItems.find(item => item.product.id === selectedProduct.id);
    if (existingItem) {
      setErrors({ product: "Sản phẩm đã có trong giỏ hàng" });
      return;
    }

    // Add to cart
    const cartItem: CartItem = {
      id: `${selectedProduct.id}-${Date.now()}`,
      product: selectedProduct,
      quantity,
      unitPrice,
    };

    onAddToCart(cartItem);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1400px] w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-3 pb-6 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            Thêm Sản Phẩm Vào Giỏ Hàng
          </DialogTitle>
          <DialogDescription className="text-base">
            Chọn sản phẩm và cấu hình số lượng để thêm vào giỏ hàng. Sử dụng tính năng cuộn để tải thêm sản phẩm.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 py-6 flex-1 min-h-0">
          {/* Product Selection - 2/3 width on extra large screens */}
          <div className="xl:col-span-2 space-y-6 min-h-0">
            <div className="bg-gray-50 rounded-xl p-6 h-full max-h-[500px] overflow-hidden">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Danh Sách Sản Phẩm
              </h3>
              <div className="h-[calc(100%-3rem)] overflow-y-auto scrollbar-always border border-gray-200 rounded-lg p-2">
                <ProductSelectorInfinite
                  selectedProduct={selectedProduct}
                  onSelectProduct={setSelectedProduct}
                  cartItems={cartItems}
                  loading={loading}
                />
              </div>
            </div>
            {errors.product && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded px-3 py-2">
                {errors.product}
              </p>
            )}
          </div>

          {/* Product Configuration - 1/3 width on extra large screens */}
          <div className="flex flex-col h-full max-h-[500px]">
            {/* Scrollable Configuration Area */}
            <div className="flex-1 overflow-y-auto scrollbar-always pr-2 mb-6">
              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Cấu Hình Sản Phẩm
                </h3>
              
              <ProductConfiguration
                selectedProduct={selectedProduct}
                quantity={quantity}
                onQuantityChange={setQuantity}
                unitPrice={unitPrice}
                onUnitPriceChange={setUnitPrice}
                loading={loading}
                errors={errors}
              />

              {/* Cart Summary */}
              {selectedProduct && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-3">Tóm Tắt</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Đơn giá:</span>
                      <span className="font-medium">
                        {unitPrice.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Số lượng:</span>
                      <span className="font-medium">{quantity}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2 text-blue-600">
                      <span>Tổng tiền:</span>
                      <span>
                        {(unitPrice * quantity).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex-shrink-0 space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedProduct || loading || quantity <= 0 || (selectedProduct && selectedProduct.stockQuantity === 0) || (selectedProduct && quantity > selectedProduct.stockQuantity)}
                className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Thêm Vào Giỏ Hàng
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="w-full h-11 text-base"
              >
                <X className="mr-2 h-4 w-4" />
                Đóng
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}