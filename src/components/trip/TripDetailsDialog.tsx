import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripStopRow } from "./TripStopRow";
import { TravelerCounter } from "./TravelerCounter";
import type { TripData } from "@/data/tripData";

export interface EditableTripData {
  stops: Array<{
    id: string;
    origin: string;
    destination: string;
    transportType: "flight" | "car";
    date: Date;
    isSkipped: boolean;
  }>;
  adults: number;
  children: number;
}

interface TripDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripData: TripData;
  onApply: (updatedData: EditableTripData) => void;
}

export function TripDetailsDialog({
  open,
  onOpenChange,
  tripData,
  onApply,
}: TripDetailsDialogProps) {
  const [editableData, setEditableData] = useState<EditableTripData>(() =>
    initializeEditableData(tripData)
  );

  // Reset editable data when dialog opens
  useEffect(() => {
    if (open) {
      setEditableData(initializeEditableData(tripData));
    }
  }, [open, tripData]);

  const handleDateChange = (stopId: string, newDate: Date) => {
    setEditableData((prev) => ({
      ...prev,
      stops: prev.stops.map((stop) =>
        stop.id === stopId ? { ...stop, date: newDate } : stop
      ),
    }));
  };

  const handleToggleSkip = (stopId: string) => {
    setEditableData((prev) => ({
      ...prev,
      stops: prev.stops.map((stop) =>
        stop.id === stopId ? { ...stop, isSkipped: !stop.isSkipped } : stop
      ),
    }));
  };

  const handleAdultsChange = (value: number) => {
    setEditableData((prev) => ({ ...prev, adults: value }));
  };

  const handleChildrenChange = (value: number) => {
    setEditableData((prev) => ({ ...prev, children: value }));
  };

  const handleApply = () => {
    onApply(editableData);
    onOpenChange(false);
  };

  // Count non-skipped stops to prevent removing all
  const activeStops = editableData.stops.filter((s) => !s.isSkipped).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          {/* Dialog Container - Centered */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="w-full max-w-lg mx-4 pointer-events-auto"
            >
              <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                  Select Your Stay Details
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Trip Overview */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Trip Overview
                  </h3>
                  <div className="space-y-2">
                    {editableData.stops.map((stop, index) => (
                      <TripStopRow
                        key={stop.id}
                        index={index + 1}
                        origin={stop.origin}
                        destination={stop.destination}
                        transportType={stop.transportType}
                        date={stop.date}
                        onDateChange={(date) => handleDateChange(stop.id, date)}
                        onRemove={() => handleToggleSkip(stop.id)}
                        canRemove={activeStops > 1 || stop.isSkipped}
                        isSkipped={stop.isSkipped}
                      />
                    ))}
                  </div>
                </div>

                {/* Travelers */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Travelers
                  </h3>
                  <div className="bg-secondary/50 rounded-lg px-4">
                    <TravelerCounter
                      label="Adults"
                      value={editableData.adults}
                      onChange={handleAdultsChange}
                      min={1}
                      icon={<Users className="h-5 w-5" />}
                    />
                    <div className="h-px bg-border" />
                    <TravelerCounter
                      label="Children"
                      value={editableData.children}
                      onChange={handleChildrenChange}
                      min={0}
                      icon={<Baby className="h-5 w-5" />}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border">
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleApply}
                >
                  Apply
                </Button>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function initializeEditableData(tripData: TripData): EditableTripData {
  // Create stops from city stops data
  const stops = tripData.cityStops.map((city, index) => {
    const previousCity = index === 0 ? "Berlin" : tripData.cityStops[index - 1].name;
    return {
      id: city.id,
      origin: previousCity,
      destination: city.name,
      transportType: (index === 0 ? "flight" : "car") as "flight" | "car",
      date: new Date(), // Default to today, can be enhanced with actual dates
      isSkipped: false,
    };
  });

  return {
    stops,
    adults: tripData.travelers,
    children: 0,
  };
}
