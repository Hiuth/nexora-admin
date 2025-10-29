import {
  ApiResponse,
  WarrantyRecordResponse,
  CreateWarrantyRequest,
  UpdateWarrantyRequest,
} from "@/types";
import { apiCall } from "./base";

export const warrantyService = {
  create: async (
    productId: string,
    orderId: string,
    productUnitId: string,
    data: CreateWarrantyRequest
  ): Promise<ApiResponse<WarrantyRecordResponse>> =>
    apiCall(`/Warranty/create/${productId}/${orderId}/${productUnitId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (
    id: string,
    data: UpdateWarrantyRequest
  ): Promise<ApiResponse<WarrantyRecordResponse>> =>
    apiCall(`/Warranty/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getByProductId: async (
    productId: string
  ): Promise<ApiResponse<WarrantyRecordResponse[]>> =>
    apiCall(`/Warranty/getByProductId/${productId}`),

  getByOrderId: async (
    orderId: string
  ): Promise<ApiResponse<WarrantyRecordResponse[]>> =>
    apiCall(`/Warranty/getByOrderId/${orderId}`),

  getByStatus: async (
    status: string
  ): Promise<ApiResponse<WarrantyRecordResponse[]>> =>
    apiCall(`/Warranty/getByStatus/${status}`),

  getBySerialNumber: async (
    serialNumber: string
  ): Promise<ApiResponse<WarrantyRecordResponse>> =>
    apiCall(`/Warranty/getBySerialNumber/${serialNumber}`),

  getByImei: async (
    imei: string
  ): Promise<ApiResponse<WarrantyRecordResponse>> =>
    apiCall(`/Warranty/getByImei/${imei}`),

  delete: async (id: string): Promise<ApiResponse<string>> =>
    apiCall(`/Warranty/delete/${id}`, { method: "DELETE" }),
};
