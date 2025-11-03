import { ApiResponse } from "@/types";
import { API_CONFIG } from "../api-config";
import { AuthManager } from "../auth";

// Generic API call function
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = AuthManager.getToken();

  // Prepare headers
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only add Content-Type if not FormData (browser will set it automatically for FormData)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Add authorization token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    let response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // If 401 and we have a token, try to refresh
    if (response.status === 401 && token) {
      try {
        const newToken = await AuthManager.refreshToken();
        if (newToken) {
          // Retry with new token
          headers["Authorization"] = `Bearer ${newToken}`;
          response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            ...options,
            headers,
          });
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Let the original 401 response through
      }
    }

    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        console.error(`API Error Details for ${endpoint}:`, errorData);
      } catch (parseError) {
        console.error(`Failed to parse error response for ${endpoint}`);
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}
