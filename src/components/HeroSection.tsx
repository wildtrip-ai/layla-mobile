import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, Send } from "lucide-react";
import heroImage from "@/assets/hero-japan.jpg";

export function HeroSection() {
  const [tripQuery, setTripQuery] = useState("");
  const sectionRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <img
          src={heroImage}
          alt="Beautiful travel destination"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
      </motion.div>

      {/* Content with Parallax */}
      <motion.div 
        className="relative z-10 w-full px-4 pt-20 pb-16 md:pt-24"
        style={{ y: textY, opacity }}
      >
        <div className="container mx-auto text-center">
          {/* Headline */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-card mb-4 text-shadow-hero"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Travel Planning Made Simple
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-card/90 mb-8 md:mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Just describe your dream trip. We do the heavy lifting.
          </motion.p>

          {/* Search Input Card */}
          <motion.div 
            className="max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="bg-card rounded-2xl shadow-2xl p-4 md:p-6">
              <div className="flex flex-col gap-4">
                <textarea
                  value={tripQuery}
                  onChange={(e) => setTripQuery(e.target.value)}
                  placeholder="Help me plan a budget-friendly vacation to Barcelona"
                  className="w-full min-h-[80px] md:min-h-[60px] resize-none border-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base md:text-lg"
                  rows={2}
                />
                <div className="flex items-center justify-end gap-3">
                  <motion.button 
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mic className="h-5 w-5" />
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="hero" size="lg" className="gap-2">
                      <Send className="h-4 w-4" />
                      Plan my trip
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick action buttons */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button variant="hero-outline" size="default">
                Create a new trip
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button variant="hero-outline" size="default">
                Inspire me where to go
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
