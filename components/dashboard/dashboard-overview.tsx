"use client";

import {
  HeroSection,
  StatsCards,
  RecentOrders,
  QuickActions,
  TopProducts,
  LoadingSkeleton,
} from "@/components/dashboard";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export function DashboardOverview() {
  const { stats, loading, error } = useDashboardData();

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Statistics Cards */}
      <StatsCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentOrders orders={stats.recentOrders} />
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          <QuickActions />
          <TopProducts products={stats.topProducts} />
        </div>
      </div>
    </div>
  );
}
