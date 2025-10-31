import { AuthManager } from "@/lib/auth";
import { useState, useEffect } from "react";

// Hook để lấy user info từ token
export function useUser() {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Chỉ get user khi đã mount trên client
    const userData = AuthManager.getUserFromToken();
    setUser(userData);
  }, []);

  // Fallback values được định nghĩa cố định để tránh hydration mismatch
  const fallbackName = "Admin";
  const fallbackEmail = "admin@nexora.com";

  return {
    user,
    isLoggedIn: !!user,
    getUserName: () => {
      if (!isClient) return fallbackName;
      return user?.name || user?.userName || user?.sub || fallbackName;
    },
    getUserEmail: () => {
      if (!isClient) return fallbackEmail;
      return user?.email || fallbackEmail;
    },
    getUserAvatar: () => {
      if (!isClient) return "";
      return user?.avatar || user?.picture || "";
    },
    getUserId: () => {
      if (!isClient) return "";
      return user?.id || user?.sub || user?.userId;
    },
    getUserRole: () => {
      if (!isClient) return "admin";
      return user?.role || user?.roles || "admin";
    },
  };
}
