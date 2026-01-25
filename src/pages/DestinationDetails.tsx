import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar, Clock, Users, ChevronRight, Camera, Info } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/ui/scroll-animations";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCountryBySlug, CountryPlace } from "@/data/countriesData";

// Extended destination data with more details
const destinationExtendedData: Record<string, {
  highlights: string[];
  bestTimeToVisit: string;
  averageStay: string;
  travelTips: string[];
  gallery: string[];
}> = {
  "costa-del-sol": {
    highlights: ["Marbella's luxury resorts", "Málaga's Picasso Museum", "Traditional white villages", "Golf courses"],
    bestTimeToVisit: "April - October",
    averageStay: "5-7 days",
    travelTips: ["Book beach clubs in advance during summer", "Rent a car to explore nearby villages", "Try fresh seafood at chiringuitos"],
    gallery: [
      "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800&q=80",
      "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&q=80",
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80",
    ],
  },
  "amalfi-coast": {
    highlights: ["Positano's colorful houses", "Ravello's gardens", "Path of the Gods hike", "Limoncello tasting"],
    bestTimeToVisit: "May - September",
    averageStay: "3-5 days",
    travelTips: ["Book ferries early in peak season", "Start hikes early to avoid heat", "Reserve restaurant tables in advance"],
    gallery: [
      "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
      "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800&q=80",
    ],
  },
  "tuscany": {
    highlights: ["Florence's Renaissance art", "Chianti wine region", "Siena's medieval center", "Truffle hunting"],
    bestTimeToVisit: "April - June, September - October",
    averageStay: "7-10 days",
    travelTips: ["Rent a villa for authentic experience", "Book winery tours ahead", "Visit smaller towns for fewer crowds"],
    gallery: [
      "https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=800&q=80",
      "https://images.unsplash.com/photo-1543429776-2782fc5d5ff8?w=800&q=80",
      "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=800&q=80",
    ],
  },
  "algarve": {
    highlights: ["Benagil Cave", "Lagos' dramatic cliffs", "Faro's old town", "Fresh seafood"],
    bestTimeToVisit: "May - September",
    averageStay: "5-7 days",
    travelTips: ["Kayak to hidden caves", "Visit beaches early morning", "Try cataplana seafood stew"],
    gallery: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ],
  },
  "bali-dest": {
    highlights: ["Ubud's rice terraces", "Temple sunsets", "World-class surfing", "Wellness retreats"],
    bestTimeToVisit: "April - October",
    averageStay: "10-14 days",
    travelTips: ["Rent a scooter for flexibility", "Wake early for temple visits", "Negotiate taxi prices beforehand"],
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
    ],
  },
  "bavaria": {
    highlights: ["Neuschwanstein Castle", "Oktoberfest", "Alpine hiking", "Traditional beer halls"],
    bestTimeToVisit: "May - October",
    averageStay: "5-7 days",
    travelTips: ["Book castle tickets online", "Try local Bavarian cuisine", "Use regional train passes"],
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800&q=80",
      "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80",
    ],
  },
};

// Default extended data for destinations without specific data
const defaultExtendedData = {
  highlights: ["Beautiful landscapes", "Rich culture", "Local cuisine", "Historic sites"],
  bestTimeToVisit: "Spring & Autumn",
  averageStay: "4-7 days",
  travelTips: ["Research local customs", "Book accommodations early", "Try local food"],
  gallery: [] as string[],
};

function getDestinationFromCountry(countrySlug: string, destinationId: string): { country: ReturnType<typeof getCountryBySlug>, destination: CountryPlace | undefined } {
  const country = getCountryBySlug(countrySlug);
  if (!country) return { country: undefined, destination: undefined };
  
  const destination = country.destinations.find(d => d.id === destinationId);
  return { country, destination };
}

export default function DestinationDetails() {
  const { countrySlug, destinationId } = useParams<{ countrySlug: string; destinationId: string }>();
  
  const { country, destination } = countrySlug && destinationId 
    ? getDestinationFromCountry(countrySlug, destinationId)
    : { country: undefined, destination: undefined };

  if (!country || !destination) {
    return <Navigate to="/countries" replace />;
  }

  const extendedData = destinationExtendedData[destination.id] || defaultExtendedData;
  const galleryImages = extendedData.gallery.length > 0 ? extendedData.gallery : [destination.image];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <div className="relative h-[280px] md:h-[400px] overflow-hidden">
          <motion.img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="container mx-auto">
              <FadeIn>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {country.name}
                  </Badge>
                  {destination.rating && (
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
                      {destination.rating}
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                  {destination.name}
                </h1>
                {destination.description && (
                  <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                    {destination.description}
                  </p>
                )}
              </FadeIn>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Breadcrumb */}
          <FadeIn>
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/countries">All Countries</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/country/${country.slug}`}>{country.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="text-foreground font-medium">{destination.name}</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info Cards */}
              <FadeIn>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Best Time</p>
                        <p className="font-medium text-foreground">{extendedData.bestTimeToVisit}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Average Stay</p>
                        <p className="font-medium text-foreground">{extendedData.averageStay}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ideal For</p>
                        <p className="font-medium text-foreground">All travelers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Highlights */}
              <FadeIn delay={0.1}>
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Highlights
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {extendedData.highlights.map((highlight, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 bg-card border border-border rounded-lg p-3"
                      >
                        <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeIn>

              {/* Photo Gallery */}
              {galleryImages.length > 1 && (
                <FadeIn delay={0.2}>
                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Camera className="h-5 w-5 text-primary" />
                      Photo Gallery
                    </h2>
                    <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-3" staggerDelay={0.05}>
                      {galleryImages.map((image, index) => (
                        <StaggerItem key={index}>
                          <ScaleOnHover scale={1.02}>
                            <div className="aspect-[4/3] rounded-xl overflow-hidden">
                              <img 
                                src={image} 
                                alt={`${destination.name} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </ScaleOnHover>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </section>
                </FadeIn>
              )}

              {/* Travel Tips */}
              <FadeIn delay={0.3}>
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Travel Tips
                  </h2>
                  <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                    {extendedData.travelTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-primary/10 text-primary text-sm font-medium rounded-full shrink-0">
                          {index + 1}
                        </span>
                        <p className="text-foreground">{tip}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <FadeIn delay={0.2}>
                <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
                  <h3 className="font-semibold text-foreground mb-4">Plan Your Trip</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ready to explore {destination.name}? Start planning your perfect trip today.
                  </p>
                  <Button className="w-full mb-3" asChild>
                    <Link to="/new-trip-planner">
                      Create Trip
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/country/${country.slug}`}>
                      Explore {country.name}
                    </Link>
                  </Button>
                </div>
              </FadeIn>

              {/* Other Destinations */}
              <FadeIn delay={0.3}>
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-foreground mb-4">Other Destinations</h3>
                  <div className="space-y-3">
                    {country.destinations
                      .filter(d => d.id !== destination.id)
                      .slice(0, 3)
                      .map((dest) => (
                        <Link
                          key={dest.id}
                          to={`/country/${country.slug}/destination/${dest.id}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                            <img 
                              src={dest.image} 
                              alt={dest.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {dest.name}
                            </p>
                            {dest.rating && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {dest.rating}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}