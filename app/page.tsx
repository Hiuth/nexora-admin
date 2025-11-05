import AdminLayout from "@/components/admin-layout";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export default function Dashboard() {
  return (
    <AdminLayout>
      <DashboardOverview />
    </AdminLayout>
  );
}
