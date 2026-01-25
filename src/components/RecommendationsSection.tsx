import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useFavorites } from "@/hooks/useFavorites";
import { getCountryBySlug, CountryData, CountryPlace, allCountries } from "@/data/countriesData";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animations";

interface RecommendedDestination {
  countrySlug: string;
  destinationId: string;
  destination: CountryPlace;
  country: CountryData;
  reason: string;
}

// Countries grouped by region for finding similar destinations
const regionGroups: Record<string, string[]> = {
  "Western Europe": ["spain", "portugal", "france", "italy", "germany", "netherlands", "belgium"],
  "Southern Europe": ["spain", "portugal", "italy", "greece", "croatia"],
  "Central Europe": ["germany", "austria", "switzerland", "czech-republic", "poland"],
  "Southeast Asia": ["thailand", "vietnam", "indonesia", "malaysia", "philippines", "cambodia"],
  "East Asia": ["japan", "south-korea", "china", "taiwan"],
  "Middle East": ["jordan", "uae", "israel", "turkey", "egypt"],
  "North Africa": ["morocco", "egypt", "tunisia"],
};

function getRegionForCountry(countrySlug: string): string | undefined {
  for (const [region, countries] of Object.entries(regionGroups)) {
    if (countries.includes(countrySlug)) {
      return region;
    }
  }
  return undefined;
}

function getSimilarCountries(countrySlug: string): string[] {
  const region = getRegionForCountry(countrySlug);
  if (!region) return [];
  return regionGroups[region]?.filter(c => c !== countrySlug) || [];
}

export function RecommendationsSection() {
  const { items: recentlyViewed } = useRecentlyViewed();
  const { getFavoritesByCategory } = useFavorites();
  
  const recommendations = useMemo(() => {
    const recommended: RecommendedDestination[] = [];
    const seenIds = new Set<string>();
    
    // Collect viewed and favorited destination IDs to exclude
    const excludeIds = new Set<string>();
    recentlyViewed.forEach(item => {
      excludeIds.add(`${item.countrySlug}-${item.destinationId}`);
    });
    getFavoritesByCategory('destinations').forEach(fav => {
      excludeIds.add(`${fav.countrySlug}-${fav.itemId}`);
    });

    // Strategy 1: More destinations from countries user has viewed
    const viewedCountries = [...new Set(recentlyViewed.map(item => item.countrySlug))];
    
    for (const countrySlug of viewedCountries.slice(0, 3)) {
      const country = getCountryBySlug(countrySlug);
      if (!country) continue;
      
      for (const dest of country.destinations) {
        const key = `${countrySlug}-${dest.id}`;
        if (!excludeIds.has(key) && !seenIds.has(key)) {
          seenIds.add(key);
          recommended.push({
            countrySlug,
            destinationId: dest.id,
            destination: dest,
            country,
            reason: `More in ${country.name}`,
          });
        }
        if (recommended.length >= 2) break;
      }
    }

    // Strategy 2: Destinations from similar regions
    for (const countrySlug of viewedCountries.slice(0, 2)) {
      const similarCountries = getSimilarCountries(countrySlug);
      
      for (const similarSlug of similarCountries.slice(0, 2)) {
        const country = getCountryBySlug(similarSlug);
        if (!country) continue;
        
        for (const dest of country.destinations.slice(0, 1)) {
          const key = `${similarSlug}-${dest.id}`;
          if (!excludeIds.has(key) && !seenIds.has(key)) {
            seenIds.add(key);
            const region = getRegionForCountry(countrySlug);
            recommended.push({
              countrySlug: similarSlug,
              destinationId: dest.id,
              destination: dest,
              country,
              reason: region ? `Similar to ${region}` : "You might like",
            });
          }
        }
        if (recommended.length >= 5) break;
      }
      if (recommended.length >= 5) break;
    }

    // Strategy 3: Based on favorites - find similar countries
    const favCountries = [...new Set(getFavoritesByCategory('destinations').map(f => f.countrySlug))];
    
    for (const countrySlug of favCountries.slice(0, 2)) {
      const similarCountries = getSimilarCountries(countrySlug);
      
      for (const similarSlug of similarCountries.slice(0, 1)) {
        const country = getCountryBySlug(similarSlug);
        if (!country) continue;
        
        for (const dest of country.destinations.slice(0, 1)) {
          const key = `${similarSlug}-${dest.id}`;
          if (!excludeIds.has(key) && !seenIds.has(key) && recommended.length < 8) {
            seenIds.add(key);
            recommended.push({
              countrySlug: similarSlug,
              destinationId: dest.id,
              destination: dest,
              country,
              reason: "Based on favorites",
            });
          }
        }
      }
    }

    // Fill remaining slots with popular destinations
    const popularCountries = ["spain", "italy", "portugal", "indonesia", "germany"];
    if (recommended.length < 5) {
      for (const slug of popularCountries) {
        const country = getCountryBySlug(slug);
        if (!country) continue;
        
        for (const dest of country.destinations) {
          const key = `${slug}-${dest.id}`;
          if (!excludeIds.has(key) && !seenIds.has(key) && recommended.length < 5) {
            seenIds.add(key);
            recommended.push({
              countrySlug: slug,
              destinationId: dest.id,
              destination: dest,
              country,
              reason: "Popular destination",
            });
          }
        }
      }
    }

    return recommended.slice(0, 6);
  }, [recentlyViewed, getFavoritesByCategory]);

  // Only show if user has some history
  const hasHistory = recentlyViewed.length > 0 || getFavoritesByCategory('destinations').length > 0;
  
  if (!hasHistory || recommendations.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Recommended for You</h2>
                <p className="text-sm text-muted-foreground">Based on your interests</p>
              </div>
            </div>
            <Link to="/countries">
              <Button variant="ghost" size="sm" className="gap-1">
                Explore All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" staggerDelay={0.05}>
          {recommendations.map((rec) => (
            <StaggerItem key={`${rec.countrySlug}-${rec.destinationId}`}>
              <RecommendationCard recommendation={rec} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function RecommendationCard({ recommendation }: { recommendation: RecommendedDestination }) {
  const { countrySlug, destinationId, destination, country, reason } = recommendation;
  
  return (
    <Link to={`/country/${countrySlug}/destination/${destinationId}`}>
      <motion.div
        className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-xl transition-all"
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Reason badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 bg-white/90 text-foreground text-[10px] px-2 py-0.5"
        >
          {reason}
        </Badge>

        {/* Country flag */}
        <div className="absolute top-3 right-3 text-lg">
          {country.flag}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-semibold text-white text-sm mb-0.5 line-clamp-1">
            {destination.name}
          </h3>
          <p className="text-white/70 text-xs">
            {country.name}
          </p>
          {destination.rating && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-white/90 text-xs">{destination.rating}</span>
            </div>
          )}
        </div>

        {/* Hover shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </motion.div>
    </Link>
  );
}
