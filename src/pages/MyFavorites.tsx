import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Trash2, Building2, UtensilsCrossed, Palette, Landmark, Mountain, TreePine, Star, Heart, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useFavoritesApi, FavoriteCategory as ApiFavoriteCategory, FavoriteItem as ApiFavoriteItem } from "@/hooks/useFavoritesApi";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { FavoritesGridSkeleton } from "@/components/FavoriteCardSkeleton";
import { getStoredToken, removeFavorite as removeFavoriteApi } from "@/lib/auth";

// Map API categories (snake_case) to display categories
type LocalCategory = 'destinations' | 'cities' | 'restaurants' | 'museums' | 'historicalSites' | 'naturalAttractions' | 'amenities' | 'accommodations' | 'activities';

const categoryConfig: Record<LocalCategory, { label: string; icon: React.ReactNode; pluralLabel: string; apiValue: ApiFavoriteCategory }> = {
  destinations: { label: "Destinations", icon: <MapPin className="h-4 w-4" />, pluralLabel: "destinations", apiValue: "destinations" },
  cities: { label: "Cities", icon: <Building2 className="h-4 w-4" />, pluralLabel: "cities", apiValue: "cities" },
  restaurants: { label: "Restaurants", icon: <UtensilsCrossed className="h-4 w-4" />, pluralLabel: "restaurants", apiValue: "restaurants" },
  museums: { label: "Museums", icon: <Palette className="h-4 w-4" />, pluralLabel: "museums", apiValue: "museums" },
  historicalSites: { label: "Historical", icon: <Landmark className="h-4 w-4" />, pluralLabel: "historical sites", apiValue: "historical_sites" },
  naturalAttractions: { label: "Nature", icon: <Mountain className="h-4 w-4" />, pluralLabel: "natural attractions", apiValue: "natural_attractions" },
  amenities: { label: "Amenities", icon: <TreePine className="h-4 w-4" />, pluralLabel: "amenities", apiValue: "amenities" },
  accommodations: { label: "Accommodations", icon: <Building2 className="h-4 w-4" />, pluralLabel: "accommodations", apiValue: "accommodations" },
  activities: { label: "Activities", icon: <Mountain className="h-4 w-4" />, pluralLabel: "activities", apiValue: "activities" },
};

const categoryOrder: LocalCategory[] = ['destinations', 'cities', 'restaurants', 'museums', 'historicalSites', 'naturalAttractions', 'amenities', 'accommodations', 'activities'];

// Convert API category to local category
function apiCategoryToLocal(apiCategory: ApiFavoriteCategory): LocalCategory {
  const mapping: Record<ApiFavoriteCategory, LocalCategory> = {
    'destinations': 'destinations',
    'cities': 'cities',
    'restaurants': 'restaurants',
    'museums': 'museums',
    'historical_sites': 'historicalSites',
    'natural_attractions': 'naturalAttractions',
    'amenities': 'amenities',
    'accommodations': 'accommodations',
    'activities': 'activities',
  };
  return mapping[apiCategory];
}

function getItemLink(item: ApiFavoriteItem): string | undefined {
  if (item.category === 'destinations') {
    return `/country/${item.country_slug}/destination/${item.place_id}`;
  }
  return undefined;
}

export default function MyFavorites() {
  const [activeTab, setActiveTab] = useState<'all' | LocalCategory>('all');
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Get selected API category
  const selectedApiCategory = activeTab === 'all' ? undefined : categoryConfig[activeTab].apiValue;

  // Fetch favorites from API
  const { favorites, isLoading, isLoadingMore, error, hasMore, loadMore, refresh, count } = useFavoritesApi(selectedApiCategory);

  // Compute categories with items from count
  const categoriesWithItems = useMemo(() => {
    if (!count) return [];
    return categoryOrder.filter(cat => {
      const apiCat = categoryConfig[cat].apiValue;
      return count.by_category[apiCat] > 0;
    });
  }, [count]);

  const totalCount = count?.total || 0;

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  const removeFavorite = async (item: ApiFavoriteItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Get auth token
      const token = getStoredToken();
      if (!token) {
        toast({
          title: "Error",
          description: "You must be logged in to remove favorites.",
          variant: "destructive",
        });
        return;
      }

      // Call DELETE API endpoint directly with place_id
      await removeFavoriteApi(token, item.place_id);

      // Update localStorage to remove the favorite
      const localCategory = apiCategoryToLocal(item.category);
      const keyString = `${localCategory}:${item.country_slug}:${item.place_id}`;
      const stored = localStorage.getItem('favorites');
      if (stored) {
        try {
          const favorites = JSON.parse(stored);
          const newFavorites = favorites.filter((f: string) => f !== keyString);
          localStorage.setItem('favorites', JSON.stringify(newFavorites));
        } catch {
          // Ignore localStorage errors
        }
      }

      // Refresh the list after removing
      await refresh();

      toast({
        title: "Removed from favorites",
        description: `${item.item_name} has been removed from your favorites.`,
      });
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove favorite. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-24">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className="text-2xl font-serif font-medium text-foreground">
              My Favorites
            </h1>
            {!isLoading && (
              <p className="text-muted-foreground">
                {totalCount} saved place{totalCount !== 1 ? 's' : ''}
              </p>
            )}
          </motion.div>

          {/* Status Tabs */}
          {!isLoading && totalCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | LocalCategory)}>
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="all" className="flex-1 sm:flex-none">
                    All
                  </TabsTrigger>
                  {categoriesWithItems.map(category => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="flex-1 sm:flex-none"
                    >
                      {categoryConfig[category].label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </motion.div>
          )}

          {/* Favorites Grid */}
          <div className="mt-6 sm:mt-8">
            {/* Show skeleton while loading initial data */}
            {isLoading ? (
              <FavoritesGridSkeleton count={6} />
            ) : error ? (
              /* Error state */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                  <Heart className="h-10 w-10 text-destructive" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                  Error loading favorites
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {error}
                </p>
                <Button onClick={() => refresh()}>
                  Try Again
                </Button>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {favorites.length > 0 ? (
                  <>
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      <AnimatePresence>
                        {favorites.map((item, index) => {
                          const link = getItemLink(item);
                          const localCategory = apiCategoryToLocal(item.category);

                          const cardContent = (
                            <motion.div
                              className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm transition-shadow duration-300 hover:shadow-lg relative"
                              whileHover={!isMobile ? { y: -4 } : undefined}
                              transition={{ duration: 0.2 }}
                            >
                              {/* Image */}
                              <div className="relative aspect-[16/10] overflow-hidden">
                                <motion.img
                                  src={item.item_image_url}
                                  alt={item.item_name}
                                  className="w-full h-full object-cover"
                                  whileHover={!isMobile ? { scale: 1.05 } : undefined}
                                  transition={{ duration: 0.4 }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                {/* Category badge - LEFT side */}
                                <Badge
                                  variant="outline"
                                  className="absolute top-3 left-3 bg-white/90 text-foreground border-border backdrop-blur-sm gap-1.5"
                                >
                                  {categoryConfig[localCategory].icon}
                                  <span className="hidden sm:inline">{categoryConfig[localCategory].label}</span>
                                </Badge>

                                {/* Delete button - RIGHT side, shown on hover */}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={(e) => removeFavorite(item, e)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Content */}
                              <div className="p-4">
                                <h3 className="font-serif text-lg font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                  {item.item_name}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>{item.country_name}</span>
                                </div>
                                {item.item_rating && (
                                  <div className="flex items-center gap-1.5 mt-3">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{item.item_rating}</span>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );

                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                              {link ? (
                                <Link to={link} className="block group">
                                  {cardContent}
                                </Link>
                              ) : (
                                <div className="group">
                                  {cardContent}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </motion.div>

                    {/* Infinite scroll trigger & load more button */}
                    {hasMore && (
                      <div ref={loadMoreRef} className="flex justify-center mt-8">
                        {isLoadingMore ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Loading more...</span>
                          </div>
                        ) : (
                          <Button onClick={loadMore} variant="outline">
                            Load More
                          </Button>
                        )}
                      </div>
                    )}
                  </>
              ) : (
                  /* Empty state */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                      <Heart className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">
                      {activeTab === 'all' ? 'No favorites yet' : `No ${categoryConfig[activeTab as LocalCategory].pluralLabel} saved`}
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      {activeTab === 'all'
                        ? 'Start exploring destinations and save your favorites by clicking the heart icon.'
                        : `Explore ${categoryConfig[activeTab as LocalCategory].pluralLabel} and save your favorites.`
                      }
                    </p>
                    <Link to="/countries">
                      <Button>
                        <MapPin className="h-4 w-4 mr-2" />
                        Explore Countries
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
