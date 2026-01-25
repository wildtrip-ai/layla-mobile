import { Sun, Cloud, CloudRain, Snowflake, Users, UserMinus, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WeatherInfo {
  summer: { high: number; low: number };
  winter: { high: number; low: number };
  climate: string;
  rainyMonths: string;
}

interface BestTimeCalendarProps {
  weather: WeatherInfo;
  destinationName: string;
}

interface MonthData {
  name: string;
  shortName: string;
  tempHigh: number;
  tempLow: number;
  season: "peak" | "shoulder" | "low";
  weather: "sunny" | "mild" | "rainy" | "cold";
  crowdLevel: "high" | "medium" | "low";
  priceLevel: "high" | "medium" | "low";
}

function generateMonthlyData(weather: WeatherInfo): MonthData[] {
  // Parse rainy months
  const rainyMonthsLower = weather.rainyMonths.toLowerCase();
  const isRainy = (month: string) => rainyMonthsLower.includes(month.toLowerCase());

  // Temperature interpolation based on season
  const getTemp = (month: number): { high: number; low: number } => {
    // 0 = Jan, 6 = July
    const summerPeak = 6; // July
    const winterPeak = 0; // January
    
    // Calculate blend factor (0 = full winter, 1 = full summer)
    const distanceFromSummer = Math.abs(month - summerPeak);
    const normalizedDistance = distanceFromSummer <= 6 ? distanceFromSummer : 12 - distanceFromSummer;
    const summerBlend = 1 - (normalizedDistance / 6);
    
    return {
      high: Math.round(weather.winter.high + (weather.summer.high - weather.winter.high) * summerBlend),
      low: Math.round(weather.winter.low + (weather.summer.low - weather.winter.low) * summerBlend),
    };
  };

  const months: MonthData[] = [
    { name: "January", shortName: "Jan" },
    { name: "February", shortName: "Feb" },
    { name: "March", shortName: "Mar" },
    { name: "April", shortName: "Apr" },
    { name: "May", shortName: "May" },
    { name: "June", shortName: "Jun" },
    { name: "July", shortName: "Jul" },
    { name: "August", shortName: "Aug" },
    { name: "September", shortName: "Sep" },
    { name: "October", shortName: "Oct" },
    { name: "November", shortName: "Nov" },
    { name: "December", shortName: "Dec" },
  ].map((m, index) => {
    const temp = getTemp(index);
    const rainy = isRainy(m.name);
    
    // Determine weather type
    let weatherType: MonthData["weather"] = "mild";
    if (temp.high >= 25) weatherType = "sunny";
    else if (temp.high < 10) weatherType = "cold";
    else if (rainy) weatherType = "rainy";
    
    // Determine season (peak in summer, low in winter for most destinations)
    let season: MonthData["season"] = "shoulder";
    if (index >= 5 && index <= 7) season = "peak"; // June-August
    else if (index >= 11 || index <= 1) season = "low"; // Dec-Feb
    
    // Crowd and price levels follow season
    const crowdLevel = season === "peak" ? "high" : season === "low" ? "low" : "medium";
    const priceLevel = season === "peak" ? "high" : season === "low" ? "low" : "medium";
    
    return {
      ...m,
      tempHigh: temp.high,
      tempLow: temp.low,
      season,
      weather: weatherType,
      crowdLevel,
      priceLevel,
    };
  });

  return months;
}

const weatherIcons: Record<MonthData["weather"], React.ReactNode> = {
  sunny: <Sun className="h-4 w-4 text-amber-500" />,
  mild: <Cloud className="h-4 w-4 text-blue-400" />,
  rainy: <CloudRain className="h-4 w-4 text-blue-600" />,
  cold: <Snowflake className="h-4 w-4 text-cyan-500" />,
};

const seasonColors: Record<MonthData["season"], string> = {
  peak: "bg-amber-100 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700",
  shoulder: "bg-emerald-100 border-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-700",
  low: "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700",
};

const seasonLabels: Record<MonthData["season"], { label: string; description: string }> = {
  peak: { label: "Peak Season", description: "High crowds & prices" },
  shoulder: { label: "Shoulder Season", description: "Moderate crowds" },
  low: { label: "Low Season", description: "Best deals" },
};

export function BestTimeCalendar({ weather, destinationName }: BestTimeCalendarProps) {
  const monthlyData = generateMonthlyData(weather);
  
  // Find best months (shoulder season with good weather)
  const bestMonths = monthlyData.filter(
    m => m.season === "shoulder" && (m.weather === "sunny" || m.weather === "mild")
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-amber-500/10 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sun className="h-5 w-5 text-amber-500" />
          Best Time to Visit
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Climate Summary */}
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Climate</p>
          <p className="font-medium">{weather.climate}</p>
          {bestMonths.length > 0 && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
              Best to visit: {bestMonths.map(m => m.shortName).join(", ")}
            </p>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 justify-center">
          {(Object.keys(seasonLabels) as MonthData["season"][]).map(season => (
            <div key={season} className="flex items-center gap-1.5">
              <div className={cn("w-3 h-3 rounded border", seasonColors[season])} />
              <span className="text-xs text-muted-foreground">{seasonLabels[season].label}</span>
            </div>
          ))}
        </div>

        {/* Monthly Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {monthlyData.map((month) => (
            <div
              key={month.name}
              className={cn(
                "p-3 rounded-lg border text-center transition-all hover:shadow-md",
                seasonColors[month.season]
              )}
            >
              <p className="font-medium text-sm">{month.shortName}</p>
              <div className="flex justify-center my-2">
                {weatherIcons[month.weather]}
              </div>
              <p className="text-xs font-medium">
                {month.tempHigh}° / {month.tempLow}°
              </p>
              <div className="flex justify-center gap-1 mt-2">
                <Users className={cn(
                  "h-3 w-3",
                  month.crowdLevel === "high" ? "text-red-500" : 
                  month.crowdLevel === "low" ? "text-green-500" : "text-amber-500"
                )} />
                <DollarSign className={cn(
                  "h-3 w-3",
                  month.priceLevel === "high" ? "text-red-500" : 
                  month.priceLevel === "low" ? "text-green-500" : "text-amber-500"
                )} />
              </div>
            </div>
          ))}
        </div>

        {/* Indicator Legend */}
        <div className="flex flex-wrap justify-center gap-4 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" /> Crowds
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" /> Prices
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">●</span> Low
            <span className="text-amber-500">●</span> Medium
            <span className="text-red-500">●</span> High
          </div>
        </div>

        {/* Rainy Season Note */}
        {weather.rainyMonths && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
            <CloudRain className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Rainy season:</span> {weather.rainyMonths}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
