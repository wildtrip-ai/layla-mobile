import { createContext, useContext, useMemo, ReactNode, useEffect, useCallback, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getStoredProfileData, getAnonymousPreferences } from "@/lib/profileStorage";
import { useAuth } from "@/contexts/AuthContext";

// Supported languages
export const SUPPORTED_LANGUAGES = ["en", "uk", "de", "es", "fr", "it", "pt", "ja", "zh"] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

interface LanguageContextType {
  lang: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  localizedPath: (path: string) => string;
  isValidLanguage: (lang: string) => lang is SupportedLanguage;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { lang: langParam } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading: isAuthLoading, isProfileLoading } = useAuth();
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage | null>(null);

  const isValidLanguage = useCallback((lang: string): lang is SupportedLanguage => {
    return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
  }, []);

  const resolvePreferredLanguage = useCallback((): SupportedLanguage | null => {
    const profileData = getStoredProfileData();
    const anonPrefs = getAnonymousPreferences();
    const storedLanguage = profileData?.language || anonPrefs?.language;

    if (storedLanguage && isValidLanguage(storedLanguage)) {
      return storedLanguage;
    }

    return null;
  }, [isValidLanguage]);

  const lang: SupportedLanguage = useMemo(() => {
    if (langParam && isValidLanguage(langParam)) {
      return langParam;
    }
    return DEFAULT_LANGUAGE;
  }, [langParam, isValidLanguage]);

  useEffect(() => {
    if (isAuthLoading || isProfileLoading) return;
    setPreferredLanguage(resolvePreferredLanguage());
  }, [isAuthLoading, isProfileLoading, resolvePreferredLanguage]);

  useEffect(() => {
    const handleStorage = () => {
      setPreferredLanguage(resolvePreferredLanguage());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [resolvePreferredLanguage]);

  // Sync URL language with user's profile language preference
  useEffect(() => {
    // Wait for auth and profile loading to complete before checking preferences
    if (isAuthLoading || isProfileLoading) return;

    // If user has a preferred language that differs from current URL, redirect to it
    if (preferredLanguage && preferredLanguage !== lang) {
      // Build new path with preferred language
      const pathParts = location.pathname.split("/").filter(Boolean);
      if (pathParts.length > 0 && isValidLanguage(pathParts[0])) {
        pathParts.shift(); // Remove current language
      }
      const newPath = `/${preferredLanguage}/${pathParts.join("/")}${location.search}`;
      navigate(newPath, { replace: true });
    }
  }, [
    isAuthLoading,
    isProfileLoading,
    preferredLanguage,
    lang,
    location.pathname,
    location.search,
    navigate,
    isValidLanguage,
  ]);

  const setLanguage = (newLang: SupportedLanguage) => {
    // Get current path without language prefix
    const pathParts = location.pathname.split("/").filter(Boolean);
    
    // Check if first part is a language
    if (pathParts.length > 0 && isValidLanguage(pathParts[0])) {
      pathParts.shift(); // Remove current language
    }
    
    // Build new path with new language
    const newPath = `/${newLang}/${pathParts.join("/")}${location.search}`;
    navigate(newPath);
  };

  const localizedPath = (path: string): string => {
    // Remove leading slash if present
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    
    // Check if path already has a language prefix
    const firstSegment = cleanPath.split("/")[0];
    if (isValidLanguage(firstSegment)) {
      return `/${cleanPath}`;
    }
    
    return `/${lang}/${cleanPath}`;
  };

  const value = useMemo(
    () => ({ lang, setLanguage, localizedPath, isValidLanguage }),
    [lang, location.pathname]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Helper hook for components that need language but might be outside provider
export function useLanguageParam(): SupportedLanguage {
  const { lang } = useParams<{ lang: string }>();
  if (lang && SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
    return lang as SupportedLanguage;
  }
  return DEFAULT_LANGUAGE;
}
