import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowRight, Building2, UtensilsCrossed, TreePine, Landmark, Mountain, Palette } from "lucide-react";
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
import { getCountryBySlug, CountryPlace } from "@/data/countriesData";

interface PlaceCardProps {
  place: CountryPlace;
  showRating?: boolean;
}

function PlaceCard({ place, showRating = true }: PlaceCardProps) {
  return (
    <ScaleOnHover scale={1.03}>
      <div className="group relative overflow-hidden rounded-xl bg-card border border-border shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-[4/3] overflow-hidden">
          <motion.img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {place.name}
            </h3>
            {showRating && place.rating && (
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{place.rating}</span>
              </div>
            )}
          </div>
          {place.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {place.description}
            </p>
          )}
        </div>
      </div>
    </ScaleOnHover>
  );
}

interface CategorySectionProps {
  title: string;
  icon: React.ReactNode;
  places: CountryPlace[];
  showViewAll?: boolean;
  gridCols?: string;
}

function CategorySection({ title, icon, places, showViewAll = true, gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" }: CategorySectionProps) {
  return (
    <section className="mb-12">
      <FadeIn>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              {icon}
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              {title}
            </h2>
          </div>
          {showViewAll && (
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </FadeIn>

      <StaggerContainer className={`grid ${gridCols} gap-4 md:gap-6`} staggerDelay={0.05}>
        {places.map((place) => (
          <StaggerItem key={place.id}>
            <PlaceCard place={place} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

export default function CountryDetails() {
  const { slug } = useParams<{ slug: string }>();
  const country = slug ? getCountryBySlug(slug) : undefined;

  if (!country) {
    return <Navigate to="/countries" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <div className="relative h-[200px] md:h-[280px] overflow-hidden">
          <img
            src={country.heroImage}
            alt={country.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="container mx-auto">
              <FadeIn>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground flex items-center gap-4">
                  <span className="bg-white rounded-lg p-2 shadow-sm text-5xl md:text-6xl">
                    {country.flag}
                  </span>
                  {country.name}
                </h1>
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
                  <span className="text-foreground font-medium">{country.name}</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </FadeIn>

          {/* Categories */}
          <CategorySection
            title="Popular Cities"
            icon={<Building2 className="h-5 w-5" />}
            places={country.cities}
            gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          />

          <CategorySection
            title="Top Restaurants"
            icon={<UtensilsCrossed className="h-5 w-5" />}
            places={country.restaurants}
          />

          <CategorySection
            title="Popular Amenities"
            icon={<TreePine className="h-5 w-5" />}
            places={country.amenities}
          />

          <CategorySection
            title="Museums"
            icon={<Palette className="h-5 w-5" />}
            places={country.museums}
          />

          <CategorySection
            title="Historical Sites"
            icon={<Landmark className="h-5 w-5" />}
            places={country.historicalSites}
          />

          <CategorySection
            title="Natural Attractions"
            icon={<Mountain className="h-5 w-5" />}
            places={country.naturalAttractions}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
