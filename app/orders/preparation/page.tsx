"use client";

import AdminLayout from "@/components/admin-layout";
import { OrderPreparationTable } from "@/components/orders/order-preparation-table";

export default function OrderPreparationPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Chuẩn Bị Đơn Hàng
          </h1>
          <p className="text-muted-foreground">
            Quản lý và chuẩn bị các đơn hàng cần xử lý
          </p>
        </div>

        <OrderPreparationTable />
      </div>
    </AdminLayout>
  );
}
