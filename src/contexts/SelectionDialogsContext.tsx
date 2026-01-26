import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import {
  getStoredProfileData,
  getAnonymousPreferences,
  updateAnonymousPreferences,
  updateStoredProfileData,
} from "@/lib/profileStorage";
import { useAuth } from "./AuthContext";

interface SelectionDialogsContextType {
  languageDialogOpen: boolean;
  setLanguageDialogOpen: (open: boolean) => void;
  currencyDialogOpen: boolean;
  setCurrencyDialogOpen: (open: boolean) => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  updateCurrency: (currency: string) => void;
}

const SelectionDialogsContext = createContext<SelectionDialogsContextType | undefined>(undefined);

export function SelectionDialogsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
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
    if (isAuthenticated) {
      // Update logged-in user's profile data in session storage
      updateStoredProfileData({ currency });
    } else {
      // Update anonymous user's preferences
      updateAnonymousPreferences({ currency });
    }
  }, [isAuthenticated]);

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
