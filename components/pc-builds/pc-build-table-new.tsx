"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, ShoppingCart } from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: string[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  orderDate: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    customerName: "Nguyễn Văn A",
    customerEmail: "nguyenvana@email.com",
    customerPhone: "0901234567",
    products: ["Laptop Dell XPS 13", "Chuột Logitech"],
    totalAmount: 1299.99,
    status: "completed",
    orderDate: "2024-01-15",
  },
  {
    id: "2",
    customerName: "Trần Thị B",
    customerEmail: "tranthib@email.com",
    customerPhone: "0912345678",
    products: ["Gaming PC RTX 4080", "Màn hình 27 inch"],
    totalAmount: 2599.99,
    status: "processing",
    orderDate: "2024-01-16",
  },
  {
    id: "3",
    customerName: "Lê Văn C",
    customerEmail: "levanc@email.com",
    customerPhone: "0923456789",
    products: ["iPhone 15 Pro", "AirPods Pro"],
    totalAmount: 1499.99,
    status: "pending",
    orderDate: "2024-01-17",
  },
];

export function PcBuildTable() {
  const [orders, setOrders] = useState(mockOrders);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "processing":
        return "bg-blue-500/20 text-blue-400";
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Tạo Đơn Hàng Mới
          </h2>
          <p className="text-muted-foreground">
            Tạo và quản lý đơn hàng khách hàng
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} />
          Tạo đơn hàng
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Mã đơn hàng
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Liên hệ
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Sản phẩm
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Tổng tiền
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Ngày tạo
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
                <td className="px-6 py-4 text-foreground font-medium">
                  #{order.id.padStart(6, "0")}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-foreground font-medium">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerEmail}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {order.customerPhone}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    {order.products.slice(0, 2).map((product, index) => (
                      <p key={index} className="text-foreground">
                        {product}
                      </p>
                    ))}
                    {order.products.length > 2 && (
                      <p className="text-muted-foreground">
                        +{order.products.length - 2} sản phẩm khác
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-foreground font-semibold">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {order.orderDate}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-background rounded transition-colors">
                      <Eye size={18} className="text-foreground" />
                    </button>
                    <button className="p-2 hover:bg-background rounded transition-colors">
                      <Edit2 size={18} className="text-foreground" />
                    </button>
                    <button className="p-2 hover:bg-background rounded transition-colors">
                      <Trash2 size={18} className="text-destructive" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
