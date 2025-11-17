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
import { Checkbox } from "@/components/ui/checkbox";
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
    isPaid: false,
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
        isPaid: order.isPaid,
      });
    } else {
      setFormData({
        status: "PENDING",
        totalAmount: 0,
        customerName: "",
        phoneNumber: "",
        address: "",
        isPaid: false,
      });
    }
    setErrors({});
  }, [order, isOpen]);

  // Handle status change - with payment validation for CONFIRMED status
  const handleStatusChange = async (newStatus: string) => {
    // Validation cho trạng thái CONFIRMED
    if (newStatus === "CONFIRMED" && !formData.isPaid) {
      setErrors({
        ...errors,
        status: "Đơn hàng chỉ có thể xác nhận khi đã thanh toán",
      });
      return;
    }
    
    setFormData({ ...formData, status: newStatus });
    // Clear error nếu có
    if (errors.status) {
      const { status, ...otherErrors } = errors;
      setErrors(otherErrors);
    }
  };

  // Filter available statuses based on current status
  const getAvailableStatuses = () => {
    if (!order) return orderStatuses;

    const currentStatus = order.status.toLowerCase();

    switch (currentStatus) {
      case "pending":
        return orderStatuses.filter((s) =>
          ["PENDING", "CONFIRMED", "CANCELLED"].includes(s.value)
        );
      case "confirmed":
        return orderStatuses.filter((s) =>
          ["CONFIRMED", "PROCESSING", "CANCELLED"].includes(s.value)
        );
      case "processing":
        return orderStatuses.filter((s) =>
          ["PROCESSING", "SHIPPED", "CANCELLED"].includes(s.value)
        );
      case "shipped":
        return orderStatuses.filter((s) =>
          ["SHIPPED", "DELIVERED"].includes(s.value)
        );
      case "delivered":
      case "cancelled":
        return orderStatuses.filter((s) => s.value === order.status);
      default:
        return orderStatuses;
    }
  };

  const canEditField = (fieldName: string) => {
    if (!order) return true; // Khi tạo mới, cho phép edit tất cả

    // Khi chỉnh sửa đơn hàng hiện có
    switch (fieldName) {
      case "status":
        return true; // Luôn cho phép chỉnh sửa trạng thái
      case "isPaid":
        // Không cho phép chỉnh sửa trạng thái thanh toán khi đã CONFIRMED
        return order.status.toLowerCase() !== "confirmed";
      case "customerName":
      case "phoneNumber":
      case "address":
      case "totalAmount":
        return order.status.toLowerCase() === "pending"; // Chỉ cho phép chỉnh sửa khi đơn hàng đang chờ xử lý
      default:
        return false;
    }
  };

  const canEditOrder = () => {
    return !order || order.status.toLowerCase() === "pending";
  };

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
        isPaid: false,
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
      isPaid: false,
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
              ? order.status.toLowerCase() === "pending"
                ? "Cập nhật thông tin đơn hàng (có thể chỉnh sửa tất cả)"
                : "Cập nhật trạng thái đơn hàng (chỉ có thể chỉnh sửa trạng thái)"
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
                disabled={loading || !canEditField("customerName")}
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
                disabled={loading || !canEditField("phoneNumber")}
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
                step="any"
                disabled={loading || !canEditField("totalAmount")} // Chỉ đọc khi tạo đơn hàng mới
                readOnly={!canEditField("totalAmount")} // Chỉ đọc khi tạo đơn hàng mới
                className={!canEditField("totalAmount") ? "bg-muted" : ""}
              />
              {errors.totalAmount && (
                <p className="text-sm text-destructive">{errors.totalAmount}</p>
              )}
              {!canEditField("totalAmount") && order && (
                <p className="text-xs text-muted-foreground">
                  Không thể chỉnh sửa tổng tiền khi đơn hàng đã được xác nhận
                </p>
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
                onValueChange={handleStatusChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableStatuses().map((status) => (
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

          {/* Payment Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPaid"
              checked={formData.isPaid}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isPaid: !!checked })
              }
              disabled={loading || !canEditField("isPaid")}
            />
            <Label htmlFor="isPaid" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Đã thanh toán
            </Label>
            {!canEditField("isPaid") && (
              <p className="text-xs text-muted-foreground ml-2">
                (Không thể thay đổi sau khi xác nhận)
              </p>
            )}
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
              disabled={loading || !canEditField("address")}
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
