import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Link2, Share2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ShareTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  tripTitle: string;
}

export function ShareTripDialog({
  open,
  onOpenChange,
  tripId,
  tripTitle,
}: ShareTripDialogProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = `${window.location.origin}/trip/${tripId}?shared=true`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this link with friends and family.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tripTitle,
          text: `Check out my trip: ${tripTitle}`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif">
            <Share2 className="h-5 w-5 text-primary" />
            Share Trip
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Share "<span className="font-medium text-foreground">{tripTitle}</span>" with friends and family using the link below.
          </p>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                readOnly
                value={shareUrl}
                className="pl-9 pr-4 text-sm bg-muted/50"
                onFocus={(e) => e.target.select()}
              />
            </div>
            <Button
              onClick={handleCopy}
              variant={copied ? "default" : "outline"}
              className="shrink-0 min-w-[100px]"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="copied"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5"
                  >
                    <Check className="h-4 w-4" />
                    Copied
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>

          {typeof navigator.share === "function" && (
            <Button
              onClick={handleNativeShare}
              variant="outline"
              className="w-full"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share via...
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
