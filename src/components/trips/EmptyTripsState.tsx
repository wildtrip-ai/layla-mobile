import { motion } from "framer-motion";
import { MapPin, Compass, Clock, FileEdit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";

interface EmptyTripsStateProps {
  tab: "all" | "upcoming" | "past" | "drafts";
}

const tabContent = {
  all: {
    icon: Compass,
    title: "No trips yet",
    description: "Start planning your next adventure and create your first trip.",
  },
  upcoming: {
    icon: MapPin,
    title: "No upcoming trips",
    description: "You don't have any trips planned. Time to start exploring!",
  },
  past: {
    icon: Clock,
    title: "No past trips",
    description: "Your completed adventures will appear here.",
  },
  drafts: {
    icon: FileEdit,
    title: "No draft trips",
    description: "Trips you're still planning will show up here.",
  },
};

export function EmptyTripsState({ tab }: EmptyTripsStateProps) {
  const content = tabContent[tab];
  const Icon = content.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <Icon className="h-10 w-10 text-primary" />
      </motion.div>

      <motion.h3
        className="text-xl font-serif font-medium text-foreground mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {content.title}
      </motion.h3>

      <motion.p
        className="text-muted-foreground max-w-sm mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {content.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <LocalizedLink to="/new-trip-planner">
          <Button variant="hero" size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Create New Trip
          </Button>
        </LocalizedLink>
      </motion.div>
    </motion.div>
  );
}
