import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, MapPin, ChevronDown, ExternalLink, Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Header } from "@/components/Header";
import { sampleTrip } from "@/data/tripData";
import type L from "leaflet";

// Extended activity details with descriptions, coordinates, and FAQs
const activityDetails: Record<string, {
  description: string;
  address: string;
  coordinates: [number, number];
  faqs: { question: string; answer: string }[];
}> = {
  "d1-1": {
    description: "Rainbow Street is the heart of Amman's vibrant nightlife and cultural scene. This iconic pedestrian-friendly street in the Jabal Amman neighborhood offers an eclectic mix of cafes, art galleries, antique shops, and restaurants. Perfect for an evening stroll, you'll experience the authentic charm of old Amman while enjoying stunning views of the city. The street comes alive after sunset with locals and tourists mingling in its many establishments.",
    address: "Rainbow St., Jabal Amman, Amman, Jordan",
    coordinates: [31.9522, 35.9320],
    faqs: [
      { question: "What are the best times to visit?", answer: "Rainbow Street is most vibrant in the evening, especially on weekends (Thursday and Friday nights). The cafes and restaurants typically open around 10 AM and stay open until midnight or later." },
      { question: "What can I do there?", answer: "Enjoy local cuisine at authentic restaurants, browse unique antique shops, visit art galleries, relax at rooftop cafes, and take in panoramic views of Amman's hills." },
      { question: "Is it safe to walk around at night?", answer: "Yes, Rainbow Street is one of the safest areas in Amman, well-lit and frequented by families, tourists, and locals throughout the evening." },
      { question: "Are there parking facilities nearby?", answer: "Street parking is limited. We recommend using a taxi or ride-sharing service, or your hotel's transfer service for convenience." },
    ],
  },
  "d1-2": {
    description: "Fakhreldin Restaurant is one of Amman's most prestigious fine dining establishments, offering an exquisite Lebanese and Jordanian culinary experience. Housed in a beautifully restored 1920s villa, the restaurant features elegant indoor dining rooms and a charming garden terrace. Known for its exceptional mezze, grilled meats, and warm hospitality, it's the perfect setting for a romantic honeymoon dinner.",
    address: "Taha Hussein St., Amman, Jordan",
    coordinates: [31.9555, 35.9285],
    faqs: [
      { question: "Do I need a reservation?", answer: "Yes, reservations are highly recommended, especially for dinner and weekends. We can arrange this for you through the concierge." },
      { question: "What is the dress code?", answer: "Smart casual to formal attire is recommended. This is an upscale establishment perfect for special occasions." },
      { question: "What are the signature dishes?", answer: "Try the mixed mezze platter, lamb ouzi, and their famous grilled meats. The desserts, especially the knafeh, are exceptional." },
      { question: "Is there vegetarian options?", answer: "Yes, the restaurant offers an extensive selection of vegetarian mezze and main courses featuring fresh, locally-sourced ingredients." },
    ],
  },
  "d2-1": {
    description: "Discover the hidden gems of Amman with this immersive walking tour that takes you through the city's historic downtown. Led by passionate local guides, you'll explore ancient souks, taste authentic street food, and learn about Jordan's rich cultural heritage. This 3-hour experience covers sites often missed by typical tourist itineraries, offering genuine connections with local artisans and shopkeepers.",
    address: "Downtown Amman, starting point at Al-Husseini Mosque",
    coordinates: [31.9539, 35.9331],
    faqs: [
      { question: "What's included in the tour?", answer: "The tour includes a professional English-speaking guide, street food tastings (falafel, fresh juices, sweets), and visits to local shops and hidden historical sites." },
      { question: "How long is the tour?", answer: "The tour lasts approximately 3 hours (180 minutes), with plenty of stops for photos and food tastings." },
      { question: "Is it suitable for all fitness levels?", answer: "The tour involves moderate walking through downtown streets with some uneven surfaces. Comfortable walking shoes are recommended." },
      { question: "What should I bring?", answer: "Bring comfortable shoes, sunscreen, a hat, and a camera. Modest clothing is recommended as you'll visit some religious sites." },
    ],
  },
  "d2-2": {
    description: "The Amman Citadel, known locally as Jabal al-Qal'a, stands majestically atop one of Amman's seven hills. This ancient site features ruins spanning the Bronze Age through the Islamic era, including the iconic Temple of Hercules, the Umayyad Palace, and a Byzantine church. The panoramic views of downtown Amman and the surrounding hills make this a must-visit destination for history enthusiasts and photographers alike.",
    address: "K. Ali Ben Al-Hussein St. 146, Amman, Jordan",
    coordinates: [31.9587, 35.9338],
    faqs: [
      { question: "What are the opening hours?", answer: "The Citadel is open daily from 8:00 AM to 6:00 PM (April-September) and 8:00 AM to 4:00 PM (October-March). Last entry is 30 minutes before closing." },
      { question: "Is there an entrance fee?", answer: "Yes, the entrance fee is approximately 3 JOD per person. The Jordan Pass includes entry if you have one." },
      { question: "Are guided tours available?", answer: "Yes, licensed guides are available at the entrance. We recommend hiring one to fully appreciate the historical significance of the ruins." },
      { question: "How much time should I plan for the visit?", answer: "Plan for 1.5 to 2 hours to explore the main sites, visit the museum, and enjoy the views. Photography enthusiasts may want more time." },
    ],
  },
  "d2-3": {
    description: "The Jordan Archaeological Museum, located within the Amman Citadel complex, houses an impressive collection of artifacts spanning from prehistoric times to the 15th century. Highlights include the Dead Sea Scrolls copper fragments, ancient statues from Ain Ghazal, and exquisite jewelry from various periods. This intimate museum offers invaluable context for understanding Jordan's rich archaeological heritage.",
    address: "Amman Citadel National Historic Site, Amman, Jordan",
    coordinates: [31.9585, 35.9340],
    faqs: [
      { question: "What are the museum hours?", answer: "The museum is open daily from 9:00 AM to 5:00 PM. It's closed on major Jordanian holidays." },
      { question: "Is admission included with Citadel entry?", answer: "Yes, entry to the museum is included in the Citadel admission fee. Present your ticket at the museum entrance." },
      { question: "Can I take photos inside?", answer: "Photography without flash is permitted in most areas. Some special exhibits may have restrictions." },
      { question: "Is the museum wheelchair accessible?", answer: "The museum has limited accessibility. Contact the site in advance to arrange assistance if needed." },
    ],
  },
  "d2-4": {
    description: "The Roman Theater of Amman is a stunning 2nd-century amphitheater carved into the hillside, capable of seating 6,000 spectators. Built during the reign of Emperor Antoninus Pius (138-161 AD), it remains remarkably well-preserved and is still used for cultural events today. The theater's impressive acoustics and imposing stone structure offer a glimpse into Roman Philadelphia's grandeur.",
    address: "The Hashemite Plaza, Taha Al-Hashemi St., Amman, Jordan",
    coordinates: [31.9519, 35.9344],
    faqs: [
      { question: "What are the opening hours?", answer: "Open daily from 8:00 AM to 6:00 PM (summer) and 8:00 AM to 4:00 PM (winter). Best visited in the morning for fewer crowds." },
      { question: "Are there still performances held here?", answer: "Yes, the theater hosts occasional cultural events, concerts, and the Amman Summer Festival. Check local listings for scheduled performances." },
      { question: "Can I climb to the top seats?", answer: "Yes, you can climb the steep stone steps to the highest tier for spectacular views. Take your time and wear comfortable shoes." },
      { question: "What else is nearby?", answer: "The theater is adjacent to the Hashemite Plaza, the Odeon (smaller theater), and the Folklore Museum. You can easily combine visits." },
    ],
  },
  "d2-5": {
    description: "Hashem Restaurant is a legendary Amman institution, serving the city's most beloved falafel and hummus since 1952. This no-frills, open-air establishment in downtown Amman has hosted everyone from King Abdullah to Anthony Bourdain. The simple menu focuses on perfected classics: crispy falafel, creamy hummus, fresh-baked bread, and refreshing mint tea. It's an essential Amman experience.",
    address: "King Faisal Street, Downtown Amman, Jordan",
    coordinates: [31.9545, 35.9328],
    faqs: [
      { question: "Do I need a reservation?", answer: "No reservations are needed or accepted. Seating is first-come, first-served at communal tables. Expect to share tables during busy times." },
      { question: "What are the operating hours?", answer: "Open 24 hours a day, 7 days a week. It's popular for breakfast, lunch, and late-night meals." },
      { question: "How much does a meal cost?", answer: "A full meal with falafel, hummus, ful, salad, and tea typically costs around 3-5 JOD per person. Cash only." },
      { question: "Is the food vegetarian-friendly?", answer: "Yes! The entire menu is vegetarian. It's a favorite among vegetarians and meat-eaters alike for its exceptional quality." },
    ],
  },
};

export default function ActivityDetails() {
  const { id: tripId, activityId } = useParams<{ id: string; activityId: string }>();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isAddedToTrip, setIsAddedToTrip] = useState(true);

  // Find the activity from trip data
  const activity = sampleTrip.dayPlans
    .flatMap(day => day.items)
    .find(item => item.id === activityId);

  // Find which day this activity belongs to
  const dayPlan = sampleTrip.dayPlans.find(day => 
    day.items.some(item => item.id === activityId)
  );

  // Get extended details for this activity
  const details = activityId ? activityDetails[activityId] : null;

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || !details?.coordinates || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Fix default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: details.coordinates,
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Create custom marker with activity name
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            background: hsl(var(--primary));
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transform: translateX(-50%);
          ">
            ${activity?.title || "Activity"}
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      L.marker(details.coordinates, { icon: customIcon }).addTo(map);

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [details?.coordinates, activity?.title]);

  if (!activity || activity.type === "note") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Activity not found</h1>
          <Button onClick={() => navigate(`/trip/${tripId}`)}>
            Back to Trip
          </Button>
        </div>
      </div>
    );
  }

  const activityTypeLabel = activity.type === "restaurant" ? "RESTAURANT" : "ATTRACTION";

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <main className="container mx-auto px-4 pt-24 max-w-4xl">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/trip/${tripId}`} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Trip plan
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{activity.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Activity Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Badge variant="secondary" className="mb-3 text-xs font-semibold tracking-wider">
            {activityTypeLabel}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-serif text-foreground">
            {activity.title}
          </h1>
        </motion.div>

        {/* Hero Image */}
        {activity.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 rounded-2xl overflow-hidden"
          >
            <img
              src={activity.image}
              alt={activity.title}
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
          </motion.div>
        )}

        {/* Overview Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            {details?.description || `Discover ${activity.title}, a must-visit destination in your Jordan honeymoon itinerary.`}
          </p>
        </motion.section>

        {/* FAQ Section */}
        {details?.faqs && details.faqs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {details.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.section>
        )}

        {/* Location Section */}
        {details?.coordinates && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Location</h2>
            {details?.address && (
              <p className="text-muted-foreground mb-4 flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                {details.address}
              </p>
            )}
            <div
              ref={mapRef}
              className="w-full h-[300px] rounded-xl overflow-hidden border border-border"
            />
          </motion.section>
        )}
      </main>

      {/* Sticky Bottom Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40"
      >
        <div className="container mx-auto px-4 py-4 max-w-4xl flex items-center justify-between gap-4">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{dayPlan?.date}, {dayPlan?.dayOfWeek}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {isAddedToTrip ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      Added to Trip
                    </>
                  ) : (
                    "Add to Trip"
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsAddedToTrip(!isAddedToTrip)}>
                  {isAddedToTrip ? "Remove from Trip" : "Add to Trip"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button className="gap-2">
              Explore Options
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
