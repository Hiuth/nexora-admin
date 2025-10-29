"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";

interface Warranty {
  id: string;
  productName: string;
  serialNumber: string;
  orderId: string;
  startDate: string;
  endDate: string;
  warrantyPeriod: number;
  status: "active" | "expired" | "claimed";
}

const mockWarranties: Warranty[] = [
  {
    id: "1",
    productName: "Laptop Dell XPS 13",
    serialNumber: "DL123456789",
    orderId: "ORD-001",
    startDate: "2024-01-15",
    endDate: "2026-01-15",
    warrantyPeriod: 24,
    status: "active",
  },
  {
    id: "2",
    productName: "iPhone 15 Pro",
    serialNumber: "IP987654321",
    orderId: "ORD-002",
    startDate: "2024-02-10",
    endDate: "2025-02-10",
    warrantyPeriod: 12,
    status: "active",
  },
  {
    id: "3",
    productName: "Samsung Galaxy S24",
    serialNumber: "SM555666777",
    orderId: "ORD-003",
    startDate: "2023-12-01",
    endDate: "2024-12-01",
    warrantyPeriod: 12,
    status: "expired",
  },
];

export function WarrantyTable() {
  const [warranties, setWarranties] = useState(mockWarranties);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Còn hiệu lực";
      case "expired":
        return "Đã hết hạn";
      case "claimed":
        return "Đã sử dụng";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "expired":
        return "bg-red-500/20 text-red-400";
      case "claimed":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Danh Sách Bảo Hành
          </h2>
          <p className="text-muted-foreground">
            Quản lý thông tin bảo hành sản phẩm
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} />
          Thêm bảo hành
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Sản phẩm
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Serial Number
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Đơn hàng
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Ngày bắt đầu
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Ngày kết thúc
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Thời gian BH
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {warranties.map((warranty) => (
              <tr
                key={warranty.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4 text-foreground font-medium">
                  {warranty.productName}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {warranty.serialNumber}
                </td>
                <td className="px-6 py-4 text-foreground">
                  {warranty.orderId}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {warranty.startDate}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {warranty.endDate}
                </td>
                <td className="px-6 py-4 text-foreground">
                  {warranty.warrantyPeriod} tháng
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      warranty.status
                    )}`}
                  >
                    {getStatusLabel(warranty.status)}
                  </span>
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
