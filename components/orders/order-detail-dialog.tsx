"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  OrderDetailResponse,
  CreateOrderDetailRequest,
  ProductResponse,
} from "@/types";
import { Loader2, Package } from "lucide-react";

interface OrderDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  products: ProductResponse[];
  onSubmit: (
    orderId: string,
    productId: string,
    data: CreateOrderDetailRequest
  ) => Promise<boolean>;
  loading?: boolean;
}

export function OrderDetailDialog({
  isOpen,
  onOpenChange,
  orderId,
  products,
  onSubmit,
  loading = false,
}: OrderDetailDialogProps) {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
    unitPrice: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  useEffect(() => {
    setFormData({
      productId: "",
      quantity: 1,
      unitPrice: 0,
    });
    setSelectedProduct(null);
    setErrors({});
  }, [isOpen]);

  useEffect(() => {
    if (formData.productId) {
      const product = products.find((p) => p.id === formData.productId);
      if (product) {
        setSelectedProduct(product);
        setFormData((prev) => ({ ...prev, unitPrice: product.price }));
      }
    }
  }, [formData.productId, products]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.productId) {
      newErrors.productId = "Vui lòng chọn sản phẩm";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    }

    if (formData.unitPrice <= 0) {
      newErrors.unitPrice = "Đơn giá phải lớn hơn 0";
    }

    // Check stock quantity
    if (selectedProduct && formData.quantity > selectedProduct.stockQuantity) {
      newErrors.quantity = `Chỉ còn ${selectedProduct.stockQuantity} sản phẩm trong kho`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await onSubmit(orderId, formData.productId, {
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
    });

    if (success) {
      setFormData({
        productId: "",
        quantity: 1,
        unitPrice: 0,
      });
      setSelectedProduct(null);
      setErrors({});
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setFormData({
      productId: "",
      quantity: 1,
      unitPrice: 0,
    });
    setSelectedProduct(null);
    setErrors({});
    onOpenChange(false);
  };

  const totalPrice = formData.quantity * formData.unitPrice;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Thêm Sản Phẩm Vào Đơn Hàng
          </DialogTitle>
          <DialogDescription>
            Chọn sản phẩm và nhập số lượng để thêm vào đơn hàng
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productId">Sản phẩm *</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) =>
                setFormData({ ...formData, productId: value })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn sản phẩm" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    <div className="flex flex-col">
                      <span>{product.productName}</span>
                      <span className="text-sm text-muted-foreground">
                        Giá: {product.price.toLocaleString("vi-VN")} VND - Còn:{" "}
                        {product.stockQuantity}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.productId && (
              <p className="text-sm text-destructive">{errors.productId}</p>
            )}
          </div>

          {selectedProduct && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Thông tin sản phẩm</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Tên:</span>{" "}
                  {selectedProduct.productName}
                </p>
                <p>
                  <span className="font-medium">Giá:</span>{" "}
                  {selectedProduct.price.toLocaleString("vi-VN")} VND
                </p>
                <p>
                  <span className="font-medium">Tồn kho:</span>{" "}
                  {selectedProduct.stockQuantity}
                </p>
                <p>
                  <span className="font-medium">Thương hiệu:</span>{" "}
                  {selectedProduct.brandName}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                placeholder="Nhập số lượng"
                min="1"
                max={selectedProduct?.stockQuantity || 999}
                disabled={loading}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Đơn giá *</Label>
              <Input
                id="unitPrice"
                type="number"
                value={formData.unitPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unitPrice: Number(e.target.value),
                  })
                }
                placeholder="Nhập đơn giá"
                min="0"
                step="1000"
                disabled={loading}
              />
              {errors.unitPrice && (
                <p className="text-sm text-destructive">{errors.unitPrice}</p>
              )}
            </div>
          </div>

          {formData.quantity > 0 && formData.unitPrice > 0 && (
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Tổng tiền:</span>
                <span className="text-lg font-bold text-primary">
                  {totalPrice.toLocaleString("vi-VN")} VND
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Thêm Sản Phẩm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
