import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  ChevronRight, 
  Star, 
  SlidersHorizontal, 
  Map, 
  List,
  ArrowUpDown,
  ChevronDown,
  Plus,
  Check,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { AccommodationMap } from "@/components/trip/AccommodationMap";
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

function getRatingLabel(rating: number): string {
  if (rating >= 9.5) return "Wonderful";
  if (rating >= 9.0) return "Excellent";
  if (rating >= 8.5) return "Very Good";
  if (rating >= 8.0) return "Good";
  return "Pleasant";
}

interface AccommodationResultCardProps {
  accommodation: Accommodation;
  isAdded?: boolean;
  isFeatured?: boolean;
}

function AccommodationResultCard({ 
  accommodation, 
  isAdded = false,
  isFeatured = false 
}: AccommodationResultCardProps) {
  const [added, setAdded] = useState(isAdded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-card rounded-xl border overflow-hidden ${
        isFeatured ? "border-primary border-2" : "border-border"
      }`}
    >
      {/* AI Insight for featured */}
      {isFeatured && (
        <div className="bg-accent px-4 py-3 flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            This <span className="font-semibold text-primary">luxury 5-star hotel</span> perfectly aligns with your request for a{" "}
            <span className="font-semibold">high-end stay in Amman</span> following your visit to the Dead Sea and prior to your departure.
          </p>
        </div>
      )}

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_200px] gap-4 md:gap-6">
          {/* Image */}
          <div className="aspect-[4/3] md:aspect-square rounded-lg overflow-hidden">
            <img
              src={accommodation.image}
              alt={accommodation.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: accommodation.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h3 className="text-xl font-serif font-medium text-foreground mb-2">
                {accommodation.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-teal-500 text-white px-2 py-0.5 rounded text-sm font-medium">
                  {accommodation.rating}
                </span>
                <span className="text-sm text-foreground font-medium">
                  {getRatingLabel(accommodation.rating)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {accommodation.reviews.toLocaleString()} reviews
                </span>
              </div>
            </div>

            {/* Price options */}
            <div className="space-y-2">
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="text-xs px-1.5 py-0.5 bg-muted rounded">agoda</span>
                <span>UAH {(parseInt(accommodation.price.replace(/\D/g, "")) - 50).toLocaleString()}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="text-xs px-1.5 py-0.5 bg-muted rounded">Expedia</span>
                <span>UAH {(parseInt(accommodation.price.replace(/\D/g, "")) + 10).toLocaleString()}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                More deals
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col justify-between items-stretch md:items-end gap-4">
            {/* Special badges */}
            {!isFeatured && accommodation.id === "a2" && (
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                  Only on Layla
                </Badge>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-0">
                  -UAH 3,882
                </Badge>
              </div>
            )}

            <div className="text-right flex-1 flex flex-col justify-center">
              <p className="text-teal-500 font-semibold">{accommodation.provider}</p>
              {accommodation.id === "a2" && (
                <p className="text-sm text-teal-600">Free cancellation · Breakfast included</p>
              )}
              <p className="text-2xl font-bold text-foreground">{accommodation.price}</p>
              <p className="text-sm text-muted-foreground">Includes taxes and fees</p>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Button 
                variant={added ? "secondary" : "outline"}
                className={`w-full md:w-40 ${added ? "bg-muted" : ""}`}
                onClick={() => setAdded(!added)}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Added to Trip
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Add to Trip
                  </>
                )}
              </Button>
              <Button className="w-full md:w-40">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AccommodationResults() {
  const { id } = useParams();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);

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
            {moreAccommodations.map((accommodation, index) => (
              <AccommodationResultCard
                key={accommodation.id}
                accommodation={accommodation}
                isAdded={index === 0}
                isFeatured={index === 0}
              />
            ))}
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