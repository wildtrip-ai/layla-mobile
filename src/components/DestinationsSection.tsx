import { ArrowRight } from "lucide-react";
import italyImage from "@/assets/destination-italy.jpg";
import jordanImage from "@/assets/destination-jordan.jpg";
import irelandImage from "@/assets/destination-ireland.jpg";

const destinations = [
  {
    id: 1,
    title: "Family - Europe Trip",
    image: italyImage,
  },
  {
    id: 2,
    title: "Couples - Honeymoon in Jordan",
    image: jordanImage,
  },
  {
    id: 3,
    title: "Road Trip Highlands",
    image: irelandImage,
  },
];

export function DestinationsSection() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8 md:mb-12">
          Where to go next
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div key={destination.id} className="group cursor-pointer">
              {/* Image */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                <img
                  src={destination.image}
                  alt={destination.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-medium text-foreground mb-2">
                {destination.title}
              </h3>
              
              {/* Link */}
              <button className="flex items-center gap-2 text-foreground font-semibold group-hover:gap-3 transition-all">
                Start planning
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
