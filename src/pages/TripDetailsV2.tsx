import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authenticatedFetch } from "@/lib/apiClient";

const API_BASE = "https://internal-api.emiratesescape.com/v1.0";

type TripDetailsResponse = {
  id?: string;
  name?: string;
  title?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  [key: string]: unknown;
};

export default function TripDetailsV2() {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<TripDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTripDetails = async () => {
      if (!tripId) {
        setError("Missing trip ID.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await authenticatedFetch(`${API_BASE}/trips/${tripId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: TripDetailsResponse = await response.json();
        if (isMounted) {
          setTrip(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load trip details.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTripDetails();

    return () => {
      isMounted = false;
    };
  }, [tripId]);

  const tripTitle = trip?.name ?? trip?.title ?? (tripId ? `Trip ${tripId}` : "Trip Details");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pb-16 pt-24">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" asChild>
            <LocalizedLink to="/my-trips" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to My Trips
            </LocalizedLink>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{tripTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && (
              <p className="text-muted-foreground">Loading trip details...</p>
            )}
            {!isLoading && error && (
              <p className="text-destructive">{error}</p>
            )}
            {!isLoading && !error && trip && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {trip.status && <span>Status: {trip.status}</span>}
                  {trip.start_date && <span>Start: {trip.start_date}</span>}
                  {trip.end_date && <span>End: {trip.end_date}</span>}
                </div>
                {trip.description && <p>{trip.description}</p>}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-sm font-medium text-foreground">Raw API Response</p>
                  <pre className="mt-2 max-h-96 overflow-auto text-xs text-muted-foreground">
                    {JSON.stringify(trip, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
