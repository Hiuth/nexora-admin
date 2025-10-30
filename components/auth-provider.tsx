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

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/login") {
      return;
    }

    // Check authentication status
    const checkAuth = () => {
      const token = AuthManager.getToken();

      if (!token) {
        router.push("/login");
        return;
      }

      // Check if token is expired
      if (AuthManager.isTokenExpired(token)) {
        AuthManager.removeToken();
        router.push("/login");
        return;
      }
    };

    // Check auth on mount
    checkAuth();

    // Set up interval to check token expiry every minute
    const interval = setInterval(() => {
      AuthManager.checkTokenExpiry();
    }, 60000); // Check every minute

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [pathname, router]);

  return <>{children}</>;
}

// Hook to use authentication context
export function useAuth() {
  const router = useRouter();

  const login = (token: string) => {
    // Chỉ lưu token, không decode user info
    AuthManager.saveToken(token);
    router.push("/");
  };

  const logout = async () => {
    try {
      // Call logout API
      await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGOUT), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AuthManager.getToken()}`,
        },
      });
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
    return AuthManager.getToken();
  };

  return {
    login,
    logout,
    isAuthenticated,
    getUser,
    getToken,
  };
}
