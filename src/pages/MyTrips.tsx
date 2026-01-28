import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TripCard } from "@/components/trips/TripCard";
import { TripCardSkeleton } from "@/components/trips/TripCardSkeleton";
import { EmptyTripsState } from "@/components/trips/EmptyTripsState";
import { useTripsApi, type TripStatus } from "@/hooks/useTripsApi";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginDialog } from "@/contexts/LoginDialogContext";

type TabValue = "all" | "upcoming" | "past" | "drafts";

export default function MyTrips() {
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openLoginDialog } = useLoginDialog();

  // Map tab value to API status filter
  const statusFilter = useMemo<TripStatus | undefined>(() => {
    if (activeTab === "all") return undefined;
    if (activeTab === "drafts") return "draft";
    return activeTab as TripStatus;
  }, [activeTab]);

  // Fetch trips from API with current filter
  const { trips, isLoading, error, refresh } = useTripsApi(statusFilter);

  const handleDeleteTrip = async (tripId: string) => {
    // TODO: Call delete API endpoint
    // For now, just refresh the list
    await refresh();
  };

  const handleNewTrip = () => {
    if (isAuthenticated) {
      navigate("/new-trip-planner");
    } else {
      openLoginDialog();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-24">
        <div className="container mx-auto px-4">

          {/* Page Header */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className="text-2xl font-serif font-medium text-foreground">
              My Trips
            </h1>
            <Button variant="hero" className="w-full sm:w-auto" onClick={handleNewTrip}>
              <Plus className="mr-2 h-4 w-4" />
              New Trip
            </Button>
          </motion.div>

          {/* Status Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all" className="flex-1 sm:flex-none">
                  All
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="past" className="flex-1 sm:flex-none">
                  Past
                </TabsTrigger>
                <TabsTrigger value="drafts" className="flex-1 sm:flex-none">
                  Drafts
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Mobile swipe hint */}
          <motion.p
            className="text-xs text-muted-foreground mt-4 sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Swipe left on a card to delete
          </motion.p>

          {/* Trip Grid */}
          <div className="mt-6 sm:mt-8">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {[...Array(6)].map((_, index) => (
                    <TripCardSkeleton key={index} index={index} />
                  ))}
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground mb-4">
                    Failed to load trips. Please try again.
                  </p>
                  <Button onClick={refresh} variant="outline">
                    Retry
                  </Button>
                </motion.div>
              ) : trips.length > 0 ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {trips.map((trip, index) => (
                      <TripCard
                        key={trip.id}
                        trip={trip}
                        index={index}
                        onDelete={handleDeleteTrip}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <EmptyTripsState tab={activeTab} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
