import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapDialog } from "./MapDialog";

interface TripMapProps {
  cityStops: { id: string; name: string; dates: string; image: string }[];
}

// City coordinates for Jordan trip
const cityCoordinates: Record<string, [number, number]> = {
  Berlin: [52.52, 13.405],
  Amman: [31.9454, 35.9284],
  "Wadi Rum": [29.5328, 35.4194],
  Petra: [30.3285, 35.4444],
  "Dead Sea": [31.5, 35.5],
};

export function TripMap({ cityStops }: TripMapProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get coordinates for all cities
  const routeCoordinates: [number, number][] = cityStops
    .map(city => cityCoordinates[city.name])
    .filter(Boolean);

  // Calculate center of all points
  const centerLat = routeCoordinates.reduce((sum, coord) => sum + coord[0], 0) / routeCoordinates.length;
  const centerLng = routeCoordinates.reduce((sum, coord) => sum + coord[1], 0) / routeCoordinates.length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-card rounded-2xl overflow-hidden border border-border cursor-pointer group"
        onClick={() => setDialogOpen(true)}
      >
        {/* Map Preview using static image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          {/* Static OpenStreetMap image */}
          <img
            src={`https://staticmap.openstreetmap.de/staticmap.php?center=${centerLat},${centerLng}&zoom=7&size=800x400&maptype=osmarenderer&markers=${routeCoordinates.map((coord, i) => `${coord[0]},${coord[1]},lightblue${i + 1}`).join('|')}`}
            alt="Trip map"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback to placeholder if static map fails
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          
          {/* Fallback placeholder */}
          <div className="hidden absolute inset-0 bg-secondary flex items-center justify-center">
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
                className="bg-foreground text-background w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
              >
                {index + 1}
              </div>
            ))}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />

          {/* View full map button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4 gap-2 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              setDialogOpen(true);
            }}
          >
            <MapPin className="h-3 w-3" />
            View full map
          </Button>
        </div>
      </motion.div>

      {/* Map Dialog */}
      <MapDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        cityStops={cityStops}
      />
    </>
  );
}
