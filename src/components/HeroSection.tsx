import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Send } from "lucide-react";
import heroImage from "@/assets/hero-japan.jpg";

export function HeroSection() {
  const [tripQuery, setTripQuery] = useState("");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful travel destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 pt-20 pb-16 md:pt-24">
        <div className="container mx-auto text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-card mb-4 text-shadow-hero animate-fade-in">
            Travel Planning Made Simple
          </h1>
          <p className="text-lg md:text-xl text-card/90 mb-8 md:mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Just describe your dream trip. We do the heavy lifting.
          </p>

          {/* Search Input Card */}
          <div className="max-w-2xl mx-auto mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
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
                  <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
                    <Mic className="h-5 w-5" />
                  </button>
                  <Button variant="hero" size="lg" className="gap-2">
                    <Send className="h-4 w-4" />
                    Plan my trip
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero-outline" size="default">
              Create a new trip
            </Button>
            <Button variant="hero-outline" size="default">
              Inspire me where to go
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
