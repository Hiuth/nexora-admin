import {
  ApiResponse,
  ProductAttributeResponse,
  CreateProductAttributeRequest,
  UpdateProductAttributeRequest,
} from "@/types";
import { apiCall } from "./base";
import { API_CONFIG } from "../api-config";

export const productAttributeService = {
  create: async (
    attributeId: string,
    productId: string,
    data: CreateProductAttributeRequest
  ): Promise<ApiResponse<ProductAttributeResponse>> => {
    const formData = new FormData();
    formData.append("value", data.value);

    return apiCall(
      `${API_CONFIG.ENDPOINTS.PRODUCT_ATTRIBUTE.CREATE}/${attributeId}/${productId}`,
      {
        method: "POST",
        headers: {},
        body: formData,
      }
    );
  },

  update: async (
    productAttributeId: string,
    attributeId: string,
    value: string
  ): Promise<ApiResponse<ProductAttributeResponse>> => {
    const formData = new FormData();

    // Always append both fields as they are required
    formData.append("attributeId", attributeId);
    formData.append("value", value);

    return apiCall(
      `${API_CONFIG.ENDPOINTS.PRODUCT_ATTRIBUTE.UPDATE}/${productAttributeId}`,
      {
        method: "PUT",
        headers: {},
        body: formData,
      }
    );
  },

  getByProductId: async (
    productId: string
  ): Promise<ApiResponse<ProductAttributeResponse[]>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PRODUCT_ATTRIBUTE.GET_BY_PRODUCT_ID}/${productId}`
    ),

  delete: async (productAttributeId: string): Promise<ApiResponse<string>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PRODUCT_ATTRIBUTE.DELETE}/${productAttributeId}`,
      {
        method: "DELETE",
      }
    ),
};
