import { useState, useEffect, useCallback } from "react";
import { getStoredToken } from "@/lib/auth";

export type FavoriteCategory = 'destinations' | 'cities' | 'restaurants' | 'museums' | 'historical_sites' | 'natural_attractions' | 'amenities' | 'accommodations' | 'activities';

export interface FavoriteItem {
  id: string;
  category: FavoriteCategory;
  country_slug: string;
  country_name: string;
  place_id: string;
  item_name: string;
  item_image_url: string;
  item_rating: number | null;
  created_at: string;
}

interface FavoritesResponse {
  items: FavoriteItem[];
  next_cursor: string | null;
  has_more: boolean;
}

interface FavoritesCountResponse {
  total: number;
  by_category: Record<string, number>;
}

interface UseFavoritesApiResult {
  favorites: FavoriteItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  count: FavoritesCountResponse | null;
}

const API_BASE = "https://internal-api.emiratesescape.com/v1.0";

export function useFavoritesApi(category?: FavoriteCategory): UseFavoritesApiResult {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [count, setCount] = useState<FavoritesCountResponse | null>(null);

  const fetchFavorites = useCallback(async (cursor?: string | null, append = false) => {
    const token = getStoredToken();
    if (!token) {
      setError("Not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const params = new URLSearchParams();
      if (category) {
        params.append('category', category);
      }
      if (cursor) {
        params.append('cursor', cursor);
      }

      const url = `${API_BASE}/favorites${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FavoritesResponse = await response.json();

      if (append) {
        setFavorites(prev => [...prev, ...data.items]);
      } else {
        setFavorites(data.items);
      }

      setNextCursor(data.next_cursor);
      setHasMore(data.has_more);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch favorites");
      console.error("Failed to fetch favorites:", err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [category]);

  const fetchCount = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/favorites/count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FavoritesCountResponse = await response.json();
      setCount(data);
    } catch (err) {
      console.error("Failed to fetch favorites count:", err);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !nextCursor) return;
    await fetchFavorites(nextCursor, true);
  }, [hasMore, isLoadingMore, nextCursor, fetchFavorites]);

  const refresh = useCallback(async () => {
    setFavorites([]);
    setNextCursor(null);
    setHasMore(false);
    await Promise.all([
      fetchFavorites(null, false),
      fetchCount()
    ]);
  }, [fetchFavorites, fetchCount]);

  useEffect(() => {
    refresh();
  }, [category]); // Only re-fetch when category changes

  return {
    favorites,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    count,
  };
}
