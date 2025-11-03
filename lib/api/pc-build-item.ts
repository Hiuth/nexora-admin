import {
  ApiResponse,
  PcBuildItemResponse,
  CreatePcBuildItemRequest,
  UpdatePcBuildItemRequest,
} from "@/types";
import { apiCall } from "./base";
import { API_CONFIG } from "../api-config";

export const pcBuildItemService = {
  create: async (
    pcBuildId: string,
    productId: string,
    data: CreatePcBuildItemRequest
  ): Promise<ApiResponse<PcBuildItemResponse>> => {
    const formData = new FormData();
    formData.append("quantity", data.quantity.toString());

    return apiCall(
      `${API_CONFIG.ENDPOINTS.PC_BUILD_ITEM.CREATE}/${pcBuildId}/${productId}`,
      {
        method: "POST",
        body: formData,
      }
    );
  },

  update: async (
    pcBuildItemId: string,
    productId?: string,
    data?: UpdatePcBuildItemRequest
  ): Promise<ApiResponse<PcBuildItemResponse>> => {
    const formData = new FormData();
    if (productId) formData.append("productId", productId);
    if (data?.quantity) formData.append("quantity", data.quantity.toString());

    return apiCall(
      `${API_CONFIG.ENDPOINTS.PC_BUILD_ITEM.UPDATE}/${pcBuildItemId}`,
      {
        method: "PUT",
        body: formData,
      }
    );
  },

  getByPcBuildId: async (
    pcBuildId: string
  ): Promise<ApiResponse<PcBuildItemResponse[]>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PC_BUILD_ITEM.GET_BY_PC_BUILD_ID}/${pcBuildId}`
    ),

  delete: async (pcBuildItemId: string): Promise<ApiResponse<string>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.PC_BUILD_ITEM.DELETE}/${pcBuildItemId}`, {
      method: "DELETE",
    }),
};
