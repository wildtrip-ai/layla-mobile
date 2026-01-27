import { useCallback, useEffect, useRef, useState } from "react";
import { authenticatedFetch } from "@/lib/apiClient";
import { sampleTrip, type TripData, type CityStop, type DayPlan } from "@/data/tripData";
import type { TripAction } from "@/hooks/useTripData";

const API_BASE = "https://internal-api.emiratesescape.com/v1.0";
const MAX_HISTORY = 10;

export type TripDetailsApiResponse = Partial<TripData> & {
  id?: string;
  name?: string;
  title?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
};

const normalizeTripData = (
  apiData: TripDetailsApiResponse | null
): TripData => {
  if (!apiData) {
    return structuredClone(sampleTrip);
  }

  const datesFromApi =
    apiData.start_date && apiData.end_date
      ? `${apiData.start_date} - ${apiData.end_date}`
      : undefined;

  return {
    ...structuredClone(sampleTrip),
    ...apiData,
    id: apiData.id ?? sampleTrip.id,
    title: apiData.title ?? apiData.name ?? sampleTrip.title,
    dates: apiData.dates ?? datesFromApi ?? sampleTrip.dates,
    travelers: apiData.travelers ?? sampleTrip.travelers,
    description: apiData.description ?? sampleTrip.description,
    cityStops:
      apiData.cityStops && apiData.cityStops.length > 0
        ? apiData.cityStops
        : sampleTrip.cityStops,
    transports:
      apiData.transports && apiData.transports.length > 0
        ? apiData.transports
        : sampleTrip.transports,
    accommodations:
      apiData.accommodations && apiData.accommodations.length > 0
        ? apiData.accommodations
        : sampleTrip.accommodations,
    dayPlans:
      apiData.dayPlans && apiData.dayPlans.length > 0
        ? apiData.dayPlans
        : sampleTrip.dayPlans,
  };
};

export function useTripDetails(tripId?: string) {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const historyRef = useRef<TripData[]>([]);

  const fetchTripDetails = useCallback(async () => {
    if (!tripId) {
      setError("Missing trip ID.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch(`${API_BASE}/trips/${tripId}`);

      if (!response.ok) {
        throw new Error(`Failed to load trip details (status ${response.status}).`);
      }

      const data: TripDetailsApiResponse = await response.json();
      const normalized = normalizeTripData(data);
      historyRef.current = [];
      setTripData(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trip details.");
      setTripData((prev) => prev ?? normalizeTripData(null));
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!isMounted) return;
      await fetchTripDetails();
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [fetchTripDetails, reloadKey]);

  const dispatch = useCallback((action: TripAction) => {
    setTripData((prev) => {
      if (!prev) return prev;

      if (action.type === "UNDO") {
        if (historyRef.current.length > 0) {
          const previousState = historyRef.current.pop();
          return previousState ?? prev;
        }
        return prev;
      }

      historyRef.current.push(structuredClone(prev));
      if (historyRef.current.length > MAX_HISTORY) {
        historyRef.current.shift();
      }

      const next = structuredClone(prev);

      switch (action.type) {
        case "REMOVE_FLIGHTS": {
          next.transports = next.transports.filter((t) => t.type !== "flight");
          next.stats.transports = next.transports.length;
          return next;
        }

        case "ADD_CITY": {
          next.cityStops.push(action.city);
          next.stats.cities = next.cityStops.length;

          if (action.dayPlan) {
            next.dayPlans.push(action.dayPlan);
            next.stats.days = next.dayPlans.length;
            next.stats.activities += action.dayPlan.items.filter(
              (item) => item.type === "activity"
            ).length;
          }
          return next;
        }

        case "CHANGE_HOTEL": {
          if (action.cityIndex < next.accommodations.length) {
            next.accommodations[action.cityIndex] = action.newHotel;
          }
          return next;
        }

        case "APPLY_BUDGET_CHANGES": {
          if (next.accommodations.length > 0) {
            next.accommodations[0] = {
              ...next.accommodations[0],
              name: "Amman Rotana Hotel",
              stars: 4,
              price: "UAH 9,200",
              description:
                "A comfortable 4-star option with great amenities at a more affordable price.",
            };
          }
          next.dayPlans = next.dayPlans.map((day) => ({
            ...day,
            items: day.items.map((item) => {
              if (item.price?.includes("2,854")) {
                return {
                  ...item,
                  price: "UAH 1,200 /person",
                  title: "Amman Group Walking Tour",
                };
              }
              return item;
            }),
          }));
          return next;
        }

        case "RESET": {
          return structuredClone(sampleTrip);
        }

        default:
          return prev;
      }
    });
  }, []);

  const removeFlights = useCallback(
    () => dispatch({ type: "REMOVE_FLIGHTS" }),
    [dispatch]
  );

  const addCity = useCallback(
    (cityName: string) => {
      setTripData((prev) => {
        if (!prev) return prev;

        const fallbackImage =
          prev.cityStops[0]?.image ?? sampleTrip.cityStops[0]?.image ?? "";

        const cityConfigs: Record<string, { city: CityStop; dayPlan: DayPlan }> = {
          Jerash: {
            city: {
              id: `city-jerash-${Date.now()}`,
              name: "Jerash",
              dates: "May 2",
              image: fallbackImage,
            },
            dayPlan: {
              day: 4,
              date: "May 2",
              dayOfWeek: "Saturday",
              weather: "☀️",
              temperature: 24,
              title: "Ancient Roman Ruins of Jerash",
              items: [
                {
                  id: `jerash-tour-${Date.now()}`,
                  type: "activity",
                  title: "Guided Tour of Jerash",
                  location: "Jerash Archaeological Site",
                  rating: 4.8,
                  reviews: 1250,
                  duration: "180 minutes",
                  price: "UAH 1,500 /person",
                  persons: 2,
                },
                {
                  id: `jerash-lunch-${Date.now()}`,
                  type: "restaurant",
                  title: "Lebanese House Restaurant",
                  location: "Jerash City Center",
                  rating: 4.5,
                  reviews: 320,
                },
              ],
            },
          },
          "Dead Sea": {
            city: {
              id: `city-deadsea-${Date.now()}`,
              name: "Dead Sea",
              dates: "May 3",
              image: fallbackImage,
            },
            dayPlan: {
              day: 4,
              date: "May 3",
              dayOfWeek: "Sunday",
              weather: "☀️",
              temperature: 28,
              title: "Dead Sea Float & Spa Experience",
              items: [
                {
                  id: `deadsea-float-${Date.now()}`,
                  type: "activity",
                  title: "Dead Sea Beach & Floating Experience",
                  location: "Dead Sea Resort Area",
                  rating: 4.9,
                  reviews: 2100,
                  duration: "240 minutes",
                  persons: 2,
                },
                {
                  id: `deadsea-spa-${Date.now()}`,
                  type: "activity",
                  title: "Mud Spa Treatment",
                  location: "Kempinski Dead Sea",
                  rating: 4.7,
                  reviews: 890,
                  duration: "90 minutes",
                  price: "UAH 2,000 /person",
                  persons: 2,
                },
              ],
            },
          },
          Madaba: {
            city: {
              id: `city-madaba-${Date.now()}`,
              name: "Madaba",
              dates: "May 2",
              image: fallbackImage,
            },
            dayPlan: {
              day: 4,
              date: "May 2",
              dayOfWeek: "Saturday",
              weather: "⛅",
              temperature: 22,
              title: "Madaba Mosaics & Mount Nebo",
              items: [
                {
                  id: `madaba-church-${Date.now()}`,
                  type: "activity",
                  title: "St. George's Church - Mosaic Map",
                  location: "King Talal Street, Madaba",
                  rating: 4.6,
                  reviews: 1800,
                  duration: "60 minutes",
                  persons: 2,
                },
                {
                  id: `madaba-mount-${Date.now()}`,
                  type: "activity",
                  title: "Mount Nebo Viewpoint",
                  location: "Mount Nebo",
                  rating: 4.7,
                  reviews: 950,
                  duration: "90 minutes",
                  persons: 2,
                },
              ],
            },
          },
        };

        const cityConfig = cityConfigs[cityName];
        if (!cityConfig) {
          return prev;
        }

        const next = structuredClone(prev);
        next.cityStops.push(cityConfig.city);
        next.dayPlans.push(cityConfig.dayPlan);
        next.stats.cities = next.cityStops.length;
        next.stats.days = next.dayPlans.length;
        next.stats.activities += cityConfig.dayPlan.items.filter(
          (item) => item.type === "activity"
        ).length;

        return next;
      });
    },
    []
  );

  const applyBudgetChanges = useCallback(
    () => dispatch({ type: "APPLY_BUDGET_CHANGES" }),
    [dispatch]
  );

  const undo = useCallback(() => dispatch({ type: "UNDO" }), [dispatch]);

  const canUndo = historyRef.current.length > 0;

  const refetch = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  return {
    tripData,
    isLoading,
    error,
    removeFlights,
    addCity,
    applyBudgetChanges,
    undo,
    canUndo,
    refetch,
  };
}
