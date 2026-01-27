import { createContext, useContext, useMemo, ReactNode, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getStoredProfileData, getAnonymousPreferences } from "@/lib/profileStorage";

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
  const hasCheckedProfile = useRef(false);

  const isValidLanguage = (lang: string): lang is SupportedLanguage => {
    return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
  };

  const lang: SupportedLanguage = useMemo(() => {
    if (langParam && isValidLanguage(langParam)) {
      return langParam;
    }
    return DEFAULT_LANGUAGE;
  }, [langParam]);

  // Sync URL language with user's profile language preference on mount
  useEffect(() => {
    // Only check once per session to avoid redirect loops
    if (hasCheckedProfile.current) return;

    // Get user's preferred language from profile or anonymous preferences
    const profileData = getStoredProfileData();
    const anonPrefs = getAnonymousPreferences();
    const preferredLanguage = profileData?.language || anonPrefs?.language;

    // If user has a preferred language that differs from current URL, redirect to it
    if (preferredLanguage && isValidLanguage(preferredLanguage) && preferredLanguage !== lang) {
      hasCheckedProfile.current = true;

      // Build new path with preferred language
      const pathParts = location.pathname.split("/").filter(Boolean);
      if (pathParts.length > 0 && isValidLanguage(pathParts[0])) {
        pathParts.shift(); // Remove current language
      }
      const newPath = `/${preferredLanguage}/${pathParts.join("/")}${location.search}`;
      navigate(newPath, { replace: true });
    } else {
      hasCheckedProfile.current = true;
    }
  }, [lang, location.pathname, location.search, navigate]);

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
