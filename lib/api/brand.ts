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
    categoryId: string,
    data: CreateBrandRequest
  ): Promise<ApiResponse<BrandResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.BRAND.CREATE}/${categoryId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (
    brandId: string,
    categoryId: string,
    data: UpdateBrandRequest
  ): Promise<ApiResponse<BrandResponse>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.BRAND.UPDATE}/${brandId}?categoryId=${categoryId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    ),

  getAll: async (): Promise<ApiResponse<BrandResponse[]>> =>
    apiCall(API_CONFIG.ENDPOINTS.BRAND.GET_ALL),

  getById: async (id: string): Promise<ApiResponse<BrandResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.BRAND.GET_BY_ID}/${id}`),

  getByCategoryId: async (
    categoryId: string
  ): Promise<ApiResponse<BrandResponse[]>> =>
    apiCall(`/Brand/getByCategoryId/${categoryId}`),
};
