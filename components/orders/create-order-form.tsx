"use client";

import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Loader2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { CreateOrderRequest } from "@/types";
import { CartItem } from "./create-order-cart";

interface CreateOrderFormProps {
  cartItems: CartItem[];
  onCreateOrder: (orderData: CreateOrderRequest) => Promise<boolean>;
  onBackToCart?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const orderStatuses = [
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "SHIPPED", label: "Đã gửi hàng" },
  { value: "DELIVERED", label: "Đã giao hàng" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export function CreateOrderForm({
  cartItems,
  onCreateOrder,
  onBackToCart,
  loading = false,
  disabled = false,
}: CreateOrderFormProps) {
  const [formData, setFormData] = useState({
    status: "PENDING",
    customerName: "",
    phoneNumber: "",
    address: "",
    isPaid: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

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

    if (cartItems.length === 0) {
      newErrors.cart = "Giỏ hàng không được trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const orderData: CreateOrderRequest = {
      ...formData,
      totalAmount: 0, // Let backend calculate from order details
    };

    const success = await onCreateOrder(orderData);
    if (success) {
      // Reset form after successful creation
      setFormData({
        status: "PENDING",
        customerName: "",
        phoneNumber: "",
        address: "",
        isPaid: false,
      });
      setErrors({});
    }
  };

  const isFormDisabled = disabled || loading || cartItems.length === 0;

  return (
    <div className="space-y-6">
      {/* Back to Cart Button */}
      {onBackToCart && (
        <div className="flex justify-start">
          <Button
            variant="outline"
            onClick={onBackToCart}
            disabled={loading}
            className="group bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 px-6 py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            <ArrowLeft className="mr-3 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
            Quay Lại Giỏ Hàng
          </Button>
        </div>
      )}

      {/* Order Form */}
      <div className="bg-blue-600 rounded-lg shadow-lg">
        <div className="text-white p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Thông Tin Đơn Hàng
          </h2>
          <p className="text-blue-100 mt-1">
            Nhập thông tin khách hàng và tạo đơn hàng
          </p>
        </div>
        <div className="bg-white p-6 rounded-b-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">
                    Tổng kết đơn hàng
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
                  {cartItems.length} sản phẩm
                </Badge>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {totalAmount.toLocaleString("vi-VN")} VND
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Tổng giá trị đơn hàng (đã bao gồm{" "}
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} sản
                phẩm)
              </div>
            </div>

            <Separator />

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin khách hàng
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="customerName"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Tên khách hàng *
                  </Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="Nhập tên khách hàng"
                    disabled={isFormDisabled}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-destructive">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Số điện thoại *
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="Nhập số điện thoại"
                    disabled={isFormDisabled}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Địa chỉ giao hàng *
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Nhập địa chỉ giao hàng chi tiết"
                  rows={3}
                  disabled={isFormDisabled}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái đơn hàng *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                  disabled={isFormDisabled}
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

              {/* Payment Status */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPaid"
                  checked={formData.isPaid}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPaid: !!checked })
                  }
                  disabled={isFormDisabled}
                />
                <Label htmlFor="isPaid" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Đã thanh toán
                </Label>
              </div>
            </div>

            {/* Error Messages */}
            {errors.cart && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600 text-center">
                  {errors.cart}
                </p>
              </div>
            )}

            <Separator />

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isFormDisabled}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang tạo đơn hàng...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Tạo Đơn Hàng ({totalAmount.toLocaleString("vi-VN")} VND)
                  </>
                )}
              </Button>
            </div>

            {cartItems.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  Vui lòng thêm sản phẩm vào giỏ hàng trước khi tạo đơn hàng
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
