"use client";

import { useState, useEffect } from "react";
import {
  productService,
  orderService,
  pcBuildService,
  categoryService,
  brandService,
} from "@/lib/api";

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalPcBuilds: number;
  totalCategories: number;
  totalBrands: number;
  recentOrders: any[];
  topProducts: any[];
}

export function useDashboardData() {
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
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load basic statistics
      const [
        productsResponse,
        ordersResponse,
        pcBuildsResponse,
        categoriesResponse,
        brandsResponse,
      ] = await Promise.all([
        productService.getAll(),
        orderService.getAll(),
        pcBuildService.getAll(),
        categoryService.getAll(),
        brandService.getAll(),
      ]);

      setStats({
        totalProducts: productsResponse.result?.length || 0,
        totalOrders: ordersResponse.result?.length || 0,
        totalPcBuilds: pcBuildsResponse.result?.length || 0,
        totalCategories: categoriesResponse.result?.length || 0,
        totalBrands: brandsResponse.result?.length || 0,
        recentOrders: ordersResponse.result?.slice(0, 5) || [],
        topProducts: productsResponse.result?.slice(0, 5) || [],
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: loadDashboardData,
  };
}
