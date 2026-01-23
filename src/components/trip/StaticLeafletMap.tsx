import { useEffect, useRef, useState } from "react";

interface StaticLeafletMapProps {
  coordinates: [number, number][];
  center: [number, number];
  zoom?: number;
  className?: string;
  selectedIndex?: number | null;
}

export function StaticLeafletMap({ 
  coordinates, 
  center, 
  zoom = 7,
  className = "",
  selectedIndex = null
}: StaticLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const prevCenterRef = useRef<[number, number]>(center);
  const prevZoomRef = useRef<number>(zoom);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

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
      const createNumberedIcon = (num: number, isSelected: boolean = false) => {
        return L.divIcon({
          className: "custom-numbered-marker",
          html: `<div style="
            background: ${isSelected ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'};
            color: ${isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--background))'};
            width: ${isSelected ? '36px' : '28px'};
            height: ${isSelected ? '36px' : '28px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: ${isSelected ? '16px' : '14px'};
            box-shadow: ${isSelected ? '0 0 0 4px hsla(var(--primary) / 0.3), 0 4px 12px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)'};
            transition: all 0.3s ease;
          ">${num}</div>`,
          iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
          iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14],
        });
      };

      // Add markers and store references
      markersRef.current = coordinates.map((coord, index) => {
        const marker = L.marker(coord, { icon: createNumberedIcon(index + 1, selectedIndex === index) }).addTo(map);
        return marker;
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
      setIsMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
        setIsMapReady(false);
      }
    };
  }, [coordinates]);

  // Animate to new center/zoom when props change
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const centerChanged = prevCenterRef.current[0] !== center[0] || prevCenterRef.current[1] !== center[1];
    const zoomChanged = prevZoomRef.current !== zoom;

    if (centerChanged || zoomChanged) {
      mapInstanceRef.current.flyTo(center, zoom, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
      prevCenterRef.current = center;
      prevZoomRef.current = zoom;
    }
  }, [center, zoom, isMapReady]);

  // Update marker styles when selectedIndex changes
  useEffect(() => {
    if (!isMapReady) return;

    const updateMarkerIcons = async () => {
      const L = await import("leaflet");
      
      const createNumberedIcon = (num: number, isSelected: boolean = false) => {
        return L.divIcon({
          className: "custom-numbered-marker",
          html: `<div style="
            background: ${isSelected ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'};
            color: ${isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--background))'};
            width: ${isSelected ? '36px' : '28px'};
            height: ${isSelected ? '36px' : '28px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: ${isSelected ? '16px' : '14px'};
            box-shadow: ${isSelected ? '0 0 0 4px hsla(var(--primary) / 0.3), 0 4px 12px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)'};
            transition: all 0.3s ease;
          ">${num}</div>`,
          iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
          iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14],
        });
      };

      markersRef.current.forEach((marker, index) => {
        marker.setIcon(createNumberedIcon(index + 1, selectedIndex === index));
      });
    };

    updateMarkerIcons();
  }, [selectedIndex, isMapReady]);

  return (
    <div 
      ref={mapContainerRef} 
      className={`w-full h-full ${className}`}
      style={{ pointerEvents: "none" }}
    />
  );
}
