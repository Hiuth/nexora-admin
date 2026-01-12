"use client";

import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Star,
  Zap,
  CheckCircle,
  Timer,
  Monitor,
  Tag,
} from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalPcBuilds: number;
    totalCategories: number;
    totalBrands: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cardData = [
    {
      title: "Tổng đơn hàng",
      value: stats.totalOrders?.toLocaleString() || "0",
      icon: ShoppingCart,
      description: "Tổng số đơn hàng",
      color: "blue",
      bgPattern: "bg-blue-500/10",
      iconBg: "bg-blue-500",
      accentIcon: Target,
      highlight: "Đơn hàng",
      trendType: "neutral" as const,
      trend: "Total",
    },
    {
      title: "Sản phẩm",
      value: stats.totalProducts?.toLocaleString() || "0",
      icon: Package,
      description: "Sản phẩm trong kho",
      color: "emerald",
      bgPattern: "bg-emerald-500/10",
      iconBg: "bg-emerald-500",
      accentIcon: Star,
      highlight: "Sản phẩm",
      trendType: "neutral" as const,
      trend: "Total",
    },
    {
      title: "PC Builds",
      value: stats.totalPcBuilds?.toLocaleString() || "0",
      icon: Monitor,
      description: "Cấu hình sẵn",
      color: "purple",
      bgPattern: "bg-purple-500/10",
      iconBg: "bg-purple-500",
      accentIcon: CheckCircle,
      highlight: "Cấu hình",
      trendType: "neutral" as const,
      trend: "Total",
    },
    {
      title: "Danh mục",
      value:
        (stats.totalCategories + stats.totalBrands)?.toLocaleString() || "0",
      icon: Tag,
      description: `${stats.totalCategories} danh mục, ${stats.totalBrands} brand`,
      color: "orange",
      bgPattern: "bg-orange-500/10",
      iconBg: "bg-orange-500",
      accentIcon: Timer,
      highlight: "Tổng cộng",
      trendType: "neutral" as const,
      trend: "Total",
    },
  ];

  const getTrendIcon = (type: "up" | "down" | "neutral") => {
    switch (type) {
      case "up":
        return TrendingUp;
      case "down":
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = (type: "up" | "down" | "neutral") => {
    switch (type) {
      case "up":
        return "text-emerald-600 bg-emerald-50";
      case "down":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card, index) => {
        const IconComponent = card.icon;
        const TrendIcon = getTrendIcon(card.trendType);
        const AccentIcon = card.accentIcon;

        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
          >
            {/* Background Pattern */}
            <div
              className={`absolute inset-0 ${card.bgPattern} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>

            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-gray-100/50 to-gray-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-tr from-gray-50/60 to-gray-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Content */}
            <div className="relative z-10 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`p-4 ${card.iconBg} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(
                      card.trendType
                    )}`}
                  >
                    <TrendIcon className="w-3 h-3" />
                    {card.trend}
                  </div>
                  <div className="mt-1">
                    <AccentIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    {card.title}
                  </h3>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-gray-200 transition-colors duration-300">
                    {card.highlight}
                  </span>
                </div>

                <div className="text-4xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                  {card.value}
                </div>

                <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
