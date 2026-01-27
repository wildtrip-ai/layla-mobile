import { Navigate, useLocation } from "react-router-dom";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, SupportedLanguage } from "@/hooks/useLanguage";
import { getStoredProfileData, getAnonymousPreferences } from "@/lib/profileStorage";

export function LanguageRedirect() {
  const location = useLocation();

  // Get language preference with priority: user profile > anonymous prefs > browser > default
  const getPreferredLanguage = (): SupportedLanguage => {
    // First, check if logged-in user has a language preference
    const profileData = getStoredProfileData();
    if (profileData?.language && SUPPORTED_LANGUAGES.includes(profileData.language as SupportedLanguage)) {
      return profileData.language as SupportedLanguage;
    }

    // Second, check if anonymous user has a language preference
    const anonPrefs = getAnonymousPreferences();
    if (anonPrefs?.language && SUPPORTED_LANGUAGES.includes(anonPrefs.language as SupportedLanguage)) {
      return anonPrefs.language as SupportedLanguage;
    }

    // Third, try browser language
    const browserLang = navigator.language.split("-")[0];
    if (SUPPORTED_LANGUAGES.includes(browserLang as SupportedLanguage)) {
      return browserLang as SupportedLanguage;
    }

    // Finally, fall back to default
    return DEFAULT_LANGUAGE;
  };

  const detectedLang = getPreferredLanguage();
  const newPath = `/${detectedLang}${location.pathname}${location.search}`;

  return <Navigate to={newPath} replace />;
}
