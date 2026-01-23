import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Star, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Accommodation } from "@/data/tripData";

interface AccommodationCardProps {
  accommodation: Accommodation;
}

export function AccommodationCard({ accommodation }: AccommodationCardProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleMoreStays = () => {
    navigate(`/trip/${id || "jordan-honeymoon"}/accommodations`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      {/* AI Insight */}
      <div className="bg-accent px-4 py-3 flex items-start gap-2">
        <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-foreground">
          This <span className="font-semibold text-primary">luxury 5-star hotel</span> perfectly aligns with your request for a{" "}
          <span className="font-semibold">high-end stay in Amman</span> following your visit to the Dead Sea and prior to your departure.
        </p>
      </div>

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Image */}
          <div className="aspect-[4/3] rounded-lg overflow-hidden">
            <img
              src={accommodation.image}
              alt={accommodation.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: accommodation.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h3 className="text-xl font-serif font-medium text-foreground mb-2">
                {accommodation.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="bg-teal-500 text-white px-2 py-0.5 rounded text-sm font-medium">
                  {accommodation.rating}
                </span>
                <span className="text-sm text-foreground font-medium">Very Good</span>
                <span className="text-sm text-muted-foreground">
                  {accommodation.reviews.toLocaleString()} reviews
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end justify-between">
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="h-4 w-4" />
              Remove
            </button>

            <div className="text-right">
              <p className="text-teal-500 font-semibold">{accommodation.provider}</p>
              <p className="text-2xl font-bold text-foreground">{accommodation.price}</p>
              <p className="text-sm text-muted-foreground">Includes taxes and fees</p>

              <div className="flex flex-col gap-2 mt-3">
                <Button className="bg-primary hover:bg-primary/90">
                  View Details
                </Button>
                <Button variant="outline" onClick={handleMoreStays}>
                  More stays
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}