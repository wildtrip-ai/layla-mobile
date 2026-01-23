import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TripMapProps {
  cityStops: { id: string; name: string }[];
}

export function TripMap({ cityStops }: TripMapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card rounded-2xl overflow-hidden border border-border"
    >
      {/* Map Placeholder */}
      <div className="relative h-64 md:h-80 bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Interactive map</p>
            <p className="text-sm text-muted-foreground">
              {cityStops.map(c => c.name).join(" → ")}
            </p>
          </div>
        </div>

        {/* Map markers overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {cityStops.map((city, index) => (
            <div
              key={city.id}
              className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* View full map button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 gap-2"
        >
          View full map
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
}
