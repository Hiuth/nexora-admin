import {
  ApiResponse,
  ProductUnitResponse,
  CreateProductUnitRequest,
  UpdateProductUnitRequest,
} from "@/types";
import { apiCall } from "./base";
import { API_CONFIG } from "../api-config";

export const productUnitService = {
  create: async (
    productId: string,
    data: CreateProductUnitRequest
  ): Promise<ApiResponse<ProductUnitResponse>> => {
    const formData = new FormData();
    if (data.imei) formData.append("imei", data.imei);
    if (data.serialNumber) formData.append("serialNumber", data.serialNumber);
    formData.append("status", data.status);

    return apiCall(`${API_CONFIG.ENDPOINTS.PRODUCT_UNIT.CREATE}/${productId}`, {
      method: "POST",
      headers: {},
      body: formData,
    });
  },

  update: async (
    id: string,
    data: UpdateProductUnitRequest
  ): Promise<ApiResponse<ProductUnitResponse>> => {
    const formData = new FormData();
    if (data.imei) formData.append("imei", data.imei);
    if (data.serialNumber) formData.append("serialNumber", data.serialNumber);
    if (data.status) formData.append("status", data.status);

    return apiCall(`${API_CONFIG.ENDPOINTS.PRODUCT_UNIT.UPDATE}/${id}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  },

  getByProductId: async (
    productId: string
  ): Promise<ApiResponse<ProductUnitResponse[]>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PRODUCT_UNIT.GET_BY_PRODUCT_ID}/${productId}`
    ),

  getById: async (id: string): Promise<ApiResponse<ProductUnitResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.PRODUCT_UNIT.GET_BY_ID}/${id}`),

  delete: async (id: string): Promise<ApiResponse<string>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.PRODUCT_UNIT.DELETE}/${id}`, {
      method: "DELETE",
    }),
};
