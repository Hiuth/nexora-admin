import {
  ApiResponse,
  OrderResponse,
  OrderDetailResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
} from "@/types";
import { apiCall } from "./base";
import { API_CONFIG } from "../api-config";

export const orderService = {
  create: async (
    data: CreateOrderRequest
  ): Promise<ApiResponse<OrderResponse>> =>
    apiCall(API_CONFIG.ENDPOINTS.ORDER.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (
    id: string,
    data: UpdateOrderRequest
  ): Promise<ApiResponse<OrderResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.ORDER.UPDATE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getByAccountId: async (): Promise<ApiResponse<OrderResponse[]>> =>
    apiCall(API_CONFIG.ENDPOINTS.ORDER.GET_BY_ACCOUNT_ID),

  getAll: async (): Promise<ApiResponse<OrderResponse[]>> =>
    apiCall(API_CONFIG.ENDPOINTS.ORDER.GET_ALL),

  delete: async (id: string): Promise<ApiResponse<string>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.ORDER.DELETE}/${id}`, { method: "DELETE" }),
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
