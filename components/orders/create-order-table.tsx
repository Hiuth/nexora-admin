"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, ShoppingCart, User } from "lucide-react";

interface NewOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: "draft" | "pending" | "processing" | "completed" | "cancelled";
  orderDate: string;
}

const mockNewOrders: NewOrder[] = [
  {
    id: "1",
    customerName: "Nguyễn Văn A",
    customerEmail: "nguyenvana@email.com",
    customerPhone: "0901234567",
    products: [
      { name: "Laptop Dell XPS 13", quantity: 1, price: 1199.99 },
      { name: "Chuột Logitech", quantity: 1, price: 49.99 },
    ],
    totalAmount: 1249.98,
    status: "draft",
    orderDate: "2024-01-15",
  },
  {
    id: "2",
    customerName: "Trần Thị B",
    customerEmail: "tranthib@email.com",
    customerPhone: "0912345678",
    products: [
      { name: "Gaming PC RTX 4080", quantity: 1, price: 2499.99 },
      { name: "Màn hình 27 inch", quantity: 1, price: 299.99 },
    ],
    totalAmount: 2799.98,
    status: "pending",
    orderDate: "2024-01-16",
  },
];

export function CreateOrderTable() {
  const [orders, setOrders] = useState(mockNewOrders);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Bản nháp";
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
      case "draft":
        return "bg-gray-500/20 text-gray-400";
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
            Quản Lý Tạo Đơn Hàng
          </h2>
          <p className="text-muted-foreground">
            Tạo đơn hàng mới và quản lý đơn hàng draft
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <User size={20} />
            Thêm khách hàng
          </button>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={20} />
            Tạo đơn hàng mới
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đơn draft</p>
              <p className="text-2xl font-bold text-foreground">5</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chờ xử lý</p>
              <p className="text-2xl font-bold text-foreground">12</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hôm nay</p>
              <p className="text-2xl font-bold text-foreground">8</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-foreground">$15.2K</p>
            </div>
          </div>
        </div>
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
                        {product.name} (x{product.quantity})
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
                    <button
                      className="p-2 hover:bg-background rounded transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye size={18} className="text-foreground" />
                    </button>
                    <button
                      className="p-2 hover:bg-background rounded transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={18} className="text-foreground" />
                    </button>
                    <button
                      className="p-2 hover:bg-background rounded transition-colors"
                      title="Xác nhận đơn hàng"
                    >
                      <ShoppingCart size={18} className="text-green-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-background rounded transition-colors"
                      title="Xóa"
                    >
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
