import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Trash2, Building2, UtensilsCrossed, Palette, Landmark, Mountain, TreePine } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getCountryBySlug, CountryPlace, CountryData } from "@/data/countriesData";
import { useFavorites, FavoriteCategory, FavoriteKey } from "@/hooks/useFavorites";

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

  const removeFavorite = (item: FavoriteItem) => {
    toggleFavorite(item.key, item.place.name);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">My Favorites</h1>
                <p className="text-muted-foreground">
                  {getTotalCount()} saved place{getTotalCount() !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          {getTotalCount() > 0 && (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | FavoriteCategory)} className="mb-8">
              <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
                >
                  All
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                    {getTotalCount()}
                  </Badge>
                </TabsTrigger>
                {categoriesWithItems.map(category => (
                  <TabsTrigger 
                    key={category}
                    value={category}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 gap-2"
                  >
                    {categoryConfig[category].icon}
                    <span className="hidden sm:inline">{categoryConfig[category].label}</span>
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {getCategoryCount(category)}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          {/* Favorites Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => {
                  const link = getItemLink(item);
                  
                  return (
                    <motion.div
                      key={`${item.key.category}-${item.key.countrySlug}-${item.key.itemId}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {link ? (
                            <Link to={link}>
                              <img
                                src={item.place.image}
                                alt={item.place.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </Link>
                          ) : (
                            <img
                              src={item.place.image}
                              alt={item.place.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          
                          {/* Remove button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFavorite(item)}
                            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>

                          {/* Category badge */}
                          <Badge 
                            variant="secondary" 
                            className="absolute top-3 left-3 bg-white/90 text-foreground gap-1.5"
                          >
                            {categoryConfig[item.key.category].icon}
                            <span className="hidden sm:inline">{categoryConfig[item.key.category].label}</span>
                          </Badge>

                          {/* Country flag */}
                          <div className="absolute bottom-3 right-3 text-2xl">
                            {item.country.flag}
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          {link ? (
                            <Link to={link}>
                              <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                                {item.place.name}
                              </h3>
                            </Link>
                          ) : (
                            <h3 className="font-semibold text-lg mb-1">
                              {item.place.name}
                            </h3>
                          )}
                          <div className="flex items-center gap-1 text-muted-foreground text-sm">
                            <MapPin className="h-3.5 w-3.5" />
                            <Link 
                              to={`/country/${item.key.countrySlug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {item.country.name}
                            </Link>
                          </div>
                          {item.place.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {item.place.description}
                            </p>
                          )}
                          {item.place.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm font-medium">{item.place.rating}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
