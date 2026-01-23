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
  Users
} from "lucide-react";
import { Header } from "@/components/Header";
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
import type L from "leaflet";

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

            {/* Hero Image */}
            <div className="aspect-[16/9] rounded-xl overflow-hidden">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xl font-bold text-foreground">{hotel.price}</p>
              <p className="text-sm text-muted-foreground">
                {hotel.dates} • {sampleTrip.travelers} travellers
              </p>
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
        </div>
      </div>
    </div>
  );
}
