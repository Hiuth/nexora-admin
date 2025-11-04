"use client";

import { OrderStatusCard } from "./order-status-card";
import { OrderResponse } from "@/types";
import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface OrderOverviewProps {
  orders: OrderResponse[];
}

export function OrderOverview({ orders }: OrderOverviewProps) {
  const getOrdersByStatus = (status: string) => {
    return orders.filter(
      (order) => order.status.toUpperCase() === status.toUpperCase()
    );
  };

  const statusConfig = [
    {
      title: "Chờ xử lý",
      status: "PENDING",
      icon: Clock,
      color: "bg-yellow-500",
      description: "Đơn hàng mới chờ xác nhận",
    },
    {
      title: "Đã xác nhận",
      status: "CONFIRMED",
      icon: CheckCircle,
      color: "bg-blue-500",
      description: "Đã xác nhận, chờ xử lý",
    },
    {
      title: "Đang xử lý",
      status: "PROCESSING",
      icon: AlertCircle,
      color: "bg-orange-500",
      description: "Đang chuẩn bị hàng",
    },
    {
      title: "Đã gửi",
      status: "SHIPPED",
      icon: Truck,
      color: "bg-purple-500",
      description: "Đang vận chuyển",
    },
    {
      title: "Đã giao",
      status: "DELIVERED",
      icon: Package,
      color: "bg-green-500",
      description: "Giao hàng thành công",
    },
    {
      title: "Đã hủy",
      status: "CANCELLED",
      icon: XCircle,
      color: "bg-red-500",
      description: "Đơn hàng bị hủy",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
      {statusConfig.map((config) => {
        const statusOrders = getOrdersByStatus(config.status);
        return (
          <OrderStatusCard
            key={config.status}
            title={config.title}
            count={statusOrders.length}
            icon={config.icon}
            color={config.color}
            orders={statusOrders}
            description={config.description}
          />
        );
      })}
    </div>
  );
}
