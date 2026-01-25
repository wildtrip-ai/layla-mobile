import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowRight, Building2, UtensilsCrossed, TreePine, Landmark, Mountain, Palette, MapPin } from "lucide-react";
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
import { FavoriteButton } from "@/components/FavoriteButton";
import { FavoriteCategory } from "@/hooks/useFavorites";

interface PlaceCardProps {
  place: CountryPlace;
  showRating?: boolean;
  href?: string;
  countrySlug: string;
  category: FavoriteCategory;
}

function PlaceCard({ place, showRating = true, href, countrySlug, category }: PlaceCardProps) {
  const cardContent = (
    <div className="group relative overflow-hidden rounded-xl bg-card border border-border shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-[4/3] overflow-hidden relative">
        <motion.img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        <FavoriteButton
          category={category}
          countrySlug={countrySlug}
          itemId={place.id}
          itemName={place.name}
          size="sm"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
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
  );

  if (href) {
    return (
      <ScaleOnHover scale={1.03}>
        <Link to={href}>
          {cardContent}
        </Link>
      </ScaleOnHover>
    );
  }

  return (
    <ScaleOnHover scale={1.03}>
      {cardContent}
    </ScaleOnHover>
  );
}

interface CategorySectionProps {
  title: string;
  icon: React.ReactNode;
  places: CountryPlace[];
  showViewAll?: boolean;
  gridCols?: string;
  getHref?: (place: CountryPlace) => string;
  countrySlug: string;
  category: FavoriteCategory;
}

function CategorySection({ title, icon, places, showViewAll = true, gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", getHref, countrySlug, category }: CategorySectionProps) {
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
            <PlaceCard 
              place={place} 
              href={getHref?.(place)} 
              countrySlug={countrySlug}
              category={category}
            />
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
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
                  <span className="bg-white rounded-lg p-1.5 md:p-2 shadow-sm text-2xl md:text-3xl">
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
            title="Top Destinations"
            icon={<MapPin className="h-5 w-5" />}
            places={country.destinations}
            getHref={(place) => `/country/${country.slug}/destination/${place.id}`}
            countrySlug={country.slug}
            category="destinations"
          />

          <CategorySection
            title="Popular Cities"
            icon={<Building2 className="h-5 w-5" />}
            places={country.cities}
            gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            countrySlug={country.slug}
            category="cities"
          />

          <CategorySection
            title="Top Restaurants"
            icon={<UtensilsCrossed className="h-5 w-5" />}
            places={country.restaurants}
            countrySlug={country.slug}
            category="restaurants"
          />

          <CategorySection
            title="Popular Amenities"
            icon={<TreePine className="h-5 w-5" />}
            places={country.amenities}
            countrySlug={country.slug}
            category="amenities"
          />

          <CategorySection
            title="Museums"
            icon={<Palette className="h-5 w-5" />}
            places={country.museums}
            countrySlug={country.slug}
            category="museums"
          />

          <CategorySection
            title="Historical Sites"
            icon={<Landmark className="h-5 w-5" />}
            places={country.historicalSites}
            countrySlug={country.slug}
            category="historicalSites"
          />

          <CategorySection
            title="Natural Attractions"
            icon={<Mountain className="h-5 w-5" />}
            places={country.naturalAttractions}
            countrySlug={country.slug}
            category="naturalAttractions"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
