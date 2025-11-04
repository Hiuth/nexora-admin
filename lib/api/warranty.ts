import { ApiResponse, WarrantyRecordResponse } from "@/types";
import { apiCall } from "./base";
import { API_CONFIG } from "../api-config";

export const warrantyRecordService = {
  create: async (
    productId: string,
    orderId: string,
    productUnitId: string
  ): Promise<ApiResponse<WarrantyRecordResponse>> => {
    const formData = new FormData();
    return apiCall(
      `${API_CONFIG.ENDPOINTS.WARRANTY_RECORD.CREATE}/${productId}/${orderId}/${productUnitId}`,
      {
        method: "POST",
        body: formData,
      }
    );
  },

  update: async (
    warrantyPeriodId: string,
    status: string
  ): Promise<ApiResponse<WarrantyRecordResponse>> => {
    const formData = new FormData();
    formData.append("status", status);
    return apiCall(
      `${API_CONFIG.ENDPOINTS.WARRANTY_RECORD.UPDATE}/${warrantyPeriodId}`,
      {
        method: "PUT",
        body: formData,
      }
    );
  },

  getByProductId: async (
    productId: string
  ): Promise<ApiResponse<WarrantyRecordResponse[]>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.WARRANTY_RECORD.GET_BY_PRODUCT_ID}/${productId}`
    ),

  getByOrderId: async (
    orderId: string
  ): Promise<ApiResponse<WarrantyRecordResponse[]>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.WARRANTY_RECORD.GET_BY_ORDER_ID}/${orderId}`
    ),

  getByStatus: async (
    status: string
  ): Promise<ApiResponse<WarrantyRecordResponse[]>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.WARRANTY_RECORD.GET_BY_STATUS}/${status}`),

  getBySerialNumber: async (
    serialNumber: string
  ): Promise<ApiResponse<WarrantyRecordResponse>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.WARRANTY_RECORD.GET_BY_SERIAL_NUMBER}/${serialNumber}`
    ),

  getByImei: async (
    imei: string
  ): Promise<ApiResponse<WarrantyRecordResponse>> =>
    apiCall(`${API_CONFIG.ENDPOINTS.WARRANTY_RECORD.GET_BY_IMEI}/${imei}`),

  delete: async (warrantyPeriodId: string): Promise<ApiResponse<string>> =>
    apiCall(
      `${API_CONFIG.ENDPOINTS.WARRANTY_RECORD.DELETE}/${warrantyPeriodId}`,
      {
        method: "DELETE",
      }
    ),
};
