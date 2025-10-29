import AdminLayout from "@/components/admin-layout";
import { PcBuildTable } from "@/components/pc-builds/pc-build-table-new";

export default function PcBuildsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tạo Đơn Hàng</h1>
          <p className="text-muted-foreground mt-2">
            Tạo và quản lý đơn hàng mới
          </p>
        </div>
        <PcBuildTable />
      </div>
    </AdminLayout>
  );
}
