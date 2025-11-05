import { AuthManager } from "./auth";

// Token manager để tự động refresh token
export class TokenManager {
  private static refreshPromise: Promise<string | null> | null = null;

  // Đảm bảo có token hợp lệ trước khi gọi API
  static async ensureValidToken(): Promise<string | null> {
    const accessToken = AuthManager.getAccessToken();

    if (!accessToken) {
      return null;
    }

    // Kiểm tra token có sắp hết hạn không (còn 5 phút)
    if (this.isTokenNearExpiry(accessToken)) {
      // Nếu đã có process refresh đang chạy, chờ nó
      if (this.refreshPromise) {
        return this.refreshPromise;
      }

      // Bắt đầu refresh token
      this.refreshPromise = this.performTokenRefresh();
      const newToken = await this.refreshPromise;
      this.refreshPromise = null;

      return newToken;
    }

    return accessToken;
  }

  // Kiểm tra token có sắp hết hạn không (trong 5 phút tới)
  private static isTokenNearExpiry(token: string): boolean {
    const decoded = AuthManager.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - currentTime;

    // Refresh nếu token hết hạn trong 5 phút (300 giây)
    return timeUntilExpiry < 300;
  }

  // Thực hiện refresh token
  private static async performTokenRefresh(): Promise<string | null> {
    try {
      const newToken = await AuthManager.refreshToken();
      if (newToken) {
        return newToken;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    }
  }

  // Setup auto-refresh timer (tùy chọn)
  static setupAutoRefresh(): void {
    if (typeof window === "undefined") return;

    // Kiểm tra token mỗi 2 phút
    const interval = setInterval(async () => {
      if (AuthManager.isAuthenticated()) {
        await this.ensureValidToken();
      } else {
        // Không còn authenticated thì clear interval
        clearInterval(interval);
      }
    }, 120000); // 2 phút

    // Cleanup khi unload page
    window.addEventListener("beforeunload", () => {
      clearInterval(interval);
    });
  }
}

// Setup auto-refresh khi module được load
// TẠAM THỜI DISABLE ĐỂ DEBUG
// if (typeof window !== "undefined") {
//   TokenManager.setupAutoRefresh();
// }
