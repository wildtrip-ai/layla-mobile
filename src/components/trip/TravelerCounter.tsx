import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TravelerCounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  icon: React.ReactNode;
}

export function TravelerCounter({
  label,
  value,
  onChange,
  min = 0,
  max = 20,
  icon,
}: TravelerCounterProps) {
  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-foreground font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={decrement}
          disabled={value <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center text-foreground font-medium">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={increment}
          disabled={value >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
