import { useEffect, useRef } from "react";

interface StaticLeafletMapProps {
  coordinates: [number, number][];
  center: [number, number];
  zoom?: number;
  className?: string;
}

export function StaticLeafletMap({ 
  coordinates, 
  center, 
  zoom = 7,
  className = ""
}: StaticLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Dynamic import of Leaflet
    const initMap = async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      // Create map with all interactions disabled
      const map = L.map(mapContainerRef.current!, {
        center: center,
        zoom: zoom,
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        keyboard: false,
        dragging: false,
        attributionControl: false,
      });

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Custom numbered marker
      const createNumberedIcon = (num: number) => {
        return L.divIcon({
          className: "custom-numbered-marker",
          html: `<div style="
            background: hsl(var(--foreground));
            color: hsl(var(--background));
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">${num}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
      };

      // Add markers
      coordinates.forEach((coord, index) => {
        L.marker(coord, { icon: createNumberedIcon(index + 1) }).addTo(map);
      });

      // Draw route line
      if (coordinates.length >= 2) {
        L.polyline(coordinates, {
          color: "#3b82f6",
          weight: 3,
          opacity: 0.7,
          dashArray: "8, 8",
        }).addTo(map);
      }

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, center, zoom]);

  return (
    <div 
      ref={mapContainerRef} 
      className={`w-full h-full ${className}`}
      style={{ pointerEvents: "none" }}
    />
  );
}
