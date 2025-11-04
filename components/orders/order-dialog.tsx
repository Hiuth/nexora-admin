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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderResponse, CreateOrderRequest, UpdateOrderRequest } from "@/types";
import { Loader2, Package } from "lucide-react";

interface OrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order?: OrderResponse | null;
  onSubmit?: (data: CreateOrderRequest) => Promise<boolean>;
  onUpdate: (orderId: string, data: UpdateOrderRequest) => Promise<boolean>;
  loading?: boolean;
}

const orderStatuses = [
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "SHIPPED", label: "Đã gửi hàng" },
  { value: "DELIVERED", label: "Đã giao hàng" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export function OrderDialog({
  isOpen,
  onOpenChange,
  order,
  onSubmit,
  onUpdate,
  loading = false,
}: OrderDialogProps) {
  const [formData, setFormData] = useState({
    status: "",
    totalAmount: 0,
    customerName: "",
    phoneNumber: "",
    address: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status,
        totalAmount: order.totalAmount,
        customerName: order.customerName,
        phoneNumber: order.phoneNumber,
        address: order.address,
      });
    } else {
      setFormData({
        status: "PENDING",
        totalAmount: 0,
        customerName: "",
        phoneNumber: "",
        address: "",
      });
    }
    setErrors({});
  }, [order, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Tên khách hàng là bắt buộc";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    } else if (
      !/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }

    if (!formData.status) {
      newErrors.status = "Trạng thái là bắt buộc";
    }

    // Chỉ validate tổng tiền khi chỉnh sửa đơn hàng (không phải tạo mới)
    if (order && formData.totalAmount <= 0) {
      newErrors.totalAmount = "Tổng tiền phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let success = false;
    if (order) {
      success = await onUpdate(order.id, formData);
    } else if (onSubmit) {
      success = await onSubmit(formData);
    }

    if (success) {
      setFormData({
        status: "PENDING",
        totalAmount: 0,
        customerName: "",
        phoneNumber: "",
        address: "",
      });
      setErrors({});
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setFormData({
      status: "PENDING",
      totalAmount: 0,
      customerName: "",
      phoneNumber: "",
      address: "",
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {order ? "Chỉnh Sửa Đơn Hàng" : "Tạo Đơn Hàng Mới"}
          </DialogTitle>
          <DialogDescription>
            {order
              ? "Cập nhật thông tin đơn hàng"
              : "Nhập thông tin để tạo đơn hàng mới"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Tên khách hàng *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                placeholder="Nhập tên khách hàng"
                disabled={loading}
              />
              {errors.customerName && (
                <p className="text-sm text-destructive">
                  {errors.customerName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="Nhập số điện thoại"
                disabled={loading}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">
                Tổng tiền {!order ? "(Tự động)" : "*"}
              </Label>
              <Input
                id="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalAmount: Number(e.target.value),
                  })
                }
                placeholder="Tổng tiền sẽ được tính tự động"
                min="0"
                step="1000"
                disabled={loading || !order} // Chỉ đọc khi tạo đơn hàng mới
                readOnly={!order} // Chỉ đọc khi tạo đơn hàng mới
                className={!order ? "bg-muted" : ""}
              />
              {errors.totalAmount && (
                <p className="text-sm text-destructive">{errors.totalAmount}</p>
              )}
              {!order && (
                <p className="text-xs text-muted-foreground">
                  Tổng tiền sẽ được tính tự động khi thêm sản phẩm
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Nhập địa chỉ giao hàng"
              rows={3}
              disabled={loading}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

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
              {order ? "Cập Nhật" : "Tạo Mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
