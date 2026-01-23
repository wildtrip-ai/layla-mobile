import { motion } from "framer-motion";
import { Plane, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Transport } from "@/data/tripData";

interface TransportCardProps {
  transport: Transport;
}

export function TransportCard({ transport }: TransportCardProps) {
  const Icon = transport.type === "flight" ? Plane : Car;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-xl border border-border p-4 md:p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="gap-1">
          {transport.type === "flight" ? "Flight" : "Airport Transfer"}
        </Badge>
      </div>

      {transport.type === "flight" ? (
        <div className="space-y-4">
          <Badge variant="secondary">Estimated</Badge>
          
          <div className="flex items-center justify-between gap-4">
            {/* Departure */}
            <div className="text-left">
              <p className="text-sm text-muted-foreground">{transport.from}</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{transport.fromCode}</p>
              <p className="text-sm text-muted-foreground">
                {transport.departureDate}, {transport.departureTime}
              </p>
            </div>

            {/* Duration */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <p className="text-sm text-muted-foreground">{transport.duration}</p>
              <div className="flex items-center gap-2 w-full">
                <div className="h-px flex-1 bg-border" />
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div className="h-px flex-1 bg-border" />
              </div>
              <p className="text-sm text-muted-foreground">{transport.stops}</p>
            </div>

            {/* Arrival */}
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{transport.to}</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{transport.toCode}</p>
              <p className="text-sm text-muted-foreground">
                {transport.arrivalDate}, {transport.arrivalTime}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">{transport.travelers} travellers</p>
              <p className="font-semibold text-foreground">From {transport.price}</p>
            </div>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              Get Live Prices
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-24 h-16 bg-secondary rounded-lg flex items-center justify-center">
            <Car className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground">{transport.title}</h4>
            <p className="text-sm text-muted-foreground">{transport.from}</p>
            <p className="text-sm text-muted-foreground">{transport.duration}</p>
            <p className="font-medium text-foreground mt-1">From {transport.price}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
