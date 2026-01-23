import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Plus, Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Accommodation } from "@/data/tripData";

// Hotel locations in Amman (sample coordinates)
const hotelCoordinates: Record<string, [number, number]> = {
  "a1": [31.9539, 35.9106], // W Amman
  "a2": [31.9580, 35.8950], // Ritz-Carlton
  "a3": [31.9520, 35.9000], // St. Regis
  "a4": [31.9600, 35.9150], // Fairmont
};

function getRatingLabel(rating: number): string {
  if (rating >= 9.5) return "Wonderful";
  if (rating >= 9.0) return "Excellent";
  if (rating >= 8.5) return "Very Good";
  if (rating >= 8.0) return "Good";
  return "Pleasant";
}

interface AccommodationMapProps {
  accommodations: Accommodation[];
  onClose: () => void;
}

export function AccommodationMap({ accommodations, onClose }: AccommodationMapProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Accommodation | null>(null);
  const [addedHotels, setAddedHotels] = useState<Set<string>>(new Set(["a1"]));

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      if (!isMounted || !mapRef.current) return;

      // Create map centered on Amman
      const map = L.map(mapRef.current, {
        center: [31.9550, 35.9100],
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
      });

      // Add tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add hotel markers
      accommodations.forEach((hotel) => {
        const coords = hotelCoordinates[hotel.id];
        if (!coords) return;

        const isAdded = addedHotels.has(hotel.id);

        // Create custom marker
        const markerHtml = `
          <div class="relative flex items-center justify-center">
            <div class="bg-primary text-primary-foreground px-2 py-1 rounded-lg shadow-lg text-xs font-semibold whitespace-nowrap ${
              isAdded ? "ring-2 ring-teal-500" : ""
            }">
              ${hotel.price}
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45"></div>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: "custom-hotel-marker",
          iconSize: [80, 40],
          iconAnchor: [40, 40],
        });

        const marker = L.marker(coords, { icon }).addTo(map);

        marker.on("click", () => {
          setSelectedHotel(hotel);
        });
      });
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [accommodations]);

  const toggleAddHotel = (hotelId: string) => {
    setAddedHotels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(hotelId)) {
        newSet.delete(hotelId);
      } else {
        newSet.add(hotelId);
      }
      return newSet;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div>
            <h2 className="text-lg font-serif font-medium text-foreground">
              Accommodation in Amman
            </h2>
            <p className="text-sm text-muted-foreground">
              {accommodations.length} hotels available
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} className="w-full h-full pt-16" />

      {/* Selected Hotel Card */}
      {selectedHotel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[400px] bg-card rounded-xl border border-border shadow-xl overflow-hidden"
        >
          <button
            className="absolute top-2 right-2 z-10 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
            onClick={() => setSelectedHotel(null)}
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex gap-4 p-4">
            {/* Image */}
            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
              <img
                src={selectedHotel.image}
                alt={selectedHotel.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-0.5 mb-1">
                {Array.from({ length: selectedHotel.stars }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h3 className="font-medium text-foreground truncate">
                {selectedHotel.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-teal-500 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                  {selectedHotel.rating}
                </span>
                <span className="text-xs text-muted-foreground">
                  {getRatingLabel(selectedHotel.rating)} · {selectedHotel.reviews.toLocaleString()} reviews
                </span>
              </div>
              <div className="mt-2">
                <span className="text-lg font-bold text-foreground">{selectedHotel.price}</span>
                <span className="text-xs text-muted-foreground ml-1">total</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 p-4 pt-0">
            <Button
              variant={addedHotels.has(selectedHotel.id) ? "secondary" : "outline"}
              className="flex-1"
              onClick={() => toggleAddHotel(selectedHotel.id)}
            >
              {addedHotels.has(selectedHotel.id) ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Added
                  <ChevronDown className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Trip
                </>
              )}
            </Button>
            <Button className="flex-1" onClick={() => navigate(`/trip/${id || "jordan-honeymoon"}/accommodation/${selectedHotel.id}`)}>View Details</Button>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 right-4 bg-card rounded-lg border border-border px-3 py-2 shadow-lg hidden md:block">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded bg-primary" />
          <span>Click markers for details</span>
        </div>
      </div>
    </motion.div>
  );
}