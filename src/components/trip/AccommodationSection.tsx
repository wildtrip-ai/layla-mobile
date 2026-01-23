import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { AccommodationCard } from "./AccommodationCard";
import type { Accommodation } from "@/data/tripData";

interface AccommodationSectionProps {
  accommodations: Accommodation[];
  dates: string;
}

export function AccommodationSection({ accommodations, dates }: AccommodationSectionProps) {
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
          <h2 className="text-2xl font-serif text-foreground">Accommodation</h2>
          <p className="text-sm text-muted-foreground">{dates}</p>
        </div>
      </div>

      {/* Accommodation Cards */}
      <div className="space-y-4">
        {accommodations.map((accommodation) => (
          <AccommodationCard key={accommodation.id} accommodation={accommodation} />
        ))}
      </div>
    </motion.div>
  );
}
