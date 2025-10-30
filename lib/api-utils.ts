import { ApiResponse } from "../types/api";

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
    ACTIVE: "text-green-600 bg-green-100",
    INACTIVE: "text-red-600 bg-red-100",
    OUT_OF_STOCK: "text-orange-600 bg-orange-100",
    PENDING: "text-yellow-600 bg-yellow-100",
    CONFIRMED: "text-blue-600 bg-blue-100",
    PROCESSING: "text-purple-600 bg-purple-100",
    SHIPPED: "text-indigo-600 bg-indigo-100",
    DELIVERED: "text-green-600 bg-green-100",
    CANCELLED: "text-red-600 bg-red-100",
    EXPIRED: "text-red-600 bg-red-100",
    CLAIMED: "text-orange-600 bg-orange-100",
    DRAFT: "text-gray-600 bg-gray-100",
  };

  return statusColors[status] || "text-gray-600 bg-gray-100";
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
  };

  return statusTexts[status] || status;
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
