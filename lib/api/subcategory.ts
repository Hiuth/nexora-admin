import {
  ApiResponse,
  SubCategoryResponse,
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest,
} from "@/types";
import { apiCall } from "./base";
import { API_CONFIG } from "../api-config";

export const subCategoryService = {
  create: async (
    categoryId: string,
    data: CreateSubCategoryRequest,
    file: File
  ): Promise<ApiResponse<SubCategoryResponse>> => {
    const formData = new FormData();
    formData.append("subCategoryName", data.subCategoryName);
    if (data.description) formData.append("description", data.description);
    if (file) formData.append("file", file);

    return apiCall(`${API_CONFIG.ENDPOINTS.SUBCATEGORY.CREATE}/${categoryId}`, {
      method: "POST",
      headers: {},
      body: formData,
    });
  },

  update: async (
    id: string,
    categoryId: string,
    data: UpdateSubCategoryRequest,
    file?: File
  ): Promise<ApiResponse<SubCategoryResponse>> => {
    const formData = new FormData();
    if (data.subCategoryName)
      formData.append("subCategoryName", data.subCategoryName);
    if (data.description) formData.append("description", data.description);
    if (data.categoryId) {
      // Nếu có categoryId trong data (thay đổi), dùng giá trị đó
      formData.append("categoryId", data.categoryId);
    } else {
      // Nếu không có thay đổi categoryId, dùng categoryId hiện tại
      formData.append("categoryId", categoryId);
    }
    if (file) formData.append("file", file);

    return apiCall(`${API_CONFIG.ENDPOINTS.SUBCATEGORY.UPDATE}/${id}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  },

  getAll: async (): Promise<ApiResponse<SubCategoryResponse[]>> =>
    apiCall(API_CONFIG.ENDPOINTS.SUBCATEGORY.GET_ALL),

  getById: async (id: string): Promise<ApiResponse<SubCategoryResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.SUBCATEGORY.GET_BY_ID}/${id}`),

  getByCategoryId: async (
    categoryId: string
  ): Promise<ApiResponse<SubCategoryResponse[]>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.SUBCATEGORY.GET_BY_CATEGORY_ID}/${categoryId}`
    ),
};
