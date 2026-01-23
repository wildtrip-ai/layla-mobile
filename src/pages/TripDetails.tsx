import { useState } from "react";
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
import { sampleTrip } from "@/data/tripData";

export default function TripDetails() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [premiumDrawerOpen, setPremiumDrawerOpen] = useState(false);
  const [isFreePlan] = useState(true); // Mock: defaults to free plan for demo
  const [tripSettings, setTripSettings] = useState({
    travelers: sampleTrip.travelers,
    dates: sampleTrip.dates,
  });

  const handleAddClick = () => {
    if (isFreePlan) {
      setPremiumDrawerOpen(true);
    } else {
      // Future: Handle normal add flow
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
        tripData={sampleTrip}
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
              <TripSidebar />
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Trip Header */}
              <TripHeader 
                trip={sampleTrip} 
                onOpenDialog={() => setDialogOpen(true)}
                travelers={tripSettings.travelers}
              />

              {/* Map */}
              <TripMap 
                cityStops={sampleTrip.cityStops} 
                activities={sampleTrip.dayPlans.flatMap(day => day.items.filter(item => item.type !== 'note'))}
              />

              {/* Description */}
              <TripDescription 
                title={sampleTrip.subtitle} 
                description={sampleTrip.description} 
              />

              {/* Image Gallery */}
              <ImageGallery 
                images={sampleTrip.dayPlans.flatMap(day => 
                  day.items.filter(item => item.image).map(item => ({
                    src: item.image!,
                    title: item.title,
                    location: item.location,
                  }))
                )}
              />

              {/* Transport */}
              <TransportSection transports={sampleTrip.transports} />

              {/* Accommodation */}
              <AccommodationSection 
                accommodations={sampleTrip.accommodations} 
                dates="May 1 - 3" 
              />

              {/* Day by Day Plan */}
              <DayPlanSection 
                dayPlans={sampleTrip.dayPlans} 
                dates="May 1 - 3"
                onAddClick={handleAddClick}
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
