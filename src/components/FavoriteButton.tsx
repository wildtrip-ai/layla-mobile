import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites, FavoriteCategory } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginDialog } from "@/contexts/LoginDialogContext";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FavoriteButtonProps {
  category: FavoriteCategory;
  countrySlug: string;
  itemId: string;
  itemName: string;
  className?: string;
  size?: "sm" | "default";
  placeId?: string;
}

export function FavoriteButton({
  category,
  countrySlug,
  itemId,
  itemName,
  className,
  size = "default",
  placeId,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { openLoginDialog } = useLoginDialog();
  const [isLoading, setIsLoading] = useState(false);

  const key = { category, countrySlug, itemId };
  const favorite = isFavorite(key);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If not authenticated, show login dialog
    if (!isAuthenticated) {
      openLoginDialog();
      return;
    }

    setIsLoading(true);
    try {
      await toggleFavorite(key, itemName, placeId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "rounded-full bg-white/90 hover:bg-white shadow-md transition-all",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        className
      )}
    >
      <Heart
        className={cn(
          "transition-colors",
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          favorite ? "fill-red-500 text-red-500" : "text-muted-foreground",
          isLoading && "opacity-50"
        )}
      />
    </Button>
  );
}
