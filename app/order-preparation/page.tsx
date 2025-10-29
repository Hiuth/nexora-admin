import AdminLayout from "@/components/admin-layout";
import { OrderPreparationTable } from "@/components/orders/order-preparation-table";

export default function OrderPreparationPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Chuẩn Bị Đơn Hàng
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý và chuẩn bị đơn hàng với các đơn vị sản phẩm
          </p>
        </div>
        <OrderPreparationTable />
      </div>
    </AdminLayout>
  );
}
