"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Plus,
  Package,
  ShoppingCart,
  Zap,
  Download,
  Upload,
  RefreshCw,
  TrendingUp,
  Activity,
  Monitor,
} from "lucide-react";

export function QuickActions() {
  const primaryActions = [
    {
      label: "Tạo đơn hàng",
      href: "/create-orders",
      icon: ShoppingCart,
      description: "Tạo đơn hàng mới cho khách hàng",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100",
      iconColor: "text-white",
      textColor: "text-white",
      shadow: "shadow-blue-500/25",
    },
    {
      label: "Thêm sản phẩm",
      href: "/products",
      icon: Package,
      description: "Thêm sản phẩm mới vào kho",
      gradient: "from-emerald-500 to-emerald-600",
      hoverGradient: "from-emerald-600 to-emerald-700",
      bgGradient: "from-emerald-50 to-emerald-100",
      iconColor: "text-white",
      textColor: "text-white",
      shadow: "shadow-emerald-500/25",
    },
  ];

  const secondaryActions = [
    {
      label: "Tạo PC Build",
      href: "/pc-builds",
      icon: Monitor,
      description: "Tạo cấu hình PC mới",
      color: "purple",
    },
    {
      label: "Quản lý đơn hàng",
      href: "/orders",
      icon: ShoppingCart,
      description: "Xem và quản lý đơn hàng",
      color: "pink",
    },
  ];

  const utilityActions = [
    {
      label: "Export dữ liệu",
      href: "#",
      icon: Download,
      description: "Xuất dữ liệu Excel/PDF",
    },
    {
      label: "Import dữ liệu",
      href: "#",
      icon: Upload,
      description: "Nhập dữ liệu từ file",
    },
    {
      label: "Đồng bộ hóa",
      href: "#",
      icon: RefreshCw,
      description: "Đồng bộ dữ liệu",
    },
  ];

  const getColorConfig = (color: string) => {
    const configs = {
      purple: {
        bg: "bg-purple-50",
        hover: "hover:bg-purple-100",
        icon: "text-purple-600",
        border: "border-purple-100",
      },
      orange: {
        bg: "bg-orange-50",
        hover: "hover:bg-orange-100",
        icon: "text-orange-600",
        border: "border-orange-100",
      },
      pink: {
        bg: "bg-pink-50",
        hover: "hover:bg-pink-100",
        icon: "text-pink-600",
        border: "border-pink-100",
      },
      indigo: {
        bg: "bg-indigo-50",
        hover: "hover:bg-indigo-100",
        icon: "text-indigo-600",
        border: "border-indigo-100",
      },
    };
    return configs[color as keyof typeof configs] || configs.purple;
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Thao tác nhanh
              </h2>
              <p className="text-sm text-gray-500">Các tác vụ thường dùng</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Activity className="w-4 h-4" />
            <span>Ready</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Primary Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Chính
          </h3>
          <div className="grid gap-3">
            {primaryActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <button
                    className={`group relative overflow-hidden w-full p-4 bg-gradient-to-r ${action.gradient} hover:${action.hoverGradient} rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${action.shadow}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-200">
                        <IconComponent
                          className={`w-6 h-6 ${action.iconColor}`}
                        />
                      </div>
                      <div className="text-left flex-1">
                        <div
                          className={`font-bold ${action.textColor} text-lg`}
                        >
                          {action.label}
                        </div>
                        <div className="text-white/80 text-sm">
                          {action.description}
                        </div>
                      </div>
                      <div className="text-white/60 group-hover:text-white/80 transition-colors duration-200">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute -right-8 -top-8 w-20 h-20 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Quản lý
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {secondaryActions.map((action, index) => {
              const IconComponent = action.icon;
              const colorConfig = getColorConfig(action.color);

              return (
                <Link key={index} href={action.href}>
                  <button
                    className={`group p-4 ${colorConfig.bg} ${colorConfig.hover} border ${colorConfig.border} rounded-2xl transition-all duration-200 hover:scale-105`}
                  >
                    <div className="text-center space-y-3">
                      <div className="mx-auto w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                        <IconComponent
                          className={`w-6 h-6 ${colorConfig.icon}`}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm mb-1">
                          {action.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Utility Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Tiện ích
          </h3>
          <div className="space-y-2">
            {utilityActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <button className="group w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                    <div className="p-2 bg-gray-100 group-hover:bg-gray-200 rounded-lg transition-colors duration-200">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {action.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {action.description}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
