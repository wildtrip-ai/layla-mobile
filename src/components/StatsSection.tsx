import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { FadeIn } from "@/components/ui/scroll-animations";

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [end, duration, isInView, hasStarted]);

  return (
    <motion.span
      ref={ref}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {count.toLocaleString()}{suffix}
    </motion.span>
  );
}

export function StatsSection() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <FadeIn>
          <motion.div 
            className="bg-card rounded-2xl shadow-lg p-6 md:p-10"
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left side - CTA */}
              <FadeIn delay={0.1} direction="left">
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
                    Your trip in minutes, not weeks.
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Plan your next trip with me and save hours of planning
                  </p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="hero" size="lg" className="gap-2">
                      <Send className="h-4 w-4" />
                      Plan my trip
                    </Button>
                  </motion.div>
                </div>
              </FadeIn>

              {/* Right side - Stats */}
              <div className="grid grid-cols-2 gap-6 text-center lg:text-right">
                <FadeIn delay={0.2} direction="up">
                  <div>
                    <div className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-1">
                      <AnimatedCounter end={1463836} />
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base">Trips Planned</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.3} direction="up">
                  <div>
                    <div className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-1">
                      <AnimatedCounter end={26557108} />
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base">Messages Processed</p>
                  </div>
                </FadeIn>
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
