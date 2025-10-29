import AdminLayout from "@/components/admin-layout";
import { ProductUnitTable } from "@/components/products/product-unit-table";

export default function ProductUnitsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản Lý Đơn Vị Sản Phẩm
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các đơn vị đo lường sản phẩm
          </p>
        </div>
        <ProductUnitTable />
      </div>
    </AdminLayout>
  );
}
