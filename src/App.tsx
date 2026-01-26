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
import Settings from "./pages/Settings";
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
  const { lang, setLanguage } = useLanguage();

  const handleLanguageSelect = (langCode: string) => {
    if (SUPPORTED_LANGUAGES.includes(langCode as SupportedLanguage)) {
      setLanguage(langCode as SupportedLanguage);
    }
  };

  return (
    <>
      <SelectionDialog
        open={languageDialogOpen}
        onOpenChange={setLanguageDialogOpen}
        title="Choose language"
        items={languages}
        selectedValue={lang}
        onSelect={handleLanguageSelect}
      />
      <SelectionDialog
        open={currencyDialogOpen}
        onOpenChange={setCurrencyDialogOpen}
        title="Choose currency"
        items={currencies}
        selectedValue={selectedCurrency}
        onSelect={setSelectedCurrency}
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
      <Route path="/settings" element={<Settings />} />
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
