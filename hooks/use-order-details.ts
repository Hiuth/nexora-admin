"use client";

import { useState, useCallback } from "react";
import { orderDetailService } from "@/lib/api/order-details";
import { OrderDetailResponse, CreateOrderDetailRequest } from "@/types";
import { toast } from "@/hooks/use-toast";

export function useOrderDetails() {
  const [orderDetails, setOrderDetails] = useState<OrderDetailResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Load order details by order ID
  const loadOrderDetails = useCallback(async (orderId: string) => {
    if (!orderId) {
      setOrderDetails([]);
      return;
    }

    setLoading(true);
    try {
      const response = await orderDetailService.getByOrderId(orderId);
      if (response.result) {
        setOrderDetails(response.result);
      }
    } catch (error) {
      console.error("Error loading order details:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải chi tiết đơn hàng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Create order detail
  const createOrderDetail = useCallback(
    async (
      orderId: string,
      productId: string,
      data: CreateOrderDetailRequest
    ) => {
      setCreating(true);
      try {
        const response = await orderDetailService.create(
          orderId,
          productId,
          data
        );

        if (response.result) {
          toast({
            title: "Thành công",
            description: "Đã thêm sản phẩm vào đơn hàng",
          });

          // Reload order details
          await loadOrderDetails(orderId);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error creating order detail:", error);
        toast({
          title: "Lỗi",
          description: "Không thể thêm sản phẩm vào đơn hàng",
          variant: "destructive",
        });
        return false;
      } finally {
        setCreating(false);
      }
    },
    [loadOrderDetails]
  );

  // Delete all order details by order ID
  const deleteOrderDetails = useCallback(async (orderId: string) => {
    setDeleting(orderId);
    try {
      await orderDetailService.deleteByOrderId(orderId);
      toast({
        title: "Thành công",
        description: "Đã xóa tất cả chi tiết đơn hàng",
      });

      // Clear order details
      setOrderDetails([]);
      return true;
    } catch (error) {
      console.error("Error deleting order details:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa chi tiết đơn hàng",
        variant: "destructive",
      });
      return false;
    } finally {
      setDeleting(null);
    }
  }, []);

  return {
    orderDetails,
    loading,
    creating,
    deleting,
    createOrderDetail,
    deleteOrderDetails,
    loadOrderDetails,
  };
}
