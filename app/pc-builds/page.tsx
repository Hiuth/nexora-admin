import AdminLayout from "@/components/admin-layout";
import { PcBuildTable, PcBuildsProvider } from "@/components/pc-builds";

export default function PcBuildsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">PC Build</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các cấu hình máy tính xây sẵn
          </p>
        </div>
        <PcBuildsProvider>
          <PcBuildTable />
        </PcBuildsProvider>
      </div>
    </AdminLayout>
  );
}
