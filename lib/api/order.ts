import {
  ApiResponse,
  OrderResponse,
  OrderDetailResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
} from "@/types";
import { apiCall } from "./base";

export const orderService = {
  create: async (
    data: CreateOrderRequest
  ): Promise<ApiResponse<OrderResponse>> =>
    apiCall("/Order/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (
    id: string,
    data: UpdateOrderRequest
  ): Promise<ApiResponse<OrderResponse>> =>
    apiCall(`/Order/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getByAccountId: async (): Promise<ApiResponse<OrderResponse[]>> =>
    apiCall("/Order/getByAccountId"),

  getAll: async (): Promise<ApiResponse<OrderResponse[]>> =>
    apiCall("/Order/getAll"),

  delete: async (id: string): Promise<ApiResponse<string>> =>
    apiCall(`/Order/delete/${id}`, { method: "DELETE" }),
};

export const orderDetailService = {
  create: async (
    orderId: string,
    productId: string,
    data: any
  ): Promise<ApiResponse<OrderDetailResponse>> =>
    apiCall(`/OrderDetail/create/${orderId}/${productId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getByOrderId: async (
    orderId: string
  ): Promise<ApiResponse<OrderDetailResponse[]>> =>
    apiCall(`/OrderDetail/getByOrderId/${orderId}`),

  deleteByOrderId: async (orderId: string): Promise<ApiResponse<string>> =>
    apiCall(`/OrderDetail/deleteByOrderId/${orderId}`, { method: "DELETE" }),
};
