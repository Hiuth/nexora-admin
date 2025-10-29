import { ApiResponse, ProductImgResponse } from "@/types";
import { apiCall } from "./base";

export const productImgService = {
  create: async (
    productId: string,
    file: File
  ): Promise<ApiResponse<ProductImgResponse>> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiCall(`/ProductImg/create/${productId}`, {
      method: "POST",
      headers: {},
      body: formData,
    });
  },

  getByProductId: async (
    productId: string
  ): Promise<ApiResponse<ProductImgResponse[]>> =>
    apiCall(`/ProductImg/getByProductId/${productId}`),

  delete: async (id: string): Promise<ApiResponse<string>> =>
    apiCall(`/ProductImg/delete/${id}`, { method: "DELETE" }),
};
