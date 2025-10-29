import {
  ApiResponse,
  BrandResponse,
  CreateBrandRequest,
  UpdateBrandRequest,
} from "@/types";
import { apiCall } from "./base";

export const brandService = {
  create: async (
    categoryId: string,
    data: CreateBrandRequest
  ): Promise<ApiResponse<BrandResponse>> =>
    apiCall(`/Brand/create/${categoryId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (
    brandId: string,
    categoryId: string,
    data: UpdateBrandRequest
  ): Promise<ApiResponse<BrandResponse>> =>
    apiCall(`/Brand/update/${brandId}?categoryId=${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getAll: async (): Promise<ApiResponse<BrandResponse[]>> =>
    apiCall("/Brand/getAll"),

  getById: async (id: string): Promise<ApiResponse<BrandResponse>> =>
    apiCall(`/Brand/getById/${id}`),

  getByCategoryId: async (
    categoryId: string
  ): Promise<ApiResponse<BrandResponse[]>> =>
    apiCall(`/Brand/getByCategoryId/${categoryId}`),
};
