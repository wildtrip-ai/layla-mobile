import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { TripHeader } from "@/components/trip/TripHeader";
import { TripMap } from "@/components/trip/TripMap";
import { TripDescription } from "@/components/trip/TripDescription";
import { ImageGallery } from "@/components/trip/ImageGallery";
import { TransportSection } from "@/components/trip/TransportSection";
import { AccommodationSection } from "@/components/trip/AccommodationSection";
import { DayPlanSection } from "@/components/trip/DayPlanSection";
import { TripSidebar } from "@/components/trip/TripSidebar";
import { TripDetailsDialog, type EditableTripData } from "@/components/trip/TripDetailsDialog";
import { PremiumUpgradeDrawer } from "@/components/trip/PremiumUpgradeDrawer";
import { useTripData } from "@/hooks/useTripData";

// Helper to parse city dates like "May 1 - May 3" 
function parseCityDateRange(dateString: string): { startDay: number; endDay: number } {
  const match = dateString.match(/May (\d+) - May (\d+)/);
  if (match) {
    return { startDay: parseInt(match[1]), endDay: parseInt(match[2]) };
  }
  return { startDay: 1, endDay: 31 };
}

// Helper to parse day date like "May 1"
function parseDayDate(dateString: string): number {
  const match = dateString.match(/May (\d+)/);
  return match ? parseInt(match[1]) : 0;
}

export default function TripDetails() {
  const { tripData, removeFlights, addCity, applyBudgetChanges, undo, canUndo } = useTripData();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [premiumDrawerOpen, setPremiumDrawerOpen] = useState(false);
  const [isFreePlan] = useState(true);
  const [tripSettings, setTripSettings] = useState({
    travelers: tripData.travelers,
    dates: tripData.dates,
  });

  // Map dialog state - lifted from TripMap for coordination
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [selectedCityIndex, setSelectedCityIndex] = useState<number | null>(null);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  // Get current city info
  const currentCity = tripData.cityStops[currentCityIndex];
  const currentCityName = currentCity?.name || "";
  const currentCityDates = currentCity?.dates || "";
  const cityDateRange = parseCityDateRange(currentCityDates);

  // Filter day plans by current city
  const filteredDayPlans = useMemo(() => {
    return tripData.dayPlans.filter(day => {
      const dayNum = parseDayDate(day.date);
      // Include days that start within the city's date range (not including end day which is departure)
      return dayNum >= cityDateRange.startDay && dayNum < cityDateRange.endDay;
    });
  }, [tripData.dayPlans, cityDateRange.startDay, cityDateRange.endDay]);

  // Filter accommodations by current city dates
  const filteredAccommodations = useMemo(() => {
    return tripData.accommodations.filter(acc => {
      // Parse accommodation dates like "May 1 - 3"
      const match = acc.dates.match(/May (\d+) - (\d+)/);
      if (match) {
        const accStart = parseInt(match[1]);
        const accEnd = parseInt(match[2]);
        // Check if accommodation overlaps with city dates
        return accStart < cityDateRange.endDay && accEnd > cityDateRange.startDay;
      }
      return false;
    });
  }, [tripData.accommodations, cityDateRange.startDay, cityDateRange.endDay]);

  // Filter transports for current city
  const filteredTransports = useMemo(() => {
    return tripData.transports.filter(transport => {
      // For first city, show flights/arrivals
      if (currentCityIndex === 0) {
        return transport.to === currentCityName || transport.toCode === "AMM";
      }
      // For other cities, show transfers to that city
      return transport.to === currentCityName || transport.title.toLowerCase().includes(currentCityName.toLowerCase());
    });
  }, [tripData.transports, currentCityIndex, currentCityName]);

  // Filter images from current city's day plans
  const filteredImages = useMemo(() => {
    return filteredDayPlans.flatMap(day => 
      day.items.filter(item => item.image).map(item => ({
        src: item.image!,
        title: item.title,
        location: item.location,
      }))
    );
  }, [filteredDayPlans]);

  const handleAddClick = () => {
    if (isFreePlan) {
      setPremiumDrawerOpen(true);
    } else {
      console.log("Adding item...");
    }
  };

  const handleApplyChanges = (data: EditableTripData) => {
    const totalTravelers = data.adults + data.children;
    setTripSettings((prev) => ({
      ...prev,
      travelers: totalTravelers,
    }));
  };

  // Handle city click from timeline - zooms map, doesn't open dialog
  const handleCityClick = (cityIndex: number) => {
    setCurrentCityIndex(cityIndex);
    setSelectedCityIndex(cityIndex);
  };

  // Handle Next City button - advances to next city
  const handleNextCity = () => {
    const nextIndex = currentCityIndex + 1;
    if (nextIndex < tripData.cityStops.length) {
      setCurrentCityIndex(nextIndex);
      setSelectedCityIndex(nextIndex);
    }
  };

  // Reset selected city when map closes
  const handleMapDialogChange = (open: boolean) => {
    setMapDialogOpen(open);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Trip Date/Travelers Badge - Clickable */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 hidden md:block">
        <button
          onClick={() => setDialogOpen(true)}
          className="bg-card border border-border rounded-full px-4 py-2 shadow-lg flex items-center gap-3 text-sm hover:bg-secondary/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{tripSettings.dates}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{tripSettings.travelers} travellers</span>
          </div>
        </button>
      </div>

      {/* Trip Details Dialog */}
      <TripDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tripData={tripData}
        onApply={handleApplyChanges}
      />

      <main className="pt-20 pb-24">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Button>
            </Link>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
            {/* Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
              <TripSidebar 
                onRemoveFlights={removeFlights}
                onAddCity={addCity}
                onApplyBudgetChanges={applyBudgetChanges}
                onUndo={undo}
                canUndo={canUndo}
              />
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Trip Header */}
              <TripHeader 
                trip={tripData} 
                onOpenDialog={() => setDialogOpen(true)}
                travelers={tripSettings.travelers}
                onCityClick={handleCityClick}
                selectedCityIndex={selectedCityIndex}
                currentCityIndex={currentCityIndex}
              />

              {/* Map */}
              <TripMap 
                cityStops={tripData.cityStops} 
                activities={tripData.dayPlans.flatMap(day => day.items.filter(item => item.type !== 'note'))}
                dialogOpen={mapDialogOpen}
                onDialogOpenChange={handleMapDialogChange}
                targetCityIndex={selectedCityIndex}
                selectedCityIndex={selectedCityIndex}
              />

              {/* Description */}
              <TripDescription 
                title={`${currentCityName} Experience`} 
                description={tripData.description} 
              />

              {/* Image Gallery - Filtered */}
              {filteredImages.length > 0 && (
                <ImageGallery images={filteredImages} />
              )}

              {/* Transport - Filtered */}
              <TransportSection 
                transports={filteredTransports} 
                cityName={currentCityName}
                isFirstCity={currentCityIndex === 0}
              />

              {/* Accommodation - Filtered */}
              <AccommodationSection 
                accommodations={filteredAccommodations} 
                dates={currentCityDates}
                cityName={currentCityName}
              />

              {/* Day by Day Plan - Filtered */}
              <DayPlanSection 
                dayPlans={filteredDayPlans} 
                dates={currentCityDates}
                onAddClick={handleAddClick}
                cityStops={tripData.cityStops}
                currentCityIndex={currentCityIndex}
                onNextCity={handleNextCity}
                cityName={currentCityName}
                tripId={tripData.id}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Premium Upgrade Drawer */}
      <PremiumUpgradeDrawer 
        open={premiumDrawerOpen} 
        onOpenChange={setPremiumDrawerOpen} 
      />

      {/* Fixed CTA on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border lg:hidden">
        <Button variant="hero" size="lg" className="w-full">
          Customize this trip
        </Button>
      </div>
    </div>
  );
}
