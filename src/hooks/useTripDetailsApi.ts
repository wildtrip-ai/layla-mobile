import { useCallback } from "react";
import {
  sampleTrip,
  type Activity,
  type Accommodation,
  type CityStop,
  type DayPlan,
  type Transport,
  type TripData,
} from "@/data/tripData";
import { apiRequest } from "@/lib/apiClient";

const API_BASE = "https://internal-api.emiratesescape.com/v1.0";

export interface TripApiStats {
  total_days?: number;
  total_cities?: number;
  total_activities?: number;
  total_hotels?: number;
  total_transports?: number;
}

export interface TripApiDayPlanItem {
  id?: string;
  type?: string;
  title?: string;
  location?: string;
  image_url?: string;
  rating?: number;
  review_count?: number;
  duration_minutes?: number;
  duration?: string;
  price?: number | string;
  currency?: string;
  persons?: number;
}

export interface TripApiDayPlan {
  id?: string;
  day?: number;
  date?: string;
  day_of_week?: string;
  weather?: string;
  temperature?: number;
  title?: string;
  items?: TripApiDayPlanItem[];
}

export interface TripApiAccommodation {
  id?: string;
  name?: string;
  stars?: number;
  rating?: number;
  review_count?: number;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  price?: number | string;
  currency?: string;
  provider?: string;
  description?: string;
}

export interface TripApiTransport {
  id?: string;
  type?: string;
  title?: string;
  from?: string;
  from_code?: string;
  to?: string;
  to_code?: string;
  departure_date?: string;
  departure_time?: string;
  arrival_date?: string;
  arrival_time?: string;
  duration_minutes?: number;
  duration?: string;
  stops?: string;
  price?: number | string;
  currency?: string;
  travelers?: number;
}

export interface TripApiCityStop {
  id?: string;
  name?: string;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  day_plans?: TripApiDayPlan[];
  accommodation?: TripApiAccommodation;
}

export interface TripDetailsApiResponse {
  id?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  traveler_count?: number;
  stats?: TripApiStats;
  city_stops?: TripApiCityStop[];
  inbound_transport?: TripApiTransport;
  transports?: TripApiTransport[];
}

const parseDate = (value?: string): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatMonthDay = (date: Date): string =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const formatDayDate = (value?: string): string => {
  const parsed = parseDate(value);
  return parsed ? formatMonthDay(parsed) : value ?? "";
};

const formatDateRange = (start?: string, end?: string): string => {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  if (startDate && endDate) {
    return `${formatMonthDay(startDate)} - ${formatMonthDay(endDate)}`;
  }
  if (startDate) return formatMonthDay(startDate);
  if (endDate) return formatMonthDay(endDate);
  return "";
};

const formatAccommodationDateRange = (start?: string, end?: string): string => {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  if (startDate && endDate) {
    const startMonth = startDate.toLocaleDateString("en-US", { month: "short" });
    const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }
  if (startDate) return formatMonthDay(startDate);
  if (endDate) return formatMonthDay(endDate);
  return "";
};

const formatDuration = (minutes?: number, duration?: string): string | undefined => {
  if (duration) return duration;
  if (typeof minutes === "number") return `${minutes} minutes`;
  return undefined;
};

const formatPrice = (price?: number | string, currency?: string): string | undefined => {
  if (price === undefined || price === null) return undefined;
  if (typeof price === "string") return price;
  return currency ? `${currency} ${price}` : `${price}`;
};

const mapItemType = (type?: string): Activity["type"] => {
  switch (type) {
    case "restaurant":
      return "restaurant";
    case "note":
      return "note";
    case "activity":
      return "activity";
    case "dining":
      return "restaurant";
    default:
      return "activity";
  }
};

const mapTransportType = (type?: string): Transport["type"] => {
  switch (type) {
    case "flight":
    case "transfer":
    case "car":
      return type;
    default:
      return "transfer";
  }
};

export const mapTripApiToTripData = (
  apiData: TripDetailsApiResponse | null,
  fallback: TripData = sampleTrip
): TripData => {
  if (!apiData) {
    return structuredClone(fallback);
  }

  const mappedCityStops: CityStop[] = (apiData.city_stops ?? []).map(
    (stop, index) => ({
      id: stop.id ?? `city-${index + 1}`,
      name: stop.name ?? `City ${index + 1}`,
      dates:
        formatDateRange(stop.start_date, stop.end_date) ||
        fallback.cityStops[index]?.dates ||
        "",
      image:
        stop.image_url ??
        fallback.cityStops[index]?.image ??
        fallback.image,
    })
  );

  const mappedDayPlans: DayPlan[] = (apiData.city_stops ?? []).flatMap(
    (stop, stopIndex) =>
      (stop.day_plans ?? []).map((plan, planIndex) => {
        const dateValue = parseDate(plan.date);
        const fallbackPlan = fallback.dayPlans[planIndex];

        return {
          day: plan.day ?? planIndex + 1,
          date: formatDayDate(plan.date) || fallbackPlan?.date || "",
          dayOfWeek:
            plan.day_of_week ??
            (dateValue
              ? dateValue.toLocaleDateString("en-US", { weekday: "long" })
              : fallbackPlan?.dayOfWeek ?? "Friday"),
          weather: plan.weather ?? fallbackPlan?.weather ?? "☀️",
          temperature: plan.temperature ?? fallbackPlan?.temperature ?? 24,
          title:
            plan.title ??
            fallbackPlan?.title ??
            `${stop.name ?? `City ${stopIndex + 1}`} Day Plan`,
          items: (plan.items ?? []).map((item, itemIndex): Activity => ({
            id: item.id ?? `item-${stopIndex + 1}-${planIndex + 1}-${itemIndex + 1}`,
            type: mapItemType(item.type),
            title: item.title ?? "Untitled Activity",
            location: item.location,
            image: item.image_url,
            rating: item.rating,
            reviews: item.review_count,
            duration: formatDuration(item.duration_minutes, item.duration),
            price: formatPrice(item.price, item.currency),
            persons: item.persons ?? apiData.traveler_count,
          })),
        };
      })
  );

  const mappedAccommodations: Accommodation[] = (apiData.city_stops ?? []).flatMap(
    (stop, index) => {
      if (!stop.accommodation) return [];
      const fallbackAccommodation = fallback.accommodations[index];
      const accommodation = stop.accommodation;

      return [
        {
          id: accommodation.id ?? `accommodation-${index + 1}`,
          name: accommodation.name ?? fallbackAccommodation?.name ?? "",
          stars: accommodation.stars ?? fallbackAccommodation?.stars ?? 0,
          rating: accommodation.rating ?? fallbackAccommodation?.rating ?? 0,
          reviews: accommodation.review_count ?? fallbackAccommodation?.reviews ?? 0,
          image: accommodation.image_url ?? fallbackAccommodation?.image ?? "",
          dates:
            formatAccommodationDateRange(
              accommodation.start_date ?? stop.start_date,
              accommodation.end_date ?? stop.end_date
            ) || fallbackAccommodation?.dates || "",
          price:
            formatPrice(accommodation.price, accommodation.currency) ??
            fallbackAccommodation?.price ??
            "",
          provider: accommodation.provider ?? fallbackAccommodation?.provider ?? "",
          description:
            accommodation.description ?? fallbackAccommodation?.description ?? "",
        },
      ];
    }
  );

  const transportPayloads = [
    ...(apiData.inbound_transport ? [apiData.inbound_transport] : []),
    ...(apiData.transports ?? []),
  ];

  const mappedTransports: Transport[] = transportPayloads.map((transport, index) => ({
    id: transport.id ?? `transport-${index + 1}`,
    type: mapTransportType(transport.type),
    title: transport.title ?? "Transport",
    from: transport.from ?? "",
    fromCode: transport.from_code,
    to: transport.to ?? "",
    toCode: transport.to_code,
    departureDate: formatDayDate(transport.departure_date),
    departureTime: transport.departure_time ?? "",
    arrivalDate: formatDayDate(transport.arrival_date),
    arrivalTime: transport.arrival_time ?? "",
    duration:
      formatDuration(transport.duration_minutes, transport.duration) ?? "",
    stops: transport.stops,
    price: formatPrice(transport.price, transport.currency) ?? "",
    travelers: transport.travelers ?? apiData.traveler_count ?? 0,
  }));

  const activitiesCount =
    apiData.stats?.total_activities ??
    mappedDayPlans.reduce(
      (total, plan) =>
        total + plan.items.filter((item) => item.type === "activity").length,
      0
    ) ??
    fallback.stats.activities;

  return {
    id: apiData.id ?? fallback.id,
    title: apiData.title ?? apiData.name ?? fallback.title,
    subtitle: apiData.subtitle ?? fallback.subtitle,
    image: apiData.image_url ?? fallback.image,
    dates:
      formatDateRange(apiData.start_date, apiData.end_date) || fallback.dates,
    travelers: apiData.traveler_count ?? fallback.travelers,
    stats: {
      days:
        apiData.stats?.total_days ??
        (mappedDayPlans.length > 0 ? mappedDayPlans.length : fallback.stats.days),
      cities:
        apiData.stats?.total_cities ??
        (mappedCityStops.length > 0
          ? mappedCityStops.length
          : fallback.stats.cities),
      activities: activitiesCount,
      hotels:
        apiData.stats?.total_hotels ??
        (mappedAccommodations.length > 0
          ? mappedAccommodations.length
          : fallback.stats.hotels),
      transports:
        apiData.stats?.total_transports ?? mappedTransports.length,
    },
    description: apiData.description ?? fallback.description,
    cityStops:
      mappedCityStops.length > 0 ? mappedCityStops : fallback.cityStops,
    transports: mappedTransports,
    accommodations:
      mappedAccommodations.length > 0
        ? mappedAccommodations
        : fallback.accommodations,
    dayPlans:
      mappedDayPlans.length > 0 ? mappedDayPlans : fallback.dayPlans,
  };
};

export function useTripDetailsApi() {
  const fetchTripDetails = useCallback(async (tripId: string) => {
    const data = await apiRequest<TripDetailsApiResponse>(
      `${API_BASE}/trips/${tripId}`
    );
    return mapTripApiToTripData(data);
  }, []);

  return { fetchTripDetails };
}
