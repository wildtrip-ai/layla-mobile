import { useState, useEffect, useCallback } from "react";
import { getStoredToken } from "@/lib/auth";

export type TripStatus = 'upcoming' | 'past' | 'draft';

export interface TripApiItem {
  id: string;
  title: string;
  image_url: string;
  start_date: string;
  end_date: string;
  status: TripStatus;
  stats: {
    total_days: number;
    total_cities: number;
  };
}

interface TripsResponse {
  items: TripApiItem[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface SavedTrip {
  id: string;
  title: string;
  image: string;
  dates: string;
  status: TripStatus;
  stats: {
    days: number;
    cities: number;
  };
  lastModified: string;
}

interface UseTripsApiResult {
  trips: SavedTrip[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

const API_BASE = "https://internal-api.emiratesescape.com/v1.0";

/**
 * Formats date range from start and end dates
 * Example: "Jun 15 - 25, 2025" or "TBD" for drafts
 */
function formatDateRange(startDate: string, endDate: string, status: TripStatus): string {
  if (status === 'draft' || !startDate || !endDate) {
    return 'TBD';
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const endDay = end.getDate();
    const year = end.getFullYear();

    // If same month: "Jun 15 - 25, 2025"
    if (start.getMonth() === end.getMonth()) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    }

    // Different months: "May 30 - Jun 5, 2025"
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  } catch (err) {
    console.error('Error formatting date range:', err);
    return 'TBD';
  }
}

/**
 * Maps API response item to SavedTrip format
 */
function mapTripApiToSavedTrip(apiItem: TripApiItem): SavedTrip {
  return {
    id: apiItem.id,
    title: apiItem.title,
    image: apiItem.image_url,
    dates: formatDateRange(apiItem.start_date, apiItem.end_date, apiItem.status),
    status: apiItem.status,
    stats: {
      days: apiItem.stats.total_days,
      cities: apiItem.stats.total_cities,
    },
    lastModified: apiItem.start_date || new Date().toISOString().split('T')[0],
  };
}

export function useTripsApi(status?: TripStatus): UseTripsApiResult {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchTrips = useCallback(async (cursor?: string | null, append = false) => {
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
      if (status) {
        params.append('status', status);
      }
      if (cursor) {
        params.append('cursor', cursor);
      }

      const url = `${API_BASE}/trips${params.toString() ? `?${params.toString()}` : ''}`;
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

      const data: TripsResponse = await response.json();
      const mappedTrips = data.items.map(mapTripApiToSavedTrip);

      if (append) {
        setTrips(prev => [...prev, ...mappedTrips]);
      } else {
        setTrips(mappedTrips);
      }

      setNextCursor(data.next_cursor);
      setHasMore(data.has_more);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch trips");
      console.error("Failed to fetch trips:", err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [status]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !nextCursor) return;
    await fetchTrips(nextCursor, true);
  }, [hasMore, isLoadingMore, nextCursor, fetchTrips]);

  const refresh = useCallback(async () => {
    setTrips([]);
    setNextCursor(null);
    setHasMore(false);
    await fetchTrips(null, false);
  }, [fetchTrips]);

  useEffect(() => {
    refresh();
  }, [status]); // Re-fetch when status filter changes

  return {
    trips,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
