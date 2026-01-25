import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Trash2, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCountryBySlug, CountryPlace, CountryData } from "@/data/countriesData";
import { useToast } from "@/hooks/use-toast";

interface FavoriteItem {
  key: string;
  countrySlug: string;
  destinationId: string;
  destination: CountryPlace;
  country: CountryData;
}

export default function MyFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteDestinations') || '[]');
    
    const loadedFavorites: FavoriteItem[] = [];
    
    storedFavorites.forEach((key: string) => {
      const [countrySlug, destinationId] = key.split('-');
      const country = getCountryBySlug(countrySlug);
      
      if (country) {
        const destination = country.destinations.find(d => d.id === destinationId);
        if (destination) {
          loadedFavorites.push({
            key,
            countrySlug,
            destinationId,
            destination,
            country,
          });
        }
      }
    });
    
    setFavorites(loadedFavorites);
  };

  const removeFavorite = (key: string, name: string) => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteDestinations') || '[]');
    const newFavorites = storedFavorites.filter((id: string) => id !== key);
    localStorage.setItem('favoriteDestinations', JSON.stringify(newFavorites));
    
    setFavorites(prev => prev.filter(f => f.key !== key));
    
    toast({
      title: "Removed from favorites",
      description: `${name} has been removed from your favorites.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">My Favorites</h1>
                <p className="text-muted-foreground">
                  {favorites.length} saved destination{favorites.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Favorites Grid */}
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {favorites.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Link to={`/country/${item.countrySlug}/destination/${item.destinationId}`}>
                          <img
                            src={item.destination.image}
                            alt={item.destination.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </Link>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Remove button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFavorite(item.key, item.destination.name)}
                          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>

                        {/* Favorite indicator */}
                        <div className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </div>

                        {/* Country flag */}
                        <div className="absolute bottom-3 right-3 text-2xl">
                          {item.country.flag}
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <Link to={`/country/${item.countrySlug}/destination/${item.destinationId}`}>
                          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                            {item.destination.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <MapPin className="h-3.5 w-3.5" />
                          <Link 
                            to={`/country/${item.countrySlug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {item.country.name}
                          </Link>
                        </div>
                        {item.destination.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {item.destination.description}
                          </p>
                        )}
                        {item.destination.rating && (
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-medium">{item.destination.rating}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
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
              <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Start exploring destinations and save your favorites by clicking the heart icon.
              </p>
              <Link to="/countries">
                <Button>
                  <MapPin className="h-4 w-4 mr-2" />
                  Explore Destinations
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
