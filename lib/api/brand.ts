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
  ): Promise<ApiResponse<BrandResponse>> => {
    const formData = new FormData();
    formData.append("brandName", data.brandName);

    return apiCall(`${API_CONFIG.ENDPOINTS.BRAND.CREATE}/${categoryId}`, {
      method: "POST",
      headers: {},
      body: formData,
    });
  },

  update: async (
    brandId: string,
    categoryId: string,
    data: UpdateBrandRequest
  ): Promise<ApiResponse<BrandResponse>> => {
    const formData = new FormData();
    if (data.brandName) formData.append("brandName", data.brandName);
    if (data.categoryId) {
      // Nếu có categoryId trong data (thay đổi), dùng giá trị đó
      formData.append("categoryId", data.categoryId);
    } else {
      // Nếu không có thay đổi categoryId, dùng categoryId hiện tại
      formData.append("categoryId", categoryId);
    }

    return apiCall(`${API_CONFIG.ENDPOINTS.BRAND.UPDATE}/${brandId}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  },

  // Remove delete method since it's not available in backend
  // delete: async (id: string): Promise<ApiResponse<void>> =>
  //   apiCall(`${API_CONFIG.ENDPOINTS.BRAND.DELETE}/${id}`, {
  //     method: "DELETE",
  //   }),

  getAll: async (): Promise<ApiResponse<BrandResponse[]>> =>
    apiCall(API_CONFIG.ENDPOINTS.BRAND.GET_ALL),

  getById: async (id: string): Promise<ApiResponse<BrandResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.BRAND.GET_BY_ID}/${id}`),

  getByCategoryId: async (
    categoryId: string
  ): Promise<ApiResponse<BrandResponse[]>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.BRAND.GET_ALL}/getByCategoryId/${categoryId}`
    ),
};
