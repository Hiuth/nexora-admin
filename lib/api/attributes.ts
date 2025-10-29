import {
  ApiResponse,
  AttributesResponse,
  CreateAttributeRequest,
  UpdateAttributeRequest,
} from "@/types";
import { apiCall } from "./base";

export const attributesService = {
  create: async (
    categoryId: string,
    data: CreateAttributeRequest
  ): Promise<ApiResponse<AttributesResponse>> =>
    apiCall(`/Attributes/create/${categoryId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (
    attributeId: string,
    categoryId: string,
    data: UpdateAttributeRequest
  ): Promise<ApiResponse<AttributesResponse>> =>
    apiCall(`/Attributes/update/${attributeId}?categoryId=${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getAll: async (): Promise<ApiResponse<AttributesResponse[]>> =>
    apiCall("/Attributes/getAll"),

  getById: async (id: string): Promise<ApiResponse<AttributesResponse>> =>
    apiCall(`/Attributes/getById/${id}`),

  getByCategoryId: async (
    categoryId: string
  ): Promise<ApiResponse<AttributesResponse[]>> =>
    apiCall(`/Attributes/getByCategoryId/${categoryId}`),
};
