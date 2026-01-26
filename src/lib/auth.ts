const API_BASE = "https://internal-api.emiratesescape.com/v1.0";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string | null;
  default_account_id: string;
}

interface ConfirmMagicLinkResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
    team_member_status: string | null;
  };
}

interface FetchCurrentUserResponse {
  email: string;
  first_name: string;
  last_name: string | null;
  default_account_id: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  profile_photo_url: string | null;
  profile_photo_thumbnail_url: string | null;
  language: string;
  currency: string;
  timezone: string;
  bio: string | null;
  phone: string | null;
  date_of_birth: string | null;
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_notifications: boolean;
  trip_reminders: boolean;
  subscription_tier: string;
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

interface GoogleAuthURLResponse {
  authorization_url: string;
}

interface GoogleCallbackResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export async function confirmMagicLink(
  email: string,
  token: string
): Promise<ConfirmMagicLinkResponse> {
  const response = await fetch(`${API_BASE}/signin/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, token }),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Invalid or expired magic link");
    }
    throw new Error("Failed to confirm magic link");
  }

  return response.json();
}

export async function fetchCurrentUser(
  accessToken: string
): Promise<FetchCurrentUserResponse> {
  const response = await fetch(`${API_BASE}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
}

export async function fetchUserProfile(
  accessToken: string
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE}/users/me/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
}

export async function updateUserName(
  accessToken: string,
  data: { first_name?: string; last_name?: string }
): Promise<FetchCurrentUserResponse> {
  const response = await fetch(`${API_BASE}/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update user name");
  }

  return response.json();
}

// Google OAuth functions
export async function getGoogleAuthUrl(): Promise<string> {
  const response = await fetch(`${API_BASE}/auth/google/authorize`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get Google authorization URL");
  }

  const data: GoogleAuthURLResponse = await response.json();
  return data.authorization_url;
}

export async function handleGoogleCallback(
  code: string,
  state?: string | null
): Promise<GoogleCallbackResponse> {
  const response = await fetch(`${API_BASE}/auth/google/callback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      ...(state && { state })
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Google authentication failed. Please try again.");
    }
    throw new Error("Failed to complete Google sign-in");
  }

  return response.json();
}

// Token management
export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// User management
export function getStoredUser(): AuthUser | null {
  const userJson = localStorage.getItem(AUTH_USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  localStorage.removeItem(AUTH_USER_KEY);
}

// Clear all auth data
export function clearAuthData(): void {
  removeStoredToken();
  removeStoredUser();
}
