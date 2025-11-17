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
      <div className="space-y-6 lg:space-y-8 p-4 lg:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Quản Lý Bảo Hành</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Tạo và quản lý bảo hành cho các sản phẩm trong đơn hàng đã xác nhận
            </p>
          </div>
        </div>

        {/* Order Selector */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg lg:text-xl">Chọn Đơn Hàng</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Chọn đơn hàng đã xác nhận để tạo bảo hành cho các sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
            <OrderSelector
              selectedOrderId={selectedOrderId}
              onOrderChange={handleOrderChange}
            />
          </CardContent>
        </Card>

        {/* Warranty Management */}
        <div className="w-full overflow-hidden">
          <WarrantyTable
            selectedOrder={selectedOrder}
            onRefresh={() => {
              // Refresh logic if needed
            }}
          />
        </div>

        {/* Instructions */}
        {!selectedOrderId && (
          <Card className="overflow-hidden">
            <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="text-center py-4 sm:py-6 lg:py-8 space-y-2 sm:space-y-3 lg:space-y-4">
                <Package className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-muted-foreground/50 mx-auto" />
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-sm sm:text-base lg:text-lg font-medium">Chưa chọn đơn hàng</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-xs sm:max-w-md mx-auto px-2">
                    Vui lòng chọn đơn hàng đã xác nhận để bắt đầu tạo bảo hành cho sản phẩm
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
