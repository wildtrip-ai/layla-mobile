import { getStoredToken, clearAuthData } from "./auth";
import { clearStoredProfileData } from "./profileStorage";

// Event emitter for auth events
type AuthEventCallback = () => void;
const authEventListeners: AuthEventCallback[] = [];

export function onUnauthorized(callback: AuthEventCallback): () => void {
  authEventListeners.push(callback);
  return () => {
    const index = authEventListeners.indexOf(callback);
    if (index > -1) {
      authEventListeners.splice(index, 1);
    }
  };
}

function emitUnauthorized() {
  authEventListeners.forEach((callback) => callback());
}

export function handleUnauthorizedResponse() {
  // Clear all auth data
  clearAuthData();
  clearStoredProfileData();
  // Emit event for React components to handle
  emitUnauthorized();
}

interface FetchOptions extends RequestInit {
  skipAuthCheck?: boolean;
}

/**
 * Authenticated fetch wrapper that handles 401 responses
 * Automatically adds Authorization header and handles token expiration
 */
export async function authenticatedFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { skipAuthCheck, ...fetchOptions } = options;
  const token = getStoredToken();

  // Add authorization header if token exists
  const headers: HeadersInit = {
    ...fetchOptions.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401 && !skipAuthCheck) {
    handleUnauthorizedResponse();
    throw new Error("Session expired. Please sign in again.");
  }

  return response;
}

/**
 * Helper for JSON API calls with authentication
 */
export async function apiRequest<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await authenticatedFetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
