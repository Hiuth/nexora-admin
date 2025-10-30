import { jwtDecode } from "jwt-decode";
import { API_CONFIG, buildApiUrl } from "./api-config";

// Auth utilities and token management
export class AuthManager {
  private static readonly TOKEN_KEY = "nexora_admin_token";

  // Save token to localStorage
  static saveToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  // Get token from localStorage
  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  // Remove token from localStorage
  static removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Decode JWT token to get user info (without storing)
  static getUserFromToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Token decode error:", error);
      return null;
    }
  }

  // Decode JWT token (basic decode without verification)
  static decodeToken(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }

  // Auto logout when token expires
  static checkTokenExpiry(): void {
    const token = this.getToken();
    if (token && this.isTokenExpired(token)) {
      this.removeToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }
}

// Auth API functions
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  result?: string; // JWT token
}

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const formData = new FormData();
    formData.append("email", credentials.email);
    formData.append("password", credentials.password);

    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data;
  },

  logout: async (): Promise<void> => {
    const token = AuthManager.getToken();
    if (!token) return;

    try {
      await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGOUT), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      AuthManager.removeToken();
    }
  },

  sendOtpForgotPassword: async (): Promise<any> => {
    const token = AuthManager.getToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(
      buildApiUrl(API_CONFIG.ENDPOINTS.SEND_OTP_FORGOT_PASSWORD),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.json();
  },

  resetPassword: async (otp: string, newPassword: string): Promise<any> => {
    const token = AuthManager.getToken();
    if (!token) throw new Error("Not authenticated");

    const formData = new FormData();
    formData.append("otp", otp);
    formData.append("newPassword", newPassword);

    const response = await fetch(
      buildApiUrl(API_CONFIG.ENDPOINTS.RESET_PASSWORD),
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    return response.json();
  },
};
