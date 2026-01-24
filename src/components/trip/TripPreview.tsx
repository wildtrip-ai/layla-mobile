import { motion } from "framer-motion";
import { Calendar, MapPin, Plane, Building2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TripData } from "@/data/tripData";
import { Link } from "react-router-dom";

interface TripPreviewProps {
  trip: TripData;
}

export function TripPreview({ trip }: TripPreviewProps) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Trip Header Card */}
      <motion.div 
        className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {/* Hero Image */}
        <div className="relative h-48 md:h-64">
          <img 
            src={trip.image} 
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge variant="secondary" className="mb-2">
              AI Generated
            </Badge>
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-1">
              {trip.title}
            </h2>
            <p className="text-white/80 text-sm">{trip.subtitle}</p>
          </div>
        </div>

        {/* Trip Stats */}
        <div className="p-4 md:p-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{trip.dates}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{trip.stats.cities} cities</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-lg font-semibold text-foreground">{trip.stats.days}</div>
              <div className="text-xs text-muted-foreground">Days</div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <MapPin className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-lg font-semibold text-foreground">{trip.stats.cities}</div>
              <div className="text-xs text-muted-foreground">Cities</div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <Activity className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-lg font-semibold text-foreground">{trip.stats.activities}</div>
              <div className="text-xs text-muted-foreground">Activities</div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <Building2 className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-lg font-semibold text-foreground">{trip.stats.hotels}</div>
              <div className="text-xs text-muted-foreground">Hotels</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* City Stops Preview */}
      <motion.div
        className="bg-card rounded-2xl p-4 md:p-6 border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h3 className="font-semibold text-foreground mb-4">Your Route</h3>
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {trip.cityStops.map((city, index) => (
            <div 
              key={city.id}
              className="flex items-center gap-3 flex-shrink-0"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary/20">
                  <img 
                    src={city.image} 
                    alt={city.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium">
                  {index + 1}
                </div>
              </div>
              <div>
                <div className="font-medium text-foreground text-sm">{city.name}</div>
                <div className="text-xs text-muted-foreground">{city.dates}</div>
              </div>
              {index < trip.cityStops.length - 1 && (
                <Plane className="h-4 w-4 text-muted-foreground/50 rotate-90" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        className="bg-card rounded-2xl p-4 md:p-6 border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h3 className="font-semibold text-foreground mb-3">Trip Overview</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {trip.description}
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Link to={`/trip/${trip.id}`} className="flex-1">
          <Button variant="hero" size="lg" className="w-full">
            View Full Itinerary
          </Button>
        </Link>
        <Button variant="outline" size="lg" className="flex-1">
          Save Draft
        </Button>
      </motion.div>
    </motion.div>
  );
}
