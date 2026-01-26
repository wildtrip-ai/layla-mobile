import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  AuthUser,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
  clearAuthData,
  fetchCurrentUser,
} from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, user: AuthUser) => void;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    
    if (token && storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((accessToken: string, userData: AuthUser) => {
    setStoredToken(accessToken);
    setStoredUser(userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    clearAuthData();
    setUser(null);
  }, []);

  const refreshUserProfile = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      const profile = await fetchCurrentUser(token);
      const currentUser = getStoredUser();
      if (currentUser) {
        const updatedUser: AuthUser = {
          ...currentUser,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          default_account_id: profile.default_account_id,
        };
        setStoredUser(updatedUser);
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Failed to refresh user profile:", error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
