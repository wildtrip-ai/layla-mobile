import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar, Clock, Users, ChevronRight, Camera, Info, Map, Thermometer, CloudSun, Compass, Plane, Train, Bus, Ship, Wallet, Bed, UtensilsCrossed, Ticket, Backpack, MessageCircle, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/ui/scroll-animations";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCountryBySlug, CountryPlace } from "@/data/countriesData";
import { getDestinationExtras, TransportOption, BudgetInfo, PackingCategory, LocalPhrase } from "@/data/destinationExtras";
import { ImageGallery, GalleryImage } from "@/components/trip/ImageGallery";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareButton } from "@/components/ShareButton";
import { TripCostCalculator } from "@/components/destination/TripCostCalculator";
import { BestTimeCalendar } from "@/components/destination/BestTimeCalendar";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useCountryPlaces } from "@/hooks/useCountryPlaces";

interface WeatherInfo {
  summer: { high: number; low: number };
  winter: { high: number; low: number };
  climate: string;
  rainyMonths: string;
}

interface NearbyAttraction {
  name: string;
  type: string;
  distance: string;
  description: string;
}

// Extended destination data with more details and coordinates
const destinationExtendedData: Record<string, {
  highlights: string[];
  bestTimeToVisit: string;
  averageStay: string;
  idealFor: string;
  travelTips: string[];
  gallery: string[];
  coordinates: [number, number];
  weather: WeatherInfo;
  nearbyAttractions: NearbyAttraction[];
}> = {
  // Spain destinations
  "costa-del-sol": {
    highlights: ["Marbella's luxury resorts", "Málaga's Picasso Museum", "Traditional white villages", "World-class golf courses"],
    bestTimeToVisit: "April - October",
    averageStay: "5-7 days",
    idealFor: "Beach lovers",
    travelTips: ["Book beach clubs in advance during summer", "Rent a car to explore nearby white villages", "Try fresh seafood at chiringuitos on the beach", "Visit Nerja caves for a unique experience"],
    gallery: [
      "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800&q=80",
      "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&q=80",
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80",
    ],
    coordinates: [36.5108, -4.8858],
    weather: {
      summer: { high: 32, low: 21 },
      winter: { high: 17, low: 8 },
      climate: "Mediterranean",
      rainyMonths: "November - February",
    },
    nearbyAttractions: [
      { name: "Alhambra Palace", type: "Historical", distance: "1.5h drive", description: "Stunning Moorish palace complex in Granada" },
      { name: "Ronda", type: "Town", distance: "1h drive", description: "Dramatic clifftop town with ancient bridge" },
      { name: "Gibraltar", type: "Landmark", distance: "1h drive", description: "British territory with famous rock" },
      { name: "Nerja Caves", type: "Natural", distance: "45min drive", description: "Spectacular underground caverns" },
    ],
  },
  "ibiza": {
    highlights: ["World-famous nightclubs", "Hidden cove beaches", "Dalt Vila old town", "Sunset at Café del Mar"],
    bestTimeToVisit: "May - October",
    averageStay: "4-7 days",
    idealFor: "Party lovers",
    travelTips: ["Book club tickets online to avoid queues", "Rent a boat to explore hidden coves", "Visit Formentera for a day trip", "Stay in Santa Eulària for a quieter vibe"],
    gallery: [
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80",
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ],
    coordinates: [38.9067, 1.4206],
    weather: {
      summer: { high: 30, low: 22 },
      winter: { high: 15, low: 8 },
      climate: "Mediterranean",
      rainyMonths: "October - March",
    },
    nearbyAttractions: [
      { name: "Formentera Island", type: "Island", distance: "30min ferry", description: "Pristine beaches and crystal waters" },
      { name: "Es Vedrà", type: "Natural", distance: "30min drive", description: "Mystical rocky islet with legends" },
      { name: "Dalt Vila", type: "Historical", distance: "In town", description: "UNESCO-listed old town fortress" },
      { name: "Cala Comte", type: "Beach", distance: "20min drive", description: "Famous sunset beach with turquoise waters" },
    ],
  },
  "canary-islands": {
    highlights: ["Mount Teide volcano", "Year-round sunshine", "Black sand beaches", "Stargazing experiences"],
    bestTimeToVisit: "Year-round",
    averageStay: "7-10 days",
    idealFor: "Nature lovers",
    travelTips: ["Visit multiple islands for variety", "Book Teide cable car in advance", "Try papas arrugadas with mojo sauce", "Explore Lanzarote's volcanic landscapes"],
    gallery: [
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80",
      "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
    coordinates: [28.2916, -16.6291],
    weather: {
      summer: { high: 28, low: 20 },
      winter: { high: 21, low: 14 },
      climate: "Subtropical",
      rainyMonths: "November - February",
    },
    nearbyAttractions: [
      { name: "Teide National Park", type: "Natural", distance: "Central Tenerife", description: "Spain's highest peak and UNESCO site" },
      { name: "Timanfaya Park", type: "Natural", distance: "Lanzarote", description: "Surreal volcanic landscape" },
      { name: "Maspalomas Dunes", type: "Natural", distance: "Gran Canaria", description: "Sahara-like sand dunes by the sea" },
      { name: "La Gomera Rainforest", type: "Natural", distance: "Ferry from Tenerife", description: "Ancient laurel forest" },
    ],
  },
  "balearic-islands": {
    highlights: ["Mallorca's Serra de Tramuntana", "Menorca's pristine beaches", "Mediterranean cuisine", "Historic Palma cathedral"],
    bestTimeToVisit: "May - September",
    averageStay: "5-10 days",
    idealFor: "Island hoppers",
    travelTips: ["Rent a car in Mallorca for mountain villages", "Visit Menorca for untouched nature", "Book restaurants in advance during peak season", "Take the Sóller train for scenic views"],
    gallery: [
      "https://images.unsplash.com/photo-1517627043994-b991abb62fc8?w=800&q=80",
      "https://images.unsplash.com/photo-1559590070-5f94ff0f8c6c?w=800&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    ],
    coordinates: [39.5696, 2.6502],
    weather: {
      summer: { high: 31, low: 21 },
      winter: { high: 15, low: 6 },
      climate: "Mediterranean",
      rainyMonths: "October - March",
    },
    nearbyAttractions: [
      { name: "Palma Cathedral", type: "Historical", distance: "Palma city", description: "Gothic masterpiece by the sea" },
      { name: "Drach Caves", type: "Natural", distance: "1h from Palma", description: "Underground lake concerts" },
      { name: "Valldemossa", type: "Town", distance: "30min from Palma", description: "Charming mountain village" },
      { name: "Cala Macarella", type: "Beach", distance: "Menorca", description: "Turquoise bay paradise" },
    ],
  },
  // Italy destinations
  "amalfi-coast": {
    highlights: ["Positano's colorful houses", "Ravello's villa gardens", "Path of the Gods hike", "Limoncello tasting"],
    bestTimeToVisit: "May - September",
    averageStay: "3-5 days",
    idealFor: "Romantic trips",
    travelTips: ["Book ferries early in peak season", "Start hikes early to avoid heat", "Reserve restaurant tables in advance", "Stay in Praiano for fewer crowds"],
    gallery: [
      "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
      "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800&q=80",
    ],
    coordinates: [40.6333, 14.6029],
    weather: {
      summer: { high: 30, low: 22 },
      winter: { high: 13, low: 6 },
      climate: "Mediterranean",
      rainyMonths: "November - February",
    },
    nearbyAttractions: [
      { name: "Pompeii", type: "Historical", distance: "45min drive", description: "Ancient Roman city preserved by volcanic ash" },
      { name: "Capri Island", type: "Island", distance: "30min ferry", description: "Glamorous island with Blue Grotto" },
      { name: "Naples", type: "City", distance: "1.5h drive", description: "Vibrant city, birthplace of pizza" },
      { name: "Vesuvius", type: "Natural", distance: "1h drive", description: "Active volcano with stunning views" },
    ],
  },
  "tuscany": {
    highlights: ["Florence's Renaissance art", "Chianti wine region", "Siena's medieval center", "Truffle hunting in San Miniato"],
    bestTimeToVisit: "April - June, September - October",
    averageStay: "7-10 days",
    idealFor: "Culture seekers",
    travelTips: ["Rent a villa for authentic experience", "Book winery tours ahead", "Visit smaller towns like San Gimignano", "Take cooking classes in the countryside"],
    gallery: [
      "https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=800&q=80",
      "https://images.unsplash.com/photo-1543429776-2782fc5d5ff8?w=800&q=80",
      "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=800&q=80",
    ],
    coordinates: [43.3188, 11.3308],
    weather: {
      summer: { high: 32, low: 18 },
      winter: { high: 10, low: 2 },
      climate: "Mediterranean continental",
      rainyMonths: "October - December",
    },
    nearbyAttractions: [
      { name: "Florence", type: "City", distance: "Central", description: "Renaissance capital with Uffizi Gallery" },
      { name: "San Gimignano", type: "Town", distance: "45min from Florence", description: "Medieval towers and gelato" },
      { name: "Pisa", type: "City", distance: "1h from Florence", description: "Famous leaning tower" },
      { name: "Val d'Orcia", type: "Natural", distance: "1.5h from Florence", description: "Rolling hills and cypress trees" },
    ],
  },
  "sardinia": {
    highlights: ["Costa Smeralda beaches", "Ancient nuraghi ruins", "Crystal-clear waters", "Pecorino cheese tasting"],
    bestTimeToVisit: "May - September",
    averageStay: "7-10 days",
    idealFor: "Beach lovers",
    travelTips: ["Rent a car to explore remote beaches", "Visit La Maddalena archipelago by boat", "Try traditional porceddu (roast pig)", "Book Costa Smeralda hotels early"],
    gallery: [
      "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?w=800&q=80",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ],
    coordinates: [40.1209, 9.0129],
    weather: {
      summer: { high: 31, low: 20 },
      winter: { high: 14, low: 6 },
      climate: "Mediterranean",
      rainyMonths: "October - December",
    },
    nearbyAttractions: [
      { name: "La Maddalena", type: "Island", distance: "Ferry from Palau", description: "Archipelago with pink sand beaches" },
      { name: "Neptune's Grotto", type: "Natural", distance: "Near Alghero", description: "Stunning sea cave formations" },
      { name: "Su Nuraxi", type: "Historical", distance: "Central Sardinia", description: "UNESCO Bronze Age fortress" },
      { name: "Gorropu Canyon", type: "Natural", distance: "Eastern Sardinia", description: "Europe's deepest canyon" },
    ],
  },
  "sicily": {
    highlights: ["Mount Etna volcano", "Valley of the Temples", "Baroque Noto", "Arancini and cannoli"],
    bestTimeToVisit: "April - June, September - October",
    averageStay: "7-10 days",
    idealFor: "History buffs",
    travelTips: ["Join an Etna hiking tour with a guide", "Visit the Greek theaters at sunset", "Try street food in Palermo's markets", "Explore the Aeolian Islands by ferry"],
    gallery: [
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&q=80",
      "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800&q=80",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    ],
    coordinates: [37.5994, 14.0154],
    weather: {
      summer: { high: 33, low: 22 },
      winter: { high: 15, low: 8 },
      climate: "Mediterranean",
      rainyMonths: "October - February",
    },
    nearbyAttractions: [
      { name: "Mount Etna", type: "Natural", distance: "Near Catania", description: "Europe's highest active volcano" },
      { name: "Valley of Temples", type: "Historical", distance: "Agrigento", description: "Ancient Greek temple complex" },
      { name: "Taormina", type: "Town", distance: "Eastern coast", description: "Hilltop town with Greek theater" },
      { name: "Aeolian Islands", type: "Island", distance: "Ferry from Milazzo", description: "Volcanic islands with Stromboli" },
    ],
  },
  // Portugal destinations
  "algarve": {
    highlights: ["Benagil Cave", "Lagos' dramatic cliffs", "Faro's old town", "Fresh grilled sardines"],
    bestTimeToVisit: "May - September",
    averageStay: "5-7 days",
    idealFor: "Beach lovers",
    travelTips: ["Kayak to hidden sea caves", "Visit beaches early morning", "Try cataplana seafood stew", "Book cliff walking tours in advance"],
    gallery: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ],
    coordinates: [37.0179, -7.9304],
    weather: {
      summer: { high: 29, low: 18 },
      winter: { high: 16, low: 8 },
      climate: "Mediterranean",
      rainyMonths: "November - February",
    },
    nearbyAttractions: [
      { name: "Benagil Cave", type: "Natural", distance: "Near Lagoa", description: "Iconic sea cave with skylight" },
      { name: "Ponta da Piedade", type: "Natural", distance: "Lagos", description: "Dramatic limestone cliffs" },
      { name: "Ria Formosa", type: "Natural", distance: "Near Faro", description: "Coastal lagoon nature reserve" },
      { name: "Sagres Fortress", type: "Historical", distance: "Western tip", description: "Historic fort at Europe's edge" },
    ],
  },
  "madeira-dest": {
    highlights: ["Levada walks", "Monte Palace gardens", "Funchal old town", "Poncha cocktails"],
    bestTimeToVisit: "Year-round",
    averageStay: "5-7 days",
    idealFor: "Hikers",
    travelTips: ["Wear proper hiking shoes for levadas", "Take the cable car to Monte", "Try espetada (beef skewers)", "Rent a car for scenic coastal drives"],
    gallery: [
      "https://images.unsplash.com/photo-1538582709604-cdd4c0c6f2b8?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80",
    ],
    coordinates: [32.6669, -16.9241],
    weather: {
      summer: { high: 25, low: 18 },
      winter: { high: 19, low: 13 },
      climate: "Subtropical oceanic",
      rainyMonths: "October - March",
    },
    nearbyAttractions: [
      { name: "Pico do Arieiro", type: "Natural", distance: "30min from Funchal", description: "Madeira's third-highest peak" },
      { name: "Cabo Girão", type: "Natural", distance: "20min from Funchal", description: "Europe's highest sea cliff" },
      { name: "Porto Moniz", type: "Natural", distance: "1.5h from Funchal", description: "Natural volcanic swimming pools" },
      { name: "Santana", type: "Town", distance: "40min from Funchal", description: "Traditional A-frame houses" },
    ],
  },
  "azores-dest": {
    highlights: ["Sete Cidades crater lakes", "Whale watching", "Hot springs", "Cozido das Furnas"],
    bestTimeToVisit: "May - September",
    averageStay: "7-10 days",
    idealFor: "Adventure seekers",
    travelTips: ["Visit multiple islands if time allows", "Book whale watching tours early", "Try the volcanic-cooked stew", "Pack layers as weather changes quickly"],
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
      "https://images.unsplash.com/photo-1538582709604-cdd4c0c6f2b8?w=800&q=80",
    ],
    coordinates: [37.7412, -25.6756],
    weather: {
      summer: { high: 25, low: 17 },
      winter: { high: 17, low: 11 },
      climate: "Oceanic",
      rainyMonths: "October - March",
    },
    nearbyAttractions: [
      { name: "Sete Cidades", type: "Natural", distance: "São Miguel", description: "Twin lakes in volcanic crater" },
      { name: "Furnas Valley", type: "Natural", distance: "São Miguel", description: "Hot springs and volcanic cooking" },
      { name: "Pico Mountain", type: "Natural", distance: "Pico Island", description: "Portugal's highest peak" },
      { name: "Angra do Heroísmo", type: "Historical", distance: "Terceira", description: "UNESCO World Heritage city" },
    ],
  },
  "douro": {
    highlights: ["Port wine tastings", "Scenic train journey", "River cruises", "Terraced vineyards"],
    bestTimeToVisit: "May - October",
    averageStay: "3-5 days",
    idealFor: "Wine lovers",
    travelTips: ["Take the historic Douro train line", "Book quinta stays for vineyard experience", "Join a sunset river cruise", "Visit during grape harvest in September"],
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
      "https://images.unsplash.com/photo-1567253555255-58b06066df7c?w=800&q=80",
    ],
    coordinates: [41.1496, -7.7669],
    weather: {
      summer: { high: 33, low: 17 },
      winter: { high: 12, low: 3 },
      climate: "Mediterranean continental",
      rainyMonths: "November - February",
    },
    nearbyAttractions: [
      { name: "Porto", type: "City", distance: "1.5h downstream", description: "Historic port wine city" },
      { name: "Pinhão", type: "Town", distance: "Valley center", description: "Heart of wine country" },
      { name: "Lamego", type: "Town", distance: "Near Régua", description: "Sanctuary and baroque architecture" },
      { name: "Foz Côa", type: "Historical", distance: "Eastern valley", description: "Prehistoric rock art museum" },
    ],
  },
  // Indonesia destinations
  "bali-dest": {
    highlights: ["Ubud's rice terraces", "Temple sunsets at Tanah Lot", "World-class surfing", "Wellness retreats"],
    bestTimeToVisit: "April - October",
    averageStay: "10-14 days",
    idealFor: "All travelers",
    travelTips: ["Rent a scooter for flexibility", "Wake early for temple visits", "Negotiate taxi prices beforehand", "Stay in Canggu for surf and cafes"],
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
    ],
    coordinates: [-8.3405, 115.0920],
    weather: {
      summer: { high: 31, low: 24 },
      winter: { high: 30, low: 23 },
      climate: "Tropical",
      rainyMonths: "November - March",
    },
    nearbyAttractions: [
      { name: "Ubud Monkey Forest", type: "Natural", distance: "Central Bali", description: "Sacred temple and monkey sanctuary" },
      { name: "Tegallalang Terraces", type: "Natural", distance: "Near Ubud", description: "Iconic rice terrace landscapes" },
      { name: "Uluwatu Temple", type: "Historical", distance: "South Bali", description: "Clifftop temple with sunset views" },
      { name: "Nusa Penida", type: "Island", distance: "45min boat", description: "Dramatic cliffs and manta rays" },
    ],
  },
  "raja-ampat-dest": {
    highlights: ["World's best diving", "1,500+ fish species", "Remote island paradise", "Manta ray encounters"],
    bestTimeToVisit: "October - April",
    averageStay: "7-10 days",
    idealFor: "Divers",
    travelTips: ["Book liveaboard diving trips in advance", "Bring reef-safe sunscreen", "Carry cash as ATMs are rare", "Prepare for basic accommodations"],
    gallery: [
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ],
    coordinates: [-0.2300, 130.5200],
    weather: {
      summer: { high: 31, low: 24 },
      winter: { high: 30, low: 24 },
      climate: "Tropical",
      rainyMonths: "June - September",
    },
    nearbyAttractions: [
      { name: "Wayag Islands", type: "Natural", distance: "Northern Raja Ampat", description: "Iconic karst island viewpoint" },
      { name: "Misool", type: "Island", distance: "Southern Raja Ampat", description: "Pristine lagoons and caves" },
      { name: "Arborek Village", type: "Cultural", distance: "Central area", description: "Traditional Papuan village" },
      { name: "Manta Sandy", type: "Natural", distance: "Dive site", description: "Famous manta cleaning station" },
    ],
  },
  "komodo-dest": {
    highlights: ["Komodo dragons", "Pink Beach", "Padar Island viewpoint", "Manta ray diving"],
    bestTimeToVisit: "April - December",
    averageStay: "3-5 days",
    idealFor: "Wildlife lovers",
    travelTips: ["Join multi-day boat tours from Labuan Bajo", "Hire a ranger for dragon tours", "Snorkel at Pink Beach in the morning", "Hike Padar at sunrise for best views"],
    gallery: [
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ],
    coordinates: [-8.5500, 119.4833],
    weather: {
      summer: { high: 33, low: 24 },
      winter: { high: 31, low: 23 },
      climate: "Tropical savanna",
      rainyMonths: "December - March",
    },
    nearbyAttractions: [
      { name: "Padar Island", type: "Natural", distance: "In park", description: "Tri-colored beaches viewpoint" },
      { name: "Pink Beach", type: "Natural", distance: "In park", description: "Rare pink sand beach" },
      { name: "Rinca Island", type: "Natural", distance: "In park", description: "Komodo dragon habitat" },
      { name: "Manta Point", type: "Natural", distance: "Dive site", description: "Manta ray snorkeling spot" },
    ],
  },
  "lombok-dest": {
    highlights: ["Mount Rinjani trek", "Gili Islands", "Untouched beaches", "Traditional Sasak villages"],
    bestTimeToVisit: "May - September",
    averageStay: "5-7 days",
    idealFor: "Adventure seekers",
    travelTips: ["Book Rinjani treks with licensed guides", "Take fast boats to Gili Islands", "Visit Selong Belanak for beginner surfing", "Respect local Sasak customs"],
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    ],
    coordinates: [-8.5833, 116.1167],
    weather: {
      summer: { high: 31, low: 22 },
      winter: { high: 30, low: 22 },
      climate: "Tropical",
      rainyMonths: "November - March",
    },
    nearbyAttractions: [
      { name: "Gili Trawangan", type: "Island", distance: "30min boat", description: "Car-free island with nightlife" },
      { name: "Mount Rinjani", type: "Natural", distance: "Central Lombok", description: "Indonesia's second-highest volcano" },
      { name: "Selong Belanak", type: "Beach", distance: "South Lombok", description: "Perfect beginner surf beach" },
      { name: "Sasak Villages", type: "Cultural", distance: "South Lombok", description: "Traditional weaving communities" },
    ],
  },
  // Germany destinations
  "bavaria": {
    highlights: ["Neuschwanstein Castle", "Oktoberfest", "Alpine hiking", "Traditional beer halls"],
    bestTimeToVisit: "May - October",
    averageStay: "5-7 days",
    idealFor: "Culture lovers",
    travelTips: ["Book castle tickets online in advance", "Try local Bavarian cuisine like weisswurst", "Use regional Bayern ticket for trains", "Visit smaller towns like Füssen"],
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800&q=80",
      "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80",
    ],
    coordinates: [48.7904, 11.4979],
    weather: {
      summer: { high: 24, low: 13 },
      winter: { high: 3, low: -4 },
      climate: "Continental",
      rainyMonths: "May - August",
    },
    nearbyAttractions: [
      { name: "Neuschwanstein", type: "Historical", distance: "Near Füssen", description: "Fairy-tale castle of Ludwig II" },
      { name: "Munich", type: "City", distance: "Central Bavaria", description: "Beer halls and art museums" },
      { name: "Zugspitze", type: "Natural", distance: "Near Garmisch", description: "Germany's highest peak" },
      { name: "Rothenburg ob der Tauber", type: "Town", distance: "2h from Munich", description: "Medieval walled town" },
    ],
  },
  "black-forest-dest": {
    highlights: ["Cuckoo clock villages", "Black Forest cake", "Scenic hiking trails", "Thermal spas"],
    bestTimeToVisit: "May - October",
    averageStay: "4-6 days",
    idealFor: "Nature lovers",
    travelTips: ["Rent a car for scenic drives", "Visit Triberg for its famous waterfall", "Try authentic Black Forest ham", "Stay in a traditional guesthouse"],
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
      "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80",
    ],
    coordinates: [48.0000, 8.0000],
    weather: {
      summer: { high: 24, low: 12 },
      winter: { high: 4, low: -2 },
      climate: "Temperate oceanic",
      rainyMonths: "June - August",
    },
    nearbyAttractions: [
      { name: "Triberg Waterfalls", type: "Natural", distance: "Central area", description: "Germany's highest waterfalls" },
      { name: "Freiburg", type: "City", distance: "Western edge", description: "Sunny university town" },
      { name: "Baden-Baden", type: "Town", distance: "Northern edge", description: "Historic spa resort town" },
      { name: "Titisee Lake", type: "Natural", distance: "Central area", description: "Scenic glacial lake" },
    ],
  },
  "rhine-dest": {
    highlights: ["Romantic castles", "Riesling wine tasting", "Lorelei rock", "River cruises"],
    bestTimeToVisit: "May - September",
    averageStay: "3-5 days",
    idealFor: "Romance",
    travelTips: ["Take a scenic train along the river", "Visit multiple castles with combo tickets", "Try local Riesling wines", "Book river cruises for sunset views"],
    gallery: [
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
      "https://images.unsplash.com/photo-1568797629192-789acf8e4df3?w=800&q=80",
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    ],
    coordinates: [50.1109, 7.7367],
    weather: {
      summer: { high: 25, low: 14 },
      winter: { high: 5, low: -1 },
      climate: "Temperate",
      rainyMonths: "June - August",
    },
    nearbyAttractions: [
      { name: "Lorelei Rock", type: "Natural", distance: "St. Goarshausen", description: "Legendary cliff with river views" },
      { name: "Marksburg Castle", type: "Historical", distance: "Braubach", description: "Best-preserved Rhine castle" },
      { name: "Rüdesheim", type: "Town", distance: "Southern valley", description: "Wine town with cable car" },
      { name: "Cologne", type: "City", distance: "1.5h north", description: "Gothic cathedral and old town" },
    ],
  },
  "baltic-coast": {
    highlights: ["Sandy beaches", "Historic Rügen island", "Seaside resort architecture", "Smoked fish delicacies"],
    bestTimeToVisit: "June - September",
    averageStay: "4-6 days",
    idealFor: "Beach families",
    travelTips: ["Rent beach chairs (Strandkörbe) early", "Take the historic steam train on Rügen", "Try Fischbrötchen (fish sandwiches)", "Visit the white cliffs of Jasmund"],
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
      "https://images.unsplash.com/photo-1572621450911-c691a6a5e65a?w=800&q=80",
    ],
    coordinates: [54.1833, 12.0833],
    weather: {
      summer: { high: 22, low: 14 },
      winter: { high: 3, low: -2 },
      climate: "Oceanic",
      rainyMonths: "July - September",
    },
    nearbyAttractions: [
      { name: "Jasmund Cliffs", type: "Natural", distance: "Rügen", description: "Dramatic white chalk cliffs" },
      { name: "Binz", type: "Town", distance: "Rügen", description: "Elegant seaside resort" },
      { name: "Rostock", type: "City", distance: "Coast", description: "Historic Hanseatic port city" },
      { name: "Usedom Island", type: "Island", distance: "Eastern coast", description: "Sunny beach island" },
    ],
  },
};

// Default extended data for destinations without specific data
const defaultExtendedData = {
  highlights: ["Beautiful landscapes", "Rich culture", "Local cuisine", "Historic sites"],
  bestTimeToVisit: "Spring & Autumn",
  averageStay: "4-7 days",
  idealFor: "All travelers",
  travelTips: ["Research local customs before visiting", "Book accommodations early in peak season", "Try local food and restaurants", "Learn a few phrases in the local language"],
  gallery: [] as string[],
  coordinates: [0, 0] as [number, number],
  weather: {
    summer: { high: 25, low: 15 },
    winter: { high: 10, low: 2 },
    climate: "Temperate",
    rainyMonths: "Variable",
  },
  nearbyAttractions: [] as NearbyAttraction[],
};

function getDestinationFromCountry(countrySlug: string, destinationId: string): { country: ReturnType<typeof getCountryBySlug>, destination: CountryPlace | undefined } {
  const country = getCountryBySlug(countrySlug);
  if (!country) return { country: undefined, destination: undefined };
  
  const destination = country.destinations.find(d => d.id === destinationId);
  return { country, destination };
}

// Map component for destination location
function DestinationMap({ coordinates, destinationName }: { coordinates: [number, number]; destinationName: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || coordinates[0] === 0) return;

    let map: any = null;

    const loadMap = async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      if (!mapRef.current) return;

      map = L.map(mapRef.current, {
        center: coordinates,
        zoom: 8,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom marker
      const customIcon = L.divIcon({
        className: "custom-destination-marker",
        html: `<div style="
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid white;
        ">
          <span style="transform: rotate(45deg); color: white; font-size: 14px;">📍</span>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker(coordinates, { icon: customIcon })
        .addTo(map)
        .bindPopup(`<strong>${destinationName}</strong>`)
        .openPopup();

      setMapLoaded(true);
    };

    loadMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [coordinates, destinationName]);

  if (coordinates[0] === 0) return null;

  return (
    <FadeIn delay={0.25}>
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          Location
        </h2>
        <div 
          ref={mapRef} 
          className="h-[250px] md:h-[300px] rounded-xl overflow-hidden border border-border"
          style={{ background: "#f5f5f5" }}
        />
      </section>
    </FadeIn>
  );
}

// Weather section component
function WeatherSection({ weather }: { weather: WeatherInfo }) {
  return (
    <FadeIn delay={0.15}>
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <CloudSun className="h-5 w-5 text-primary" />
          Weather & Climate
        </h2>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-muted-foreground">Summer</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {weather.summer.high}°C / {weather.summer.low}°C
              </p>
              <p className="text-xs text-muted-foreground">High / Low</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">Winter</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {weather.winter.high}°C / {weather.winter.low}°C
              </p>
              <p className="text-xs text-muted-foreground">High / Low</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Climate:</span>{" "}
              <span className="font-medium text-foreground">{weather.climate}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Rainy Season:</span>{" "}
              <span className="font-medium text-foreground">{weather.rainyMonths}</span>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

// Nearby attractions section component
function NearbyAttractionsSection({ attractions }: { attractions: NearbyAttraction[] }) {
  if (attractions.length === 0) return null;

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "natural": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "historical": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "city": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "town": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "island": return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400";
      case "beach": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cultural": return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Generate a placeholder image URL based on attraction name
  const getAttractionImage = (name: string, type: string) => {
    const searchTerm = encodeURIComponent(`${name} ${type} landmark`.toLowerCase());
    return `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&fit=crop`;
  };

  // Use different placeholder images based on type
  const getTypeImage = (type: string, index: number) => {
    const typeImages: Record<string, string[]> = {
      natural: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80",
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=200&q=80",
      ],
      historical: [
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200&q=80",
        "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=200&q=80",
      ],
      city: [
        "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=200&q=80",
        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=200&q=80",
      ],
      town: [
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&q=80",
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=200&q=80",
      ],
      island: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80",
        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=200&q=80",
      ],
      beach: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80",
        "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=200&q=80",
      ],
    };
    const images = typeImages[type.toLowerCase()] || typeImages.natural;
    return images[index % images.length];
  };

  return (
    <FadeIn delay={0.35}>
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          Nearby Attractions
        </h2>
        <div className="space-y-3">
          {attractions.map((attraction, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex gap-4">
                {/* Image thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <img
                    src={getTypeImage(attraction.type, index)}
                    alt={attraction.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-medium text-foreground">{attraction.name}</h3>
                    <Badge className={`text-xs shrink-0 ${getTypeColor(attraction.type)}`}>
                      {attraction.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{attraction.description}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {attraction.distance}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}

// Transport section component
function TransportSection({ transport }: { transport: TransportOption[] }) {
  const getTransportIcon = (type: string) => {
    switch (type) {
      case "airport": return <Plane className="h-4 w-4" />;
      case "train": return <Train className="h-4 w-4" />;
      case "bus": return <Bus className="h-4 w-4" />;
      case "ferry": return <Ship className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getTransportColor = (type: string) => {
    switch (type) {
      case "airport": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "train": return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case "bus": return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
      case "ferry": return "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400";
      default: return "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Transport type images
  const getTransportImage = (type: string) => {
    const images: Record<string, string> = {
      airport: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&q=80",
      train: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=200&q=80",
      bus: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&q=80",
      ferry: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=200&q=80",
    };
    return images[type] || images.bus;
  };

  return (
    <FadeIn delay={0.2}>
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Plane className="h-5 w-5 text-primary" />
          How to Get There
        </h2>
        <div className="space-y-3">
          {transport.map((option, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex gap-4">
                {/* Image thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <img
                    src={getTransportImage(option.type)}
                    alt={option.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${getTransportColor(option.type)}`}>
                        {getTransportIcon(option.type)}
                      </div>
                      <h3 className="font-medium text-foreground">{option.name}</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      <Clock className="h-3 w-3 mr-1" />
                      {option.travelTime}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{option.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}

// Budget section component
function BudgetSection({ budget, destinationName }: { budget: BudgetInfo; destinationName: string }) {
  const dailyLow = budget.accommodationBudget.low + budget.foodBudget.low + budget.activitiesBudget.low + budget.transportBudget;
  const dailyMid = budget.accommodationBudget.mid + budget.foodBudget.mid + budget.activitiesBudget.mid + budget.transportBudget;
  const dailyHigh = budget.accommodationBudget.high + budget.foodBudget.high + budget.activitiesBudget.high + budget.transportBudget;

  const formatCurrency = (amount: number) => {
    return budget.currency === "USD" ? `$${amount}` : `€${amount}`;
  };

  return (
    <FadeIn delay={0.38}>
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Daily Budget Estimate
        </h2>
        <div className="bg-card border border-border rounded-xl p-4">
          {/* Budget tiers */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Budget</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(dailyLow)}</p>
              <p className="text-xs text-muted-foreground">/day</p>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <p className="text-xs text-muted-foreground mb-1">Mid-Range</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(dailyMid)}</p>
              <p className="text-xs text-muted-foreground">/day</p>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Luxury</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{formatCurrency(dailyHigh)}</p>
              <p className="text-xs text-muted-foreground">/day</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Accommodation</span>
              </div>
              <span className="text-muted-foreground">
                {formatCurrency(budget.accommodationBudget.low)} - {formatCurrency(budget.accommodationBudget.high)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Food & Dining</span>
              </div>
              <span className="text-muted-foreground">
                {formatCurrency(budget.foodBudget.low)} - {formatCurrency(budget.foodBudget.high)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Activities</span>
              </div>
              <span className="text-muted-foreground">
                {formatCurrency(budget.activitiesBudget.low)} - {formatCurrency(budget.activitiesBudget.high)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Bus className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Local Transport</span>
              </div>
              <span className="text-muted-foreground">
                ~{formatCurrency(budget.transportBudget)}
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground italic">
            * Estimates are per person per day in {destinationName}. Actual costs may vary by season and preferences.
          </p>
        </div>
      </section>
    </FadeIn>
  );
}

// Packing List Section Component
function PackingListSection({ packingList, destinationName, climate }: { packingList: PackingCategory[]; destinationName: string; climate: string }) {
  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('beach') || category.toLowerCase().includes('swim')) return '🏖️';
    if (category.toLowerCase().includes('hik') || category.toLowerCase().includes('adventure')) return '🥾';
    if (category.toLowerCase().includes('evening') || category.toLowerCase().includes('night')) return '🌙';
    if (category.toLowerCase().includes('temple') || category.toLowerCase().includes('culture')) return '🏛️';
    if (category.toLowerCase().includes('wine') || category.toLowerCase().includes('food')) return '🍷';
    if (category.toLowerCase().includes('dive') || category.toLowerCase().includes('snorkel')) return '🤿';
    if (category.toLowerCase().includes('photo')) return '📸';
    if (category.toLowerCase().includes('weather') || category.toLowerCase().includes('rain')) return '🌧️';
    if (category.toLowerCase().includes('essential')) return '✅';
    return '🎒';
  };

  return (
    <FadeIn delay={0.35}>
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Backpack className="h-5 w-5 text-primary" />
          Packing List
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Recommended items for {destinationName}'s {climate} climate
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packingList.map((category, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{getCategoryIcon(category.category)}</span>
                <h3 className="font-medium text-foreground">{category.category}</h3>
              </div>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}

// Local Phrases Section Component
function LocalPhrasesSection({ localPhrases }: { localPhrases: { language: string; phrases: LocalPhrase[] } }) {
  return (
    <FadeIn delay={0.4}>
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Local Phrases
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Useful {localPhrases.language} phrases for your trip
        </p>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-border">
            {localPhrases.phrases.map((phrase, index) => (
              <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-lg">{phrase.phrase}</p>
                    <p className="text-muted-foreground">{phrase.translation}</p>
                  </div>
                  {phrase.pronunciation && (
                    <div className="flex items-center gap-1.5 text-sm text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">
                      <Volume2 className="h-3.5 w-3.5" />
                      <span className="italic">{phrase.pronunciation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

export default function DestinationDetails() {
  const { countrySlug, destinationId } = useParams<{ countrySlug: string; destinationId: string }>();
  const { addItem } = useRecentlyViewed();
  const { featuredPlaces, otherPlaces } = useCountryPlaces(countrySlug);
  
  const { country, destination } = countrySlug && destinationId 
    ? getDestinationFromCountry(countrySlug, destinationId)
    : { country: undefined, destination: undefined };

  const apiPlaceId = useMemo(() => {
    if (!destinationId) return undefined;
    const allPlaces = [...featuredPlaces, ...otherPlaces];
    return allPlaces.find((place) => place.id === destinationId)?.placeId;
  }, [destinationId, featuredPlaces, otherPlaces]);

  // Track this destination as recently viewed
  useEffect(() => {
    if (country && destination && countrySlug && destinationId) {
      addItem({
        countrySlug,
        destinationId,
        name: destination.name,
        image: destination.image,
        countryName: country.name,
        countryFlag: country.flag,
      });
    }
  }, [country, destination, countrySlug, destinationId, addItem]);

  if (!country || !destination) {
    return <Navigate to="/countries" replace />;
  }

  const extendedData = destinationExtendedData[destination.id] || defaultExtendedData;
  const extras = getDestinationExtras(destination.id);
  const galleryImages = extendedData.gallery.length > 0 ? extendedData.gallery : [destination.image];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <div className="relative h-[280px] md:h-[400px] overflow-hidden">
          <motion.img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="container mx-auto">
              <FadeIn>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {country.name}
                  </Badge>
                  {destination.rating && (
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
                      {destination.rating}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                    {destination.name}
                  </h1>
                  {countrySlug && destinationId && (
                    <>
                      <FavoriteButton
                        category="destinations"
                        countrySlug={countrySlug}
                        itemId={destinationId}
                        itemName={destination.name}
                        placeId={apiPlaceId}
                        className="h-10 w-10 shrink-0"
                      />
                      <ShareButton
                        title={destination.name}
                        text={destination.description || `Check out ${destination.name} in ${country.name}`}
                        className="h-10 w-10 shrink-0"
                      />
                    </>
                  )}
                </div>
                {destination.description && (
                  <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                    {destination.description}
                  </p>
                )}
              </FadeIn>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Breadcrumb */}
          <FadeIn>
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/countries">All Countries</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/country/${country.slug}`}>{country.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="text-foreground font-medium">{destination.name}</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info Cards */}
              <FadeIn>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Best Time</p>
                        <p className="font-medium text-foreground text-sm">{extendedData.bestTimeToVisit}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Average Stay</p>
                        <p className="font-medium text-foreground text-sm">{extendedData.averageStay}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ideal For</p>
                        <p className="font-medium text-foreground text-sm">{extendedData.idealFor}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Highlights */}
              <FadeIn delay={0.1}>
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Highlights
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {extendedData.highlights.map((highlight, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:shadow-md transition-shadow group"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                          <img
                            src={extendedData.gallery[index % extendedData.gallery.length] || destination.image}
                            alt={highlight}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <span className="text-foreground font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeIn>

              {/* Weather & Climate */}
              <WeatherSection weather={extendedData.weather} />

              {/* How to Get There */}
              <TransportSection transport={extras.transport} />

              {/* Map */}
              <DestinationMap 
                coordinates={extendedData.coordinates} 
                destinationName={destination.name} 
              />

              {/* Nearby Attractions */}
              <NearbyAttractionsSection attractions={extendedData.nearbyAttractions} />

              {/* Packing List */}
              <PackingListSection packingList={extras.packingList} destinationName={destination.name} climate={extendedData.weather.climate} />

              {/* Local Phrases */}
              <LocalPhrasesSection localPhrases={extras.localPhrases} />

              {/* Budget Estimate */}
              <BudgetSection budget={extras.budget} destinationName={destination.name} />

              {/* Photo Gallery */}
              {galleryImages.length > 1 && (
                <FadeIn delay={0.4}>
                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Camera className="h-5 w-5 text-primary" />
                      Photo Gallery
                    </h2>
                    <ImageGallery 
                      images={galleryImages.map((image, index) => ({
                        src: image,
                        title: `${destination.name}`,
                        location: country.name,
                      }))}
                    />
                  </section>
                </FadeIn>
              )}

              {/* Travel Tips */}
              <FadeIn delay={0.45}>
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Travel Tips
                  </h2>
                  <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                    {extendedData.travelTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-primary/10 text-primary text-sm font-medium rounded-full shrink-0">
                          {index + 1}
                        </span>
                        <p className="text-foreground">{tip}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trip Cost Calculator */}
              <FadeIn delay={0.2}>
                <TripCostCalculator 
                  budget={extras.budget} 
                  destinationName={destination.name}
                  destinationRegion="europe"
                />
              </FadeIn>

              {/* Best Time to Visit */}
              <FadeIn delay={0.25}>
                <BestTimeCalendar 
                  weather={extendedData.weather} 
                  destinationName={destination.name} 
                />
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
                  <h3 className="font-semibold text-foreground mb-4">Plan Your Trip</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ready to explore {destination.name}? Start planning your perfect trip today.
                  </p>
                  <Button className="w-full mb-3" asChild>
                    <Link to="/new-trip-planner">
                      Create Trip
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/country/${country.slug}`}>
                      Explore {country.name}
                    </Link>
                  </Button>
                </div>
              </FadeIn>

              {/* Other Destinations */}
              <FadeIn delay={0.3}>
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-foreground mb-4">Other Destinations</h3>
                  <div className="space-y-3">
                    {country.destinations
                      .filter(d => d.id !== destination.id)
                      .slice(0, 3)
                      .map((dest) => (
                        <Link
                          key={dest.id}
                          to={`/country/${country.slug}/destination/${dest.id}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                            <img 
                              src={dest.image} 
                              alt={dest.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {dest.name}
                            </p>
                            {dest.rating && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {dest.rating}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
