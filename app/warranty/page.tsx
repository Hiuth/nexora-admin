"use client";

import { useState } from "react";
import { Shield, Package } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderSelector } from "@/components/warranty/order-selector";
import { WarrantyTable } from "@/components/warranty/warranty-management-table";
import { OrderResponse } from "@/types";

export default function WarrantyPage() {
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );

  const handleOrderChange = (orderId: string, order: OrderResponse | null) => {
    setSelectedOrderId(orderId);
    setSelectedOrder(order);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Quản Lý Bảo Hành</h1>
            <p className="text-muted-foreground">
              Tạo và quản lý bảo hành cho các sản phẩm trong đơn hàng đang xử lý
            </p>
          </div>
        </div>

        {/* Order Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Chọn Đơn Hàng</CardTitle>
            <CardDescription>
              Chọn đơn hàng đang xử lý để tạo bảo hành cho các sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrderSelector
              selectedOrderId={selectedOrderId}
              onOrderChange={handleOrderChange}
            />
          </CardContent>
        </Card>

        {/* Warranty Management */}
        <WarrantyTable
          selectedOrder={selectedOrder}
          onRefresh={() => {
            // Refresh logic if needed
          }}
        />

        {/* Instructions */}
        {!selectedOrderId && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 space-y-4">
                <Package className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">Chưa chọn đơn hàng</h3>
                  <p className="text-muted-foreground">
                    Vui lòng chọn đơn hàng đang xử lý để bắt đầu tạo bảo hành
                    cho sản phẩm
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
