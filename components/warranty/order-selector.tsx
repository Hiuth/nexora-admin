"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, User, Phone, MapPin, Calendar, Search } from "lucide-react";
import { OrderResponse } from "@/types";
import { useOrders } from "@/hooks/use-orders";

interface OrderSelectorProps {
  selectedOrderId: string;
  onOrderChange: (orderId: string, order: OrderResponse | null) => void;
}

export function OrderSelector({
  selectedOrderId,
  onOrderChange,
}: OrderSelectorProps) {
  const { orders, loading } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc chỉ những order có status PROCESSING
  const processingOrders = orders.filter(
    (order) => order.status.toUpperCase() === "PROCESSING"
  );

  // Filtered orders based on search term
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return processingOrders;

    const searchLower = searchTerm.toLowerCase();
    return processingOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.phoneNumber.includes(searchTerm)
    );
  }, [processingOrders, searchTerm]);

  useEffect(() => {
    if (selectedOrderId) {
      const order = filteredOrders.find((o) => o.id === selectedOrderId);
      setSelectedOrder(order || null);
    } else {
      setSelectedOrder(null);
    }
  }, [selectedOrderId, filteredOrders]);

  const handleOrderSelect = (orderId: string) => {
    const order = filteredOrders.find((o) => o.id === orderId);
    setSelectedOrder(order || null);
    onOrderChange(orderId, order || null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PROCESSING":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case "PROCESSING":
        return "Đang xử lý";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">
          Đang tải danh sách đơn hàng...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="space-y-2 sm:space-y-3">
        <label className="text-xs sm:text-sm font-medium text-foreground">
          Chọn đơn hàng đang xử lý
        </label>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 sm:pl-10 text-xs sm:text-sm h-8 sm:h-9 lg:h-10"
          />
        </div>

        {/* Order Selector */}
        <Select value={selectedOrderId} onValueChange={handleOrderSelect}>
          <SelectTrigger className="w-full h-8 sm:h-9 lg:h-10 text-xs sm:text-sm">
            <SelectValue placeholder="Chọn đơn hàng để tạo bảo hành..." />
          </SelectTrigger>
          <SelectContent className="max-w-[calc(100vw-2rem)] sm:max-w-none">
            {filteredOrders.length === 0 ? (
              <div className="px-2 py-2 text-xs sm:text-sm text-muted-foreground">
                {searchTerm
                  ? "Không tìm thấy đơn hàng phù hợp"
                  : "Không có đơn hàng đang xử lý"}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <SelectItem key={order.id} value={order.id} className="p-2">
                  <div className="flex items-center gap-1 sm:gap-2 w-full min-w-0">
                    <Package className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-mono">
                      #{order.id.slice(-6)}
                    </span>
                    <span className="text-muted-foreground hidden sm:inline text-xs">-</span>
                    <span className="truncate text-xs sm:text-sm flex-1 min-w-0">
                      {order.customerName}
                    </span>
                    <Badge
                      className={`text-white text-xs flex-shrink-0 px-1 sm:px-2 py-0.5 ${getStatusColor(order.status)}`}
                    >
                      <span className="hidden sm:inline">{getStatusText(order.status)}</span>
                      <span className="sm:hidden">
                        {getStatusText(order.status).slice(0, 3)}
                      </span>
                    </Badge>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* Results counter */}
        {searchTerm && (
          <div className="text-xs text-muted-foreground px-1">
            Tìm thấy {filteredOrders.length} đơn hàng
          </div>
        )}
      </div>

      {selectedOrder && (
        <Card className="mt-3 sm:mt-4 overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3 lg:pb-4 px-3 sm:px-4 lg:px-6 pt-3 sm:pt-4 lg:pt-6">
            <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base lg:text-lg">
              <Package className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
              <span className="truncate text-xs sm:text-sm lg:text-base">
                Đơn hàng #{selectedOrder.id.slice(-6)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-xs sm:text-sm block">Khách hàng</span>
                    <p className="text-xs sm:text-sm text-foreground truncate mt-0.5">
                      {selectedOrder.customerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-xs sm:text-sm block">Số điện thoại</span>
                    <p className="text-xs sm:text-sm text-foreground mt-0.5">
                      {selectedOrder.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-xs sm:text-sm block">Địa chỉ</span>
                    <p className="text-xs sm:text-sm text-foreground break-words mt-0.5 leading-relaxed">
                      {selectedOrder.address}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-xs sm:text-sm block">Ngày đặt</span>
                    <p className="text-xs sm:text-sm text-foreground mt-0.5">
                      {new Date(selectedOrder.orderDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-xs sm:text-sm block">Trạng thái</span>
                    <div className="mt-1">
                      <Badge
                        className={`text-white text-xs px-2 py-0.5 ${getStatusColor(selectedOrder.status)}`}
                      >
                        {getStatusText(selectedOrder.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0 text-xs sm:text-sm">💰</div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-xs sm:text-sm block">Tổng tiền</span>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600 break-words mt-0.5">
                      {selectedOrder.totalAmount?.toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
