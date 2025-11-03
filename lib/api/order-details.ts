import {
  ApiResponse,
  OrderDetailResponse,
  CreateOrderDetailRequest,
} from "@/types";
import { apiCall } from "./base";
import { API_CONFIG } from "../api-config";

export const orderDetailService = {
  create: async (
    orderId: string,
    productId: string,
    data: CreateOrderDetailRequest
  ): Promise<ApiResponse<OrderDetailResponse>> => {
    const formData = new FormData();
    formData.append("quantity", data.quantity.toString());
    formData.append("unitPrice", data.unitPrice.toString());

    return apiCall(
      `${API_CONFIG.ENDPOINTS.ORDER_DETAIL.CREATE}/${orderId}/${productId}`,
      {
        method: "POST",
        headers: {},
        body: formData,
      }
    );
  },

  getByOrderId: async (
    orderId: string
  ): Promise<ApiResponse<OrderDetailResponse[]>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.ORDER_DETAIL.GET_BY_ORDER_ID}/${orderId}`),

  deleteByOrderId: async (orderId: string): Promise<ApiResponse<string>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.ORDER_DETAIL.DELETE_BY_ORDER_ID}/${orderId}`,
      {
        method: "DELETE",
      }
    ),
};
