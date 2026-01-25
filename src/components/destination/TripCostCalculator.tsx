import { useState, useMemo } from "react";
import { CalendarDays, Users, Wallet, Bed, UtensilsCrossed, Ticket, Car, TrendingUp, TrendingDown } from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { BudgetInfo } from "@/data/destinationExtras";

interface TripCostCalculatorProps {
  budget: BudgetInfo;
  destinationName: string;
}

type BudgetLevel = "low" | "mid" | "high";

const budgetLabels: Record<BudgetLevel, { label: string; icon: React.ReactNode; description: string }> = {
  low: { label: "Budget", icon: <TrendingDown className="h-4 w-4" />, description: "Hostels, street food, free activities" },
  mid: { label: "Moderate", icon: <Wallet className="h-4 w-4" />, description: "3-star hotels, casual dining, tours" },
  high: { label: "Luxury", icon: <TrendingUp className="h-4 w-4" />, description: "5-star resorts, fine dining, VIP experiences" },
};

export function TripCostCalculator({ budget, destinationName }: TripCostCalculatorProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: addDays(new Date(), 30),
    to: addDays(new Date(), 37),
  });
  const [travelers, setTravelers] = useState(2);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("mid");

  const numberOfDays = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return 7;
    return Math.max(1, differenceInDays(dateRange.to, dateRange.from) + 1);
  }, [dateRange]);

  const costs = useMemo(() => {
    const accommodationPerNight = budget.accommodationBudget[budgetLevel];
    const foodPerDay = budget.foodBudget[budgetLevel] * travelers;
    const activitiesPerDay = budget.activitiesBudget[budgetLevel] * travelers;
    const transportPerDay = budget.transportBudget * travelers;

    const totalAccommodation = accommodationPerNight * (numberOfDays - 1); // nights = days - 1
    const totalFood = foodPerDay * numberOfDays;
    const totalActivities = activitiesPerDay * numberOfDays;
    const totalTransport = transportPerDay * numberOfDays;
    const grandTotal = totalAccommodation + totalFood + totalActivities + totalTransport;

    return {
      accommodation: totalAccommodation,
      food: totalFood,
      activities: totalActivities,
      transport: totalTransport,
      total: grandTotal,
      perPerson: grandTotal / travelers,
      perDay: grandTotal / numberOfDays,
    };
  }, [budget, budgetLevel, numberOfDays, travelers]);

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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5 text-primary" />
          Trip Cost Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
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
          * Estimates based on average prices for {destinationName}. Actual costs may vary.
        </p>
      </CardContent>
    </Card>
  );
}
