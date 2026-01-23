import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="lavender-surface rounded-2xl p-8 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4">
            Ready to give it a try?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            See how Voyager can turn any idea into a trip in under a minute.
          </p>
          <Button variant="hero" size="lg" className="gap-2">
            Try Voyager now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
