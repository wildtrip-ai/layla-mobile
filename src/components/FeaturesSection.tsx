import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Diamond, DollarSign, Globe, CheckCircle } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, Parallax } from "@/components/ui/scroll-animations";

const features = [
  {
    icon: Diamond,
    title: "Tailor-made",
    description: "Ask Voyager to create a personalized itinerary tailored to your preferences and travel style.",
  },
  {
    icon: DollarSign,
    title: "Cheaper",
    description: "Voyager makes you find the best deals and offers, saving you money on your travel plans.",
  },
  {
    icon: Globe,
    title: "Hidden Gems",
    description: "Voyager uncovers hidden gems and off-the-beaten-path destinations, ensuring you.",
  },
  {
    icon: CheckCircle,
    title: "No Surprises",
    description: "Voyager ensures everything runs smoothly, from flights to accommodations, with no.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-12 md:py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* All-in-One Card */}
        <FadeIn>
          <Parallax offset={20}>
            <motion.div 
              className="bg-secondary rounded-2xl p-6 md:p-10 mb-16"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
                All-in-One AI Trip Planner
              </h2>
              <p className="text-muted-foreground max-w-3xl mb-6 leading-relaxed">
                Looking for the perfect trip planner for your next family vacation, romantic getaway, anniversary escape, or birthday trip? You're in the right place. Ask me anything about planning your vacation — from dreamy destinations and cozy stays to flights, road trips, and more. Whether you're traveling with kids, your partner, or solo, I'll help you build the perfect...
                <button className="text-foreground font-semibold ml-1">... Read more</button>
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="hero" size="lg" className="gap-2">
                  Create a new trip
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </Parallax>
        </FadeIn>

        {/* Features Grid */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              I will be there for you in every step
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Curate, save and get notified about your trips on the go.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.1}>
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div 
                className="text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-border bg-card mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className="h-6 w-6 text-foreground" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                  {feature.description}
                </p>
                <motion.button 
                  className="text-foreground font-semibold text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  ... Read more
                </motion.button>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
