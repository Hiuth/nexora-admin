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

  getAll: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PRODUCT.GET_ALL}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),

  getById: async (id: string): Promise<ApiResponse<ProductResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.PRODUCT.GET_BY_ID}/${id}`),

  getBySubCategoryId: async (
    subCategoryId: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PRODUCT.GET_ALL}/getBysubCategoryId/${subCategoryId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),

  getByBrandId: async (
    brandId: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PRODUCT.GET_ALL}/getByBrandId/${brandId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),

  search: async (
    searchKey: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PRODUCT.GET_ALL}/searchProduct/${searchKey}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),

  getByPriceRange: async (
    minPrice: number,
    maxPrice: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.PRODUCT.GET_ALL}/getByPriceRange/${minPrice}/${maxPrice}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),
};
