// Transport and Budget data for destinations

export interface TransportOption {
  type: "airport" | "train" | "bus" | "ferry";
  name: string;
  travelTime: string;
  description: string;
}

export interface BudgetInfo {
  currency: string;
  accommodationBudget: { low: number; mid: number; high: number };
  foodBudget: { low: number; mid: number; high: number };
  activitiesBudget: { low: number; mid: number; high: number };
  transportBudget: number;
}

export interface DestinationExtras {
  transport: TransportOption[];
  budget: BudgetInfo;
}

export const destinationExtras: Record<string, DestinationExtras> = {
  // Spain destinations
  "costa-del-sol": {
    transport: [
      { type: "airport", name: "Málaga Airport (AGP)", travelTime: "20-40 min", description: "Main international airport serving the region" },
      { type: "train", name: "AVE from Madrid", travelTime: "2.5 hours", description: "High-speed rail to Málaga station" },
      { type: "bus", name: "ALSA Bus Network", travelTime: "Varies", description: "Connects coastal towns along the coast" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 50, mid: 120, high: 300 },
      foodBudget: { low: 25, mid: 50, high: 100 },
      activitiesBudget: { low: 15, mid: 40, high: 100 },
      transportBudget: 15,
    },
  },
  "ibiza": {
    transport: [
      { type: "airport", name: "Ibiza Airport (IBZ)", travelTime: "15-30 min", description: "Direct flights from major European cities" },
      { type: "ferry", name: "Baleària/Trasmed", travelTime: "2-8 hours", description: "Ferries from Barcelona, Valencia, and Denia" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 80, mid: 180, high: 500 },
      foodBudget: { low: 35, mid: 70, high: 150 },
      activitiesBudget: { low: 30, mid: 80, high: 200 },
      transportBudget: 20,
    },
  },
  "canary-islands": {
    transport: [
      { type: "airport", name: "Tenerife South (TFS)", travelTime: "20-45 min", description: "Main tourist airport for Tenerife" },
      { type: "airport", name: "Gran Canaria (LPA)", travelTime: "20-35 min", description: "Major hub for the eastern islands" },
      { type: "ferry", name: "Fred Olsen/Armas", travelTime: "1-5 hours", description: "Inter-island ferry connections" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 45, mid: 100, high: 250 },
      foodBudget: { low: 20, mid: 45, high: 90 },
      activitiesBudget: { low: 15, mid: 35, high: 80 },
      transportBudget: 12,
    },
  },
  "balearic-islands": {
    transport: [
      { type: "airport", name: "Palma de Mallorca (PMI)", travelTime: "15-30 min", description: "One of Europe's busiest summer airports" },
      { type: "airport", name: "Menorca (MAH)", travelTime: "10-20 min", description: "Small airport with seasonal flights" },
      { type: "ferry", name: "Baleària/Trasmed", travelTime: "4-8 hours", description: "Regular ferries from Barcelona and Valencia" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 60, mid: 140, high: 400 },
      foodBudget: { low: 30, mid: 60, high: 120 },
      activitiesBudget: { low: 20, mid: 50, high: 120 },
      transportBudget: 18,
    },
  },
  // Italy destinations
  "amalfi-coast": {
    transport: [
      { type: "airport", name: "Naples (NAP)", travelTime: "1.5-2 hours", description: "Closest major airport, then bus or ferry" },
      { type: "train", name: "Naples Central", travelTime: "1 hour to Salerno", description: "High-speed trains, then local transport" },
      { type: "ferry", name: "SITA/NLG Ferries", travelTime: "45-90 min", description: "Scenic coast-hugging ferries between towns" },
      { type: "bus", name: "SITA Sud", travelTime: "Varies", description: "Winding coastal bus route" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 80, mid: 200, high: 600 },
      foodBudget: { low: 35, mid: 70, high: 150 },
      activitiesBudget: { low: 20, mid: 50, high: 120 },
      transportBudget: 20,
    },
  },
  "tuscany": {
    transport: [
      { type: "airport", name: "Florence (FLR)", travelTime: "20-30 min to city", description: "Small airport with European connections" },
      { type: "airport", name: "Pisa (PSA)", travelTime: "1 hour to Florence", description: "Larger airport with more routes" },
      { type: "train", name: "High-speed from Rome/Milan", travelTime: "1.5-3 hours", description: "Frequent trains to Florence and Pisa" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 70, mid: 160, high: 450 },
      foodBudget: { low: 30, mid: 60, high: 130 },
      activitiesBudget: { low: 15, mid: 40, high: 100 },
      transportBudget: 15,
    },
  },
  "sardinia": {
    transport: [
      { type: "airport", name: "Cagliari (CAG)", travelTime: "15-25 min", description: "Southern Sardinia's main airport" },
      { type: "airport", name: "Olbia (OLB)", travelTime: "20-40 min", description: "Gateway to Costa Smeralda" },
      { type: "ferry", name: "Tirrenia/Moby", travelTime: "5-12 hours", description: "Overnight ferries from mainland Italy" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 60, mid: 150, high: 500 },
      foodBudget: { low: 30, mid: 55, high: 120 },
      activitiesBudget: { low: 20, mid: 45, high: 100 },
      transportBudget: 25,
    },
  },
  "sicily": {
    transport: [
      { type: "airport", name: "Catania (CTA)", travelTime: "20-40 min", description: "Eastern Sicily's main hub" },
      { type: "airport", name: "Palermo (PMO)", travelTime: "30-45 min", description: "Western Sicily's main airport" },
      { type: "ferry", name: "Caronte/Liberty", travelTime: "20 min from mainland", description: "Frequent ferries from Villa San Giovanni" },
      { type: "train", name: "Trenitalia", travelTime: "Train + ferry", description: "Trains from Rome include ferry crossing" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 50, mid: 120, high: 350 },
      foodBudget: { low: 25, mid: 50, high: 100 },
      activitiesBudget: { low: 15, mid: 35, high: 80 },
      transportBudget: 18,
    },
  },
  // Portugal destinations
  "algarve": {
    transport: [
      { type: "airport", name: "Faro (FAO)", travelTime: "15-60 min", description: "Region's main airport with direct EU flights" },
      { type: "train", name: "CP Rail from Lisbon", travelTime: "2.5-3 hours", description: "Regional trains to coastal towns" },
      { type: "bus", name: "Rede Expressos", travelTime: "3-4 hours", description: "Direct buses from Lisbon" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 45, mid: 100, high: 280 },
      foodBudget: { low: 20, mid: 40, high: 90 },
      activitiesBudget: { low: 15, mid: 35, high: 80 },
      transportBudget: 12,
    },
  },
  "madeira-dest": {
    transport: [
      { type: "airport", name: "Funchal (FNC)", travelTime: "20-40 min", description: "Famous for challenging approach, great views" },
      { type: "ferry", name: "Naviera Armas", travelTime: "22 hours", description: "Weekly ferry from Portimão (mainland)" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 50, mid: 110, high: 300 },
      foodBudget: { low: 20, mid: 40, high: 90 },
      activitiesBudget: { low: 15, mid: 35, high: 80 },
      transportBudget: 15,
    },
  },
  "azores-dest": {
    transport: [
      { type: "airport", name: "Ponta Delgada (PDL)", travelTime: "15-30 min", description: "Main gateway to São Miguel island" },
      { type: "airport", name: "Terceira (TER)", travelTime: "10-20 min", description: "Hub for central islands" },
      { type: "ferry", name: "Atlânticoline", travelTime: "2-8 hours", description: "Inter-island ferry services" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 45, mid: 90, high: 220 },
      foodBudget: { low: 18, mid: 35, high: 75 },
      activitiesBudget: { low: 20, mid: 50, high: 120 },
      transportBudget: 20,
    },
  },
  "douro": {
    transport: [
      { type: "airport", name: "Porto (OPO)", travelTime: "1.5-2 hours", description: "Fly to Porto, then drive or train east" },
      { type: "train", name: "Historic Douro Line", travelTime: "2-3 hours", description: "Scenic railway along the river" },
      { type: "bus", name: "Rede Expressos", travelTime: "2-3 hours", description: "Bus services to valley towns" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 60, mid: 130, high: 350 },
      foodBudget: { low: 25, mid: 50, high: 100 },
      activitiesBudget: { low: 20, mid: 60, high: 150 },
      transportBudget: 15,
    },
  },
  // Indonesia destinations
  "bali-dest": {
    transport: [
      { type: "airport", name: "Ngurah Rai (DPS)", travelTime: "20-90 min", description: "International airport near Kuta/Seminyak" },
      { type: "ferry", name: "From Java", travelTime: "45 min crossing", description: "Ferries from Banyuwangi to Gilimanuk" },
    ],
    budget: {
      currency: "USD",
      accommodationBudget: { low: 25, mid: 80, high: 300 },
      foodBudget: { low: 10, mid: 25, high: 60 },
      activitiesBudget: { low: 15, mid: 40, high: 100 },
      transportBudget: 10,
    },
  },
  "raja-ampat-dest": {
    transport: [
      { type: "airport", name: "Sorong (SOQ)", travelTime: "2-4 hour ferry", description: "Fly to Sorong, then ferry to islands" },
      { type: "ferry", name: "Public ferries", travelTime: "2-4 hours", description: "Regular boats to Waisai and islands" },
    ],
    budget: {
      currency: "USD",
      accommodationBudget: { low: 50, mid: 150, high: 500 },
      foodBudget: { low: 15, mid: 35, high: 80 },
      activitiesBudget: { low: 50, mid: 150, high: 400 },
      transportBudget: 30,
    },
  },
  "komodo-dest": {
    transport: [
      { type: "airport", name: "Labuan Bajo (LBJ)", travelTime: "In town", description: "Small airport with flights from Bali" },
      { type: "ferry", name: "PELNI/Liveaboard", travelTime: "Varies", description: "Multi-day boat tours to the islands" },
    ],
    budget: {
      currency: "USD",
      accommodationBudget: { low: 30, mid: 100, high: 350 },
      foodBudget: { low: 12, mid: 30, high: 70 },
      activitiesBudget: { low: 50, mid: 120, high: 300 },
      transportBudget: 25,
    },
  },
  "lombok-dest": {
    transport: [
      { type: "airport", name: "Lombok (LOP)", travelTime: "30-60 min", description: "International airport in south Lombok" },
      { type: "ferry", name: "Fast boats", travelTime: "1.5-2.5 hours", description: "Speed boats from Bali to Gili Islands" },
      { type: "ferry", name: "Public ferry", travelTime: "4-5 hours", description: "Car ferry from Padang Bai, Bali" },
    ],
    budget: {
      currency: "USD",
      accommodationBudget: { low: 20, mid: 60, high: 200 },
      foodBudget: { low: 8, mid: 20, high: 50 },
      activitiesBudget: { low: 20, mid: 50, high: 150 },
      transportBudget: 12,
    },
  },
  // Germany destinations
  "bavaria": {
    transport: [
      { type: "airport", name: "Munich (MUC)", travelTime: "40 min to city", description: "Major international hub" },
      { type: "train", name: "DB ICE/IC", travelTime: "4h from Berlin", description: "High-speed trains to Munich" },
      { type: "train", name: "Bayern Ticket", travelTime: "Regional", description: "Day pass for unlimited regional travel" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 60, mid: 130, high: 350 },
      foodBudget: { low: 25, mid: 50, high: 100 },
      activitiesBudget: { low: 15, mid: 35, high: 80 },
      transportBudget: 15,
    },
  },
  "black-forest-dest": {
    transport: [
      { type: "airport", name: "Stuttgart (STR)", travelTime: "1-1.5 hours", description: "Nearest major airport" },
      { type: "airport", name: "Basel/Mulhouse (BSL)", travelTime: "1-1.5 hours", description: "Alternative airport near Swiss border" },
      { type: "train", name: "Schwarzwaldbahn", travelTime: "Varies", description: "Scenic railway through the forest" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 55, mid: 120, high: 280 },
      foodBudget: { low: 22, mid: 45, high: 90 },
      activitiesBudget: { low: 12, mid: 30, high: 70 },
      transportBudget: 15,
    },
  },
  "rhine-dest": {
    transport: [
      { type: "airport", name: "Frankfurt (FRA)", travelTime: "1-1.5 hours", description: "Germany's largest airport" },
      { type: "airport", name: "Cologne/Bonn (CGN)", travelTime: "1-1.5 hours", description: "Good for northern Rhine Valley" },
      { type: "train", name: "Rhine Railway", travelTime: "Scenic route", description: "Trains along both sides of the river" },
      { type: "ferry", name: "KD Rhine Cruises", travelTime: "1-8 hours", description: "Day cruises and longer voyages" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 60, mid: 130, high: 300 },
      foodBudget: { low: 25, mid: 50, high: 100 },
      activitiesBudget: { low: 15, mid: 40, high: 100 },
      transportBudget: 18,
    },
  },
  "baltic-coast": {
    transport: [
      { type: "airport", name: "Rostock-Laage (RLG)", travelTime: "30-45 min", description: "Small regional airport" },
      { type: "airport", name: "Hamburg (HAM)", travelTime: "2-3 hours", description: "Major airport with connections" },
      { type: "train", name: "DB Regional", travelTime: "3-4h from Berlin", description: "Regular trains to coastal towns" },
      { type: "ferry", name: "Scandlines", travelTime: "2-6 hours", description: "Ferries to Denmark and Sweden" },
    ],
    budget: {
      currency: "EUR",
      accommodationBudget: { low: 50, mid: 110, high: 250 },
      foodBudget: { low: 20, mid: 40, high: 80 },
      activitiesBudget: { low: 10, mid: 25, high: 60 },
      transportBudget: 12,
    },
  },
};

// Default transport and budget for destinations without specific data
export const defaultDestinationExtras: DestinationExtras = {
  transport: [
    { type: "airport", name: "Nearest Airport", travelTime: "Varies", description: "Check local airports for connections" },
  ],
  budget: {
    currency: "EUR",
    accommodationBudget: { low: 50, mid: 120, high: 300 },
    foodBudget: { low: 25, mid: 50, high: 100 },
    activitiesBudget: { low: 20, mid: 50, high: 100 },
    transportBudget: 15,
  },
};

export function getDestinationExtras(destinationId: string): DestinationExtras {
  return destinationExtras[destinationId] || defaultDestinationExtras;
}