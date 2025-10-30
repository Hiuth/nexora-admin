import {
  ApiResponse,
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types";
import { apiCall } from "./base";
import { API_CONFIG } from "../api-config";

export const productService = {
  create: async (
    brandId: string,
    data: CreateProductRequest,
    thumbnail: File,
    subCategoryId?: string
  ): Promise<ApiResponse<ProductResponse>> => {
    const formData = new FormData();
    formData.append("productName", data.productName);
    formData.append("price", data.price.toString());
    formData.append("stockQuantity", data.stockQuantity.toString());
    formData.append("description", data.description || "");
    formData.append("status", data.status);
    formData.append("warrantyPeriod", data.warrantyPeriod.toString());
    if (subCategoryId) formData.append("subCategoryId", subCategoryId);
    formData.append("thumbnail", thumbnail);

    return apiCall(`${API_CONFIG.ENDPOINTS.PRODUCT.CREATE}/${brandId}`, {
      method: "POST",
      headers: {},
      body: formData,
    });
  },

  update: async (
    productId: string,
    data: UpdateProductRequest,
    thumbnail?: File,
    brandId?: string,
    subCategoryId?: string
  ): Promise<ApiResponse<ProductResponse>> => {
    const formData = new FormData();
    if (data.productName) formData.append("productName", data.productName);
    if (data.price) formData.append("price", data.price.toString());
    if (data.stockQuantity)
      formData.append("stockQuantity", data.stockQuantity.toString());
    if (data.description) formData.append("description", data.description);
    if (data.status) formData.append("status", data.status);
    if (data.warrantyPeriod)
      formData.append("warrantyPeriod", data.warrantyPeriod.toString());
    if (brandId) formData.append("brandId", brandId);
    if (subCategoryId) formData.append("subCategoryId", subCategoryId);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    return apiCall(`${API_CONFIG.ENDPOINTS.PRODUCT.UPDATE}/${productId}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  },

  getAll: async (): Promise<ApiResponse<any>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.PRODUCT.GET_ALL}`),

  getById: async (id: string): Promise<ApiResponse<ProductResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.PRODUCT.GET_BY_ID}/${id}`),

  getBySubCategoryId: async (
    subCategoryId: string
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PRODUCT.GET_BY_SUBCATEGORY_ID}/${subCategoryId}`
    ),

  getByBrandId: async (brandId: string): Promise<ApiResponse<any>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.PRODUCT.GET_BY_BRAND_ID}/${brandId}`),

  search: async (searchKey: string): Promise<ApiResponse<any>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.PRODUCT.SEARCH}/${searchKey}`),

  getByPriceRange: async (
    minPrice: number,
    maxPrice: number
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PRODUCT.GET_BY_PRICE_RANGE}/${minPrice}/${maxPrice}`
    ),
};
