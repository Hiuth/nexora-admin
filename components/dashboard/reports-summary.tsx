"use client";

import { formatCurrency } from "@/lib/api-utils";
import { useCategoryRevenue } from "@/hooks/use-category-revenue";
import {
  BarChart3,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Loader2,
} from "lucide-react";

interface ReportsSummaryProps {
  totalOrders?: number;
  totalCustomers?: number;
  totalProducts?: number;
}

export function ReportsSummary({
  totalOrders = 0,
  totalCustomers = 0,
  totalProducts = 0,
}: ReportsSummaryProps) {
  const { data: categoryData, loading, error } = useCategoryRevenue();

  // Calculate total revenue from category data
  const totalRevenue = categoryData?.totalRevenue || 0;

  const stats = [
    {
      label: "Doanh thu",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Đơn hàng",
      value: totalOrders.toLocaleString(),
      icon: ShoppingBag,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Khách hàng",
      value: totalCustomers.toLocaleString(),
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      label: "Sản phẩm",
      value: totalProducts.toLocaleString(),
      icon: Package,
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  // Calculate percentage for progress bars
  const categoriesWithPercentage =
    categoryData?.categories.map((category) => ({
      ...category,
      percentage:
        totalRevenue > 0 ? (category.totalRevenue / totalRevenue) * 100 : 0,
    })) || [];

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 via-white to-pink-50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Báo cáo thống kê
              </h2>
              <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
        <div className="p-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 via-white to-pink-50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Báo cáo thống kê
              </h2>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 via-white to-pink-50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Báo cáo thống kê
            </h2>
            <p className="text-sm text-gray-500">
              Tổng quan hiệu suất tháng này
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;

            return (
              <div
                key={index}
                className="group p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-sm`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Categories */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900">Danh mục bán chạy</h3>
          <div className="space-y-3">
            {categoriesWithPercentage.length > 0 ? (
              categoriesWithPercentage.slice(0, 5).map((category, index) => (
                <div
                  key={category.categoryId}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full"></div>
                    <span className="font-medium text-gray-900">
                      {category.categoryName}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {formatCurrency(category.totalRevenue)}
                      </div>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-pink-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(category.percentage, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Không có dữ liệu danh mục
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
