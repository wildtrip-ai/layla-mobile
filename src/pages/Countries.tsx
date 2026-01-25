import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animations";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { allCountries, hasDetailedData } from "@/data/countriesData";

export default function Countries() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <FadeIn>
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-foreground font-medium">All Countries</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </FadeIn>

        {/* Header */}
        <FadeIn delay={0.1}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              All Countries
            </h1>
          </div>
        </FadeIn>

        {/* Countries Grid */}
        <StaggerContainer 
          className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-3"
          staggerDelay={0.02}
        >
          {allCountries.map((country) => (
            <StaggerItem key={country.slug}>
              <Link
                to={hasDetailedData(country.slug) ? `/country/${country.slug}` : "#"}
                className={`group flex items-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 ${
                  hasDetailedData(country.slug)
                    ? "hover:bg-muted cursor-pointer"
                    : "opacity-60 cursor-default"
                }`}
                onClick={(e) => {
                  if (!hasDetailedData(country.slug)) {
                    e.preventDefault();
                  }
                }}
              >
                <span className="text-xl">{country.flag}</span>
                <span className={`text-foreground ${
                  hasDetailedData(country.slug) 
                    ? "group-hover:text-primary transition-colors" 
                    : ""
                }`}>
                  {country.name}
                </span>
                {hasDetailedData(country.slug) && (
                  <span className="ml-auto text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                )}
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </main>

      <Footer />
    </div>
  );
}
