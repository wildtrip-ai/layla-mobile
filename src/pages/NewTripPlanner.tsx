import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { NewTripSidebar } from "@/components/trip/NewTripSidebar";
import { EmptyTripState } from "@/components/trip/EmptyTripState";
import { TripPreview } from "@/components/trip/TripPreview";
import { MobileChatDrawer } from "@/components/trip/MobileChatDrawer";
import type { TripData } from "@/data/tripData";

export default function NewTripPlanner() {
  const [searchParams] = useSearchParams();
  const initialMessage = searchParams.get("message");
  const mode = searchParams.get("mode");
  
  const [generatedTrip, setGeneratedTrip] = useState<TripData | null>(null);

  const handleTripGenerated = (trip: TripData) => {
    setGeneratedTrip(trip);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

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

          {/* Two Column Layout - Desktop */}
          <div className="hidden lg:grid lg:grid-cols-[340px_1fr] gap-6">
            {/* Chat Sidebar */}
            <NewTripSidebar
              initialMessage={initialMessage}
              mode={mode}
              onTripGenerated={handleTripGenerated}
            />

            {/* Content Area */}
            <div>
              {generatedTrip ? (
                <TripPreview trip={generatedTrip} />
              ) : (
                <EmptyTripState />
              )}
            </div>
          </div>

          {/* Mobile Layout - Show content only, chat in drawer */}
          <div className="lg:hidden">
            {generatedTrip ? (
              <TripPreview trip={generatedTrip} />
            ) : (
              <EmptyTripState />
            )}
          </div>
        </div>
      </main>

      {/* Mobile Chat Drawer */}
      <MobileChatDrawer
        initialMessage={initialMessage}
        mode={mode}
        onTripGenerated={handleTripGenerated}
      />
    </div>
  );
}
