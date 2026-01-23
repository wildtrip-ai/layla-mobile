import { useState, useCallback } from "react";
import { sampleTrip, TripData, CityStop, Transport, Accommodation, DayPlan, Activity } from "@/data/tripData";

export type TripAction = 
  | { type: "REMOVE_FLIGHTS" }
  | { type: "ADD_CITY"; city: CityStop; dayPlan?: DayPlan }
  | { type: "CHANGE_HOTEL"; cityIndex: number; newHotel: Accommodation }
  | { type: "APPLY_BUDGET_CHANGES" }
  | { type: "RESET" };

export function useTripData() {
  const [tripData, setTripData] = useState<TripData>(() => structuredClone(sampleTrip));

  const dispatch = useCallback((action: TripAction) => {
    setTripData(prev => {
      const next = structuredClone(prev);

      switch (action.type) {
        case "REMOVE_FLIGHTS": {
          // Remove all flight transports
          next.transports = next.transports.filter(t => t.type !== "flight");
          next.stats.transports = next.transports.length;
          return next;
        }

        case "ADD_CITY": {
          // Add city to stops
          next.cityStops.push(action.city);
          next.stats.cities = next.cityStops.length;
          
          // Add day plan if provided
          if (action.dayPlan) {
            next.dayPlans.push(action.dayPlan);
            next.stats.days = next.dayPlans.length;
            next.stats.activities += action.dayPlan.items.filter(i => i.type === "activity").length;
          }
          return next;
        }

        case "CHANGE_HOTEL": {
          // Replace accommodation at index
          if (action.cityIndex < next.accommodations.length) {
            next.accommodations[action.cityIndex] = action.newHotel;
          }
          return next;
        }

        case "APPLY_BUDGET_CHANGES": {
          // Simulate budget optimization: update hotel to cheaper option
          if (next.accommodations.length > 0) {
            next.accommodations[0] = {
              ...next.accommodations[0],
              name: "Amman Rotana Hotel",
              stars: 4,
              price: "UAH 9,200",
              description: "A comfortable 4-star option with great amenities at a more affordable price.",
            };
          }
          // Remove expensive private tours
          next.dayPlans = next.dayPlans.map(day => ({
            ...day,
            items: day.items.map(item => {
              if (item.price?.includes("2,854")) {
                return { ...item, price: "UAH 1,200 /person", title: "Amman Group Walking Tour" };
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

  const removeFlights = useCallback(() => dispatch({ type: "REMOVE_FLIGHTS" }), [dispatch]);
  
  const addCity = useCallback((cityName: string) => {
    const cityConfigs: Record<string, { city: CityStop; dayPlan: DayPlan }> = {
      "Jerash": {
        city: {
          id: `city-jerash-${Date.now()}`,
          name: "Jerash",
          dates: "May 2",
          image: sampleTrip.cityStops[0].image,
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
              type: "activity" as const,
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
              type: "restaurant" as const,
              title: "Lebanese House Restaurant",
              location: "Jerash City Center",
              rating: 4.5,
              reviews: 320,
            },
          ],
        } as DayPlan,
      },
      "Dead Sea": {
        city: {
          id: `city-deadsea-${Date.now()}`,
          name: "Dead Sea",
          dates: "May 3",
          image: sampleTrip.cityStops[0].image,
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
              type: "activity" as const,
              title: "Dead Sea Beach & Floating Experience",
              location: "Dead Sea Resort Area",
              rating: 4.9,
              reviews: 2100,
              duration: "240 minutes",
              persons: 2,
            },
            {
              id: `deadsea-spa-${Date.now()}`,
              type: "activity" as const,
              title: "Mud Spa Treatment",
              location: "Kempinski Dead Sea",
              rating: 4.7,
              reviews: 890,
              duration: "90 minutes",
              price: "UAH 2,000 /person",
              persons: 2,
            },
          ],
        } as DayPlan,
      },
      "Madaba": {
        city: {
          id: `city-madaba-${Date.now()}`,
          name: "Madaba",
          dates: "May 2",
          image: sampleTrip.cityStops[0].image,
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
              type: "activity" as const,
              title: "St. George's Church - Mosaic Map",
              location: "King Talal Street, Madaba",
              rating: 4.6,
              reviews: 1800,
              duration: "60 minutes",
              persons: 2,
            },
            {
              id: `madaba-nebo-${Date.now()}`,
              type: "activity" as const,
              title: "Mount Nebo Viewpoint",
              location: "Mount Nebo",
              rating: 4.8,
              reviews: 2300,
              duration: "90 minutes",
              persons: 2,
            },
          ],
        } as DayPlan,
      },
    };

    const config = cityConfigs[cityName];
    if (config) {
      dispatch({ type: "ADD_CITY", city: config.city, dayPlan: config.dayPlan });
    }
  }, [dispatch]);

  const applyBudgetChanges = useCallback(() => dispatch({ type: "APPLY_BUDGET_CHANGES" }), [dispatch]);
  
  const resetTrip = useCallback(() => dispatch({ type: "RESET" }), [dispatch]);

  return {
    tripData,
    removeFlights,
    addCity,
    applyBudgetChanges,
    resetTrip,
    dispatch,
  };
}
