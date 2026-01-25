import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { VoyagerChat } from "@/components/trip/VoyagerChat";
import { EmptyTripState } from "@/components/trip/EmptyTripState";
import { TripPreview } from "@/components/trip/TripPreview";
import { TripPreviewSkeleton } from "@/components/trip/TripPreviewSkeleton";
import { MobileChatDrawer } from "@/components/trip/MobileChatDrawer";
import type { TripData } from "@/data/tripData";

export default function NewTripPlanner() {
  const [searchParams] = useSearchParams();
  const initialMessage = searchParams.get("message");
  const mode = searchParams.get("mode");
  
  const [generatedTrip, setGeneratedTrip] = useState<TripData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTripGenerated = (trip: TripData) => {
    setGeneratedTrip(trip);
  };

  const handleGeneratingChange = (generating: boolean) => {
    setIsGenerating(generating);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-24">
        <div className="container mx-auto px-4">

          {/* Two Column Layout - Desktop */}
          <div className="hidden lg:grid lg:grid-cols-[340px_1fr] gap-6">
            {/* Chat Sidebar */}
            <VoyagerChat
              mode="create"
              initialMessage={initialMessage}
              inspireMode={mode === "inspire"}
              onTripGenerated={handleTripGenerated}
              onGeneratingChange={handleGeneratingChange}
            />

            {/* Content Area */}
            <div>
              <AnimatePresence mode="wait">
                {generatedTrip ? (
                  <TripPreview key="preview" trip={generatedTrip} />
                ) : isGenerating ? (
                  <TripPreviewSkeleton key="skeleton" />
                ) : (
                  <EmptyTripState key="empty" />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Layout - Show content only, chat in drawer */}
          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              {generatedTrip ? (
                <TripPreview key="preview" trip={generatedTrip} />
              ) : isGenerating ? (
                <TripPreviewSkeleton key="skeleton" />
              ) : (
                <EmptyTripState key="empty" />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile Chat Drawer */}
      <MobileChatDrawer
        initialMessage={initialMessage}
        mode={mode}
        onTripGenerated={handleTripGenerated}
        onGeneratingChange={handleGeneratingChange}
      />
    </div>
  );
}
