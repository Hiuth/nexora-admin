import {
  ApiResponse,
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types";
import { apiCall } from "./base";

export const productService = {
  create: async (
    brandId: string,
    subCategoryId: string,
    data: CreateProductRequest,
    file: File
  ): Promise<ApiResponse<ProductResponse>> => {
    const formData = new FormData();
    formData.append("productName", data.productName);
    formData.append("price", data.price.toString());
    formData.append("stockQuantity", data.stockQuantity.toString());
    if (data.description) formData.append("description", data.description);
    formData.append("status", data.status);
    formData.append("warrantyPeriod", data.warrantyPeriod.toString());
    if (file) formData.append("file", file);

    return apiCall(
      `/Product/create/${brandId}?subCategoryId=${subCategoryId}`,
      {
        method: "POST",
        headers: {},
        body: formData,
      }
    );
  },

  update: async (
    id: string,
    brandId: string,
    subCategoryId: string,
    data: UpdateProductRequest,
    file?: File
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
    if (file) formData.append("file", file);

    return apiCall(
      `/Product/update/${id}?brandId=${brandId}&subCategoryId=${subCategoryId}`,
      {
        method: "PUT",
        headers: {},
        body: formData,
      }
    );
  },

  getAll: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(`/Product/getAll?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  getById: async (id: string): Promise<ApiResponse<ProductResponse>> =>
    apiCall(`/Product/getById/${id}`),

  getBySubCategoryId: async (
    subCategoryId: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `/Product/getBySubCategoryId/${subCategoryId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),

  getByBrandId: async (
    brandId: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `/Product/getByBrandId/${brandId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),

  search: async (
    searchTerm: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `/Product/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),

  getByPriceRange: async (
    minPrice: number,
    maxPrice: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<any>> =>
    apiCall(
      `/Product/getByPriceRange?minPrice=${minPrice}&maxPrice=${maxPrice}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),
};
