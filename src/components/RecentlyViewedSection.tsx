import { motion } from "framer-motion";
import { Clock, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecentlyViewed, RecentlyViewedItem } from "@/hooks/useRecentlyViewed";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animations";
import { LocalizedLink } from "@/components/LocalizedLink";

export function RecentlyViewedSection() {
  const { items, clearAll, hasItems } = useRecentlyViewed();

  if (!hasItems) return null;

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Recently Viewed</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" staggerDelay={0.05}>
          {items.slice(0, 5).map((item) => (
            <StaggerItem key={`${item.countrySlug}-${item.destinationId}`}>
              <RecentlyViewedCard item={item} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {items.length > 5 && (
          <FadeIn delay={0.3}>
            <div className="mt-6 text-center">
              <Button variant="outline" size="sm" className="gap-2">
                View All ({items.length})
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

function RecentlyViewedCard({ item }: { item: RecentlyViewedItem }) {
  return (
    <LocalizedLink to={`/country/${item.countrySlug}/destination/${item.destinationId}`}>
      <motion.div
        className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-lg transition-shadow"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Country flag */}
        <div className="absolute top-3 right-3 text-lg">
          {item.countryFlag}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-semibold text-white text-sm mb-0.5 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-white/70 text-xs">
            {item.countryName}
          </p>
        </div>
      </motion.div>
    </LocalizedLink>
  );
}
