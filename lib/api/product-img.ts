import { ApiResponse, ProductImgResponse } from "@/types";
import { apiCall } from "./base";
import { API_CONFIG } from "../api-config";

export const productImgService = {
  create: async (
    productId: string,
    file: File
  ): Promise<ApiResponse<ProductImgResponse>> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiCall(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCT_IMG.CREATE}/${productId}`,
      {
        method: "POST",
        headers: {},
        body: formData,
      }
    );
  },

  getByProductId: async (
    productId: string
  ): Promise<ApiResponse<ProductImgResponse[]>> =>
    apiCall(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCT_IMG.GET_BY_PRODUCT_ID}/${productId}`
    ),

  delete: async (id: string): Promise<ApiResponse<string>> =>
    apiCall(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCT_IMG.DELETE}/${id}`,
      {
        method: "DELETE",
      }
    ),
};
