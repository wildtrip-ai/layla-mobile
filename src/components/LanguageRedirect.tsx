import { Navigate, useLocation } from "react-router-dom";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, SupportedLanguage } from "@/hooks/useLanguage";

export function LanguageRedirect() {
  const location = useLocation();
  
  // Try to detect user's preferred language from browser
  const getBrowserLanguage = (): SupportedLanguage => {
    const browserLang = navigator.language.split("-")[0];
    if (SUPPORTED_LANGUAGES.includes(browserLang as SupportedLanguage)) {
      return browserLang as SupportedLanguage;
    }
    return DEFAULT_LANGUAGE;
  };

  const detectedLang = getBrowserLanguage();
  const newPath = `/${detectedLang}${location.pathname}${location.search}`;
  
  return <Navigate to={newPath} replace />;
}
