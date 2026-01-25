import { Download, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ShareButton";

interface BookingStickyBarProps {
  tripTitle: string;
  tripDates: string;
  onBook?: () => void;
}

export function BookingStickyBar({ tripTitle, tripDates, onBook }: BookingStickyBarProps) {
  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log("Downloading trip...");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-50">
      <div className="container mx-auto px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-4">
          {/* Left Actions */}
          <div className="flex items-center gap-2">
            <ShareButton
              title={tripTitle}
              text={`Check out my trip: ${tripTitle} (${tripDates})`}
              size="default"
              className="!bg-card !border !border-border !shadow-none hover:!bg-secondary/50"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownload}
              className="h-10 w-10 md:w-auto md:px-4 md:gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden md:inline">Download</span>
            </Button>
          </div>

          {/* Book Button */}
          <Button
            variant="default"
            size="lg"
            onClick={onBook}
            className="gap-2 bg-primary min-w-[120px]"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Book</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
