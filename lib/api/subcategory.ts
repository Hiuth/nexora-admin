import {
  ApiResponse,
  SubCategoryResponse,
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest,
} from "@/types";
import { apiCall } from "./base";

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

    return apiCall(`/SubCategory/create/${categoryId}`, {
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
    if (file) formData.append("file", file);

    return apiCall(`/SubCategory/update/${id}?categoryId=${categoryId}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  },

  getAll: async (): Promise<ApiResponse<SubCategoryResponse[]>> =>
    apiCall("/SubCategory/getAll"),

  getById: async (id: string): Promise<ApiResponse<SubCategoryResponse>> =>
    apiCall(`/SubCategory/getById/${id}`),

  getByCategoryId: async (
    categoryId: string
  ): Promise<ApiResponse<SubCategoryResponse[]>> =>
    apiCall(`/SubCategory/getByCategoryId/${categoryId}`),
};
