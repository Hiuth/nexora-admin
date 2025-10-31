import {
  ApiResponse,
  PcBuildResponse,
  PcBuildItemResponse,
  CreatePcBuildRequest,
  UpdatePcBuildRequest,
} from "@/types";
import { apiCall } from "./base";
import { API_CONFIG } from "../api-config";

export const pcBuildService = {
  create: async (
    categoryId: string,
    subCategoryId: string | null,
    data: CreatePcBuildRequest,
    file: File
  ): Promise<ApiResponse<PcBuildResponse>> => {
    const formData = new FormData();
    if (subCategoryId) formData.append("subCategoryId", subCategoryId);
    formData.append("pcBuildName", data.productName);
    if (data.description) formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("status", data.status);
    formData.append("file", file);

    return apiCall(`${API_CONFIG.ENDPOINTS.PC_BUILD.CREATE}/${categoryId}`, {
      method: "POST",
      headers: {},
      body: formData,
    });
  },

  update: async (
    pcBuildId: string,
    categoryId?: string,
    subCategoryId?: string,
    data?: UpdatePcBuildRequest,
    file?: File
  ): Promise<ApiResponse<PcBuildResponse>> => {
    const formData = new FormData();
    if (categoryId) formData.append("categoryId", categoryId);
    if (subCategoryId) formData.append("subCategoryId", subCategoryId);
    if (data?.productName) formData.append("pcBuildName", data.productName);
    if (data?.description) formData.append("description", data.description);
    if (data?.price) formData.append("price", data.price.toString());
    if (data?.status) formData.append("status", data.status);
    if (file) formData.append("file", file);

    return apiCall(`${API_CONFIG.ENDPOINTS.PC_BUILD.UPDATE}/${pcBuildId}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  },

  getAll: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PC_BUILD.GET_ALL}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),

  getById: async (pcBuildId: string): Promise<ApiResponse<PcBuildResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.PC_BUILD.GET_BY_ID}/${pcBuildId}`),

  getBySubCategoryId: async (
    subCategoryId: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PC_BUILD.GET_BY_SUBCATEGORY_ID}/${subCategoryId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),

  getByCategoryId: async (
    categoryId: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PC_BUILD.GET_BY_CATEGORY_ID}/${categoryId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),

  delete: async (pcBuildId: string): Promise<ApiResponse<string>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.PC_BUILD.DELETE}/${pcBuildId}`, {
      method: "DELETE",
    }),
};

export const pcBuildItemService = {
  create: async (
    pcBuildId: string,
    productId: string,
    data: any
  ): Promise<ApiResponse<PcBuildItemResponse>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PC_BUILD_ITEM.CREATE}/${pcBuildId}/${productId}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  update: async (
    id: string,
    productId: string,
    data: any
  ): Promise<ApiResponse<PcBuildItemResponse>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PC_BUILD_ITEM.UPDATE}/${id}?productId=${productId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    ),

  getById: async (id: string): Promise<ApiResponse<PcBuildItemResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.PC_BUILD_ITEM.GET_BY_ID}/${id}`),

  getByPcBuildId: async (
    pcBuildId: string
  ): Promise<ApiResponse<PcBuildItemResponse[]>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PC_BUILD_ITEM.GET_BY_PC_BUILD_ID}/${pcBuildId}`
    ),

  delete: async (id: string): Promise<ApiResponse<string>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.PC_BUILD_ITEM.DELETE}/${id}`, {
      method: "DELETE",
    }),
};
