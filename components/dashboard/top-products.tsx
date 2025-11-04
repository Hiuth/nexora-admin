"use client";

import { formatCurrency } from "@/lib/api-utils";
import {
  Package,
  Star,
  TrendingUp,
  Eye,
  Heart,
  ShoppingCart,
  Award,
  Zap,
  Crown,
  Flame,
} from "lucide-react";

interface Product {
  id: string;
  productName: string;
  price: number;
  thumbnail?: string;
  category?: string;
  brand?: string;
  rating?: number;
  totalSold?: number;
}

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
  const getBrandColor = (brand: string) => {
    const colors = {
      intel: "bg-blue-100 text-blue-800",
      amd: "bg-red-100 text-red-800",
      nvidia: "bg-green-100 text-green-800",
      asus: "bg-purple-100 text-purple-800",
      msi: "bg-orange-100 text-orange-800",
      gigabyte: "bg-cyan-100 text-cyan-800",
    };
    return (
      colors[brand?.toLowerCase() as keyof typeof colors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getGradientByIndex = (index: number) => {
    const gradients = [
      "from-yellow-400 to-orange-500", // Gold
      "from-gray-300 to-gray-500", // Silver
      "from-orange-400 to-red-500", // Bronze
      "from-blue-400 to-blue-600",
      "from-purple-400 to-purple-600",
      "from-green-400 to-green-600",
    ];
    return gradients[index % gradients.length];
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return Crown;
      case 1:
        return Award;
      case 2:
        return Star;
      default:
        return Flame;
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sản phẩm hot</h2>
              <p className="text-sm text-gray-500">Top sản phẩm bán chạy</p>
            </div>
          </div>
        </div>

        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chưa có dữ liệu
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Dữ liệu sản phẩm bán chạy sẽ được hiển thị tại đây.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 via-white to-orange-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sản phẩm hot</h2>
              <p className="text-sm text-gray-500">
                Top {products.length} sản phẩm bán chạy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            <Flame className="w-4 h-4" />
            <span>Trending</span>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="divide-y divide-gray-50">
        {products.slice(0, 5).map((product, index) => {
          const gradient = getGradientByIndex(index);
          const RankIcon = getRankIcon(index);
          const isTop3 = index < 3;

          return (
            <div
              key={product.id}
              className="p-6 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-amber-50/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Rank & Product Image */}
                <div className="relative flex-shrink-0">
                  {/* Rank Badge */}
                  <div
                    className={`absolute -top-2 -left-2 z-10 w-6 h-6 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-white text-xs font-bold">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* Hot indicator for top 3 */}
                  {isTop3 && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <Flame className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate text-sm group-hover:text-orange-600 transition-colors duration-200">
                        {product.productName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {product.brand && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getBrandColor(
                              product.brand
                            )}`}
                          >
                            {product.brand}
                          </span>
                        )}
                        {isTop3 && (
                          <div className="flex items-center gap-1">
                            <RankIcon className="w-3 h-3 text-amber-500" />
                            <span className="text-xs text-amber-600 font-medium">
                              {index === 0
                                ? "Bestseller"
                                : index === 1
                                ? "Hot"
                                : "Trending"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{product.rating}</span>
                        </div>
                      )}
                      {product.totalSold && (
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="w-4 h-4" />
                          <span>{product.totalSold} sold</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                        {formatCurrency(product.price)}
                      </div>
                      {isTop3 && (
                        <div className="text-xs text-green-600 font-medium">
                          +{20 - index * 5}% sales
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-red-50 rounded-lg transition-colors duration-200">
                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-amber-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>Cập nhật realtime</span>
          </div>
          <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            Xem tất cả sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
