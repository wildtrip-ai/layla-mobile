import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, MapPin, Utensils } from "lucide-react";
import { Activity } from "@/data/tripData";

// City coordinates for Jordan trip
const cityCoordinates: Record<string, [number, number]> = {
  Berlin: [52.52, 13.405],
  Amman: [31.9454, 35.9284],
  "Wadi Rum": [29.5328, 35.4194],
  Petra: [30.3285, 35.4444],
  "Dead Sea": [31.5, 35.5],
};

// Activity coordinates (approximate locations in Amman)
const activityCoordinates: Record<string, [number, number]> = {
  "Rainbow Street": [31.9515, 35.9243],
  "Fakhreldin Restaurant": [31.9568, 35.9142],
  "Amman Walking Tour: Hidden Gems, Culture & Street Food": [31.9520, 35.9310],
  "Amman Citadel (Jabal al-Qalaa)": [31.9582, 35.9340],
  "Jordan Archaeological Museum": [31.9580, 35.9335],
  "Amman Roman Theater": [31.9512, 35.9365],
  "Hashem Restaurant": [31.9505, 35.9350],
};

interface MapDialogProps {
  open: boolean;
  onClose: () => void;
  cityStops: { id: string; name: string; dates: string }[];
  activities?: Activity[];
  targetCityIndex?: number | null;
}

// Lazy load leaflet components
const LeafletMap = ({ 
  cityStops, 
  activities = [],
  onCityClick 
}: { 
  cityStops: { id: string; name: string; dates: string }[];
  activities?: Activity[];
  onCityClick?: (coords: [number, number], zoom: number) => void;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Expose flyTo function
  const flyToLocation = useCallback((coords: [number, number], zoom: number = 14) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, zoom, { duration: 1.2 });
    }
  }, []);

  // Store flyTo in ref for parent access
  useEffect(() => {
    if (onCityClick) {
      (window as any).__mapFlyTo = flyToLocation;
    }
    return () => {
      delete (window as any).__mapFlyTo;
    };
  }, [flyToLocation, onCityClick]);

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

      // Helper to animate polyline drawing
      const animatePolyline = (polyline: any, duration: number, delay: number = 0) => {
        const path = polyline.getElement();
        if (!path) return;
        
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.transition = 'none';
        
        // Force reflow
        path.getBoundingClientRect();
        
        setTimeout(() => {
          path.style.transition = `stroke-dashoffset ${duration}ms ease-out`;
          path.style.strokeDashoffset = '0';
        }, delay);
      };

      // Flight route (Berlin to Amman) - curved polyline
      const flightRoute: [number, number][] = [
        cityCoordinates.Berlin,
        [45, 25], // Intermediate point for curve
        cityCoordinates.Amman,
      ];

      const flightPolyline = L.polyline(flightRoute, {
        color: "#dc2626",
        weight: 3,
        dashArray: "10, 10",
        opacity: 0.8,
      }).addTo(map);

      // Ground route between Jordan cities
      const groundPolyline = L.polyline(routeCoordinates, {
        color: "#2563eb",
        weight: 4,
        opacity: 0.9,
      }).addTo(map);

      // Animate routes after map renders
      setTimeout(() => {
        animatePolyline(flightPolyline, 1500, 300);
        animatePolyline(groundPolyline, 1200, 1500);
      }, 100);

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

      // Create activity icon
      const createActivityIcon = () => {
        return L.divIcon({
          className: "custom-activity-marker",
          html: `
            <div style="
              width: 28px;
              height: 28px;
              background: #22c55e;
              border: 2px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 3px 8px rgba(0,0,0,0.25);
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
      };

      // Create restaurant icon
      const createRestaurantIcon = () => {
        return L.divIcon({
          className: "custom-restaurant-marker",
          html: `
            <div style="
              width: 28px;
              height: 28px;
              background: #f97316;
              border: 2px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 3px 8px rgba(0,0,0,0.25);
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                <path d="M7 2v20"/>
                <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
              </svg>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
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

      // Activity and restaurant markers
      activities.forEach((activity) => {
        const coords = activityCoordinates[activity.title];
        if (!coords) return;
        
        const icon = activity.type === "restaurant" 
          ? createRestaurantIcon() 
          : createActivityIcon();
        
        const popupContent = activity.type === "restaurant"
          ? `<b>🍴 ${activity.title}</b><br/>${activity.location || ""}<br/>⭐ ${activity.rating || "N/A"}`
          : `<b>📍 ${activity.title}</b><br/>${activity.location || ""}<br/>${activity.duration || ""}`;
        
        L.marker(coords, { icon }).addTo(map).bindPopup(popupContent);
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
  }, [cityStops, activities]);

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

export function MapDialog({ open, onClose, cityStops, activities = [], targetCityIndex }: MapDialogProps) {
  const [hasAnimated, setHasAnimated] = useState(false);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Animate to target city when dialog opens with a target
  useEffect(() => {
    if (open && targetCityIndex !== null && targetCityIndex !== undefined && !hasAnimated) {
      const cityName = cityStops[targetCityIndex]?.name;
      if (cityName) {
        const coords = cityCoordinates[cityName];
        if (coords) {
          // Wait for map to initialize before flying
          const timer = setTimeout(() => {
            if ((window as any).__mapFlyTo) {
              (window as any).__mapFlyTo(coords, 12);
              setHasAnimated(true);
            }
          }, 600);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [open, targetCityIndex, cityStops, hasAnimated]);

  // Reset animation flag when dialog closes
  useEffect(() => {
    if (!open) {
      setHasAnimated(false);
    }
  }, [open]);

  const handleCityClick = (cityName: string) => {
    const coords = cityCoordinates[cityName];
    if (coords && (window as any).__mapFlyTo) {
      (window as any).__mapFlyTo(coords, 12);
    }
  };

  const handleStartClick = () => {
    if ((window as any).__mapFlyTo) {
      (window as any).__mapFlyTo(cityCoordinates.Berlin, 10);
    }
  };

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
            <LeafletMap 
              cityStops={cityStops} 
              activities={activities}
              onCityClick={() => {}}
            />

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
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-muted-foreground">Activity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <Utensils className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-muted-foreground">Restaurant</span>
                </div>
              </div>
            </div>

            {/* City list - now clickable */}
            <div className="absolute bottom-4 right-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
              <h3 className="text-sm font-medium text-foreground mb-2">Your Route</h3>
              <div className="space-y-1.5">
                <button
                  onClick={handleStartClick}
                  className="flex items-center gap-2 text-sm w-full text-left hover:bg-muted/50 rounded-lg px-2 py-1 -mx-2 transition-colors"
                >
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                  <span className="text-muted-foreground hover:text-foreground transition-colors">Berlin (Start)</span>
                </button>
                {cityStops.map((city, index) => (
                  <button
                    key={city.id}
                    onClick={() => handleCityClick(city.name)}
                    className="flex items-center gap-2 text-sm w-full text-left hover:bg-muted/50 rounded-lg px-2 py-1 -mx-2 transition-colors"
                  >
                    <div className="w-5 h-5 bg-foreground rounded-full flex items-center justify-center text-background text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-foreground">{city.name}</span>
                    <span className="text-muted-foreground text-xs">({city.dates})</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
