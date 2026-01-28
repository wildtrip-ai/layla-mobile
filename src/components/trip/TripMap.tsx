import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapDialog } from "./MapDialog";
import { Activity } from "@/data/tripData";
import { StaticLeafletMap } from "./StaticLeafletMap";

interface TripMapProps {
  cityStops: { id: string; name: string; dates: string; image: string }[];
  activities?: Activity[];
  dialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  targetCityIndex?: number | null;
  selectedCityIndex?: number | null;
}

// City coordinates for Jordan trip
const cityCoordinates: Record<string, [number, number]> = {
  Berlin: [52.52, 13.405],
  Amman: [31.9454, 35.9284],
  "Wadi Rum": [29.5328, 35.4194],
  Petra: [30.3285, 35.4444],
  "Dead Sea": [31.5, 35.5],
};

export function TripMap({ 
  cityStops, 
  activities = [], 
  dialogOpen, 
  onDialogOpenChange, 
  targetCityIndex,
  selectedCityIndex = null 
}: TripMapProps) {
  // Get coordinates for all cities
  const routeCoordinates: [number, number][] = cityStops
    .map(city => cityCoordinates[city.name])
    .filter(Boolean);

  // Calculate center based on selected city or all points
  let mapCenter: [number, number];
  let mapZoom: number;

  if (selectedCityIndex !== null && routeCoordinates[selectedCityIndex]) {
    // Focus on selected city
    mapCenter = routeCoordinates[selectedCityIndex];
    mapZoom = 11;
  } else {
    // Show full route
    const centerLat = routeCoordinates.reduce((sum, coord) => sum + coord[0], 0) / routeCoordinates.length;
    const centerLng = routeCoordinates.reduce((sum, coord) => sum + coord[1], 0) / routeCoordinates.length;
    mapCenter = [centerLat, centerLng];
    mapZoom = 7;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-0 isolate bg-card rounded-2xl overflow-hidden border border-border"
      >
        {/* Static Leaflet Map Preview */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <StaticLeafletMap
            coordinates={routeCoordinates}
            center={mapCenter}
            zoom={mapZoom}
            selectedIndex={selectedCityIndex}
          />

          {/* View full map button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4 gap-2 shadow-lg pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              onDialogOpenChange(true);
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
        onClose={() => onDialogOpenChange(false)}
        cityStops={cityStops}
        activities={activities}
        targetCityIndex={targetCityIndex}
      />
    </>
  );
}
