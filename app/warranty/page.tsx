import AdminLayout from "@/components/admin-layout";
import { WarrantyTable } from "@/components/warranty/warranty-table-simple";

export default function WarrantyPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản Lý Bảo Hành
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý thông tin bảo hành sản phẩm
          </p>
        </div>
        <WarrantyTable />
      </div>
    </AdminLayout>
  );
}
