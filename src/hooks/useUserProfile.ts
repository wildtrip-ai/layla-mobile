import { useState, useEffect, useCallback } from "react";
import { fetchUserProfile, getStoredToken, UserProfile } from "@/lib/auth";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await fetchUserProfile(token);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user profile");
      console.error("Failed to fetch user profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { profile, isLoading, error, refetch: loadProfile };
}
