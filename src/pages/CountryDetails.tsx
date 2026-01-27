import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowRight, MapPin, Compass } from "lucide-react";
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
import { CountryPlace } from "@/data/countriesData";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareButton } from "@/components/ShareButton";
import { FavoriteCategory } from "@/hooks/useFavorites";
import { useCountries } from "@/hooks/useCountries";
import { useCountryPlaces } from "@/hooks/useCountryPlaces";
import { PlacesSectionSkeleton } from "@/components/PlaceCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

interface PlaceCardProps {
  place: CountryPlace;
  showRating?: boolean;
  href?: string;
  countrySlug: string;
  category: FavoriteCategory;
  countryName: string;
}

function PlaceCard({ place, showRating = true, href, countrySlug, category, countryName }: PlaceCardProps) {
  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const baseUrl = window.location.origin;
    if (category === 'destinations') {
      return `${baseUrl}/country/${countrySlug}/destination/${place.id}`;
    }
    return `${baseUrl}/country/${countrySlug}`;
  };

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
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ShareButton
            title={place.name}
            text={`Check out ${place.name} in ${countryName}`}
            url={getShareUrl()}
            size="sm"
          />
          <FavoriteButton
            category={category}
            countrySlug={countrySlug}
            itemId={place.id}
            itemName={place.name}
            placeId={place.placeId}
            size="sm"
          />
        </div>
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
  countryName: string;
  category: FavoriteCategory;
  isLoading?: boolean;
  skeletonCount?: number;
}

function CategorySection({ 
  title, 
  icon, 
  places, 
  showViewAll = true, 
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", 
  getHref, 
  countrySlug, 
  countryName, 
  category,
  isLoading = false,
  skeletonCount = 4
}: CategorySectionProps) {
  if (!isLoading && places.length === 0) {
    return null;
  }

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
          {showViewAll && places.length > 0 && (
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </FadeIn>

      {isLoading ? (
        <PlacesSectionSkeleton count={skeletonCount} gridCols={gridCols} />
      ) : (
        <StaggerContainer className={`grid ${gridCols} gap-4 md:gap-6`} staggerDelay={0.05}>
          {places.map((place) => (
            <StaggerItem key={place.id}>
              <PlaceCard 
                place={place} 
                href={getHref?.(place)} 
                countrySlug={countrySlug}
                countryName={countryName}
                category={category}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </section>
  );
}

function HeroSkeleton() {
  return (
    <div className="relative h-[200px] md:h-[280px] overflow-hidden bg-muted">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 md:h-14 md:w-14 rounded-lg" />
            <Skeleton className="h-8 md:h-10 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CountryDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { countries, isLoading: countriesLoading } = useCountries();
  const { featuredPlaces, otherPlaces, isLoading: placesLoading, error } = useCountryPlaces(slug);

  // Get country info from the countries list
  const countryInfo = countries.find(c => c.slug === slug);

  // If countries have loaded and country not found, redirect
  if (!countriesLoading && !countryInfo && countries.length > 0) {
    return <Navigate to="/countries" replace />;
  }

  const countryName = countryInfo?.name || slug || "";
  const countryFlag = countryInfo?.flag_emoji || countryInfo?.flag || "🏳️";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        {countriesLoading ? (
          <HeroSkeleton />
        ) : (
          <div className="relative h-[200px] md:h-[280px] overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
              <div className="container mx-auto">
                <FadeIn>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
                    <span className="bg-white rounded-lg p-1.5 md:p-2 shadow-sm text-2xl md:text-3xl">
                      {countryFlag}
                    </span>
                    {countryName}
                  </h1>
                </FadeIn>
              </div>
            </div>
          </div>
        )}

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
                  <span className="text-foreground font-medium">{countryName}</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </FadeIn>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Failed to load places: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Places Sections */}
          {!error && (
            <>
              <CategorySection
                title="Top Destinations"
                icon={<MapPin className="h-5 w-5" />}
                places={featuredPlaces}
                getHref={(place) => `/country/${slug}/destination/${place.id}`}
                countrySlug={slug || ""}
                countryName={countryName}
                category="destinations"
                isLoading={placesLoading}
                skeletonCount={4}
              />

              <CategorySection
                title="More to Explore"
                icon={<Compass className="h-5 w-5" />}
                places={otherPlaces}
                gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                countrySlug={slug || ""}
                countryName={countryName}
                category="cities"
                isLoading={placesLoading}
                skeletonCount={4}
              />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
