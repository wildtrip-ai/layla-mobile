import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Trash2, Building2, UtensilsCrossed, Palette, Landmark, Mountain, TreePine, Star, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getCountryBySlug, CountryPlace, CountryData } from "@/data/countriesData";
import { useFavorites, FavoriteCategory, FavoriteKey } from "@/hooks/useFavorites";
import { useIsMobile } from "@/hooks/use-mobile";

interface FavoriteItem {
  key: FavoriteKey;
  place: CountryPlace;
  country: CountryData;
}

const categoryConfig: Record<FavoriteCategory, { label: string; icon: React.ReactNode; pluralLabel: string }> = {
  destinations: { label: "Destinations", icon: <MapPin className="h-4 w-4" />, pluralLabel: "destinations" },
  cities: { label: "Cities", icon: <Building2 className="h-4 w-4" />, pluralLabel: "cities" },
  restaurants: { label: "Restaurants", icon: <UtensilsCrossed className="h-4 w-4" />, pluralLabel: "restaurants" },
  museums: { label: "Museums", icon: <Palette className="h-4 w-4" />, pluralLabel: "museums" },
  historicalSites: { label: "Historical", icon: <Landmark className="h-4 w-4" />, pluralLabel: "historical sites" },
  naturalAttractions: { label: "Nature", icon: <Mountain className="h-4 w-4" />, pluralLabel: "natural attractions" },
  amenities: { label: "Amenities", icon: <TreePine className="h-4 w-4" />, pluralLabel: "amenities" },
};

const categoryOrder: FavoriteCategory[] = ['destinations', 'cities', 'restaurants', 'museums', 'historicalSites', 'naturalAttractions', 'amenities'];

function getPlaceFromCountry(country: CountryData, category: FavoriteCategory, itemId: string): CountryPlace | undefined {
  switch (category) {
    case 'destinations': return country.destinations.find(p => p.id === itemId);
    case 'cities': return country.cities.find(p => p.id === itemId);
    case 'restaurants': return country.restaurants.find(p => p.id === itemId);
    case 'museums': return country.museums.find(p => p.id === itemId);
    case 'historicalSites': return country.historicalSites.find(p => p.id === itemId);
    case 'naturalAttractions': return country.naturalAttractions.find(p => p.id === itemId);
    case 'amenities': return country.amenities.find(p => p.id === itemId);
    default: return undefined;
  }
}

function getItemLink(item: FavoriteItem): string | undefined {
  if (item.key.category === 'destinations') {
    return `/country/${item.key.countrySlug}/destination/${item.key.itemId}`;
  }
  return undefined;
}

export default function MyFavorites() {
  const { getAllFavorites, getCategoryCount, getTotalCount, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<'all' | FavoriteCategory>('all');
  const isMobile = useIsMobile();

  const favoriteItems = useMemo(() => {
    const items: FavoriteItem[] = [];
    const allFavorites = getAllFavorites();

    allFavorites.forEach((key) => {
      const country = getCountryBySlug(key.countrySlug);
      if (!country) return;

      const place = getPlaceFromCountry(country, key.category, key.itemId);
      if (!place) return;

      items.push({ key, place, country });
    });

    return items;
  }, [getAllFavorites]);

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return favoriteItems;
    return favoriteItems.filter(item => item.key.category === activeTab);
  }, [favoriteItems, activeTab]);

  const categoriesWithItems = useMemo(() => {
    return categoryOrder.filter(cat => getCategoryCount(cat) > 0);
  }, [getCategoryCount]);

  const removeFavorite = (item: FavoriteItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item.key, item.place.name);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-24">
        <div className="container mx-auto px-4">
          {/* Page Header - matching MyTrips style */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className="text-2xl font-serif font-medium text-foreground">
              My Favorites
            </h1>
            <p className="text-muted-foreground">
              {getTotalCount()} saved place{getTotalCount() !== 1 ? 's' : ''}
            </p>
          </motion.div>

          {/* Status Tabs - matching MyTrips style */}
          {getTotalCount() > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | FavoriteCategory)}>
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

          {/* Favorites Grid - matching MyTrips grid */}
          <div className="mt-6 sm:mt-8">
            <AnimatePresence mode="wait">
              {filteredItems.length > 0 ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {filteredItems.map((item, index) => {
                      const link = getItemLink(item);
                      
                      const cardContent = (
                        <motion.div
                          className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm transition-shadow duration-300 hover:shadow-lg relative"
                          whileHover={!isMobile ? { y: -4 } : undefined}
                          transition={{ duration: 0.2 }}
                        >
                          {/* Image */}
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <motion.img
                              src={item.place.image}
                              alt={item.place.name}
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
                              {categoryConfig[item.key.category].icon}
                              <span className="hidden sm:inline">{categoryConfig[item.key.category].label}</span>
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

                            {/* Country flag */}
                            <div className="absolute bottom-3 right-3 text-2xl">
                              {item.country.flag}
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="p-4">
                            <h3 className="font-serif text-lg font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {item.place.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{item.country.name}</span>
                            </div>
                            {item.place.description && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {item.place.description}
                              </p>
                            )}
                            {item.place.rating && (
                              <div className="flex items-center gap-1.5 mt-3">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{item.place.rating}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );

                      return (
                        <motion.div
                          key={`${item.key.category}-${item.key.countrySlug}-${item.key.itemId}`}
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
                    {activeTab === 'all' ? 'No favorites yet' : `No ${categoryConfig[activeTab as FavoriteCategory].pluralLabel} saved`}
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    {activeTab === 'all' 
                      ? 'Start exploring destinations and save your favorites by clicking the heart icon.'
                      : `Explore ${categoryConfig[activeTab as FavoriteCategory].pluralLabel} and save your favorites.`
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
