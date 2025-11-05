import { jwtDecode } from "jwt-decode";
import { API_CONFIG, buildApiUrl } from "./api-config";

// Auth utilities and token management
export class AuthManager {
  private static readonly ACCESS_TOKEN_KEY = "nexora_admin_access_token";
  private static readonly REFRESH_TOKEN_KEY = "nexora_admin_refresh_token";
  private static refreshPromise: Promise<string | null> | null = null;

  // Configuration for refresh timing
  private static readonly REFRESH_BEFORE_EXPIRY_MINUTES = 5; // Refresh 5 minutes before expiry (thay vì 10)
  private static readonly CHECK_INTERVAL_MINUTES = 5; // Check every 5 minutes (thay vì 1 minute)

  // Save access token to localStorage
  static saveAccessToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }
  }

  // Save refresh token to localStorage
  static saveRefreshToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  // Save both tokens at once
  static saveTokens(accessToken: string, refreshToken: string): void {
    this.saveAccessToken(accessToken);
    this.saveRefreshToken(refreshToken);
  }

  // Get access token from localStorage
  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  // Get access token (alias for getToken)
  static getAccessToken(): string | null {
    return this.getToken();
  }

  // Get refresh token from localStorage
  static getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  // Remove all tokens from localStorage
  static removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  // Check if user is authenticated with valid access token
  static isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      return false;
    }

    // Kiểm tra xem token có hết hạn không
    if (this.isTokenExpired(accessToken)) {
      // Có refresh token thì có thể refresh
      return !!this.getRefreshToken();
    }

    return true;
  }

  // Decode JWT token to get user info (without storing)
  static getUserFromToken(): any {
    const token = this.getAccessToken();
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
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }

      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error checking token expiry:", error);
      return true;
    }
  }

  // Check if token will expire soon (within specified minutes)
  static isTokenNearExpiry(
    token: string,
    minutesBeforeExpiry: number = 5
  ): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }

      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = decoded.exp - currentTime;
      const thresholdSeconds = minutesBeforeExpiry * 60;

      return timeUntilExpiry < thresholdSeconds;
    } catch (error) {
      console.error("Error checking token near expiry:", error);
      return true;
    }
  }

  // Get time until token expires (in seconds)
  static getTokenTimeUntilExpiry(token: string): number {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return 0;
      }

      const currentTime = Date.now() / 1000;
      return Math.max(0, decoded.exp - currentTime);
    } catch (error) {
      return 0;
    }
  }

  // Get token status for debugging
  static getTokenStatus(): {
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    accessTokenExpiry: Date | null;
    refreshTokenExpiry: Date | null;
    timeUntilAccessExpiry: number;
    timeUntilRefreshExpiry: number;
    shouldRefreshSoon: boolean;
  } {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    const accessDecoded = accessToken ? this.decodeToken(accessToken) : null;
    const refreshDecoded = refreshToken ? this.decodeToken(refreshToken) : null;

    const accessExpiry = accessDecoded?.exp
      ? new Date(accessDecoded.exp * 1000)
      : null;
    const refreshExpiry = refreshDecoded?.exp
      ? new Date(refreshDecoded.exp * 1000)
      : null;

    const timeUntilAccessExpiry = accessToken
      ? this.getTokenTimeUntilExpiry(accessToken)
      : 0;
    const timeUntilRefreshExpiry = refreshToken
      ? this.getTokenTimeUntilExpiry(refreshToken)
      : 0;

    const shouldRefreshSoon = accessToken
      ? this.isTokenNearExpiry(accessToken, this.REFRESH_BEFORE_EXPIRY_MINUTES)
      : false;

    return {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accessTokenExpiry: accessExpiry,
      refreshTokenExpiry: refreshExpiry,
      timeUntilAccessExpiry,
      timeUntilRefreshExpiry,
      shouldRefreshSoon,
    };
  }

  // Auto logout when token expires
  static checkTokenExpiry(): void {
    const token = this.getAccessToken();
    if (token && this.isTokenExpired(token)) {
      this.removeToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  // Ensure we have a valid access token (refresh if needed)
  static async ensureValidToken(): Promise<string | null> {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      return null;
    }

    const timeUntilExpiry = this.getTokenTimeUntilExpiry(accessToken);

    // Refresh sớm hơn: Sử dụng config thay vì hardcode
    if (
      !this.isTokenNearExpiry(accessToken, this.REFRESH_BEFORE_EXPIRY_MINUTES)
    ) {
      return accessToken;
    }

    // Nếu đã có refresh process đang chạy, chờ nó
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Bắt đầu refresh process
    this.refreshPromise = this.performRefresh();

    try {
      const newToken = await this.refreshPromise;
      this.refreshPromise = null;
      return newToken;
    } catch (error) {
      this.refreshPromise = null;
      console.error("❌ Refresh failed:", error);
      throw error;
    }
  }

  // Perform the actual refresh operation
  private static async performRefresh(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.removeToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return null;
    }

    try {
      const response = await authAPI.refreshToken(refreshToken);

      if (response.code === 1000 && response.result) {
        // Lưu cả 2 token mới
        this.saveTokens(
          response.result.accessToken,
          response.result.refreshToken
        );
        return response.result.accessToken;
      } else {
        // Refresh thất bại, logout
        console.error("❌ Refresh token failed:", response.message);
        this.removeToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return null;
      }
    } catch (error) {
      console.error("❌ Refresh token API error:", error);
      this.removeToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return null;
    }
  }

  // Refresh token using refresh token (legacy method, use ensureValidToken instead)
  static async refreshToken(): Promise<string | null> {
    return this.ensureValidToken();
  }

  // Force refresh token immediately (for manual refresh)
  static async forceRefreshToken(): Promise<string | null> {
    // Clear existing refresh promise to force new refresh
    this.refreshPromise = null;

    // Start fresh refresh process
    this.refreshPromise = this.performRefresh();

    try {
      const newToken = await this.refreshPromise;
      this.refreshPromise = null;
      return newToken;
    } catch (error) {
      this.refreshPromise = null;
      console.error("❌ Force refresh failed:", error);
      throw error;
    }
  }
}

// Auth API functions
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  result?: LoginResponseData;
}

export interface RefreshTokenResponse {
  code: number;
  message: string;
  result?: LoginResponseData;
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
    const token = AuthManager.getAccessToken();
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

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const formData = new FormData();
    formData.append("refreshToken", refreshToken);

    const response = await fetch(
      buildApiUrl(API_CONFIG.ENDPOINTS.REFRESH_TOKEN),
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data;
  },

  sendOtpForgotPassword: async (): Promise<any> => {
    const token = AuthManager.getAccessToken();
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
    const token = AuthManager.getAccessToken();
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
