import { AuthManager } from "@/lib/auth";

// Hook để lấy user info từ token
export function useUser() {
  const user = AuthManager.getUserFromToken();

  return {
    user,
    isLoggedIn: !!user,
    getUserName: () => user?.name || user?.userName || user?.sub || "User",
    getUserEmail: () => user?.email || "user@example.com",
    getUserAvatar: () => user?.avatar || user?.picture || "",
    getUserId: () => user?.id || user?.sub || user?.userId,
    getUserRole: () => user?.role || user?.roles || "user",
  };
}
