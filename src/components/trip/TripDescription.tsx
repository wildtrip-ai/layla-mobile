import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface TripDescriptionProps {
  title: string;
  description: string;
}

export function TripDescription({ title, description }: TripDescriptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-center py-8"
    >
      <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4 italic">
        {title}
      </h2>
      <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        {description}
      </p>
      <motion.div 
        className="mt-6"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button variant="hero" size="lg" className="gap-2">
          Customize this trip
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
