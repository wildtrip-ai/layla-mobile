import tripAmman from "@/assets/trip-amman.jpg";
import italyImage from "@/assets/destination-italy.jpg";
import irelandImage from "@/assets/destination-ireland.jpg";
import heroJapan from "@/assets/hero-japan.jpg";

export interface SavedTrip {
  id: string;
  title: string;
  image: string;
  dates: string;
  status: "upcoming" | "past" | "draft";
  stats: {
    days: number;
    cities: number;
  };
  lastModified: string;
}

export const savedTrips: SavedTrip[] = [
  {
    id: "jordan-honeymoon",
    title: "7-Day Luxury Jordan Honeymoon",
    image: tripAmman,
    dates: "May 1 - 9, 2025",
    status: "upcoming",
    stats: { days: 8, cities: 5 },
    lastModified: "2025-01-20",
  },
  {
    id: "italy-family",
    title: "Family Europe Trip",
    image: italyImage,
    dates: "Jun 15 - 25, 2025",
    status: "upcoming",
    stats: { days: 10, cities: 4 },
    lastModified: "2025-01-18",
  },
  {
    id: "ireland-road-trip",
    title: "Ireland Highlands Road Trip",
    image: irelandImage,
    dates: "Aug 5 - 12, 2024",
    status: "past",
    stats: { days: 7, cities: 6 },
    lastModified: "2024-08-15",
  },
  {
    id: "japan-draft",
    title: "Japan Cherry Blossom Adventure",
    image: heroJapan,
    dates: "TBD",
    status: "draft",
    stats: { days: 14, cities: 5 },
    lastModified: "2025-01-22",
  },
];
