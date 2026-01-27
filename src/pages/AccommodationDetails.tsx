import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  ChevronDown, 
  ChevronUp,
  Check,
  Sparkles,
  Building2,
  Utensils,
  UtensilsCrossed,
  CircleParking,
  Waves,
  Bus,
  Car,
  Ticket,
  Shirt,
  CircleSlash,
  Maximize2,
  Calendar,
  Users,
  Wifi,
  Coffee,
  Tv,
  Bath,
  BedDouble,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { Header } from "@/components/Header";
import { HotelBentoGallery, type GalleryImage } from "@/components/trip/HotelBentoGallery";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sampleTrip } from "@/data/tripData";
import hotelImage from "@/assets/hotel-w-amman.jpg";
import activityCitadel from "@/assets/activity-citadel.jpg";
import activityRainbowStreet from "@/assets/activity-rainbow-street.jpg";
import activityRomanTheater from "@/assets/activity-roman-theater.jpg";
import destinationJordan from "@/assets/destination-jordan.jpg";
import type L from "leaflet";

// Hotel gallery images
const hotelGalleryImages: Record<string, GalleryImage[]> = {
  "w-amman": [
    { src: hotelImage, title: "Hotel Exterior", location: "W Amman Hotel" },
    { src: activityCitadel, title: "Rooftop Pool & Lounge", location: "W Amman Hotel" },
    { src: activityRainbowStreet, title: "WET Deck Pool Area", location: "W Amman Hotel" },
    { src: activityRomanTheater, title: "Lobby & Reception", location: "W Amman Hotel" },
    { src: destinationJordan, title: "Deluxe Room", location: "W Amman Hotel" },
  ],
  "four-seasons": [
    { src: hotelImage, title: "Hotel Exterior", location: "Four Seasons Amman" },
    { src: activityCitadel, title: "Executive Suite", location: "Four Seasons Amman" },
    { src: activityRainbowStreet, title: "The Spa", location: "Four Seasons Amman" },
    { src: activityRomanTheater, title: "Fine Dining Restaurant", location: "Four Seasons Amman" },
    { src: destinationJordan, title: "Pool Area", location: "Four Seasons Amman" },
  ],
  "fairmont": [
    { src: hotelImage, title: "Hotel Exterior", location: "Fairmont Amman" },
    { src: activityCitadel, title: "Presidential Suite", location: "Fairmont Amman" },
    { src: activityRainbowStreet, title: "Willow Stream Spa", location: "Fairmont Amman" },
    { src: activityRomanTheater, title: "Spectrum Restaurant", location: "Fairmont Amman" },
    { src: destinationJordan, title: "Rooftop Bar", location: "Fairmont Amman" },
  ],
  "kempinski": [
    { src: hotelImage, title: "Hotel Exterior", location: "Kempinski Amman" },
    { src: activityCitadel, title: "Royal Suite", location: "Kempinski Amman" },
    { src: activityRainbowStreet, title: "Kempinski Spa", location: "Kempinski Amman" },
    { src: activityRomanTheater, title: "Levantine Restaurant", location: "Kempinski Amman" },
    { src: destinationJordan, title: "Pool & Gardens", location: "Kempinski Amman" },
  ],
};

// Extended hotel data for the details page
const hotelDetails = {
  "w-amman": {
    id: "w-amman",
    name: "W Amman Hotel",
    stars: 5,
    rating: 8.8,
    reviews: 1932,
    image: hotelImage,
    dates: "May 01 - May 03",
    price: "UAH 17,437",
    provider: "Booking.com",
    description: "Luxury 5-star hotel in the heart of Amman",
    address: "Rafiq Al Hariri Avenue, 5th Circle, Amman 11183, Jordan",
    coordinates: [31.9539, 35.8753] as [number, number],
    amenities: [
      { name: "Business Center", icon: "Building2" },
      { name: "Room Service", icon: "Utensils" },
      { name: "Restaurant", icon: "UtensilsCrossed" },
      { name: "Parking", icon: "CircleParking" },
      { name: "Swimming pool", icon: "Waves" },
      { name: "Airport shuttle", icon: "Bus" },
      { name: "Valet Parking", icon: "Car" },
      { name: "Tour Desk", icon: "Ticket" },
      { name: "Dry Cleaning", icon: "Shirt" },
      { name: "Non-Smoking Rooms", icon: "CircleSlash" },
    ],
    aiInsight: `This luxury 5-star hotel perfectly aligns with your request for a high-end stay in Amman following your visit to the Dead Sea and prior to your departure. The W Amman offers stunning views of the city, world-class amenities including a rooftop pool and spa, and is ideally located near major attractions and dining options. The contemporary design and exceptional service make it an excellent choice for your honeymoon finale.`,
  },
  "four-seasons": {
    id: "four-seasons",
    name: "Four Seasons Hotel Amman",
    stars: 5,
    rating: 9.2,
    reviews: 2847,
    image: hotelImage,
    dates: "May 01 - May 03",
    price: "UAH 22,150",
    provider: "Hotels.com",
    description: "Elegant luxury hotel with panoramic city views",
    address: "5th Circle, Al Kindi Street, Amman 11185, Jordan",
    coordinates: [31.9512, 35.8621] as [number, number],
    amenities: [
      { name: "Business Center", icon: "Building2" },
      { name: "Room Service", icon: "Utensils" },
      { name: "Restaurant", icon: "UtensilsCrossed" },
      { name: "Parking", icon: "CircleParking" },
      { name: "Swimming pool", icon: "Waves" },
      { name: "Airport shuttle", icon: "Bus" },
      { name: "Valet Parking", icon: "Car" },
      { name: "Tour Desk", icon: "Ticket" },
      { name: "Dry Cleaning", icon: "Shirt" },
      { name: "Non-Smoking Rooms", icon: "CircleSlash" },
    ],
    aiInsight: `The Four Seasons Hotel Amman offers an unparalleled luxury experience with its elegant rooms and exceptional service. Located in the prestigious 5th Circle area, it provides easy access to Amman's cultural attractions while offering a peaceful retreat. The hotel's spa and fine dining restaurants make it perfect for a romantic honeymoon stay.`,
  },
  "fairmont": {
    id: "fairmont",
    name: "Fairmont Amman",
    stars: 5,
    rating: 8.6,
    reviews: 1456,
    image: hotelImage,
    dates: "May 01 - May 03",
    price: "UAH 15,890",
    provider: "Expedia",
    description: "Modern luxury hotel with spectacular views",
    address: "Queen Noor Street, 5th Circle, Amman 11195, Jordan",
    coordinates: [31.9498, 35.8698] as [number, number],
    amenities: [
      { name: "Business Center", icon: "Building2" },
      { name: "Room Service", icon: "Utensils" },
      { name: "Restaurant", icon: "UtensilsCrossed" },
      { name: "Parking", icon: "CircleParking" },
      { name: "Swimming pool", icon: "Waves" },
      { name: "Airport shuttle", icon: "Bus" },
      { name: "Valet Parking", icon: "Car" },
      { name: "Tour Desk", icon: "Ticket" },
      { name: "Dry Cleaning", icon: "Shirt" },
      { name: "Non-Smoking Rooms", icon: "CircleSlash" },
    ],
    aiInsight: `The Fairmont Amman combines modern luxury with traditional Jordanian hospitality. Its prime location offers stunning views of the city, and the hotel features excellent dining options and a full-service spa. A great value option for luxury travelers.`,
  },
  "kempinski": {
    id: "kempinski",
    name: "Kempinski Hotel Amman",
    stars: 5,
    rating: 8.9,
    reviews: 1823,
    image: hotelImage,
    dates: "May 01 - May 03",
    price: "UAH 18,750",
    provider: "Booking.com",
    description: "European elegance in the heart of Amman",
    address: "Abdul Hameed Shoman Street, Shmeisani, Amman 11190, Jordan",
    coordinates: [31.9725, 35.8912] as [number, number],
    amenities: [
      { name: "Business Center", icon: "Building2" },
      { name: "Room Service", icon: "Utensils" },
      { name: "Restaurant", icon: "UtensilsCrossed" },
      { name: "Parking", icon: "CircleParking" },
      { name: "Swimming pool", icon: "Waves" },
      { name: "Airport shuttle", icon: "Bus" },
      { name: "Valet Parking", icon: "Car" },
      { name: "Tour Desk", icon: "Ticket" },
      { name: "Dry Cleaning", icon: "Shirt" },
      { name: "Non-Smoking Rooms", icon: "CircleSlash" },
    ],
    aiInsight: `The Kempinski Hotel Amman brings European elegance to Jordan's capital. Known for its impeccable service and attention to detail, this hotel offers a refined experience with excellent dining and spa facilities.`,
  },
};

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Utensils,
  UtensilsCrossed,
  CircleParking,
  Waves,
  Bus,
  Car,
  Ticket,
  Shirt,
  CircleSlash,
};

// Room types data
interface RoomType {
  id: string;
  name: string;
  description: string;
  size: string;
  maxGuests: number;
  bedType: string;
  price: string;
  originalPrice?: string;
  amenities: string[];
  image: string;
}

const roomTypes: Record<string, RoomType[]> = {
  "w-amman": [
    {
      id: "wonderful-room",
      name: "Wonderful Room",
      description: "Contemporary style with city views",
      size: "40 m²",
      maxGuests: 2,
      bedType: "King Bed",
      price: "UAH 17,437",
      amenities: ["Free WiFi", "Smart TV", "Mini Bar", "Rain Shower"],
      image: hotelImage,
    },
    {
      id: "spectacular-room",
      name: "Spectacular Room",
      description: "Corner room with panoramic city views",
      size: "48 m²",
      maxGuests: 2,
      bedType: "King Bed",
      price: "UAH 21,850",
      originalPrice: "UAH 24,500",
      amenities: ["Free WiFi", "Smart TV", "Mini Bar", "Rain Shower", "Bathtub", "Coffee Machine"],
      image: activityCitadel,
    },
    {
      id: "wow-suite",
      name: "WOW Suite",
      description: "Luxury suite with separate living area",
      size: "72 m²",
      maxGuests: 3,
      bedType: "King Bed + Sofa Bed",
      price: "UAH 35,200",
      amenities: ["Free WiFi", "Smart TV", "Mini Bar", "Rain Shower", "Bathtub", "Coffee Machine", "Living Area"],
      image: activityRainbowStreet,
    },
  ],
  "four-seasons": [
    {
      id: "superior-room",
      name: "Superior Room",
      description: "Elegant room with garden views",
      size: "45 m²",
      maxGuests: 2,
      bedType: "King Bed",
      price: "UAH 22,150",
      amenities: ["Free WiFi", "Smart TV", "Mini Bar", "Marble Bathroom"],
      image: hotelImage,
    },
    {
      id: "deluxe-room",
      name: "Deluxe Room",
      description: "Spacious room with city views",
      size: "55 m²",
      maxGuests: 2,
      bedType: "King Bed",
      price: "UAH 28,400",
      originalPrice: "UAH 31,000",
      amenities: ["Free WiFi", "Smart TV", "Mini Bar", "Marble Bathroom", "Bathtub", "Nespresso"],
      image: activityCitadel,
    },
  ],
};

// Guest reviews data
interface GuestReview {
  id: string;
  author: string;
  avatar: string;
  country: string;
  date: string;
  rating: number;
  title: string;
  content: string;
  positives?: string;
  negatives?: string;
  tripType: string;
}

const guestReviews: Record<string, { breakdown: Record<string, number>; reviews: GuestReview[] }> = {
  "w-amman": {
    breakdown: {
      "Staff": 9.2,
      "Facilities": 9.0,
      "Cleanliness": 9.4,
      "Comfort": 9.1,
      "Value": 8.3,
      "Location": 8.8,
    },
    reviews: [
      {
        id: "r1",
        author: "Sarah M.",
        avatar: "S",
        country: "United Kingdom",
        date: "December 2025",
        rating: 9.5,
        title: "Perfect honeymoon stay!",
        content: "The hotel exceeded all our expectations. The staff went above and beyond to make our honeymoon special.",
        positives: "Amazing rooftop pool, incredible breakfast buffet, attentive staff",
        negatives: "Parking can be tricky during peak hours",
        tripType: "Couple",
      },
      {
        id: "r2",
        author: "Ahmed K.",
        avatar: "A",
        country: "Jordan",
        date: "November 2025",
        rating: 8.8,
        title: "Modern luxury in Amman",
        content: "Stylish rooms with great amenities. The WET Deck pool area is fantastic for relaxation.",
        positives: "Modern design, great pool, excellent location",
        tripType: "Business",
      },
      {
        id: "r3",
        author: "Maria L.",
        avatar: "M",
        country: "Germany",
        date: "October 2025",
        rating: 9.0,
        title: "Wonderful experience",
        content: "Everything was perfect from check-in to check-out. The room was spacious and beautifully decorated.",
        positives: "Spacious room, friendly staff, delicious food",
        negatives: "Gym could be larger",
        tripType: "Couple",
      },
    ],
  },
  "four-seasons": {
    breakdown: {
      "Staff": 9.5,
      "Facilities": 9.3,
      "Cleanliness": 9.6,
      "Comfort": 9.4,
      "Value": 8.5,
      "Location": 9.0,
    },
    reviews: [
      {
        id: "r1",
        author: "John D.",
        avatar: "J",
        country: "United States",
        date: "December 2025",
        rating: 9.8,
        title: "Exceptional service",
        content: "The Four Seasons never disappoints. Impeccable service and stunning views.",
        positives: "Outstanding service, beautiful spa, excellent dining",
        tripType: "Family",
      },
    ],
  },
};

const roomAmenityIcons: Record<string, React.ElementType> = {
  "Free WiFi": Wifi,
  "Smart TV": Tv,
  "Mini Bar": Coffee,
  "Rain Shower": Bath,
  "Bathtub": Bath,
  "Coffee Machine": Coffee,
  "Nespresso": Coffee,
  "Marble Bathroom": Bath,
  "Living Area": BedDouble,
};

function getRatingLabel(rating: number): string {
  if (rating >= 9) return "Exceptional";
  if (rating >= 8.5) return "Excellent";
  if (rating >= 8) return "Very Good";
  if (rating >= 7) return "Good";
  return "Pleasant";
}

export default function AccommodationDetails() {
  const { id, accommodationId } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isAddedToTrip, setIsAddedToTrip] = useState(true);
  const [showFullInsight, setShowFullInsight] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // Get room types and reviews for this hotel
  const hotelRoomTypes = roomTypes[accommodationId as keyof typeof roomTypes] || roomTypes["w-amman"];
  const hotelReviews = guestReviews[accommodationId as keyof typeof guestReviews] || guestReviews["w-amman"];

  // Get hotel data
  const hotel = hotelDetails[accommodationId as keyof typeof hotelDetails] || hotelDetails["w-amman"];

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current!, {
        center: hotel.coordinates,
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Add hotel marker
      const hotelIcon = L.divIcon({
        className: "custom-hotel-marker",
        html: `
          <div style="
            background: hsl(var(--primary));
            color: white;
            padding: 6px 10px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            white-space: nowrap;
          ">
            ${hotel.name}
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [60, 15],
      });

      L.marker(hotel.coordinates, { icon: hotelIcon }).addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [hotel.coordinates, hotel.name]);

  const truncatedInsight = hotel.aiInsight.slice(0, 180) + "...";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-32">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/trip/${id || "jordan-honeymoon"}`} className="flex items-center gap-1">
                      <ArrowLeft className="h-4 w-4" />
                      Trip plan
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{hotel.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>

          {/* Trip Info Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-muted rounded-full text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{sampleTrip.dates}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{sampleTrip.travelers} travellers</span>
              </div>
            </div>
          </motion.div>

          {/* Accommodation Overview Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-2">
                  {hotel.name}
                </h1>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-teal-500 text-white px-2 py-0.5 rounded text-sm font-medium">
                    {hotel.rating}
                  </span>
                  <span className="text-sm text-foreground font-medium">
                    {getRatingLabel(hotel.rating)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({hotel.reviews.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{hotel.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Added to Trip
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsAddedToTrip(!isAddedToTrip)}>
                      {isAddedToTrip ? "Remove from Trip" : "Add to Trip"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="bg-primary hover:bg-primary/90">
                  Book Now
                </Button>
              </div>
            </div>

            {/* Bento Gallery */}
            <HotelBentoGallery images={hotelGalleryImages[hotel.id] || hotelGalleryImages["w-amman"]} />
          </motion.section>

          {/* AI Insight Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-accent rounded-xl p-4 md:p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-2">From Layla:</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {showFullInsight ? hotel.aiInsight : truncatedInsight}
                  </p>
                  <button
                    onClick={() => setShowFullInsight(!showFullInsight)}
                    className="text-sm text-primary font-medium mt-2 flex items-center gap-1 hover:underline"
                  >
                    {showFullInsight ? (
                      <>
                        Show less <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Read more <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Room Types Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mb-8"
          >
            <h2 className="text-xl font-serif font-medium text-foreground mb-4">Select Your Room</h2>
            <div className="space-y-4">
              {hotelRoomTypes.map((room) => (
                <div
                  key={room.id}
                  className={`bg-card rounded-xl border transition-all cursor-pointer ${
                    selectedRoom === room.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Room Image */}
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                      />
                      {selectedRoom === room.id && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground p-1.5 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    {/* Room Details */}
                    <div className="flex-1 p-4 md:p-5">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
                        <div>
                          <h3 className="text-lg font-medium text-foreground">{room.name}</h3>
                          <p className="text-sm text-muted-foreground">{room.description}</p>
                        </div>
                        <div className="text-right">
                          {room.originalPrice && (
                            <p className="text-sm text-muted-foreground line-through">{room.originalPrice}</p>
                          )}
                          <p className="text-xl font-bold text-foreground">{room.price}</p>
                          <p className="text-xs text-muted-foreground">for 2 nights</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-4 w-4" />
                          {room.bedType}
                        </span>
                        <span>•</span>
                        <span>{room.size}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Up to {room.maxGuests} guests
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity) => {
                          const IconComponent = roomAmenityIcons[amenity];
                          return (
                            <span
                              key={amenity}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-xs text-muted-foreground"
                            >
                              {IconComponent && <IconComponent className="h-3 w-3" />}
                              {amenity}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Guest Reviews Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.38 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-medium text-foreground">Guest Reviews</h2>
              <div className="flex items-center gap-2">
                <span className="bg-teal-500 text-white px-2.5 py-1 rounded text-sm font-bold">
                  {hotel.rating}
                </span>
                <span className="text-sm font-medium text-foreground">{getRatingLabel(hotel.rating)}</span>
                <span className="text-sm text-muted-foreground">({hotel.reviews.toLocaleString()} reviews)</span>
              </div>
            </div>

            {/* Ratings Breakdown */}
            <div className="bg-card rounded-xl border border-border p-4 md:p-6 mb-4">
              <h3 className="text-sm font-medium text-foreground mb-4">Rating Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(hotelReviews.breakdown).map(([category, score]) => (
                  <div key={category} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-muted-foreground">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${(score / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground w-8">{score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {hotelReviews.reviews.map((review) => (
                <div key={review.id} className="bg-card rounded-xl border border-border p-4 md:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{review.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {review.country} • {review.tripType} • {review.date}
                        </p>
                      </div>
                    </div>
                    <span className="bg-teal-500 text-white px-2 py-0.5 rounded text-sm font-bold">
                      {review.rating}
                    </span>
                  </div>

                  <h4 className="font-medium text-foreground mb-2">{review.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{review.content}</p>

                  {(review.positives || review.negatives) && (
                    <div className="space-y-2">
                      {review.positives && (
                        <div className="flex items-start gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-muted-foreground">{review.positives}</p>
                        </div>
                      )}
                      {review.negatives && (
                        <div className="flex items-start gap-2">
                          <ThumbsDown className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-muted-foreground">{review.negatives}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4">
              See All {hotel.reviews.toLocaleString()} Reviews
            </Button>
          </motion.section>

          {/* Collapsible Sections */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-8"
          >
            <Accordion type="multiple" defaultValue={["information"]} className="space-y-4">
              {/* Accommodation Information */}
              <AccordionItem value="information" className="bg-card rounded-xl border border-border px-4 md:px-6">
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  Accommodation Information
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pb-2">
                    {hotel.amenities.map((amenity) => {
                      const IconComponent = iconMap[amenity.icon];
                      return (
                        <div
                          key={amenity.name}
                          className="flex flex-col items-center gap-2 p-3 bg-muted rounded-lg text-center"
                        >
                          {IconComponent && <IconComponent className="h-5 w-5 text-muted-foreground" />}
                          <span className="text-xs text-muted-foreground">{amenity.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Accommodation Confirmation */}
              <AccordionItem value="confirmation" className="bg-card rounded-xl border border-border px-4 md:px-6">
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  Accommodation Confirmation
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground pb-2">
                    Once you've made your booking, you can upload your confirmation documents here. 
                    We'll store them securely and make them easily accessible during your trip.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload Documents
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.section>

          {/* Accommodation Map Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-8"
          >
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 md:p-6 border-b border-border">
                <h2 className="text-lg font-medium text-foreground mb-2">Accommodation Map</h2>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{hotel.address}</span>
                </div>
              </div>
              <div className="relative">
                <div ref={mapRef} className="h-[300px] w-full" />
                <button className="absolute top-3 right-3 p-2 bg-background/90 backdrop-blur-sm rounded-lg border border-border hover:bg-background transition-colors">
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xl font-bold text-foreground">{hotel.price}</p>
              <p className="text-sm text-muted-foreground">
                {hotel.dates} • {sampleTrip.travelers} travellers
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Added to Trip
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsAddedToTrip(!isAddedToTrip)}>
                    {isAddedToTrip ? "Remove from Trip" : "Add to Trip"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="bg-primary hover:bg-primary/90">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
