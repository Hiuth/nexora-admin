import { AuthManager } from "./auth";
import { buildApiUrl } from "./api-config";

// API interceptor đơn giản với refresh token
export class ApiInterceptor {
  // Wrapper cho fetch với auth header
  static async fetchWithAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = AuthManager.getToken();

    if (!token) {
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

    // Nếu 401 Unauthorized, thử refresh token
    if (response.status === 401) {
      try {
        const newToken = await AuthManager.refreshToken();
        if (newToken) {
          // Retry với token mới
          headers.set("Authorization", `Bearer ${newToken}`);
          return fetch(url, {
            ...options,
            headers,
          });
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }

      // Nếu refresh thất bại, redirect to login
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
