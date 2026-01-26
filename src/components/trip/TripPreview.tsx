import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Plane, Building2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TypingText } from "@/components/ui/typing-text";
import type { TripData } from "@/data/tripData";
import { Link } from "react-router-dom";

interface TripPreviewProps {
  trip: TripData;
}

type RevealPhase = 
  | "hero"
  | "badge"
  | "title"
  | "subtitle"
  | "stats-header"
  | "stats-grid"
  | "cities-header"
  | "cities"
  | "description-header"
  | "description"
  | "buttons"
  | "complete";

const phaseSequence: RevealPhase[] = [
  "hero",
  "badge",
  "title",
  "subtitle",
  "stats-header",
  "stats-grid",
  "cities-header",
  "cities",
  "description-header",
  "description",
  "buttons",
  "complete",
];

export function TripPreview({ trip }: TripPreviewProps) {
  const [currentPhase, setCurrentPhase] = useState<RevealPhase>("hero");
  const [revealedCities, setRevealedCities] = useState(0);
  const [revealedStats, setRevealedStats] = useState(0);

  const advancePhase = useCallback(() => {
    setCurrentPhase((prev) => {
      const currentIndex = phaseSequence.indexOf(prev);
      if (currentIndex < phaseSequence.length - 1) {
        return phaseSequence[currentIndex + 1];
      }
      return prev;
    });
  }, []);

  const phaseIndex = phaseSequence.indexOf(currentPhase);
  const hasReached = (phase: RevealPhase) => phaseIndex >= phaseSequence.indexOf(phase);

  // Auto-advance phases with timing
  useEffect(() => {
    const timings: Partial<Record<RevealPhase, number>> = {
      hero: 300,
      badge: 400,
      title: 800,
      subtitle: 600,
      "stats-header": 300,
      "stats-grid": 800,
      "cities-header": 400,
      cities: 800,
      "description-header": 400,
      description: 1500,
      buttons: 500,
    };

    const delay = timings[currentPhase];
    if (delay && currentPhase !== "complete") {
      const timeout = setTimeout(advancePhase, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentPhase, advancePhase]);

  // Reveal stats one by one
  useEffect(() => {
    if (currentPhase === "stats-grid" && revealedStats < 4) {
      const timeout = setTimeout(() => {
        setRevealedStats((prev) => prev + 1);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [currentPhase, revealedStats]);

  // Reveal cities one by one
  useEffect(() => {
    if (currentPhase === "cities" && revealedCities < trip.cityStops.length) {
      const timeout = setTimeout(() => {
        setRevealedCities((prev) => prev + 1);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [currentPhase, revealedCities, trip.cityStops.length]);

  const stats = [
    { icon: Calendar, value: trip.stats.days, label: "Days" },
    { icon: MapPin, value: trip.stats.cities, label: "Cities" },
    { icon: Activity, value: trip.stats.activities, label: "Activities" },
    { icon: Building2, value: trip.stats.hotels, label: "Hotels" },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Trip Header Card */}
      <AnimatePresence>
        {hasReached("hero") && (
          <motion.div
            className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Hero Image */}
            <div className="relative h-48 md:h-64 overflow-hidden">
              <motion.img
                src={trip.image}
                alt={trip.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <AnimatePresence>
                  {hasReached("badge") && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Badge variant="secondary" className="mb-2">
                        AI Generated
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>

                <h2 className="text-2xl md:text-3xl font-serif text-white mb-1 min-h-[2rem]">
                  {hasReached("title") && (
                    <TypingText
                      text={trip.title}
                      speed={40}
                      showCursor={!hasReached("subtitle")}
                    />
                  )}
                </h2>

                <p className="text-white/80 text-sm min-h-[1.25rem]">
                  {hasReached("subtitle") && (
                    <TypingText
                      text={trip.subtitle}
                      speed={25}
                      showCursor={!hasReached("stats-header")}
                    />
                  )}
                </p>
              </div>
            </div>

            {/* Trip Stats */}
            <div className="p-4 md:p-6">
              <AnimatePresence>
                {hasReached("stats-header") && (
                  <motion.div
                    className="flex items-center gap-4 text-sm text-muted-foreground mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{trip.dates}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      <span>{trip.stats.cities} cities</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3">
                {stats.map((stat, index) => (
                  <AnimatePresence key={stat.label}>
                    {revealedStats > index && (
                      <motion.div
                        className="text-center p-3 bg-secondary/50 rounded-xl"
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                      >
                        <stat.icon className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <motion.div
                          className="text-lg font-semibold text-foreground"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {stat.value}
                        </motion.div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* City Stops Preview */}
      <AnimatePresence>
        {hasReached("cities-header") && (
          <motion.div
            className="bg-card rounded-2xl p-4 md:p-6 border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="font-semibold text-foreground mb-4">
              <TypingText
                text="Your Route"
                speed={50}
                showCursor={!hasReached("cities")}
              />
            </h3>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {trip.cityStops.slice(0, revealedCities).map((city, index) => (
                <motion.div
                  key={city.id}
                  className="flex items-center gap-3 flex-shrink-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary/20">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                    >
                      {index + 1}
                    </motion.div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{city.name}</div>
                    <div className="text-xs text-muted-foreground">{city.dates}</div>
                  </div>
                  {index < trip.cityStops.length - 1 && revealedCities > index + 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Plane className="h-4 w-4 text-muted-foreground/50 rotate-90" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description */}
      <AnimatePresence>
        {hasReached("description-header") && (
          <motion.div
            className="bg-card rounded-2xl p-4 md:p-6 border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="font-semibold text-foreground mb-3">
              <TypingText
                text="Trip Overview"
                speed={50}
                showCursor={!hasReached("description")}
              />
            </h3>
            {hasReached("description") && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                <TypingText
                  text={trip.description}
                  speed={15}
                  showCursor={!hasReached("buttons")}
                />
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <AnimatePresence>
        {hasReached("buttons") && (
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link to={`/trip/${trip.id}`} className="flex-1">
              <Button variant="hero" size="lg" className="w-full">
                View Full Itinerary
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="flex-1 w-full">
              Save Draft
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
