"use client";

import AdminLayout from "@/components/admin-layout";
import { CreateOrderTable } from "@/components/orders/create-order-table";

export default function CreateOrderPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo Đơn Hàng</h1>
          <p className="text-muted-foreground">
            Tạo đơn hàng mới cho khách hàng
          </p>
        </div>

        <CreateOrderTable />
      </div>
    </AdminLayout>
  );
}
