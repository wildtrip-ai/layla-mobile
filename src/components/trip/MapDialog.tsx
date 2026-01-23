import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

// City coordinates for Jordan trip
const cityCoordinates: Record<string, [number, number]> = {
  Berlin: [52.52, 13.405],
  Amman: [31.9454, 35.9284],
  "Wadi Rum": [29.5328, 35.4194],
  Petra: [30.3285, 35.4444],
  "Dead Sea": [31.5, 35.5],
};

interface MapDialogProps {
  open: boolean;
  onClose: () => void;
  cityStops: { id: string; name: string; dates: string }[];
}

// Lazy load leaflet components
const LeafletMap = ({ cityStops }: { cityStops: { id: string; name: string; dates: string }[] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet
    const loadMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Get coordinates
      const routeCoordinates: [number, number][] = cityStops
        .map(city => cityCoordinates[city.name])
        .filter(Boolean);

      const allCoordinates: [number, number][] = [
        cityCoordinates.Berlin,
        ...routeCoordinates
      ].filter(Boolean);

      // Create map
      const map = L.map(mapRef.current!, {
        center: [35, 30],
        zoom: 5,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Flight route (Berlin to Amman) - curved polyline
      const flightRoute: [number, number][] = [
        cityCoordinates.Berlin,
        [45, 25], // Intermediate point for curve
        cityCoordinates.Amman,
      ];

      L.polyline(flightRoute, {
        color: "#dc2626",
        weight: 3,
        dashArray: "10, 10",
        opacity: 0.8,
      }).addTo(map);

      // Ground route between Jordan cities
      L.polyline(routeCoordinates, {
        color: "#2563eb",
        weight: 4,
        opacity: 0.9,
      }).addTo(map);

      // Create numbered marker icon
      const createNumberedIcon = (number: number, color: string = "#1a1a2e") => {
        return L.divIcon({
          className: "custom-numbered-marker",
          html: `
            <div style="
              width: 36px;
              height: 36px;
              background: ${color};
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 14px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ">
              ${number}
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
      };

      // Berlin marker (starting point)
      L.marker(cityCoordinates.Berlin, {
        icon: L.divIcon({
          className: "custom-start-marker",
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background: #22c55e;
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
      }).addTo(map).bindPopup("Berlin (Start)");

      // City markers
      cityStops.forEach((city, index) => {
        const coords = cityCoordinates[city.name];
        if (!coords) return;
        L.marker(coords, {
          icon: createNumberedIcon(index + 1),
        }).addTo(map).bindPopup(`<b>${city.name}</b><br/>${city.dates}`);
      });

      // Fit bounds
      const bounds = L.latLngBounds(allCoordinates.map(coord => L.latLng(coord[0], coord[1])));
      map.fitBounds(bounds, { padding: [50, 50] });

      setIsLoaded(true);
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [cityStops]);

  return (
    <div className="w-full h-full relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export function MapDialog({ open, onClose, cityStops }: MapDialogProps) {
  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl h-[80vh] mx-4 bg-card rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between p-4 bg-gradient-to-b from-background/90 to-transparent">
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-card/90 hover:bg-card transition-colors shadow-lg"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
              <h2 className="text-lg font-semibold text-foreground bg-card/90 px-4 py-2 rounded-full shadow-lg">
                Map
              </h2>
              <div className="w-9" /> {/* Spacer for centering */}
            </div>

            {/* Map */}
            <LeafletMap cityStops={cityStops} />

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 border-t-2 border-dashed border-red-600" />
                  <span className="text-muted-foreground">Flight</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-blue-600 rounded" />
                  <span className="text-muted-foreground">Ground</span>
                </div>
              </div>
            </div>

            {/* City list */}
            <div className="absolute bottom-4 right-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
              <h3 className="text-sm font-medium text-foreground mb-2">Your Route</h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                  <span className="text-muted-foreground">Berlin (Start)</span>
                </div>
                {cityStops.map((city, index) => (
                  <div key={city.id} className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 bg-foreground rounded-full flex items-center justify-center text-background text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-foreground">{city.name}</span>
                    <span className="text-muted-foreground text-xs">({city.dates})</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
