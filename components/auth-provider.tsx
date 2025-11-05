"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthManager } from "@/lib/auth";
import { buildApiUrl, API_CONFIG } from "@/lib/api-config";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status
  const checkAuth = async () => {
    const accessToken = AuthManager.getAccessToken();
    const refreshToken = AuthManager.getRefreshToken();

    // Nếu không có cả 2 token, redirect to login
    if (!accessToken && !refreshToken) {
      router.push("/login");
      return;
    }

    // Sử dụng ensureValidToken để proactively refresh
    try {
      const validToken = await AuthManager.ensureValidToken();
      if (!validToken) {
        AuthManager.removeToken();
        router.push("/login");
      }
    } catch (error) {
      console.error("❌ Auth check failed:", error);
      AuthManager.removeToken();
      router.push("/login");
    }
  };

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/login") {
      return;
    }

    // Check auth on mount với delay nhỏ
    const timer = setTimeout(async () => {
      await checkAuth();
    }, 100);

    // Set up interval to check token expiry every 5 minutes
    const interval = setInterval(async () => {
      await checkAuth();
    }, 300000); // 5 phút

    // Cleanup interval on unmount
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [pathname, router]);

  return <>{children}</>;
}

// Hook to use authentication context
export function useAuth() {
  const router = useRouter();

  const login = (accessToken: string, refreshToken: string) => {
    // Lưu cả 2 token
    AuthManager.saveTokens(accessToken, refreshToken);
    router.push("/");
  };

  const logout = async () => {
    try {
      // Call logout API với access token hiện tại
      const token = AuthManager.getAccessToken();
      if (token) {
        await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGOUT), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      AuthManager.removeToken();
      router.push("/login");
    }
  };

  const isAuthenticated = () => {
    return AuthManager.isAuthenticated();
  };

  const getUser = () => {
    return AuthManager.getUserFromToken();
  };

  const getToken = () => {
    return AuthManager.getAccessToken();
  };

  return {
    login,
    logout,
    isAuthenticated,
    getUser,
    getToken,
  };
}
