import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/ui/scroll-animations";
import italyImage from "@/assets/destination-italy.jpg";
import jordanImage from "@/assets/destination-jordan.jpg";
import irelandImage from "@/assets/destination-ireland.jpg";

const destinations = [
  {
    id: 1,
    slug: "italy-family",
    title: "Family - Europe Trip",
    image: italyImage,
  },
  {
    id: 2,
    slug: "jordan-honeymoon",
    title: "Couples - Honeymoon in Jordan",
    image: jordanImage,
  },
  {
    id: 3,
    slug: "ireland-road-trip",
    title: "Road Trip Highlands",
    image: irelandImage,
  },
];

export function DestinationsSection() {
  return (
    <section className="py-12 md:py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8 md:mb-12">
            Where to go next
          </h2>
        </FadeIn>

        {/* Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.15}>
          {destinations.map((destination) => (
            <StaggerItem key={destination.id}>
              <ScaleOnHover scale={1.02}>
                <Link to={`/trip/${destination.slug}`} className="group cursor-pointer block">
                  {/* Image */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                    <motion.img
                      src={destination.image}
                      alt={destination.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {destination.title}
                  </h3>
                  
                  {/* Link */}
                  <motion.span 
                    className="flex items-center gap-2 text-foreground font-semibold"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    Start planning
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
