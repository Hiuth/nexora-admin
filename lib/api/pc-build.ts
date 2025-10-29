import {
  ApiResponse,
  PcBuildResponse,
  PcBuildItemResponse,
  CreatePcBuildRequest,
  UpdatePcBuildRequest,
} from "@/types";
import { apiCall } from "./base";

export const pcBuildService = {
  create: async (
    subCategoryId: string,
    data: CreatePcBuildRequest,
    file: File
  ): Promise<ApiResponse<PcBuildResponse>> => {
    const formData = new FormData();
    formData.append("productName", data.productName);
    formData.append("price", data.price.toString());
    if (data.description) formData.append("description", data.description);
    formData.append("status", data.status);
    if (file) formData.append("file", file);

    return apiCall(`/PcBuild/create/${subCategoryId}`, {
      method: "POST",
      headers: {},
      body: formData,
    });
  },

  update: async (
    id: string,
    subCategoryId: string,
    data: UpdatePcBuildRequest,
    file?: File
  ): Promise<ApiResponse<PcBuildResponse>> => {
    const formData = new FormData();
    if (data.productName) formData.append("productName", data.productName);
    if (data.price) formData.append("price", data.price.toString());
    if (data.description) formData.append("description", data.description);
    if (data.status) formData.append("status", data.status);
    if (file) formData.append("file", file);

    return apiCall(`/PcBuild/update/${id}?subCategoryId=${subCategoryId}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  },

  getAll: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(`/PcBuild/getAll?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  getById: async (id: string): Promise<ApiResponse<PcBuildResponse>> =>
    apiCall(`/PcBuild/getById/${id}`),

  getBySubCategoryId: async (
    subCategoryId: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `/PcBuild/getBySubCategoryId/${subCategoryId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),

  delete: async (id: string): Promise<ApiResponse<string>> =>
    apiCall(`/PcBuild/delete/${id}`, { method: "DELETE" }),
};

export const pcBuildItemService = {
  create: async (
    pcBuildId: string,
    productId: string,
    data: any
  ): Promise<ApiResponse<PcBuildItemResponse>> =>
    apiCall(`/PcBuildItem/create/${pcBuildId}/${productId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (
    id: string,
    productId: string,
    data: any
  ): Promise<ApiResponse<PcBuildItemResponse>> =>
    apiCall(`/PcBuildItem/update/${id}?productId=${productId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getById: async (id: string): Promise<ApiResponse<PcBuildItemResponse>> =>
    apiCall(`/PcBuildItem/getById/${id}`),

  getByPcBuildId: async (
    pcBuildId: string
  ): Promise<ApiResponse<PcBuildItemResponse[]>> =>
    apiCall(`/PcBuildItem/getByPcBuildId/${pcBuildId}`),

  delete: async (id: string): Promise<ApiResponse<string>> =>
    apiCall(`/PcBuildItem/delete/${id}`, { method: "DELETE" }),
};
