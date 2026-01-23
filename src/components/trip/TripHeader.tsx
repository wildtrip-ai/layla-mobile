import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Star, Building2, Car, Users } from "lucide-react";
import type { TripData } from "@/data/tripData";
import { StoryPreview } from "./StoryPreview";

interface TripHeaderProps {
  trip: TripData;
  onOpenDialog?: () => void;
  travelers?: number;
}

export function TripHeader({ trip, onOpenDialog, travelers }: TripHeaderProps) {
  const [storyOpen, setStoryOpen] = useState(false);
  const displayTravelers = travelers ?? trip.travelers;
  
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-2xl overflow-hidden border border-border"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Image */}
          <div className="relative aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden">
            <img
              src={trip.image}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
            <button 
              onClick={() => setStoryOpen(true)}
              className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-card transition-colors"
            >
              Preview
            </button>
          </div>

          {/* Story Preview Modal */}
          <StoryPreview open={storyOpen} onClose={() => setStoryOpen(false)} />

          {/* Info */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Clickable Date/Travelers Badge */}
              <button
                onClick={onOpenDialog}
                className="mb-4 bg-secondary border border-border rounded-full px-4 py-2 flex items-center gap-3 text-sm hover:bg-secondary/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{trip.dates}</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{displayTravelers} travellers</span>
                </div>
              </button>

              <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
                {trip.title}
              </h1>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{trip.stats.days} days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{trip.stats.cities} cities</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4" />
                  <span>{trip.stats.activities} activities</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  <span>{trip.stats.hotels} hotels</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Car className="h-4 w-4" />
                  <span>{trip.stats.transports} transports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* City Timeline - Outside Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-2 overflow-x-auto pb-2 px-2"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
          <MapPin className="h-4 w-4" />
          <span>Berlin</span>
        </div>
        <div className="h-px w-4 bg-border shrink-0" />
        <span className="text-muted-foreground shrink-0">✈</span>
        <div className="h-px w-4 bg-border shrink-0" />

        {trip.cityStops.map((city, index) => (
          <div key={city.id} className="flex items-center gap-2 shrink-0">
            <div className="bg-secondary rounded-lg px-3 py-2 border border-border">
              <p className="font-medium text-foreground text-sm">{city.name}</p>
              <p className="text-xs text-muted-foreground">{city.dates}</p>
            </div>
            {index < trip.cityStops.length - 1 && (
              <>
                <div className="h-px w-4 bg-border" />
                <span className="text-muted-foreground">🚗</span>
                <div className="h-px w-4 bg-border" />
              </>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
