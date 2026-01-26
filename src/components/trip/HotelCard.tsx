import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  Trash2,
  Sparkles,
  ChevronRight,
  Check,
  ChevronDown,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Accommodation } from "@/data/tripData";

interface PriceOption {
  provider: string;
  price: string;
}

interface HotelCardProps {
  accommodation: Accommodation;
  isFeatured?: boolean;
  showAIInsight?: boolean;
  showRemove?: boolean;
  onRemove?: () => void;
  showAddToTrip?: boolean;
  isAddedToTrip?: boolean;
  onAddToTrip?: (added: boolean) => void;
  priceOptions?: PriceOption[];
  specialBadges?: Array<{ label: string; variant?: "default" | "secondary" }>;
  additionalInfo?: string;
}

function getRatingLabel(rating: number): string {
  if (rating >= 9.5) return "Wonderful";
  if (rating >= 9.0) return "Excellent";
  if (rating >= 8.5) return "Very Good";
  if (rating >= 8.0) return "Good";
  return "Pleasant";
}

export function HotelCard({
  accommodation,
  isFeatured = false,
  showAIInsight = true,
  showRemove = false,
  onRemove,
  showAddToTrip = false,
  isAddedToTrip = false,
  onAddToTrip,
  priceOptions,
  specialBadges,
  additionalInfo,
}: HotelCardProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [added, setAdded] = useState(isAddedToTrip);

  const handleMoreStays = () => {
    navigate(`/trip/${id || "jordan-honeymoon"}/accommodations`);
  };

  const handleViewDetails = () => {
    navigate(`/trip/${id || "jordan-honeymoon"}/accommodation/${accommodation.id}`);
  };

  const handleAddToTrip = () => {
    const newState = !added;
    setAdded(newState);
    onAddToTrip?.(newState);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`bg-card rounded-xl border overflow-hidden ${
        isFeatured ? "border-primary border-2" : "border-border"
      }`}
    >
      {/* AI Insight */}
      {showAIInsight && (
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
            {priceOptions && priceOptions.length > 0 && (
              <div className="space-y-2">
                {priceOptions.map((option, idx) => (
                  <button
                    key={idx}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="text-xs px-1.5 py-0.5 bg-muted rounded">
                      {option.provider}
                    </span>
                    <span>{option.price}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
                <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  More deals
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col justify-between items-stretch md:items-end gap-4">
            {/* Special badges */}
            {specialBadges && specialBadges.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {specialBadges.map((badge, idx) => (
                  <Badge
                    key={idx}
                    variant={badge.variant || "secondary"}
                    className="bg-primary/10 text-primary border-0"
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            )}

            <div className="text-right flex-1 flex flex-col justify-center">
              <p className="text-teal-500 font-semibold">{accommodation.provider}</p>
              {additionalInfo && (
                <p className="text-sm text-teal-600">{additionalInfo}</p>
              )}
              <p className="text-2xl font-bold text-foreground">{accommodation.price}</p>
              <p className="text-sm text-muted-foreground">Includes taxes and fees</p>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              {showAddToTrip ? (
                <>
                  <Button
                    variant={added ? "secondary" : "outline"}
                    className={`w-full md:w-40 ${added ? "bg-muted" : ""}`}
                    onClick={handleAddToTrip}
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
                  <Button className="w-full md:w-40" onClick={handleViewDetails}>
                    View Details
                  </Button>
                </>
              ) : (
                <>
                  {showRemove && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive justify-end"
                      onClick={onRemove}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                  <Button className="w-full" onClick={handleViewDetails}>
                    View Details
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleMoreStays}>
                    More stays
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
