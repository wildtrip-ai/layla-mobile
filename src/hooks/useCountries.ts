import { useState, useEffect } from "react";

interface Country {
  id: string;
  slug: string;
  name: string;
  native_name: string | null;
  flag: string | null;
  flag_emoji: string | null;
  is_featured: boolean;
}

interface CountriesResponse {
  items: Country[];
}

interface CachedData {
  data: Country[];
  timestamp: number;
}

const CACHE_KEY = "countries_cache";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

const getCachedCountries = (): Country[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp }: CachedData = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

const setCachedCountries = (data: Country[]): void => {
  try {
    const cacheData: CachedData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn("Failed to cache countries:", error);
  }
};

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      // Check cache first
      const cached = getCachedCountries();
      if (cached) {
        setCountries(cached);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://internal-api.emiratesescape.com/v1.0/countries"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CountriesResponse = await response.json();
        const sortedCountries = data.items.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setCountries(sortedCountries);
        setCachedCountries(sortedCountries);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch countries");
        console.error("Failed to fetch countries:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, isLoading, error };
}
