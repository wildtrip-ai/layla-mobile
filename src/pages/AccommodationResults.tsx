import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  SlidersHorizontal,
  Map,
  ArrowUpDown,
  ChevronDown,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { AccommodationMap } from "@/components/trip/AccommodationMap";
import { HotelCard } from "@/components/trip/HotelCard";
import { sampleTrip, type Accommodation } from "@/data/tripData";

// Extended accommodation data for the results page
const moreAccommodations: Accommodation[] = [
  ...sampleTrip.accommodations,
  {
    id: "a2",
    name: "The Ritz-Carlton, Amman",
    stars: 5,
    rating: 9.5,
    reviews: 807,
    image: sampleTrip.accommodations[0].image,
    dates: "May 1 - 3",
    price: "UAH 36,495",
    provider: "Layla",
    description: "Experience unparalleled luxury with stunning views of Amman.",
  },
  {
    id: "a3",
    name: "The St. Regis Amman",
    stars: 5,
    rating: 9.0,
    reviews: 480,
    image: sampleTrip.accommodations[0].image,
    dates: "May 1 - 3",
    price: "UAH 28,990",
    provider: "Expedia",
    description: "Sophisticated elegance in the heart of Amman's diplomatic district.",
  },
  {
    id: "a4",
    name: "Fairmont Amman",
    stars: 5,
    rating: 8.9,
    reviews: 1205,
    image: sampleTrip.accommodations[0].image,
    dates: "May 1 - 3",
    price: "UAH 22,150",
    provider: "Booking.com",
    description: "Modern luxury with exceptional dining and panoramic city views.",
  },
];

const filterOptions = [
  "Price",
  "Free cancellation",
  "Pay later",
  "4 to 5-star",
  "8.0+ rating",
  "Swimming pool",
  "Spa",
  "Gym",
];


export default function AccommodationResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);

  const handleViewDetails = (accommodationId: string) => {
    navigate(`/trip/${id || "jordan-honeymoon"}/accommodation/${accommodationId}`);
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
          >
            <Link 
              to={`/trip/${id || sampleTrip.id}`}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Trip plan
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Accommodation results</span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-serif text-foreground">
                Accommodation in Amman
              </h1>
              <p className="text-muted-foreground">
                2 nights · 2 people · May 1 – 3
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort: Our Top Picks
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button 
                variant={showMap ? "default" : "secondary"} 
                className="gap-2"
                onClick={() => setShowMap(true)}
              >
                <Map className="h-4 w-4" />
                View Map
              </Button>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide"
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="shrink-0 gap-1"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            {filterOptions.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilters.includes(filter) ? "default" : "outline"}
                size="sm"
                className="shrink-0"
                onClick={() => toggleFilter(filter)}
              >
                {filter}
                {filter === "Price" && <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
            ))}
          </motion.div>

          {/* Add your stay prompt */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3 mb-6"
          >
            <span className="text-sm text-foreground">
              Do you already have a place to stay?
            </span>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add your Stay
            </Button>
          </motion.div>

          {/* Results */}
          <div className="space-y-4">
            {moreAccommodations.map((accommodation, index) => {
              const isFeatured = index === 0;
              const price = parseInt(accommodation.price.replace(/\D/g, ""));
              const priceOptions = [
                { provider: "agoda", price: `UAH ${(price - 50).toLocaleString()}` },
                { provider: "Expedia", price: `UAH ${(price + 10).toLocaleString()}` },
              ];
              const specialBadges = !isFeatured && accommodation.id === "a2"
                ? [
                    { label: "Only on Layla" },
                    { label: "-UAH 3,882" },
                  ]
                : undefined;
              const additionalInfo = accommodation.id === "a2"
                ? "Free cancellation · Breakfast included"
                : undefined;

              return (
                <HotelCard
                  key={accommodation.id}
                  accommodation={accommodation}
                  isFeatured={isFeatured}
                  showAIInsight={isFeatured}
                  showAddToTrip={true}
                  isAddedToTrip={index === 0}
                  priceOptions={priceOptions}
                  specialBadges={specialBadges}
                  additionalInfo={additionalInfo}
                />
              );
            })}
          </div>
        </div>
      </main>

      {/* Map View */}
      <AnimatePresence>
        {showMap && (
          <AccommodationMap 
            accommodations={moreAccommodations} 
            onClose={() => setShowMap(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}