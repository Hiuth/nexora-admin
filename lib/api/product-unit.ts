import {
  ApiResponse,
  ProductUnitResponse,
  CreateProductUnitRequest,
  UpdateProductUnitRequest,
} from "@/types";
import { apiCall } from "./base";

export const productUnitService = {
  create: async (
    productId: string,
    data: CreateProductUnitRequest
  ): Promise<ApiResponse<ProductUnitResponse>> =>
    apiCall(`/ProductUnit/create/${productId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (
    id: string,
    data: UpdateProductUnitRequest
  ): Promise<ApiResponse<ProductUnitResponse>> =>
    apiCall(`/ProductUnit/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getByProductId: async (
    productId: string
  ): Promise<ApiResponse<ProductUnitResponse[]>> =>
    apiCall(`/ProductUnit/getByProductId/${productId}`),

  getById: async (id: string): Promise<ApiResponse<ProductUnitResponse>> =>
    apiCall(`/ProductUnit/getById/${id}`),

  delete: async (id: string): Promise<ApiResponse<string>> =>
    apiCall(`/ProductUnit/delete/${id}`, { method: "DELETE" }),
};
