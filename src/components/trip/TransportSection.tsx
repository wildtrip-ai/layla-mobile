import { motion } from "framer-motion";
import { Plane, Car, MapPinOff } from "lucide-react";
import { TransportCard } from "./TransportCard";
import type { Transport } from "@/data/tripData";

interface TransportSectionProps {
  transports: Transport[];
  cityName?: string;
  isFirstCity?: boolean;
}

export function TransportSection({ transports, cityName, isFirstCity = false }: TransportSectionProps) {
  // Determine header based on context
  const getHeader = () => {
    if (!cityName) return "Transport";
    if (isFirstCity) return `Getting to ${cityName}`;
    return `Transfer to ${cityName}`;
  };

  // Determine icon based on transport types
  const hasFlights = transports.some(t => t.type === "flight");
  const Icon = hasFlights ? Plane : Car;

  // Get display date from first transport
  const displayDate = transports.length > 0 ? transports[0].departureDate : "";

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
        <Icon className="h-6 w-6 text-foreground" />
        <div>
          <h2 className="text-2xl font-serif text-foreground">{getHeader()}</h2>
          {displayDate && <p className="text-sm text-muted-foreground">{displayDate}, 2026</p>}
        </div>
      </div>

      {/* Transport Cards */}
      {transports.length > 0 ? (
        <div className="space-y-4">
          {transports.map((transport) => (
            <TransportCard key={transport.id} transport={transport} />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <MapPinOff className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No transport scheduled for {cityName || "this city"}</p>
        </div>
      )}
    </motion.div>
  );
}
