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
    categoryId: string,
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
    if (data.isSerial !== undefined)
      formData.append("isSerial", data.isSerial.toString());
    if (subCategoryId) formData.append("subCategoryId", subCategoryId);
    formData.append("thumbnail", thumbnail);

    return apiCall(
      `${API_CONFIG.ENDPOINTS.PRODUCT.CREATE}/${categoryId}/${brandId}`,
      {
        method: "POST",
        headers: {},
        body: formData,
      }
    );
  },

  update: async (
    productId: string,
    data: UpdateProductRequest,
    thumbnail?: File,
    brandId?: string,
    categoryId?: string,
    subCategoryId?: string
  ): Promise<ApiResponse<ProductResponse>> => {
    const formData = new FormData();

    // Only append non-undefined values
    if (data.productName !== undefined)
      formData.append("productName", data.productName);
    if (data.price !== undefined)
      formData.append("price", data.price.toString());
    if (data.stockQuantity !== undefined)
      formData.append("stockQuantity", data.stockQuantity.toString());
    if (data.description !== undefined)
      formData.append("description", data.description);
    if (data.status !== undefined) formData.append("status", data.status);
    if (data.warrantyPeriod !== undefined)
      formData.append("warrantyPeriod", data.warrantyPeriod.toString());
    if (data.isSerial !== undefined)
      formData.append("isSerial", data.isSerial.toString());
    if (brandId !== undefined) formData.append("brandId", brandId);
    if (categoryId !== undefined) formData.append("categoryId", categoryId);
    if (subCategoryId !== undefined)
      formData.append("subCategoryId", subCategoryId);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    return apiCall(`${API_CONFIG.ENDPOINTS.PRODUCT.UPDATE}/${productId}`, {
      method: "PUT",
      headers: {},
      body: formData,
    });
  },

  getAll: async (page?: number, pageSize?: number): Promise<ApiResponse<ProductResponse[]>> => {
    const params = new URLSearchParams();
    if (page) params.append('pageNumber', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    
    const url = `${API_CONFIG.ENDPOINTS.PRODUCT.GET_ALL}${params.toString() ? '?' + params.toString() : ''}`;
    return apiCall(url);
  },

  getById: async (id: string): Promise<ApiResponse<ProductResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.PRODUCT.GET_BY_ID}/${id}`),

  getBySubCategoryId: async (
    subCategoryId: string,
    page?: number,
    pageSize?: number
  ): Promise<ApiResponse<ProductResponse[]>> => {
    const params = new URLSearchParams();
    if (page) params.append('pageNumber', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    
    const url = `${API_CONFIG.ENDPOINTS.PRODUCT.GET_BY_SUBCATEGORY_ID}/${subCategoryId}${params.toString() ? '?' + params.toString() : ''}`;
    return apiCall(url);
  },

  getByBrandId: async (
    brandId: string,
    page?: number,
    pageSize?: number
  ): Promise<ApiResponse<ProductResponse[]>> => {
    const params = new URLSearchParams();
    if (page) params.append('pageNumber', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    
    const url = `${API_CONFIG.ENDPOINTS.PRODUCT.GET_BY_BRAND_ID}/${brandId}${params.toString() ? '?' + params.toString() : ''}`;
    return apiCall(url);
  },

  search: async (
    searchKey: string,
    page?: number,
    pageSize?: number
  ): Promise<ApiResponse<ProductResponse[]>> => {
    const params = new URLSearchParams();
    if (page) params.append('pageNumber', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    
    const url = `${API_CONFIG.ENDPOINTS.PRODUCT.SEARCH}/${searchKey}${params.toString() ? '?' + params.toString() : ''}`;
    return apiCall(url);
  },

  getByPriceRange: async (
    minPrice: number,
    maxPrice: number,
    page?: number,
    pageSize?: number
  ): Promise<ApiResponse<ProductResponse[]>> => {
    const params = new URLSearchParams();
    if (page) params.append('pageNumber', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    
    const url = `${API_CONFIG.ENDPOINTS.PRODUCT.GET_BY_PRICE_RANGE}/${minPrice}/${maxPrice}${params.toString() ? '?' + params.toString() : ''}`;
    return apiCall(url);
  },
};
