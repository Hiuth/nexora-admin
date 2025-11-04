"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { OrderTable } from "./order-table";
import { OrderResponse, UpdateOrderRequest } from "@/types";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Package,
  XCircle,
} from "lucide-react";

interface OrderTabsProps {
  orders: OrderResponse[];
  onEdit: (order: OrderResponse) => void;
  onDelete: (orderId: string) => Promise<boolean>;
  onViewDetails: (order: OrderResponse) => void;
  onEditDetails?: (order: OrderResponse) => void;
  onConfirmOrder?: (order: OrderResponse) => Promise<boolean>;
  loading?: boolean;
  deleting?: string | null;
  confirming?: string | null;
}

const orderStatuses = [
  {
    key: "pending",
    label: "Chờ xử lý",
    icon: Clock,
    filter: (order: OrderResponse) => order.status.toUpperCase() === "PENDING",
    color: "bg-yellow-500",
  },
  {
    key: "confirmed",
    label: "Đã xác nhận",
    icon: CheckCircle,
    filter: (order: OrderResponse) =>
      order.status.toUpperCase() === "CONFIRMED",
    color: "bg-blue-500",
  },
  {
    key: "processing",
    label: "Đang xử lý",
    icon: AlertCircle,
    filter: (order: OrderResponse) =>
      order.status.toUpperCase() === "PROCESSING",
    color: "bg-orange-500",
  },
  {
    key: "shipped",
    label: "Đã gửi",
    icon: Truck,
    filter: (order: OrderResponse) => order.status.toUpperCase() === "SHIPPED",
    color: "bg-purple-500",
  },
  {
    key: "delivered",
    label: "Đã giao",
    icon: Package,
    filter: (order: OrderResponse) =>
      order.status.toUpperCase() === "DELIVERED",
    color: "bg-green-500",
  },
  {
    key: "cancelled",
    label: "Đã hủy",
    icon: XCircle,
    filter: (order: OrderResponse) =>
      order.status.toUpperCase() === "CANCELLED",
    color: "bg-red-500",
  },
];

export function OrderTabs({
  orders,
  onEdit,
  onDelete,
  onViewDetails,
  onEditDetails,
  onConfirmOrder,
  loading = false,
  deleting = null,
  confirming = null,
}: OrderTabsProps) {
  const [activeTab, setActiveTab] = useState("pending");

  const getFilteredOrders = (statusKey: string) => {
    const status = orderStatuses.find((s) => s.key === statusKey);
    return status ? orders.filter(status.filter) : [];
  };

  const getOrderCount = (statusKey: string) => {
    return getFilteredOrders(statusKey).length;
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6 mb-6 h-auto bg-white border shadow-lg rounded-xl p-3 gap-2">
        {orderStatuses.map((status) => {
          const Icon = status.icon;
          const count = getOrderCount(status.key);

          return (
            <TabsTrigger
              key={status.key}
              value={status.key}
              className="flex flex-col items-center gap-1 py-4 px-3 h-auto rounded-lg transition-all duration-200 border data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:border-blue-600 data-[state=active]:scale-105 data-[state=inactive]:bg-white data-[state=inactive]:hover:bg-gray-50 data-[state=inactive]:border-gray-200"
            >
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${status.color}`} />
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-center leading-tight">
                {status.label}
              </span>
              <Badge
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 border"
              >
                {count}
              </Badge>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {orderStatuses.map((status) => (
        <TabsContent key={status.key} value={status.key} className="space-y-4">
          <div className="flex items-center gap-2 mb-4 p-4 bg-white rounded-lg border">
            <div className={`w-3 h-3 rounded-full ${status.color}`} />
            <h3 className="text-lg font-semibold">{status.label}</h3>
            <Badge variant="outline">
              {getOrderCount(status.key)} đơn hàng
            </Badge>
          </div>

          <div className="bg-white rounded-lg border">
            <OrderTable
              orders={getFilteredOrders(status.key)}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
              onEditDetails={onEditDetails}
              loading={loading}
              deleting={deleting}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
