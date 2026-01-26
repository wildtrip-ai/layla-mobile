import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import {
  getStoredProfileData,
  getAnonymousPreferences,
  updateAnonymousPreferences,
  updateLanguageOrCurrencyInStorage,
} from "@/lib/profileStorage";
import { getStoredToken } from "@/lib/auth";
import { useAuth } from "./AuthContext";

interface SelectionDialogsContextType {
  languageDialogOpen: boolean;
  setLanguageDialogOpen: (open: boolean) => void;
  currencyDialogOpen: boolean;
  setCurrencyDialogOpen: (open: boolean) => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  updateCurrency: (currency: string) => void;
  updateCurrencyWithAuth: (currency: string, onSuccess?: () => void, onError?: (error: Error) => void) => Promise<void>;
  updateLanguageWithAuth: (language: string, onSuccess?: () => void, onError?: (error: Error) => void) => Promise<void>;
}

const SelectionDialogsContext = createContext<SelectionDialogsContextType | undefined>(undefined);

export function SelectionDialogsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, refreshUserProfile } = useAuth();
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [currencyDialogOpen, setCurrencyDialogOpen] = useState(false);

  // Initialize currency from session storage
  const getInitialCurrency = useCallback(() => {
    // Try to get from logged-in user profile first
    const profileData = getStoredProfileData();
    if (profileData?.currency) {
      return profileData.currency;
    }

    // Fall back to anonymous preferences
    const anonPrefs = getAnonymousPreferences();
    if (anonPrefs?.currency) {
      return anonPrefs.currency;
    }

    // Default to USD
    return "usd";
  }, []);

  const [selectedCurrency, setSelectedCurrency] = useState(getInitialCurrency);

  // Update currency in session storage when it changes
  const updateCurrency = useCallback((currency: string) => {
    setSelectedCurrency(currency);

    // Update session storage based on authentication status
    updateLanguageOrCurrencyInStorage({ currency }, isAuthenticated);
  }, [isAuthenticated]);

  // Unified currency update for authenticated users
  const updateCurrencyWithAuth = useCallback(
    async (currency: string, onSuccess?: () => void, onError?: (error: Error) => void) => {
      const token = getStoredToken();
      if (!token || !isAuthenticated) {
        // For anonymous users, just update local state and storage
        updateCurrency(currency);
        onSuccess?.();
        return;
      }

      try {
        // Import here to avoid circular dependencies
        const { updateLanguageOrCurrency } = await import("@/lib/auth");

        // Update on the server and get the response
        await updateLanguageOrCurrency(
          token,
          { currency },
          (updatedProfile) => {
            // Update local state
            setSelectedCurrency(currency);

            // Update session storage
            updateLanguageOrCurrencyInStorage({ currency }, true);

            // Refresh user profile to sync all data
            refreshUserProfile();

            // Call success callback
            onSuccess?.();
          },
          (error) => {
            // Call error callback
            onError?.(error);
          }
        );
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Failed to update currency");
        onError?.(err);
        throw err;
      }
    },
    [isAuthenticated, updateCurrency, refreshUserProfile]
  );

  // Unified language update for authenticated users
  const updateLanguageWithAuth = useCallback(
    async (language: string, onSuccess?: () => void, onError?: (error: Error) => void) => {
      const token = getStoredToken();
      if (!token || !isAuthenticated) {
        // For anonymous users, just update storage
        updateLanguageOrCurrencyInStorage({ language }, false);
        onSuccess?.();
        return;
      }

      try {
        // Import here to avoid circular dependencies
        const { updateLanguageOrCurrency } = await import("@/lib/auth");

        // Update on the server
        await updateLanguageOrCurrency(
          token,
          { language },
          (updatedProfile) => {
            // Update session storage
            updateLanguageOrCurrencyInStorage({ language }, true);

            // Refresh user profile to sync all data
            refreshUserProfile();

            // Call success callback
            onSuccess?.();
          },
          (error) => {
            // Call error callback
            onError?.(error);
          }
        );
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Failed to update language");
        onError?.(err);
        throw err;
      }
    },
    [isAuthenticated, refreshUserProfile]
  );

  // Sync currency from session storage when profile loads or changes
  useEffect(() => {
    const profileData = getStoredProfileData();
    if (profileData?.currency && profileData.currency !== selectedCurrency) {
      setSelectedCurrency(profileData.currency);
    }
  }, [selectedCurrency]);

  return (
    <SelectionDialogsContext.Provider
      value={{
        languageDialogOpen,
        setLanguageDialogOpen,
        currencyDialogOpen,
        setCurrencyDialogOpen,
        selectedCurrency,
        setSelectedCurrency,
        updateCurrency,
        updateCurrencyWithAuth,
        updateLanguageWithAuth,
      }}
    >
      {children}
    </SelectionDialogsContext.Provider>
  );
}

export function useSelectionDialogs() {
  const context = useContext(SelectionDialogsContext);
  if (!context) {
    throw new Error("useSelectionDialogs must be used within SelectionDialogsProvider");
  }
  return context;
}
