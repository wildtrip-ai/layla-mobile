import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  AuthUser,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
  clearAuthData,
  fetchCurrentUser,
  fetchUserProfile,
  updateUserProfile,
} from "@/lib/auth";
import {
  setStoredProfileData,
  clearStoredProfileData,
  getStoredProfileData,
  getAnonymousPreferences,
  clearAnonymousPreferences,
} from "@/lib/profileStorage";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isProfileLoading: boolean;
  login: (accessToken: string, user: AuthUser) => void;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Fetch and store profile data
  const fetchAndStoreProfile = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      setIsProfileLoading(true);
      const profile = await fetchUserProfile(token);

      // Store relevant profile data in session storage
      setStoredProfileData({
        language: profile.language,
        currency: profile.currency,
        profile_photo_url: profile.profile_photo_url || undefined,
        first_name: profile.user_id, // We'll update this if we have the user data
        last_name: profile.user_id, // We'll update this if we have the user data
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        setUser(storedUser);

        // Check if we already have profile data in session storage
        const storedProfile = getStoredProfileData();
        if (!storedProfile) {
          // Fetch profile data if not already in session storage
          await fetchAndStoreProfile();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [fetchAndStoreProfile]);

  const login = useCallback((accessToken: string, userData: AuthUser) => {
    setStoredToken(accessToken);
    setStoredUser(userData);
    setUser(userData);

    // Fetch and store profile data after login (in background)
    (async () => {
      try {
        setIsProfileLoading(true);
        const profile = await fetchUserProfile(accessToken);

        // Check for anonymous preferences and migrate them
        const anonPreferences = getAnonymousPreferences();
        if (anonPreferences) {
          const updates: { language?: string; currency?: string } = {};

          // Compare anonymous preferences with profile
          if (anonPreferences.language && anonPreferences.language !== profile.language) {
            updates.language = anonPreferences.language;
          }
          if (anonPreferences.currency && anonPreferences.currency !== profile.currency) {
            updates.currency = anonPreferences.currency;
          }

          // Update profile if there are mismatches
          if (Object.keys(updates).length > 0) {
            try {
              const updatedProfile = await updateUserProfile(accessToken, updates);
              // Store the updated profile data
              setStoredProfileData({
                language: updatedProfile.language,
                currency: updatedProfile.currency,
                profile_photo_url: updatedProfile.profile_photo_url || undefined,
                first_name: userData.first_name,
                last_name: userData.last_name || undefined,
              });
            } catch (error) {
              console.error("Failed to migrate anonymous preferences:", error);
              // Fall back to storing the original profile data
              setStoredProfileData({
                language: profile.language,
                currency: profile.currency,
                profile_photo_url: profile.profile_photo_url || undefined,
                first_name: userData.first_name,
                last_name: userData.last_name || undefined,
              });
            }
          } else {
            // No updates needed, store the original profile data
            setStoredProfileData({
              language: profile.language,
              currency: profile.currency,
              profile_photo_url: profile.profile_photo_url || undefined,
              first_name: userData.first_name,
              last_name: userData.last_name || undefined,
            });
          }

          // Clear anonymous preferences after migration attempt
          clearAnonymousPreferences();
        } else {
          // No anonymous preferences, just store the profile data
          setStoredProfileData({
            language: profile.language,
            currency: profile.currency,
            profile_photo_url: profile.profile_photo_url || undefined,
            first_name: userData.first_name,
            last_name: userData.last_name || undefined,
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile on login:", error);
      } finally {
        setIsProfileLoading(false);
      }
    })();
  }, []);

  const logout = useCallback(() => {
    clearAuthData();
    clearStoredProfileData();
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
        isProfileLoading,
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
