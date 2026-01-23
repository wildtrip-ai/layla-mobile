import { format } from "date-fns";
import { Plane, Car, X, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TripStopRowProps {
  index: number;
  origin: string;
  destination: string;
  transportType: "flight" | "car";
  date: Date;
  onDateChange: (date: Date) => void;
  onRemove: () => void;
  canRemove: boolean;
  isSkipped: boolean;
}

export function TripStopRow({
  index,
  origin,
  destination,
  transportType,
  date,
  onDateChange,
  onRemove,
  canRemove,
  isSkipped,
}: TripStopRowProps) {
  const TransportIcon = transportType === "flight" ? Plane : Car;

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3 px-4 rounded-lg transition-colors",
        isSkipped
          ? "bg-muted/50 opacity-50"
          : "bg-secondary/50 hover:bg-secondary"
      )}
    >
      {/* Stop Number */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-sm font-medium text-primary">{index}</span>
      </div>

      {/* Origin */}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground truncate">
          {origin}
        </span>
      </div>

      {/* Transport Icon */}
      <div className="flex-shrink-0 text-muted-foreground">
        <TransportIcon className="h-4 w-4" />
      </div>

      {/* Destination */}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground truncate">
          {destination}
        </span>
      </div>

      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "justify-start text-left font-normal min-w-[130px]",
              !date && "text-muted-foreground"
            )}
            disabled={isSkipped}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "MMM d, yyyy") : "Pick date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[60]" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && onDateChange(newDate)}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={onRemove}
        disabled={!canRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
