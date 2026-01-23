import tripAmman from "@/assets/trip-amman.jpg";
import hotelWAmman from "@/assets/hotel-w-amman.jpg";
import rainbowStreet from "@/assets/activity-rainbow-street.jpg";
import citadel from "@/assets/activity-citadel.jpg";
import romanTheater from "@/assets/activity-roman-theater.jpg";
import wadiRum from "@/assets/destination-wadi-rum.jpg";
import petraImage from "@/assets/destination-jordan.jpg";

export interface Activity {
  id: string;
  type: "activity" | "restaurant" | "note";
  title: string;
  location?: string;
  image?: string;
  rating?: number;
  reviews?: number;
  duration?: string;
  price?: string;
  persons?: number;
}

export interface DayPlan {
  day: number;
  date: string;
  dayOfWeek: string;
  weather: string;
  temperature: number;
  title: string;
  items: Activity[];
}

export interface Accommodation {
  id: string;
  name: string;
  stars: number;
  rating: number;
  reviews: number;
  image: string;
  dates: string;
  price: string;
  provider: string;
  description: string;
}

export interface Transport {
  id: string;
  type: "flight" | "transfer" | "car";
  title: string;
  from: string;
  fromCode?: string;
  to: string;
  toCode?: string;
  departureDate: string;
  departureTime: string;
  arrivalDate?: string;
  arrivalTime?: string;
  duration: string;
  stops?: string;
  price: string;
  travelers: number;
}

export interface CityStop {
  id: string;
  name: string;
  dates: string;
  image: string;
}

export interface TripData {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  dates: string;
  travelers: number;
  stats: {
    days: number;
    cities: number;
    activities: number;
    hotels: number;
    transports: number;
  };
  description: string;
  cityStops: CityStop[];
  transports: Transport[];
  accommodations: Accommodation[];
  dayPlans: DayPlan[];
}

export const sampleTrip: TripData = {
  id: "jordan-honeymoon",
  title: "7-Day Luxury Jordan Honeymoon Escape",
  subtitle: "Luxurious Amman Honeymoon Start",
  image: tripAmman,
  dates: "May 1 - 9",
  travelers: 2,
  stats: {
    days: 8,
    cities: 5,
    activities: 18,
    hotels: 5,
    transports: 6,
  },
  description: "Sari, your honeymoon begins with two nights of pure elegance at the Four Seasons Hotel Amman, where you'll enjoy private guided tours of the Citadel and Roman Theater. This leg sets a luxurious tone for your adventure, combining world-class comfort with the rich history of Jordan's capital before your private driver whisks you away to the desert. It's the perfect sophisticated start to your romantic journey together.",
  cityStops: [
    { id: "1", name: "Amman", dates: "May 1 - May 3", image: tripAmman },
    { id: "2", name: "Wadi Rum", dates: "May 3 - May 5", image: wadiRum },
    { id: "3", name: "Petra", dates: "May 5 - May 7", image: petraImage },
  ],
  transports: [
    {
      id: "t1",
      type: "flight",
      title: "Flight to Amman",
      from: "Berlin",
      fromCode: "BER",
      to: "Amman",
      toCode: "AMM",
      departureDate: "May 01",
      departureTime: "12:00 AM",
      arrivalDate: "May 01",
      arrivalTime: "9:25 AM",
      duration: "6h 25m",
      stops: "1 stop",
      price: "UAH 20,425",
      travelers: 2,
    },
    {
      id: "t2",
      type: "transfer",
      title: "Airport Transfer To and From Amman",
      from: "Queen Alia International Airport",
      to: "Hotel",
      departureDate: "May 01",
      departureTime: "10:00 AM",
      duration: "60 minutes",
      price: "UAH 995 /person",
      travelers: 2,
    },
  ],
  accommodations: [
    {
      id: "a1",
      name: "W Amman Hotel",
      stars: 5,
      rating: 8.8,
      reviews: 1932,
      image: hotelWAmman,
      dates: "May 1 - 3",
      price: "UAH 17,437",
      provider: "Trip.com",
      description: "This luxury 5-star hotel perfectly aligns with your request for a high-end stay in Amman following your visit to the Dead Sea and prior to your departure.",
    },
  ],
  dayPlans: [
    {
      day: 1,
      date: "May 1",
      dayOfWeek: "Friday",
      weather: "☀️",
      temperature: 23,
      title: "Arrival in Amman and Evening Charm on Rainbow Street",
      items: [
        {
          id: "d1-1",
          type: "activity",
          title: "Rainbow Street",
          location: "Rainbow St.",
          image: rainbowStreet,
          persons: 2,
        },
        {
          id: "d1-2",
          type: "restaurant",
          title: "Fakhreldin Restaurant",
          location: "Taha Hussein St., Amman, Jordan",
          image: rainbowStreet,
          rating: 4.4,
          reviews: 5122,
        },
        {
          id: "d1-3",
          type: "note",
          title: "Arrive at Queen Alia International Airport and meet your private transfer to the Four Seasons Hotel Amman. Check-in starts at 3:00 PM.",
        },
      ],
    },
    {
      day: 2,
      date: "May 2",
      dayOfWeek: "Saturday",
      weather: "⛅",
      temperature: 21,
      title: "Guided Cultural and Culinary Exploration of Amman",
      items: [
        {
          id: "d2-1",
          type: "activity",
          title: "Amman Walking Tour: Hidden Gems, Culture & Street Food",
          image: tripAmman,
          rating: 5.0,
          reviews: 220,
          duration: "180 minutes",
          price: "UAH 2,854 /person",
          persons: 2,
        },
        {
          id: "d2-2",
          type: "activity",
          title: "Amman Citadel (Jabal al-Qalaa)",
          location: "K. Ali Ben Al-Hussein St.146",
          image: citadel,
          persons: 2,
        },
        {
          id: "d2-3",
          type: "activity",
          title: "Jordan Archaeological Museum",
          location: "Amman Citadel National Historic Site",
          image: citadel,
          persons: 2,
        },
        {
          id: "d2-4",
          type: "activity",
          title: "Amman Roman Theater",
          location: "The Hashemite Plaza, Taha Al-Hashemi St.",
          image: romanTheater,
          persons: 2,
        },
        {
          id: "d2-5",
          type: "restaurant",
          title: "Hashem Restaurant",
          location: "King Faisal Street Amman, Amman, Jordan",
          image: rainbowStreet,
          rating: 4.1,
          reviews: 23722,
        },
      ],
    },
    {
      day: 3,
      date: "May 3",
      dayOfWeek: "Sunday",
      weather: "⛅",
      temperature: 23,
      title: "Morning Departure to the Wadi Rum Desert",
      items: [
        {
          id: "d3-1",
          type: "note",
          title: "Enjoy a final luxury breakfast at the Four Seasons before meeting your private driver for the journey south to Wadi Rum.",
        },
      ],
    },
  ],
};
