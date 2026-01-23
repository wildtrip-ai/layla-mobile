import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapDialog } from "./MapDialog";

// Fix for default marker icons in Leaflet with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// City coordinates for Jordan trip
const cityCoordinates: Record<string, [number, number]> = {
  Berlin: [52.52, 13.405],
  Amman: [31.9454, 35.9284],
  "Wadi Rum": [29.5328, 35.4194],
  Petra: [30.3285, 35.4444],
  "Dead Sea": [31.5, 35.5],
};

// Custom marker icon
const createNumberedIcon = (number: number) => {
  return L.divIcon({
    className: "custom-numbered-marker",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: #1a1a2e;
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${number}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// Component to fit bounds when map loads
function FitBounds({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap();
  const hasRun = useRef(false);
  
  useEffect(() => {
    if (coordinates.length > 0 && !hasRun.current) {
      hasRun.current = true;
      const bounds = L.latLngBounds(coordinates.map(coord => L.latLng(coord[0], coord[1])));
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [map, coordinates]);
  
  return null;
}

interface TripMapProps {
  cityStops: { id: string; name: string; dates: string; image: string }[];
}

export function TripMap({ cityStops }: TripMapProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get coordinates for all cities
  const routeCoordinates: [number, number][] = cityStops
    .map(city => cityCoordinates[city.name])
    .filter(Boolean);

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
        {/* Map Preview */}
        <div className="relative h-64 md:h-80">
          <MapContainer
            center={[30.5, 35.5]}
            zoom={7}
            className="w-full h-full"
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FitBounds coordinates={routeCoordinates} />

            {/* Route line between cities */}
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: "#2563eb",
                weight: 3,
                opacity: 0.8,
              }}
            />

            {/* City markers */}
            {cityStops.map((city, index) => {
              const coords = cityCoordinates[city.name];
              if (!coords) return null;
              return (
                <Marker
                  key={city.id}
                  position={coords}
                  icon={createNumberedIcon(index + 1)}
                />
              );
            })}
          </MapContainer>

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
