import { AuthManager } from "./auth";
import { TokenManager } from "./token-manager";
import { buildApiUrl } from "./api-config";

// API interceptor đơn giản với refresh token
export class ApiInterceptor {
  // Wrapper cho fetch với auth header và auto token refresh
  static async fetchWithAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    // TẠAM THỜI DISABLE TOKEN MANAGER ĐỂ DEBUG
    const token = AuthManager.getAccessToken();

    // // Đảm bảo có token hợp lệ trước khi gọi API
    // const token = await TokenManager.ensureValidToken();

    if (!token) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Authentication required");
    }

    // Thêm Authorization header
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${token}`);

    // Gọi API với token
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Nếu vẫn 401 sau khi đã refresh, logout
    if (response.status === 401) {
      console.error("API returned 401 even after token refresh");
      AuthManager.removeToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Authentication failed");
    }

    return response;
  }

  // Helper method để gọi API với JSON response
  static async fetchJsonWithAuth<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await this.fetchWithAuth(url, options);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

// Simple API client
export const apiClient = {
  get: <T = any>(endpoint: string) =>
    ApiInterceptor.fetchJsonWithAuth<T>(endpoint, { method: "GET" }),

  post: <T = any>(endpoint: string, data?: any) =>
    ApiInterceptor.fetchJsonWithAuth<T>(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : undefined,
    }),

  postFormData: <T = any>(endpoint: string, formData: FormData) =>
    ApiInterceptor.fetchJsonWithAuth<T>(endpoint, {
      method: "POST",
      body: formData,
    }),

  put: <T = any>(endpoint: string, data?: any) =>
    ApiInterceptor.fetchJsonWithAuth<T>(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : undefined,
    }),

  putFormData: <T = any>(endpoint: string, formData: FormData) =>
    ApiInterceptor.fetchJsonWithAuth<T>(endpoint, {
      method: "PUT",
      body: formData,
    }),

  delete: <T = any>(endpoint: string) =>
    ApiInterceptor.fetchJsonWithAuth<T>(endpoint, { method: "DELETE" }),
};
