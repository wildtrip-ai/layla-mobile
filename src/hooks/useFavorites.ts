import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export type FavoriteCategory = 'destinations' | 'cities' | 'restaurants' | 'museums' | 'historicalSites' | 'naturalAttractions' | 'amenities';

export interface FavoriteKey {
  category: FavoriteCategory;
  countrySlug: string;
  itemId: string;
}

const STORAGE_KEY = 'favorites';

function getFavoriteKeyString(key: FavoriteKey): string {
  return `${key.category}:${key.countrySlug}:${key.itemId}`;
}

function parseFavoriteKeyString(str: string): FavoriteKey | null {
  const parts = str.split(':');
  if (parts.length !== 3) return null;
  return {
    category: parts[0] as FavoriteCategory,
    countrySlug: parts[1],
    itemId: parts[2],
  };
}

export function useFavorites() {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
    
    // Also migrate old favorites format
    const oldFavorites = localStorage.getItem('favoriteDestinations');
    if (oldFavorites) {
      try {
        const old = JSON.parse(oldFavorites);
        const migrated = old.map((key: string) => {
          const [countrySlug, itemId] = key.split('-');
          return `destinations:${countrySlug}:${itemId}`;
        });
        const current = stored ? JSON.parse(stored) : [];
        const merged = [...new Set([...current, ...migrated])];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        localStorage.removeItem('favoriteDestinations');
        setFavorites(merged);
      } catch {
        // ignore migration errors
      }
    }
  }, []);

  const isFavorite = useCallback((key: FavoriteKey): boolean => {
    return favorites.includes(getFavoriteKeyString(key));
  }, [favorites]);

  const toggleFavorite = useCallback((key: FavoriteKey, itemName: string) => {
    const keyString = getFavoriteKeyString(key);
    const isCurrentlyFavorite = favorites.includes(keyString);
    
    let newFavorites: string[];
    if (isCurrentlyFavorite) {
      newFavorites = favorites.filter(f => f !== keyString);
      toast({
        title: "Removed from favorites",
        description: `${itemName} has been removed from your favorites.`,
      });
    } else {
      newFavorites = [...favorites, keyString];
      toast({
        title: "Added to favorites",
        description: `${itemName} has been saved to your favorites.`,
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  }, [favorites, toast]);

  const getFavoritesByCategory = useCallback((category: FavoriteCategory): FavoriteKey[] => {
    return favorites
      .map(parseFavoriteKeyString)
      .filter((key): key is FavoriteKey => key !== null && key.category === category);
  }, [favorites]);

  const getAllFavorites = useCallback((): FavoriteKey[] => {
    return favorites
      .map(parseFavoriteKeyString)
      .filter((key): key is FavoriteKey => key !== null);
  }, [favorites]);

  const getCategoryCount = useCallback((category: FavoriteCategory): number => {
    return getFavoritesByCategory(category).length;
  }, [getFavoritesByCategory]);

  const getTotalCount = useCallback((): number => {
    return favorites.length;
  }, [favorites]);

  return {
    isFavorite,
    toggleFavorite,
    getFavoritesByCategory,
    getAllFavorites,
    getCategoryCount,
    getTotalCount,
  };
}
