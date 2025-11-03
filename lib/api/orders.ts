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

  getByAccountId: async (): Promise<ApiResponse<OrderResponse[]>> =>
    apiCall(API_CONFIG.ENDPOINTS.ORDER.GET_BY_ACCOUNT_ID),

  delete: async (orderId: string): Promise<ApiResponse<string>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.ORDER.DELETE}/${orderId}`, {
      method: "DELETE",
    }),
};
