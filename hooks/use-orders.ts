"use client";

import { useState, useEffect, useCallback } from "react";
import { orderService } from "@/lib/api/orders";
import { OrderResponse, CreateOrderRequest, UpdateOrderRequest } from "@/types";
import { toast } from "@/hooks/use-toast";

export function useOrders() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [userOrders, setUserOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Load all orders (admin)
  const loadAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderService.getAll();
      if (response.result) {
        setOrders(response.result);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đơn hàng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user orders
  const loadUserOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderService.getByAccountId();
      if (response.result) {
        setUserOrders(response.result);
      }
    } catch (error) {
      console.error("Error loading user orders:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải đơn hàng của bạn",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Create order
  const createOrder = useCallback(
    async (data: CreateOrderRequest) => {
      setCreating(true);
      try {
        const response = await orderService.create(data);

        if (response.result) {
          toast({
            title: "Thành công",
            description: "Đã tạo đơn hàng mới",
          });

          // Reload orders
          await loadAllOrders();
          await loadUserOrders();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error creating order:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tạo đơn hàng",
          variant: "destructive",
        });
        return false;
      } finally {
        setCreating(false);
      }
    },
    [loadAllOrders, loadUserOrders]
  );

  // Update order
  const updateOrder = useCallback(
    async (orderId: string, data: UpdateOrderRequest) => {
      setUpdating(true);
      try {
        const response = await orderService.update(orderId, data);

        if (response.result) {
          toast({
            title: "Thành công",
            description: "Đã cập nhật đơn hàng",
          });

          // Reload orders
          await loadAllOrders();
          await loadUserOrders();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error updating order:", error);
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật đơn hàng",
          variant: "destructive",
        });
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [loadAllOrders, loadUserOrders]
  );

  // Delete order
  const deleteOrder = useCallback(
    async (orderId: string) => {
      setDeleting(orderId);
      try {
        await orderService.delete(orderId);
        toast({
          title: "Thành công",
          description: "Đã xóa đơn hàng",
        });

        // Reload orders
        await loadAllOrders();
        await loadUserOrders();
        return true;
      } catch (error) {
        console.error("Error deleting order:", error);
        toast({
          title: "Lỗi",
          description: "Không thể xóa đơn hàng",
          variant: "destructive",
        });
        return false;
      } finally {
        setDeleting(null);
      }
    },
    [loadAllOrders, loadUserOrders]
  );

  // Initialize
  useEffect(() => {
    loadAllOrders();
    loadUserOrders();
  }, [loadAllOrders, loadUserOrders]);

  return {
    orders,
    userOrders,
    loading,
    creating,
    updating,
    deleting,
    createOrder,
    updateOrder,
    deleteOrder,
    loadAllOrders,
    loadUserOrders,
  };
}
