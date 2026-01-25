import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites, FavoriteCategory } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  category: FavoriteCategory;
  countrySlug: string;
  itemId: string;
  itemName: string;
  className?: string;
  size?: "sm" | "default";
}

export function FavoriteButton({
  category,
  countrySlug,
  itemId,
  itemName,
  className,
  size = "default",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const key = { category, countrySlug, itemId };
  const favorite = isFavorite(key);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(key, itemName);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
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
          favorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
        )}
      />
    </Button>
  );
}
