import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";

export function EmptyTripState() {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-[60vh] text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className="relative mb-8"
        animate={{ 
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
        <div className="relative bg-secondary/50 rounded-full p-6">
          <MapPin className="h-12 w-12 text-primary" />
        </div>
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ 
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="h-5 w-5 text-primary" />
        </motion.div>
      </motion.div>
      
      <motion.h2 
        className="text-2xl md:text-3xl font-serif text-foreground mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Your adventure starts here
      </motion.h2>
      
      <motion.p 
        className="text-muted-foreground max-w-md text-base md:text-lg leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Tell Voyager about your dream destination, travel style, and budget. 
        I'll craft the perfect itinerary for you.
      </motion.p>

      <motion.div
        className="mt-8 flex items-center gap-2 text-sm text-muted-foreground/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="w-8 h-px bg-border" />
        <span>Start chatting to begin</span>
        <div className="w-8 h-px bg-border" />
      </motion.div>
    </motion.div>
  );
}
