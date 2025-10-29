import {
  ApiResponse,
  ProductAttributeResponse,
  CreateProductAttributeRequest,
  UpdateProductAttributeRequest,
} from "@/types";
import { apiCall } from "./base";

export const productAttributeService = {
  create: async (
    attributeId: string,
    productId: string,
    data: CreateProductAttributeRequest
  ): Promise<ApiResponse<ProductAttributeResponse>> =>
    apiCall(`/ProductAttribute/create/${attributeId}/${productId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (
    id: string,
    attributeId: string,
    data: UpdateProductAttributeRequest
  ): Promise<ApiResponse<ProductAttributeResponse>> =>
    apiCall(`/ProductAttribute/update/${id}?attributeId=${attributeId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getByProductId: async (
    productId: string
  ): Promise<ApiResponse<ProductAttributeResponse[]>> =>
    apiCall(`/ProductAttribute/getByProductId/${productId}`),

  delete: async (id: string): Promise<ApiResponse<string>> =>
    apiCall(`/ProductAttribute/delete/${id}`, { method: "DELETE" }),
};
