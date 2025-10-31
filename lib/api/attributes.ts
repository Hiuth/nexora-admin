import {
  ApiResponse,
  AttributesResponse,
  CreateAttributeRequest,
  UpdateAttributeRequest,
} from "@/types";
import { apiCall } from "./base";
import { API_CONFIG } from "../api-config";

export const attributesService = {
  create: async (
    categoryId: string,
    data: CreateAttributeRequest
  ): Promise<ApiResponse<AttributesResponse>> => {
    const formData = new FormData();
    formData.append("attributeName", data.attributeName);

    return apiCall(`${API_CONFIG.ENDPOINTS.ATTRIBUTES.CREATE}/${categoryId}`, {
      method: "POST",
      headers: {},
      body: formData,
    });
  },

  update: async (
    attributeId: string,
    categoryId?: string,
    data?: UpdateAttributeRequest
  ): Promise<ApiResponse<AttributesResponse>> => {
    const formData = new FormData();
    if (data?.attributeName) {
      formData.append("attributeName", data.attributeName);
    }
    if (categoryId) {
      formData.append("categoryId", categoryId);
    }

    return apiCall(`${API_CONFIG.ENDPOINTS.ATTRIBUTES.UPDATE}/${attributeId}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  },

  getAll: async (): Promise<ApiResponse<AttributesResponse[]>> =>
    apiCall(API_CONFIG.ENDPOINTS.ATTRIBUTES.GET_ALL),

  getById: async (id: string): Promise<ApiResponse<AttributesResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.ATTRIBUTES.GET_BY_ID}/${id}`),

  getByCategoryId: async (
    categoryId: string
  ): Promise<ApiResponse<AttributesResponse[]>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.ATTRIBUTES.GET_BY_CATEGORY_ID}/${categoryId}`
    ),

  delete: async (id: string): Promise<ApiResponse<void>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.ATTRIBUTES.DELETE}/${id}`, {
      method: "DELETE",
    }),
};
