import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { VoyagerChat } from "@/components/trip/VoyagerChat";
import { EmptyTripState } from "@/components/trip/EmptyTripState";
import { TripPreview } from "@/components/trip/TripPreview";
import { TripPreviewSkeleton } from "@/components/trip/TripPreviewSkeleton";
import { MobileChatDrawer } from "@/components/trip/MobileChatDrawer";
import type { TripData } from "@/data/tripData";

// Default placeholder images for AI-generated trips
import tripAmman from "@/assets/trip-amman.jpg";
import heroDubai from "@/assets/hero-dubai.avif";
import heroDune from "@/assets/hero-dune.avif";
import heroJapan from "@/assets/hero-japan.jpg";

const DEFAULT_TRIP_IMAGES = [tripAmman, heroDubai, heroDune, heroJapan];

/**
 * Hydrate AI-generated trip data with placeholder images where missing.
 * The AI cannot produce local image paths, so we fill them in.
 */
function hydrateTripImages(trip: TripData): TripData {
  const tripImage = trip.image || DEFAULT_TRIP_IMAGES[0];

  const cityStops = trip.cityStops?.map((city, i) => ({
    ...city,
    image: city.image || DEFAULT_TRIP_IMAGES[i % DEFAULT_TRIP_IMAGES.length],
  })) ?? [];

  const dayPlans = trip.dayPlans?.map((day) => ({
    ...day,
    items: day.items.map((item) => ({
      ...item,
      image: item.image || undefined, // Leave undefined - the UI handles missing images
    })),
  })) ?? [];

  const accommodations = trip.accommodations?.map((acc) => ({
    ...acc,
    image: acc.image || tripImage,
  })) ?? [];

  return {
    ...trip,
    id: trip.id || `trip-${Date.now()}`,
    image: tripImage,
    cityStops,
    dayPlans,
    accommodations,
    transports: trip.transports ?? [],
  };
}

export default function NewTripPlanner() {
  const [searchParams] = useSearchParams();
  const initialMessage = searchParams.get("message");
  const mode = searchParams.get("mode");

  const [generatedTrip, setGeneratedTrip] = useState<TripData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTripGenerated = useCallback((trip: TripData) => {
    const hydrated = hydrateTripImages(trip);
    setGeneratedTrip(hydrated);
  }, []);

  const handleGeneratingChange = useCallback((generating: boolean) => {
    setIsGenerating(generating);
  }, []);

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
