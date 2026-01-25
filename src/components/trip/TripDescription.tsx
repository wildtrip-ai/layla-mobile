import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Download, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ShareButton";

interface TripDescriptionProps {
  title: string;
  description: string;
  tripId: string;
}

export function TripDescription({ title, description, tripId }: TripDescriptionProps) {
  const navigate = useNavigate();

  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log("Downloading trip...");
  };

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
      
      {/* Action Buttons */}
      <motion.div 
        className="mt-6 flex flex-wrap items-center justify-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Button variant="hero" size="lg" className="gap-2">
          Customize this trip
          <ArrowRight className="h-4 w-4" />
        </Button>
        
        <ShareButton 
          title={title} 
          text={description}
          className="!bg-card !border !border-border !shadow-none hover:!bg-secondary/50"
        />
        
        <Button 
          variant="outline" 
          size="lg" 
          className="gap-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
        
        <Button 
          variant="default" 
          size="lg" 
          className="gap-2"
          onClick={() => navigate(`/trip/${tripId}/booking`)}
        >
          <ShoppingCart className="h-4 w-4" />
          Book
        </Button>
      </motion.div>
    </motion.div>
  );
}
