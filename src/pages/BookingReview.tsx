import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Plane, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingItemCard } from "@/components/booking/BookingItemCard";
import { BookingStickyBar } from "@/components/booking/BookingStickyBar";
import { useTripData } from "@/hooks/useTripData";
import { useToast } from "@/hooks/use-toast";

// Booking URLs based on user requirements
const SKYSCANNER_BASE = "https://www.skyscanner.net/transport/flights";
const GETYOURGUIDE_BASE = "https://www.getyourguide.com";

function getFlightBookingUrl(fromCode: string, toCode: string): string {
  return `${SKYSCANNER_BASE}/${fromCode.toLowerCase()}/${toCode.toLowerCase()}/20260501/?adultsv2=2&cabinclass=economy&market=uk&locale=en-gb&currency=uah`;
}

function getActivityBookingUrl(): string {
  return `${GETYOURGUIDE_BASE}/paris-l16/paris-economic-transfer-from-or-to-ory-airport-to-paris-t796011/?partner_id=79D3GBH&psrc=partner_api&currency=UAH`;
}

interface RemovedItems {
  transports: Set<string>;
  accommodations: Set<string>;
  activities: Set<string>;
}

export default function BookingReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tripData } = useTripData();
  const { toast } = useToast();

  const [removedItems, setRemovedItems] = useState<RemovedItems>({
    transports: new Set(),
    accommodations: new Set(),
    activities: new Set(),
  });

  // Filter out removed items
  const filteredTransports = useMemo(() => 
    tripData.transports.filter(t => !removedItems.transports.has(t.id)),
    [tripData.transports, removedItems.transports]
  );

  const filteredAccommodations = useMemo(() =>
    tripData.accommodations.filter(a => !removedItems.accommodations.has(a.id)),
    [tripData.accommodations, removedItems.accommodations]
  );

  // Get all activities from day plans
  const allActivities = useMemo(() => {
    return tripData.dayPlans.flatMap(day =>
      day.items
        .filter(item => item.type === "activity" && !removedItems.activities.has(item.id))
        .map(item => ({ ...item, dayDate: day.date }))
    );
  }, [tripData.dayPlans, removedItems.activities]);

  // Get all transfers (type="transfer" in transports)
  const transfers = useMemo(() =>
    filteredTransports.filter(t => t.type === "transfer"),
    [filteredTransports]
  );

  const flights = useMemo(() =>
    filteredTransports.filter(t => t.type === "flight"),
    [filteredTransports]
  );

  const handleRemoveTransport = (id: string) => {
    setRemovedItems(prev => ({
      ...prev,
      transports: new Set([...prev.transports, id]),
    }));
    toast({ title: "Removed from booking" });
  };

  const handleRemoveAccommodation = (id: string) => {
    setRemovedItems(prev => ({
      ...prev,
      accommodations: new Set([...prev.accommodations, id]),
    }));
    toast({ title: "Removed from booking" });
  };

  const handleRemoveActivity = (id: string) => {
    setRemovedItems(prev => ({
      ...prev,
      activities: new Set([...prev.activities, id]),
    }));
    toast({ title: "Removed from booking" });
  };

  const handleBook = () => {
    toast({
      title: "Booking confirmed!",
      description: "You'll be redirected to complete your reservations.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/trip/${id}`)}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-foreground">Review Bookings</h1>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Estimated Prices ({tripData.dates})
              </p>
            </div>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Hotels & Transport Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Hotels & Transport</h2>
          </div>

          {/* City subheading */}
          {tripData.cityStops.length > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              {tripData.cityStops[0].name}, Jordan ({tripData.cityStops[0].dates})
            </p>
          )}

          <div className="space-y-4">
            {/* Flights */}
            {flights.map((transport) => (
              <BookingItemCard
                key={transport.id}
                type="flight"
                title={`Fly ${transport.from} → ${transport.to}`}
                estimatedBadge
                details={[
                  transport.duration,
                  `${transport.stops || "Direct"}, ${transport.travelers} people`,
                  `${transport.fromCode} → ${transport.toCode}`,
                ]}
                price={`~${transport.price}`}
                reserveUrl={transport.fromCode && transport.toCode 
                  ? getFlightBookingUrl(transport.fromCode, transport.toCode)
                  : undefined
                }
                onRemove={() => handleRemoveTransport(transport.id)}
              />
            ))}

            {/* Accommodations */}
            {filteredAccommodations.map((acc) => (
              <BookingItemCard
                key={acc.id}
                type="accommodation"
                title={acc.name}
                image={acc.image}
                details={[
                  "1 room",
                  `2 people`,
                  acc.dates,
                ]}
                price={acc.price}
                reserveUrl={`https://www.trip.com/hotels/`}
                onRemove={() => handleRemoveAccommodation(acc.id)}
              />
            ))}
          </div>
        </section>

        {/* Optional Activities Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Plane className="h-5 w-5 text-muted-foreground rotate-45" />
            <h2 className="text-lg font-semibold text-foreground">Optional Activities</h2>
          </div>

          {tripData.cityStops.length > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              {tripData.cityStops[0].name}, Jordan ({tripData.cityStops[0].dates})
            </p>
          )}

          <div className="space-y-4">
            {/* Transfers */}
            {transfers.map((transfer) => (
              <BookingItemCard
                key={transfer.id}
                type="transfer"
                title={transfer.title}
                details={[
                  transfer.duration,
                  `${transfer.travelers} people`,
                ]}
                price={transfer.price}
                reserveUrl={getActivityBookingUrl()}
                onRemove={() => handleRemoveTransport(transfer.id)}
              />
            ))}

            {/* Activities */}
            {allActivities.map((activity) => (
              <BookingItemCard
                key={activity.id}
                type="activity"
                title={activity.title}
                image={activity.image}
                details={[
                  activity.duration || "",
                  `${activity.persons || 2} people`,
                ].filter(Boolean)}
                price={activity.price ? `From ${activity.price}` : undefined}
                reserveUrl={getActivityBookingUrl()}
                onRemove={() => handleRemoveActivity(activity.id)}
              />
            ))}
          </div>
        </section>

        {/* Empty State */}
        {flights.length === 0 && filteredAccommodations.length === 0 && transfers.length === 0 && allActivities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">All items have been removed from your booking.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setRemovedItems({ transports: new Set(), accommodations: new Set(), activities: new Set() })}
            >
              Restore all items
            </Button>
          </motion.div>
        )}
      </main>

      {/* Sticky Bottom Bar */}
      <BookingStickyBar
        tripTitle={tripData.title}
        tripDates={tripData.dates}
        onBook={handleBook}
      />
    </div>
  );
}
