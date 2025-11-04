import {
  ApiResponse,
  OrderResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
} from "@/types";
import { apiCall } from "./base";
import { API_CONFIG } from "../api-config";

export const orderService = {
  create: async (
    data: CreateOrderRequest
  ): Promise<ApiResponse<OrderResponse>> => {
    const formData = new FormData();
    formData.append("status", data.status);
    formData.append("totalAmount", data.totalAmount.toString());
    formData.append("customerName", data.customerName);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("address", data.address);

    return apiCall(API_CONFIG.ENDPOINTS.ORDER.CREATE, {
      method: "POST",
      headers: {},
      body: formData,
    });
  },

  update: async (
    orderId: string,
    data: UpdateOrderRequest
  ): Promise<ApiResponse<OrderResponse>> => {
    const formData = new FormData();

    if (data.status !== undefined) {
      formData.append("status", data.status);
    }
    if (data.totalAmount !== undefined) {
      formData.append("totalAmount", data.totalAmount.toString());
    }
    if (data.customerName !== undefined) {
      formData.append("customerName", data.customerName);
    }
    if (data.phoneNumber !== undefined) {
      formData.append("phoneNumber", data.phoneNumber);
    }
    if (data.address !== undefined) {
      formData.append("address", data.address);
    }

    return apiCall(`${API_CONFIG.ENDPOINTS.ORDER.UPDATE}/${orderId}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  },

  getAll: async (): Promise<ApiResponse<OrderResponse[]>> =>
    apiCall(API_CONFIG.ENDPOINTS.ORDER.GET_ALL),

  getById: async (orderId: string): Promise<ApiResponse<OrderResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.ORDER.GET_BY_ID}/${orderId}`),

  getByAccountId: async (
    accountId?: string
  ): Promise<ApiResponse<OrderResponse[]>> => {
    const endpoint = accountId
      ? `${API_CONFIG.ENDPOINTS.ORDER.GET_BY_ACCOUNT_ID}/${accountId}`
      : API_CONFIG.ENDPOINTS.ORDER.GET_BY_ACCOUNT_ID;
    return apiCall(endpoint);
  },

  delete: async (orderId: string): Promise<ApiResponse<string>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.ORDER.DELETE}/${orderId}`, {
      method: "DELETE",
    }),

  // Additional methods that might be useful
  getOrdersByStatus: async (
    status: string
  ): Promise<ApiResponse<OrderResponse[]>> =>
    apiCall(`/Order/getByStatus/${status}`),

  getOrdersByDateRange: async (
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<OrderResponse[]>> =>
    apiCall(`/Order/getByDateRange?startDate=${startDate}&endDate=${endDate}`),

  updateOrderStatus: async (
    orderId: string,
    status: string
  ): Promise<ApiResponse<OrderResponse>> => {
    const formData = new FormData();
    formData.append("status", status);

    return apiCall(`/Order/updateStatus/${orderId}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<ApiResponse<OrderResponse>> =>
    apiCall(`/Order/cancel/${orderId}`, {
      method: "PUT",
    }),

  // Get order statistics
  getOrderStatistics: async (): Promise<ApiResponse<any>> =>
    apiCall("/Order/statistics"),
};
