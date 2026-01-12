"use client";

import { useState, useEffect } from "react";
import { orderService } from "@/lib/api";
import { OrderResponse } from "@/types";

export interface OrderTrendData {
  period: string;
  orders: number;
  revenue: number;
  date: string;
}

export function useOrderTrend(days: number = 7) {
  const [trendData, setTrendData] = useState<OrderTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrderTrend = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all orders
      const response = await orderService.getAll();
      
      if (response.code === 1000 && response.result) {
        const orders = Array.isArray(response.result) 
          ? response.result 
          : (response.result as any)?.items || [];

        // Generate last 7 days
        const today = new Date();
        const last7Days: OrderTrendData[] = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          
          const dayName = date.toLocaleDateString('vi-VN', { weekday: 'short' });
          const dayOrders = orders.filter((order: OrderResponse) => {
            const orderDate = new Date(order.orderDate);
            return (
              orderDate.getDate() === date.getDate() &&
              orderDate.getMonth() === date.getMonth() &&
              orderDate.getFullYear() === date.getFullYear()
            );
          });

          const dayRevenue = dayOrders.reduce((sum: number, order: OrderResponse) => {
            return sum + (order.totalAmount || 0);
          }, 0);

          last7Days.push({
            period: dayName,
            orders: dayOrders.length,
            revenue: dayRevenue,
            date: date.toISOString().split('T')[0],
          });
        }

        setTrendData(last7Days);
      } else {
        setTrendData([]);
      }
    } catch (err: any) {
      console.error("Error loading order trend:", err);
      setError(err.message || "Không thể tải dữ liệu xu hướng đơn hàng");
      setTrendData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderTrend();
  }, [days]);

  return {
    trendData,
    loading,
    error,
    refetch: loadOrderTrend,
  };
}