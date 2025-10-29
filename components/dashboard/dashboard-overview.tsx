"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Monitor,
  Shield,
} from "lucide-react";
import {
  productService,
  orderService,
  pcBuildService,
  categoryService,
  brandService,
} from "@/lib/api";
import { formatCurrency } from "@/lib/api-utils";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalPcBuilds: number;
  totalCategories: number;
  totalBrands: number;
  recentOrders: any[];
  topProducts: any[];
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalPcBuilds: 0,
    totalCategories: 0,
    totalBrands: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load basic statistics
      const [
        productsResponse,
        ordersResponse,
        pcBuildsResponse,
        categoriesResponse,
        brandsResponse,
      ] = await Promise.all([
        productService.getAll(1, 1000),
        orderService.getAll(),
        pcBuildService.getAll(1, 1000),
        categoryService.getAll(),
        brandService.getAll(),
      ]);

      setStats({
        totalProducts:
          productsResponse.Result?.TotalCount ||
          productsResponse.Result?.Items?.length ||
          0,
        totalOrders: ordersResponse.Result?.length || 0,
        totalPcBuilds:
          pcBuildsResponse.Result?.TotalCount ||
          pcBuildsResponse.Result?.Items?.length ||
          0,
        totalCategories: categoriesResponse.Result?.length || 0,
        totalBrands: brandsResponse.Result?.length || 0,
        recentOrders: ordersResponse.Result?.slice(0, 5) || [],
        topProducts: productsResponse.Result?.Items?.slice(0, 5) || [],
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center h-32">
              <div className="animate-pulse bg-muted rounded w-16 h-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalProducts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              Sản phẩm đang bán
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalOrders.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              Đơn hàng đã tạo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PC Build</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalPcBuilds.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              Cấu hình máy tính
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Danh mục & Thương hiệu
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.totalCategories + stats.totalBrands).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCategories} danh mục, {stats.totalBrands} thương hiệu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Chưa có đơn hàng nào
                </p>
              ) : (
                stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{order.CustomerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <Badge className="text-xs">{order.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sản phẩm nổi bật</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Chưa có sản phẩm nào
                </p>
              ) : (
                stats.topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg"
                  >
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {product.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Còn lại: {product.stockQuantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-green-600">
                        {formatCurrency(product.price)}
                      </p>
                      <Badge className="text-xs">{product.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Package className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Thêm sản phẩm</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Monitor className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium">Máy tính xây sẵn</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <ShoppingCart className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">Tạo đơn hàng</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Shield className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium">Chuẩn bị đơn hàng</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
