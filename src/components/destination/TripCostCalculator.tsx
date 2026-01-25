import { useState, useMemo } from "react";
import { CalendarDays, Users, Wallet, Bed, UtensilsCrossed, Ticket, Car, TrendingUp, TrendingDown, Plane, MapPin } from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BudgetInfo } from "@/data/destinationExtras";

interface TripCostCalculatorProps {
  budget: BudgetInfo;
  destinationName: string;
  destinationRegion?: "europe" | "asia" | "americas" | "africa" | "oceania" | "middle-east";
}

type BudgetLevel = "low" | "mid" | "high";
type OriginRegion = "north-america" | "europe" | "asia" | "south-america" | "oceania" | "middle-east" | "africa";

const budgetLabels: Record<BudgetLevel, { label: string; icon: React.ReactNode; description: string }> = {
  low: { label: "Budget", icon: <TrendingDown className="h-4 w-4" />, description: "Hostels, street food, free activities" },
  mid: { label: "Moderate", icon: <Wallet className="h-4 w-4" />, description: "3-star hotels, casual dining, tours" },
  high: { label: "Luxury", icon: <TrendingUp className="h-4 w-4" />, description: "5-star resorts, fine dining, VIP experiences" },
};

const originRegions: { value: OriginRegion; label: string; flag: string }[] = [
  { value: "north-america", label: "North America", flag: "🇺🇸" },
  { value: "europe", label: "Europe", flag: "🇪🇺" },
  { value: "asia", label: "Asia", flag: "🌏" },
  { value: "south-america", label: "South America", flag: "🌎" },
  { value: "oceania", label: "Australia / Oceania", flag: "🇦🇺" },
  { value: "middle-east", label: "Middle East", flag: "🌍" },
  { value: "africa", label: "Africa", flag: "🌍" },
];

// Average round-trip flight costs per person (USD) based on origin and destination regions
// These are rough estimates for economy class
const flightCostMatrix: Record<OriginRegion, Record<string, { low: number; mid: number; high: number }>> = {
  "north-america": {
    europe: { low: 400, mid: 800, high: 2500 },
    asia: { low: 600, mid: 1200, high: 4000 },
    americas: { low: 200, mid: 450, high: 1500 },
    africa: { low: 800, mid: 1500, high: 4500 },
    oceania: { low: 900, mid: 1600, high: 5000 },
    "middle-east": { low: 700, mid: 1300, high: 4000 },
  },
  europe: {
    europe: { low: 50, mid: 150, high: 500 },
    asia: { low: 400, mid: 800, high: 2500 },
    americas: { low: 400, mid: 800, high: 2500 },
    africa: { low: 300, mid: 600, high: 1800 },
    oceania: { low: 900, mid: 1600, high: 5000 },
    "middle-east": { low: 200, mid: 450, high: 1400 },
  },
  asia: {
    europe: { low: 400, mid: 800, high: 2500 },
    asia: { low: 100, mid: 300, high: 1000 },
    americas: { low: 600, mid: 1200, high: 4000 },
    africa: { low: 500, mid: 1000, high: 3000 },
    oceania: { low: 300, mid: 600, high: 2000 },
    "middle-east": { low: 250, mid: 500, high: 1500 },
  },
  "south-america": {
    europe: { low: 500, mid: 1000, high: 3000 },
    asia: { low: 800, mid: 1500, high: 4500 },
    americas: { low: 150, mid: 400, high: 1200 },
    africa: { low: 700, mid: 1300, high: 4000 },
    oceania: { low: 1000, mid: 1800, high: 5500 },
    "middle-east": { low: 700, mid: 1300, high: 4000 },
  },
  oceania: {
    europe: { low: 800, mid: 1500, high: 5000 },
    asia: { low: 300, mid: 600, high: 2000 },
    americas: { low: 800, mid: 1400, high: 4500 },
    africa: { low: 900, mid: 1600, high: 5000 },
    oceania: { low: 150, mid: 350, high: 1000 },
    "middle-east": { low: 600, mid: 1100, high: 3500 },
  },
  "middle-east": {
    europe: { low: 200, mid: 450, high: 1400 },
    asia: { low: 250, mid: 500, high: 1500 },
    americas: { low: 700, mid: 1300, high: 4000 },
    africa: { low: 300, mid: 600, high: 1800 },
    oceania: { low: 600, mid: 1100, high: 3500 },
    "middle-east": { low: 100, mid: 250, high: 800 },
  },
  africa: {
    europe: { low: 300, mid: 600, high: 1800 },
    asia: { low: 500, mid: 1000, high: 3000 },
    americas: { low: 800, mid: 1500, high: 4500 },
    africa: { low: 150, mid: 350, high: 1000 },
    oceania: { low: 900, mid: 1600, high: 5000 },
    "middle-east": { low: 300, mid: 600, high: 1800 },
  },
};

// Map destination region to flight matrix key
const getDestinationKey = (region?: string): string => {
  if (!region) return "europe";
  if (region === "americas") return "americas";
  return region;
};

export function TripCostCalculator({ budget, destinationName, destinationRegion = "europe" }: TripCostCalculatorProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: addDays(new Date(), 30),
    to: addDays(new Date(), 37),
  });
  const [travelers, setTravelers] = useState(2);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("mid");
  const [originRegion, setOriginRegion] = useState<OriginRegion>("north-america");
  const [includeFlights, setIncludeFlights] = useState(true);

  const numberOfDays = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return 7;
    return Math.max(1, differenceInDays(dateRange.to, dateRange.from) + 1);
  }, [dateRange]);

  const flightCost = useMemo(() => {
    if (!includeFlights) return 0;
    const destKey = getDestinationKey(destinationRegion);
    const costs = flightCostMatrix[originRegion]?.[destKey] || flightCostMatrix[originRegion]?.europe;
    const perPersonCost = costs?.[budgetLevel] || 500;
    return perPersonCost * travelers;
  }, [originRegion, destinationRegion, budgetLevel, travelers, includeFlights]);

  const costs = useMemo(() => {
    const accommodationPerNight = budget.accommodationBudget[budgetLevel];
    const foodPerDay = budget.foodBudget[budgetLevel] * travelers;
    const activitiesPerDay = budget.activitiesBudget[budgetLevel] * travelers;
    const transportPerDay = budget.transportBudget * travelers;

    const totalAccommodation = accommodationPerNight * (numberOfDays - 1);
    const totalFood = foodPerDay * numberOfDays;
    const totalActivities = activitiesPerDay * numberOfDays;
    const totalTransport = transportPerDay * numberOfDays;
    const groundTotal = totalAccommodation + totalFood + totalActivities + totalTransport;
    const grandTotal = groundTotal + flightCost;

    return {
      accommodation: totalAccommodation,
      food: totalFood,
      activities: totalActivities,
      transport: totalTransport,
      flights: flightCost,
      groundTotal,
      total: grandTotal,
      perPerson: grandTotal / travelers,
      perDay: grandTotal / numberOfDays,
    };
  }, [budget, budgetLevel, numberOfDays, travelers, flightCost]);

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      EUR: "€",
      USD: "$",
      GBP: "£",
      JPY: "¥",
      AUD: "A$",
    };
    return symbols[currency] || currency;
  };

  const currencySymbol = getCurrencySymbol(budget.currency);
  const selectedOrigin = originRegions.find(r => r.value === originRegion);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5 text-primary" />
          Trip Cost Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Origin Region */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Flying From
          </label>
          <Select value={originRegion} onValueChange={(v) => setOriginRegion(v as OriginRegion)}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {selectedOrigin && (
                  <span className="flex items-center gap-2">
                    <span>{selectedOrigin.flag}</span>
                    <span>{selectedOrigin.label}</span>
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {originRegions.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  <span className="flex items-center gap-2">
                    <span>{region.flag}</span>
                    <span>{region.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            Travel Dates
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM d, yyyy")} – {format(dateRange.to, "MMM d, yyyy")}
                      <span className="ml-auto text-muted-foreground text-xs">
                        {numberOfDays} days
                      </span>
                    </>
                  ) : (
                    format(dateRange.from, "MMM d, yyyy")
                  )
                ) : (
                  <span className="text-muted-foreground">Select dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
                disabled={(date) => date < new Date()}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Travelers */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Number of Travelers
            </span>
            <span className="text-primary font-semibold">{travelers}</span>
          </label>
          <Slider
            value={[travelers]}
            onValueChange={([value]) => setTravelers(value)}
            min={1}
            max={10}
            step={1}
            className="py-2"
          />
        </div>

        {/* Budget Level */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Travel Style</label>
          <Tabs value={budgetLevel} onValueChange={(v) => setBudgetLevel(v as BudgetLevel)}>
            <TabsList className="grid w-full grid-cols-3">
              {(Object.keys(budgetLabels) as BudgetLevel[]).map((level) => (
                <TabsTrigger key={level} value={level} className="gap-1.5">
                  {budgetLabels[level].icon}
                  <span className="hidden sm:inline">{budgetLabels[level].label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground text-center">
            {budgetLabels[budgetLevel].description}
          </p>
        </div>

        {/* Cost Breakdown */}
        <div className="pt-4 border-t space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Estimated Costs
          </h4>
          
          <div className="space-y-2">
            {/* Flights */}
            <div className="flex items-center justify-between py-2">
              <button 
                onClick={() => setIncludeFlights(!includeFlights)}
                className={cn(
                  "flex items-center gap-2 text-sm transition-opacity",
                  !includeFlights && "opacity-50"
                )}
              >
                <Plane className="h-4 w-4 text-sky-500" />
                <span>Flights (round-trip)</span>
                {!includeFlights && (
                  <span className="text-xs text-muted-foreground">(excluded)</span>
                )}
              </button>
              <span className={cn("font-medium", !includeFlights && "line-through opacity-50")}>
                {currencySymbol}{costs.flights.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="flex items-center gap-2 text-sm">
                <Bed className="h-4 w-4 text-blue-500" />
                Accommodation
              </span>
              <span className="font-medium">{currencySymbol}{costs.accommodation.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="flex items-center gap-2 text-sm">
                <UtensilsCrossed className="h-4 w-4 text-orange-500" />
                Food & Dining
              </span>
              <span className="font-medium">{currencySymbol}{costs.food.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="flex items-center gap-2 text-sm">
                <Ticket className="h-4 w-4 text-purple-500" />
                Activities
              </span>
              <span className="font-medium">{currencySymbol}{costs.activities.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4 text-green-500" />
                Local Transport
              </span>
              <span className="font-medium">{currencySymbol}{costs.transport.toLocaleString()}</span>
            </div>
          </div>

          {/* Total */}
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Estimate</span>
              <span className="text-2xl font-bold text-primary">
                {currencySymbol}{costs.total.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <span>{currencySymbol}{Math.round(costs.perPerson).toLocaleString()} per person</span>
              <span>{currencySymbol}{Math.round(costs.perDay).toLocaleString()} per day</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          * Flight estimates based on typical fares from {selectedOrigin?.label}. Actual costs may vary by season.
        </p>
      </CardContent>
    </Card>
  );
}
