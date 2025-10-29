"use client";

import { useState } from "react";
import { Eye, Trash2, CheckCircle, Clock } from "lucide-react";
import AdminLayout from "@/components/admin-layout";

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: "pending" | "processing" | "completed";
  date: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    customer: "John Doe",
    total: 299.99,
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    customer: "Jane Smith",
    total: 599.99,
    status: "processing",
    date: "2024-01-16",
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    customer: "Bob Johnson",
    total: 199.99,
    status: "pending",
    date: "2024-01-17",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={18} className="text-green-400" />;
      case "processing":
        return <Clock size={18} className="text-yellow-400" />;
      default:
        return <Clock size={18} className="text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "processing":
        return "Đang xử lý";
      default:
        return "Chờ xử lý";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý đơn hàng
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý tất cả đơn hàng từ khách hàng
            </p>
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
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Ngày
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
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-foreground">${order.total}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="text-sm text-muted-foreground">
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {order.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-background rounded transition-colors">
                        <Eye size={18} className="text-foreground" />
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
    </AdminLayout>
  );
}
