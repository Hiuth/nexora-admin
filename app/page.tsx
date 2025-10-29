import AdminLayout from "@/components/admin-layout";
import {
  Package,
  ShoppingCart,
  Tag,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      label: "Tổng Sản Phẩm",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      label: "Đơn Hàng",
      value: "567",
      change: "+8%",
      trend: "up",
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      label: "Doanh Thu",
      value: "12.5M",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "bg-yellow-500",
    },
    {
      label: "Khách Hàng",
      value: "2,845",
      change: "+5%",
      trend: "up",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      label: "Danh Mục",
      value: "45",
      change: "+2",
      trend: "up",
      icon: Tag,
      color: "bg-indigo-500",
    },
    {
      label: "Thương Hiệu",
      value: "89",
      change: "+4",
      trend: "up",
      icon: BarChart3,
      color: "bg-pink-500",
    },
    {
      label: "Đơn Vị SP",
      value: "2,156",
      change: "+18%",
      trend: "up",
      icon: Package,
      color: "bg-cyan-500",
    },
    {
      label: "Lắp Ráp PC",
      value: "76",
      change: "+23%",
      trend: "up",
      icon: Activity,
      color: "bg-orange-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bảng Điều Khiển
            </h1>
            <p className="text-muted-foreground">
              Chào mừng đến với Bảng Điều Khiển Nexora Admin
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Hôm nay</p>
              <p className="text-lg font-semibold text-foreground">
                {new Date().toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Hành Động Nhanh
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/products"
                  className="group flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent transition-all duration-200 hover:shadow-md"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Quản Lý Sản Phẩm
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Thêm, sửa, xóa sản phẩm
                    </p>
                  </div>
                </a>
                <a
                  href="/orders"
                  className="group flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent transition-all duration-200 hover:shadow-md"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Xem Đơn Hàng
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Theo dõi và quản lý đơn hàng
                    </p>
                  </div>
                </a>
                <a
                  href="/categories"
                  className="group flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent transition-all duration-200 hover:shadow-md"
                >
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Tag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Tổ Chức Danh Mục
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Quản lý danh mục sản phẩm
                    </p>
                  </div>
                </a>
                <a
                  href="/pc-builds"
                  className="group flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent transition-all duration-200 hover:shadow-md"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Lắp Ráp PC</h3>
                    <p className="text-sm text-muted-foreground">
                      Quản lý dịch vụ lắp ráp
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Hoạt Động Gần Đây
            </h2>
            <div className="space-y-4">
              {[
                {
                  action: "Đơn hàng mới",
                  item: "#12345",
                  time: "2 phút trước",
                  status: "success",
                },
                {
                  action: "Sản phẩm đã thêm",
                  item: "RTX 4090",
                  time: "15 phút trước",
                  status: "info",
                },
                {
                  action: "Đơn hàng hoàn thành",
                  item: "#12344",
                  time: "1 giờ trước",
                  status: "success",
                },
                {
                  action: "Danh mục cập nhật",
                  item: "Gaming",
                  time: "2 giờ trước",
                  status: "warning",
                },
                {
                  action: "Khách hàng mới",
                  item: "Nguyễn Văn A",
                  time: "3 giờ trước",
                  status: "info",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.item}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
