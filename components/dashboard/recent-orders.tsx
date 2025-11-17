"use client";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/api-utils";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  User,
  Calendar,
  CreditCard,
  Truck,
  TrendingUp,
  Activity,
} from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  isPaid: boolean;
}

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          label: "Chờ xử lý",
          color: "bg-amber-100 text-amber-800 border-amber-200",
          icon: Clock,
          iconColor: "text-amber-600",
          dotColor: "bg-amber-400",
        };
      case "processing":
        return {
          label: "Đang xử lý",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: Package,
          iconColor: "text-blue-600",
          dotColor: "bg-blue-400",
        };
      case "delivered":
        return {
          label: "Đã giao hàng",
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: CheckCircle2,
          iconColor: "text-emerald-600",
          dotColor: "bg-emerald-400",
        };
      case "cancelled":
        return {
          label: "Đã hủy",
          color: "bg-red-100 text-red-800 border-red-200",
          icon: XCircle,
          iconColor: "text-red-600",
          dotColor: "bg-red-400",
        };
      default:
        return {
          label: status || "Chưa xác định",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: AlertCircle,
          iconColor: "text-gray-600",
          dotColor: "bg-gray-400",
        };
    }
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "??"
    );
  };

  const getGradientByIndex = (index: number) => {
    const gradients = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-emerald-500 to-emerald-600",
      "from-orange-500 to-orange-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-teal-500 to-teal-600",
      "from-red-500 to-red-600",
    ];
    return gradients[index % gradients.length];
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Đơn hàng gần đây
                </h2>
                <p className="text-sm text-gray-500">
                  Theo dõi đơn hàng mới nhất
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Activity className="w-4 h-4" />
              <span>Real-time</span>
            </div>
          </div>
        </div>

        <div className="text-center py-20">
          <div className="relative mx-auto mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Chưa có đơn hàng nào
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Đơn hàng mới sẽ được hiển thị tại đây khi có khách hàng đặt hàng. Hệ
            thống sẽ cập nhật real-time.
          </p>
          <button className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-6 py-3 rounded-xl font-medium transition-colors duration-200">
            <Package className="w-4 h-4" />
            Tạo đơn hàng mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Đơn hàng gần đây
              </h2>
              <p className="text-sm text-gray-500">
                {orders.length} đơn hàng · Cập nhật real-time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
            <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl font-medium text-sm border border-gray-200 transition-colors duration-200">
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="divide-y divide-gray-50">
        {orders.slice(0, 5).map((order, index) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;
          const gradient = getGradientByIndex(index);

          return (
            <div
              key={order.id}
              className="p-6 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-blue-50/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Customer Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform duration-200`}
                  >
                    {getInitials(order.customerName)}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 ${statusConfig.dotColor} rounded-full border-2 border-white shadow-sm`}
                  ></div>
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-gray-900 truncate text-lg">
                        {order.customerName}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                        #{order.id.toString().slice(-6)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {order.customerEmail && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span className="truncate max-w-48">
                            {order.customerEmail}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(order.orderDate).toLocaleDateString(
                            "vi-VN",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${statusConfig.color} border font-medium px-3 py-1 text-xs flex items-center gap-1`}
                      >
                        <StatusIcon
                          className={`w-3 h-3 ${statusConfig.iconColor}`}
                        />
                        {statusConfig.label}
                      </Badge>
                      <Badge
                        variant={order.isPaid ? "default" : "secondary"}
                        className="text-xs px-2 py-1"
                      >
                        {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                      </Badge>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 rounded-lg">
                        <ArrowRight className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {orders.length > 5 && (
        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
          <button className="w-full text-center py-3 text-blue-600 hover:text-blue-700 font-medium text-sm rounded-xl hover:bg-white/50 transition-colors duration-200 flex items-center justify-center gap-2">
            <Package className="w-4 h-4" />
            Xem thêm {orders.length - 5} đơn hàng khác
          </button>
        </div>
      )}
    </div>
  );
}
