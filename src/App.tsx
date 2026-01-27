import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/hooks/useLanguage";
import { LanguageRedirect } from "@/components/LanguageRedirect";
import { LoginDialogProvider, useLoginDialog } from "@/contexts/LoginDialogContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { SelectionDialogsProvider, useSelectionDialogs } from "@/contexts/SelectionDialogsContext";
import { SelectionDialog, languages, currencies } from "@/components/SelectionDialog";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/hooks/useLanguage";
import { useLanguage } from "@/hooks/useLanguage";
import { updateUserProfile, getStoredToken } from "@/lib/auth";
import {
  updateStoredProfileData,
  updateAnonymousPreferences,
  getStoredProfileData,
  getAnonymousPreferences,
} from "@/lib/profileStorage";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import Index from "./pages/Index";
import TripDetails from "./pages/TripDetails";
import BookingReview from "./pages/BookingReview";
import AccommodationResults from "./pages/AccommodationResults";
import AccommodationDetails from "./pages/AccommodationDetails";
import ActivityDetails from "./pages/ActivityDetails";
import NewTripPlanner from "./pages/NewTripPlanner";
import MyTrips from "./pages/MyTrips";
import Countries from "./pages/Countries";
import CountryDetails from "./pages/CountryDetails";
import DestinationDetails from "./pages/DestinationDetails";
import MyFavorites from "./pages/MyFavorites";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import MagicLinkCallback from "./pages/MagicLinkCallback";
import GoogleCallback from "./pages/GoogleCallback";

const queryClient = new QueryClient();

// Component that renders LoginDialog using context
function LoginDialogContainer() {
  const { loginDialogOpen, setLoginDialogOpen } = useLoginDialog();
  return <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />;
}

// Component that renders SelectionDialogs using context
function SelectionDialogsContainer() {
  const { languageDialogOpen, setLanguageDialogOpen, currencyDialogOpen, setCurrencyDialogOpen, selectedCurrency, setSelectedCurrency } = useSelectionDialogs();
  const { effectiveLanguage, setLanguage } = useLanguage();
  const { isAuthenticated, refreshUserProfile } = useAuth();

  const handleLanguageSelect = async (langCode: string) => {
    if (!SUPPORTED_LANGUAGES.includes(langCode as SupportedLanguage)) {
      return;
    }

    const newLanguage = langCode as SupportedLanguage;
    const previousLanguage = effectiveLanguage;
    const previousStoredLanguage = isAuthenticated
      ? getStoredProfileData()?.language
      : getAnonymousPreferences()?.language;

    setLanguage(newLanguage);
    setLanguageDialogOpen(false);

    // If user is logged in, update their profile via API
    if (isAuthenticated) {
      updateStoredProfileData({ language: langCode });
      const token = getStoredToken();
      if (token) {
        try {
          await updateUserProfile(token, { language: langCode });

          await refreshUserProfile();

          toast({
            title: "Success",
            description: "Your language preference has been updated.",
          });
        } catch (error) {
          updateStoredProfileData({ language: previousStoredLanguage });
          setLanguage(previousLanguage);
          toast({
            title: "Error",
            description: "Failed to update your language preference. Please try again.",
            variant: "destructive",
          });
        }
      }
    } else {
      // For non-authenticated users, save to anonymous preferences
      updateAnonymousPreferences({ language: langCode });
    }
  };

  const handleCurrencySelect = async (currencyCode: string) => {
    // If user is logged in, update their profile via API
    if (isAuthenticated) {
      const token = getStoredToken();
      if (token) {
        try {
          await updateUserProfile(token, { currency: currencyCode });

          // Update session storage with new currency
          updateStoredProfileData({ currency: currencyCode });

          await refreshUserProfile();

          toast({
            title: "Success",
            description: "Your currency preference has been updated.",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update your currency preference. Please try again.",
            variant: "destructive",
          });
          return; // Don't update state if API call failed
        }
      }
    } else {
      // For non-authenticated users, save to anonymous preferences
      updateAnonymousPreferences({ currency: currencyCode });
    }

    // Update local state for both authenticated and non-authenticated users
    setSelectedCurrency(currencyCode);
    setCurrencyDialogOpen(false);
  };

  return (
    <>
      <SelectionDialog
        open={languageDialogOpen}
        onOpenChange={setLanguageDialogOpen}
        title="Choose language"
        items={languages}
        selectedValue={effectiveLanguage}
        onSelect={handleLanguageSelect}
      />
      <SelectionDialog
        open={currencyDialogOpen}
        onOpenChange={setCurrencyDialogOpen}
        title="Choose currency"
        items={currencies}
        selectedValue={selectedCurrency}
        onSelect={handleCurrencySelect}
      />
    </>
  );
}

// Wrapper component for routes with :lang param
function LanguageRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/my-trips" element={<MyTrips />} />
      <Route path="/my-favorites" element={<MyFavorites />} />
      <Route path="/new-trip-planner" element={<NewTripPlanner />} />
      <Route path="/trip/:id" element={<TripDetails />} />
      <Route path="/trip/:id/booking" element={<BookingReview />} />
      <Route path="/trip/:id/accommodations" element={<AccommodationResults />} />
      <Route path="/trip/:id/accommodation/:accommodationId" element={<AccommodationDetails />} />
      <Route path="/trip/:id/activity/:activityId" element={<ActivityDetails />} />
      <Route path="/countries" element={<Countries />} />
      <Route path="/country/:slug" element={<CountryDetails />} />
      <Route path="/country/:countrySlug/destination/:destinationId" element={<DestinationDetails />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/settings/profile" element={<SettingsPage />} />
      <Route path="/settings/notifications" element={<SettingsPage />} />
      <Route path="/settings/subscription" element={<SettingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LoginDialogProvider>
          <SelectionDialogsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <LanguageProvider>
                <ScrollToTop />
                <Routes>
                  {/* Auth callbacks - outside language routes */}
                  <Route path="/auth/magic-link" element={<MagicLinkCallback />} />
                  <Route path="/auth/google/callback" element={<GoogleCallback />} />

                  {/* Root path redirects to detected language */}
                  <Route path="/" element={<LanguageRedirect />} />

                  {/* All localized routes under /:lang */}
                  <Route path="/:lang/*" element={<LanguageRoutes />} />

                  {/* Fallback for non-localized paths - redirect to add language */}
                  <Route path="/my-trips" element={<LanguageRedirect />} />
                  <Route path="/my-favorites" element={<LanguageRedirect />} />
                  <Route path="/new-trip-planner" element={<LanguageRedirect />} />
                  <Route path="/trip/*" element={<LanguageRedirect />} />
                  <Route path="/countries" element={<LanguageRedirect />} />
                  <Route path="/country/*" element={<LanguageRedirect />} />
                  <Route path="/settings" element={<LanguageRedirect />} />

                  {/* 404 for truly unknown paths */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                {/* Dialogs - rendered inside LanguageProvider */}
                <LoginDialogContainer />
                <SelectionDialogsContainer />
              </LanguageProvider>
            </BrowserRouter>
            <Analytics />
          </SelectionDialogsProvider>
        </LoginDialogProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
