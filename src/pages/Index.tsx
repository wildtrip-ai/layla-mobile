import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { DestinationsSection } from "@/components/DestinationsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { RecentlyViewedSection } from "@/components/RecentlyViewedSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <RecentlyViewedSection />
        <StatsSection />
        <DestinationsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
