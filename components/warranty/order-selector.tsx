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
    return processingOrders.filter((order) =>
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
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="text-sm font-medium">
          Chọn đơn hàng đang xử lý
        </label>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Order Selector */}
        <Select value={selectedOrderId} onValueChange={handleOrderSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn đơn hàng để tạo bảo hành..." />
          </SelectTrigger>
          <SelectContent>
            {filteredOrders.length === 0 ? (
              <div className="px-2 py-1 text-sm text-muted-foreground">
                {searchTerm 
                  ? "Không tìm thấy đơn hàng phù hợp" 
                  : "Không có đơn hàng đang xử lý"
                }
              </div>
            ) : (
              filteredOrders.map((order) => (
                <SelectItem key={order.id} value={order.id}>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>#{order.id.slice(-8)}</span>
                    <span className="text-muted-foreground">-</span>
                    <span>{order.customerName}</span>
                    <Badge
                      className={`text-white ${getStatusColor(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        
        {/* Results counter */}
        {searchTerm && (
          <div className="text-xs text-muted-foreground">
            Tìm thấy {filteredOrders.length} đơn hàng
          </div>
        )}
      </div>

      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Chi tiết đơn hàng #{selectedOrder.id.slice(-8)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Khách hàng:</span>
                  <span>{selectedOrder.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Số điện thoại:</span>
                  <span>{selectedOrder.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Địa chỉ:</span>
                  <span className="text-sm">{selectedOrder.address}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Ngày đặt:</span>
                  <span>
                    {new Date(selectedOrder.orderDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Trạng thái:</span>
                  <Badge
                    className={`text-white ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusText(selectedOrder.status)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tổng tiền:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {selectedOrder.totalAmount?.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
