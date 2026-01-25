import { useState, useEffect } from "react";
import { CountryPlace } from "@/data/countriesData";

interface ApiPlace {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  thumbnail_url: string | null;
  description: string;
  short_description: string | null;
  rating: string;
  review_count: number;
  city: string | null;
  region: string | null;
  is_featured: boolean;
  tags: string[] | null;
}

interface PlacesResponse {
  items: ApiPlace[];
  next_cursor: string | null;
  has_more: boolean;
}

interface CachedPlacesData {
  data: ApiPlace[];
  timestamp: number;
}

interface UseCountryPlacesResult {
  featuredPlaces: CountryPlace[];
  otherPlaces: CountryPlace[];
  isLoading: boolean;
  error: string | null;
}

const CACHE_KEY_PREFIX = "country_places_";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

const getCacheKey = (slug: string) => `${CACHE_KEY_PREFIX}${slug}`;

const getCachedPlaces = (slug: string): ApiPlace[] | null => {
  try {
    const cached = localStorage.getItem(getCacheKey(slug));
    if (!cached) return null;

    const { data, timestamp }: CachedPlacesData = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(getCacheKey(slug));
      return null;
    }

    return data;
  } catch {
    localStorage.removeItem(getCacheKey(slug));
    return null;
  }
};

const setCachedPlaces = (slug: string, data: ApiPlace[]): void => {
  try {
    const cacheData: CachedPlacesData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(getCacheKey(slug), JSON.stringify(cacheData));
  } catch (error) {
    console.warn("Failed to cache country places:", error);
  }
};

const transformApiPlace = (apiPlace: ApiPlace): CountryPlace => ({
  id: apiPlace.slug || apiPlace.id,
  name: apiPlace.name,
  image: apiPlace.image_url,
  description: apiPlace.description || apiPlace.short_description || "",
  rating: apiPlace.rating ? parseFloat(apiPlace.rating) : undefined,
});

export function useCountryPlaces(countrySlug: string | undefined): UseCountryPlacesResult {
  const [featuredPlaces, setFeaturedPlaces] = useState<CountryPlace[]>([]);
  const [otherPlaces, setOtherPlaces] = useState<CountryPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!countrySlug) {
      setIsLoading(false);
      return;
    }

    const fetchPlaces = async () => {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cached = getCachedPlaces(countrySlug);
      if (cached) {
        const featured = cached.filter((p) => p.is_featured).map(transformApiPlace);
        const other = cached.filter((p) => !p.is_featured).map(transformApiPlace);
        setFeaturedPlaces(featured);
        setOtherPlaces(other);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://internal-api.emiratesescape.com/v1.0/countries/${countrySlug}/places`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PlacesResponse = await response.json();
        
        // Cache the raw data
        setCachedPlaces(countrySlug, data.items);

        // Transform and split by featured flag
        const featured = data.items.filter((p) => p.is_featured).map(transformApiPlace);
        const other = data.items.filter((p) => !p.is_featured).map(transformApiPlace);

        setFeaturedPlaces(featured);
        setOtherPlaces(other);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch places");
        console.error("Failed to fetch country places:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [countrySlug]);

  return { featuredPlaces, otherPlaces, isLoading, error };
}
