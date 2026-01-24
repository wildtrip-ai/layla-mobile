import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import TripDetails from "./pages/TripDetails";
import AccommodationResults from "./pages/AccommodationResults";
import AccommodationDetails from "./pages/AccommodationDetails";
import ActivityDetails from "./pages/ActivityDetails";
import NewTripPlanner from "./pages/NewTripPlanner";
import MyTrips from "./pages/MyTrips";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/new-trip-planner" element={<NewTripPlanner />} />
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/trip/:id/accommodations" element={<AccommodationResults />} />
          <Route path="/trip/:id/accommodation/:accommodationId" element={<AccommodationDetails />} />
          <Route path="/trip/:id/activity/:activityId" element={<ActivityDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
