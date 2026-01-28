import { motion } from "framer-motion";
import { Building2, MapPinOff } from "lucide-react";
import { HotelCard } from "./HotelCard";
import type { Accommodation } from "@/data/tripData";

interface AccommodationSectionProps {
  accommodations: Accommodation[];
  dates: string;
  cityName?: string;
}

export function AccommodationSection({ accommodations, dates, cityName }: AccommodationSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-foreground" />
        <div>
          <h2 className="text-2xl font-serif text-foreground">
            {cityName ? `Accommodation in ${cityName}` : "Accommodation"}
          </h2>
          <p className="text-sm text-muted-foreground">{dates}</p>
        </div>
      </div>

      {/* Accommodation Cards */}
      {accommodations.length > 0 ? (
        <div className="space-y-4 pt-4">
          {accommodations.map((accommodation) => (
            <HotelCard key={accommodation.id} accommodation={accommodation} showRemove={true} />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <MapPinOff className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No accommodation booked for {cityName || "this city"}</p>
        </div>
      )}
    </motion.div>
  );
}
