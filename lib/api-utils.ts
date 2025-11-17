import { ApiResponse } from "@/types/api";
import { apiClient } from "./api-interceptor";

// Utility functions for handling API responses and data transformation

export const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (response.code !== 1000) {
    throw new Error(response.message || "API Error");
  }

  if (!response.result) {
    throw new Error("No data returned from API");
  }

  return response.result;
};

// Enhanced API call with auto refresh token
export const callApiWithAuth = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const response = await apiClient.get<ApiResponse<T>>(endpoint);
  return handleApiResponse(response);
};

// API call with FormData and auto refresh token
export const callApiWithFormData = async <T>(
  endpoint: string,
  formData: FormData,
  method: "POST" | "PUT" | "PATCH" = "POST"
): Promise<T> => {
  let response: ApiResponse<T>;

  if (method === "POST") {
    response = await apiClient.postFormData<ApiResponse<T>>(endpoint, formData);
  } else {
    response = await apiClient.putFormData<ApiResponse<T>>(endpoint, formData);
  }

  return handleApiResponse(response);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

export const formatDateOnly = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-500 text-white",
    INACTIVE: "bg-red-500 text-white",
    OUT_OF_STOCK: "bg-orange-500 text-white",
    PENDING: "bg-yellow-500 text-white",
    CONFIRMED: "bg-blue-500 text-white",
    PROCESSING: "bg-purple-500 text-white",
    SHIPPED: "bg-indigo-500 text-white",
    DELIVERED: "bg-green-500 text-white",
    CANCELLED: "bg-red-500 text-white",
    EXPIRED: "bg-red-500 text-white",
    CLAIMED: "bg-orange-500 text-white",
    DRAFT: "bg-gray-500 text-white",
    // Product Unit statuses
    AVAILABLE: "bg-green-500 text-white",
    SOLD: "bg-red-500 text-white",
    WARRANTY: "bg-blue-500 text-white",
    RESERVED: "bg-yellow-500 text-white",
    DAMAGED: "bg-gray-500 text-white",
  };

  return statusColors[status.toUpperCase()] || "bg-gray-500 text-white";
};

export const getStatusText = (status: string): string => {
  const statusTexts: Record<string, string> = {
    ACTIVE: "Hoạt động",
    INACTIVE: "Không hoạt động",
    OUT_OF_STOCK: "Hết hàng",
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPED: "Đã gửi",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
    EXPIRED: "Đã hết hạn",
    CLAIMED: "Đã sử dụng",
    DRAFT: "Bản nháp",
    // Product Unit statuses
    AVAILABLE: "Có sẵn",
    SOLD: "Đã bán",
    WARRANTY: "Đang bảo hành",
    RESERVED: "Đã đặt",
    DAMAGED: "Hỏng",
  };

  return statusTexts[status.toUpperCase()] || status;
};

export const transformApiData = <T>(data: T[]): T[] => {
  return data.map((item) => ({
    ...item,
    // Transform dates from string to Date objects if needed
    ...(typeof item === "object" &&
      item !== null &&
      "createdAt" in item && { createdAt: new Date(item.createdAt as string) }),
    ...(typeof item === "object" &&
      item !== null &&
      "orderDate" in item && { orderDate: new Date(item.orderDate as string) }),
    ...(typeof item === "object" &&
      item !== null &&
      "startDate" in item && { startDate: new Date(item.startDate as string) }),
    ...(typeof item === "object" &&
      item !== null &&
      "endDate" in item && { endDate: new Date(item.endDate as string) }),
  }));
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
  return phoneRegex.test(phone);
};
