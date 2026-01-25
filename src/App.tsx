import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/hooks/useLanguage";
import { LanguageRedirect } from "@/components/LanguageRedirect";
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

const queryClient = new QueryClient();

// Wrapper component that provides language context for routes with :lang param
function LanguageRoutes() {
  return (
    <LanguageProvider>
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
    </LanguageProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
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
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
