import {
  ApiResponse,
  BrandResponse,
  CreateBrandRequest,
  UpdateBrandRequest,
} from "@/types";
import { apiCall } from "./base";
import { API_CONFIG } from "../api-config";

export const brandService = {
  create: async (
    data: CreateBrandRequest
  ): Promise<ApiResponse<BrandResponse>> => {
    const formData = new FormData();
    formData.append("brandName", data.brandName);

    return apiCall(API_CONFIG.ENDPOINTS.BRAND.CREATE, {
      method: "POST",
      headers: {},
      body: formData,
    });
  },

  update: async (
    brandId: string,
    data: UpdateBrandRequest
  ): Promise<ApiResponse<BrandResponse>> => {
    const formData = new FormData();
    if (data.brandName) formData.append("brandName", data.brandName);

    return apiCall(`${API_CONFIG.ENDPOINTS.BRAND.UPDATE}/${brandId}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  },

  getAll: async (): Promise<ApiResponse<BrandResponse[]>> =>
    apiCall(API_CONFIG.ENDPOINTS.BRAND.GET_ALL),

  getById: async (id: string): Promise<ApiResponse<BrandResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.BRAND.GET_BY_ID}/${id}`),
};
