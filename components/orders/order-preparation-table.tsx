"use client";

import { useState } from "react";
import {
  Plus,
  Edit2,
  CheckCircle,
  Eye,
  Package,
  Clock,
  AlertCircle,
} from "lucide-react";

interface OrderDetail {
  id: string;
  productName: string;
  quantity: number;
  unitName: string;
  unitQuantity: number;
  prepared: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  status: "pending" | "preparing" | "ready" | "delivered";
  orderDate: string;
  details: OrderDetail[];
  totalItems: number;
  preparedItems: number;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    status: "preparing",
    orderDate: "2024-01-15",
    totalItems: 3,
    preparedItems: 1,
    details: [
      {
        id: "1-1",
        productName: "Laptop Dell XPS 13",
        quantity: 1,
        unitName: "Thùng carton 15 inch",
        unitQuantity: 1,
        prepared: true,
      },
      {
        id: "1-2",
        productName: "Chuột Logitech MX Master",
        quantity: 2,
        unitName: "Hộp nhỏ",
        unitQuantity: 2,
        prepared: false,
      },
      {
        id: "1-3",
        productName: "Bàn phím Keychron K2",
        quantity: 1,
        unitName: "Hộp vừa",
        unitQuantity: 1,
        prepared: false,
      },
    ],
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    customerName: "Trần Thị B",
    customerPhone: "0912345678",
    status: "pending",
    orderDate: "2024-01-16",
    totalItems: 2,
    preparedItems: 0,
    details: [
      {
        id: "2-1",
        productName: "Gaming PC RTX 4080",
        quantity: 1,
        unitName: "Thùng lớn",
        unitQuantity: 1,
        prepared: false,
      },
      {
        id: "2-2",
        productName: "Màn hình 27 inch",
        quantity: 1,
        unitName: "Thùng màn hình",
        unitQuantity: 1,
        prepared: false,
      },
    ],
  },
];

export function OrderPreparationTable() {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ chuẩn bị";
      case "preparing":
        return "Đang chuẩn bị";
      case "ready":
        return "Sẵn sàng";
      case "delivered":
        return "Đã giao";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "preparing":
        return "bg-blue-500/20 text-blue-400";
      case "ready":
        return "bg-green-500/20 text-green-400";
      case "delivered":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} className="text-yellow-400" />;
      case "preparing":
        return <Package size={16} className="text-blue-400" />;
      case "ready":
        return <CheckCircle size={16} className="text-green-400" />;
      case "delivered":
        return <CheckCircle size={16} className="text-gray-400" />;
      default:
        return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  const toggleItemPrepared = (orderId: string, detailId: string) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          const updatedDetails = order.details.map((detail) => {
            if (detail.id === detailId) {
              return { ...detail, prepared: !detail.prepared };
            }
            return detail;
          });

          const preparedCount = updatedDetails.filter((d) => d.prepared).length;
          let newStatus = order.status;

          if (preparedCount === 0) {
            newStatus = "pending";
          } else if (preparedCount === updatedDetails.length) {
            newStatus = "ready";
          } else {
            newStatus = "preparing";
          }

          return {
            ...order,
            details: updatedDetails,
            preparedItems: preparedCount,
            status: newStatus,
          };
        }
        return order;
      })
    );
  };

  const getProgressPercentage = (prepared: number, total: number) => {
    return total > 0 ? Math.round((prepared / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Danh Sách Đơn Hàng Cần Chuẩn Bị
          </h2>
          <p className="text-muted-foreground">
            Quản lý việc chuẩn bị và đóng gói đơn hàng
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chờ chuẩn bị</p>
              <p className="text-2xl font-bold text-foreground">3</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đang chuẩn bị</p>
              <p className="text-2xl font-bold text-foreground">5</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sẵn sàng</p>
              <p className="text-2xl font-bold text-foreground">8</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hôm nay</p>
              <p className="text-2xl font-bold text-foreground">12</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Đơn hàng
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Tiến độ
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Ngày đặt
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="text-foreground font-medium">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.totalItems} sản phẩm
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-foreground font-medium">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerPhone}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${getProgressPercentage(
                            order.preparedItems,
                            order.totalItems
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground min-w-[60px]">
                      {order.preparedItems}/{order.totalItems}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {order.orderDate}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 hover:bg-background rounded transition-colors"
                      onClick={() =>
                        setSelectedOrder(
                          selectedOrder?.id === order.id ? null : order
                        )
                      }
                      title="Xem chi tiết"
                    >
                      <Eye size={18} className="text-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Panel */}
      {selectedOrder && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Chi tiết đơn hàng {selectedOrder.orderNumber}
            </h3>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {selectedOrder.details.map((detail) => (
              <div
                key={detail.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">
                    {detail.productName}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Số lượng: {detail.quantity} | Đơn vị: {detail.unitName} (x
                    {detail.unitQuantity})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      toggleItemPrepared(selectedOrder.id, detail.id)
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      detail.prepared
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30"
                    }`}
                  >
                    {detail.prepared ? (
                      <>
                        <CheckCircle size={16} />
                        Đã chuẩn bị
                      </>
                    ) : (
                      <>
                        <Package size={16} />
                        Chuẩn bị
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
