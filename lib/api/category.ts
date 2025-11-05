import {
  ApiResponse,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types";
import { apiCall } from "./base";
import { API_CONFIG } from "../api-config";

// Category revenue response types
export interface CategoryRevenueItemResponse {
  categoryId: string;
  categoryName: string;
  totalRevenue: number;
  orderCount: number;
}

export interface CategoryRevenueResponse {
  categories: CategoryRevenueItemResponse[];
  totalRevenue: number;
}

export const categoryService = {
  create: async (
    data: CreateCategoryRequest,
    file: File
  ): Promise<ApiResponse<CategoryResponse>> => {
    const formData = new FormData();
    formData.append("categoryName", data.categoryName);
    if (file) formData.append("file", file);

    return apiCall(API_CONFIG.ENDPOINTS.CATEGORY.CREATE, {
      method: "POST",
      headers: {},
      body: formData,
    });
  },

  update: async (
    id: string,
    data: UpdateCategoryRequest,
    file?: File
  ): Promise<ApiResponse<CategoryResponse>> => {
    const formData = new FormData();
    if (data.categoryName) formData.append("categoryName", data.categoryName);
    if (file) formData.append("file", file);

    return apiCall(`${API_CONFIG.ENDPOINTS.CATEGORY.UPDATE}/${id}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  },

  getAll: async (): Promise<ApiResponse<CategoryResponse[]>> =>
    apiCall(API_CONFIG.ENDPOINTS.CATEGORY.GET_ALL),

  getById: async (id: string): Promise<ApiResponse<CategoryResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.CATEGORY.GET_BY_ID}/${id}`),

  getRevenueSummary: async (): Promise<ApiResponse<CategoryRevenueResponse>> =>
    apiCall(API_CONFIG.ENDPOINTS.CATEGORY.REVENUE_SUMMARY),
};
