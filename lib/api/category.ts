import {
  ApiResponse,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types";
import { apiCall } from "./base";

export const categoryService = {
  create: async (
    data: CreateCategoryRequest,
    file: File
  ): Promise<ApiResponse<CategoryResponse>> => {
    const formData = new FormData();
    formData.append("categoryName", data.categoryName);
    if (file) formData.append("file", file);

    return apiCall("/Category/create", {
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

    return apiCall(`/Category/update/${id}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  },

  getAll: async (): Promise<ApiResponse<CategoryResponse[]>> =>
    apiCall("/Category/getAll"),

  getById: async (id: string): Promise<ApiResponse<CategoryResponse>> =>
    apiCall(`/Category/getById/${id}`),
};
