import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
  size?: "sm" | "default";
}

export function ShareButton({
  title,
  text,
  url,
  className,
  size = "default",
}: ShareButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || `Check out ${title}`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fall through to clipboard
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually from your browser.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleShare}
      className={cn(
        "rounded-full bg-white/90 hover:bg-white shadow-md transition-all",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        className
      )}
    >
      {copied ? (
        <Check
          className={cn(
            "text-green-600 transition-colors",
            size === "sm" ? "h-4 w-4" : "h-5 w-5"
          )}
        />
      ) : (
        <Share2
          className={cn(
            "text-muted-foreground transition-colors",
            size === "sm" ? "h-4 w-4" : "h-5 w-5"
          )}
        />
      )}
    </Button>
  );
}
