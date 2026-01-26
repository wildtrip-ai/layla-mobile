import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { VoyagerChat } from "./VoyagerChat";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import type { TripData } from "@/data/tripData";

interface MobileChatDrawerProps {
  initialMessage?: string | null;
  mode?: string | null;
  onTripGenerated?: (trip: TripData) => void;
  onGeneratingChange?: (isGenerating: boolean) => void;
}

export function MobileChatDrawer({
  initialMessage,
  mode,
  onTripGenerated,
  onGeneratingChange,
}: MobileChatDrawerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const haptics = useHapticFeedback();

  // Haptic feedback on drawer open/close
  useEffect(() => {
    if (isOpen) {
      haptics.medium();
    }
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      haptics.light(); // Light feedback on close
    }
    setIsOpen(open);
  };

  const handleFabClick = () => {
    haptics.medium();
    setIsOpen(true);
  };

  const handleCloseClick = () => {
    haptics.light();
    setIsOpen(false);
  };

  const handleTripGenerated = (trip: TripData) => {
    haptics.success(); // Success feedback when trip is generated
    onTripGenerated?.(trip);
    // Optionally close drawer after trip is generated
    setTimeout(() => setIsOpen(false), 1000);
  };

  const handleGeneratingChange = (generating: boolean) => {
    if (generating) {
      haptics.selection(); // Selection feedback when generation starts
    }
    onGeneratingChange?.(generating);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={handleFabClick}
        variant="hero"
        size="lg"
        className="fixed bottom-6 right-6 z-40 rounded-full h-14 w-14 shadow-lg lg:hidden active:scale-95 transition-transform"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Drawer with swipe-to-close (built into vaul) */}
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerContent className="h-[85vh] max-h-[85vh]">
          <DrawerHeader className="flex items-center justify-between border-b border-border pb-4">
            <DrawerTitle className="text-lg font-semibold">
              Plan Your Trip
            </DrawerTitle>
            <DrawerClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleCloseClick}
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          
          <div className="flex-1 overflow-hidden">
            <VoyagerChat
              mode="create"
              variant="embedded"
              initialMessage={initialMessage}
              inspireMode={mode === "inspire"}
              onTripGenerated={handleTripGenerated}
              onGeneratingChange={handleGeneratingChange}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
