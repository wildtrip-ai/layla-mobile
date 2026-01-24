
# My Trips Page Implementation Plan

## Overview
Create a "My Trips" page at `/my-trips` that displays all saved trips with their status, images, dates, and quick access to view the full itinerary. The page will be accessible from the Header dropdown menu and feature filtering by trip status (All, Upcoming, Past, Drafts).

---

## Page Layout

```text
+----------------------------------------------------------+
|  Header (navigation)                                      |
+----------------------------------------------------------+
|                                                           |
|  <- Back to home                                          |
|                                                           |
|  My Trips                                          [+ New] |
|                                                           |
|  [All] [Upcoming] [Past] [Drafts]     <- Status Tabs      |
|                                                           |
|  +------------------------+  +------------------------+   |
|  | Trip Card              |  | Trip Card              |   |
|  | [Image]                |  | [Image]                |   |
|  | Title                  |  | Title                  |   |
|  | Dates • Cities • Days  |  | Dates • Cities • Days  |   |
|  | [Upcoming] [View →]    |  | [Draft] [Edit →]       |   |
|  +------------------------+  +------------------------+   |
|                                                           |
|  +------------------------+  +------------------------+   |
|  | Trip Card              |  | Trip Card              |   |
|  | ...                    |  | ...                    |   |
|  +------------------------+  +------------------------+   |
|                                                           |
+----------------------------------------------------------+
```

---

## Implementation Steps

### 1. Create Mock Trip Data
Extend `src/data/tripData.ts` to include:

**New Interface:**
```typescript
export interface SavedTrip {
  id: string;
  title: string;
  image: string;
  dates: string;
  status: "upcoming" | "past" | "draft";
  stats: {
    days: number;
    cities: number;
  };
  lastModified: string;
}
```

**Sample Data:**
- Jordan Honeymoon (upcoming)
- Italy Family Trip (upcoming) 
- Ireland Road Trip (past)
- Japan Adventure (draft)

### 2. Create TripCard Component
Create `src/components/trips/TripCard.tsx`:

**Features:**
- Trip hero image with gradient overlay
- Title and subtitle
- Stats row (dates, cities, days)
- Status badge (Upcoming = green, Past = gray, Draft = amber)
- Action button: "View Itinerary" or "Continue Editing"
- Hover effects with framer-motion
- Link to trip details or planner based on status

**Component Structure:**
```tsx
interface TripCardProps {
  trip: SavedTrip;
}

export function TripCard({ trip }: TripCardProps) {
  const isDraft = trip.status === "draft";
  
  return (
    <Link to={isDraft ? `/new-trip-planner?tripId=${trip.id}` : `/trip/${trip.id}`}>
      <motion.div className="group cursor-pointer">
        {/* Image */}
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
          <img src={trip.image} alt={trip.title} />
          <Badge className="absolute top-3 right-3">{trip.status}</Badge>
        </div>
        
        {/* Content */}
        <div className="mt-3">
          <h3>{trip.title}</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{trip.dates}</span>
            <span>{trip.stats.cities} cities</span>
            <span>{trip.stats.days} days</span>
          </div>
        </div>
        
        {/* Action */}
        <Button variant="ghost" className="mt-2">
          {isDraft ? "Continue Editing" : "View Itinerary"}
          <ArrowRight />
        </Button>
      </motion.div>
    </Link>
  );
}
```

### 3. Create EmptyTripsState Component
Create `src/components/trips/EmptyTripsState.tsx`:

**For when no trips match the filter:**
- Icon (MapPin or Compass)
- Contextual message based on active tab
- CTA button to create new trip

### 4. Create MyTrips Page
Create `src/pages/MyTrips.tsx`:

**Structure:**
```tsx
export default function MyTrips() {
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past" | "drafts">("all");
  
  // Filter trips based on active tab
  const filteredTrips = useMemo(() => {
    if (activeTab === "all") return savedTrips;
    return savedTrips.filter(t => t.status === activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link to="/">
            <Button variant="ghost">Back to home</Button>
          </Link>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-serif">My Trips</h1>
            <Link to="/new-trip-planner">
              <Button variant="hero">
                <Plus /> New Trip
              </Button>
            </Link>
          </div>

          {/* Status Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Trip Grid */}
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <EmptyTripsState tab={activeTab} />
          )}
        </div>
      </main>
    </div>
  );
}
```

### 5. Update Routing
Add route in `src/App.tsx`:
```tsx
import MyTrips from "./pages/MyTrips";
// ...
<Route path="/my-trips" element={<MyTrips />} />
```

### 6. Update Header Navigation
Modify `src/components/Header.tsx`:
- Make "My Trips" dropdown item navigate to `/my-trips`
- Make "New Trip" item navigate to `/new-trip-planner`

---

## Technical Details

### New Files
| File | Purpose |
|------|---------|
| `src/pages/MyTrips.tsx` | Main My Trips page |
| `src/components/trips/TripCard.tsx` | Individual trip card component |
| `src/components/trips/EmptyTripsState.tsx` | Empty state for filtered views |

### Modified Files
| File | Changes |
|------|---------|
| `src/App.tsx` | Add `/my-trips` route |
| `src/components/Header.tsx` | Link menu items to pages |
| `src/data/tripData.ts` | Add SavedTrip interface and sample data |

### Status Badge Colors
| Status | Color | Badge Variant |
|--------|-------|---------------|
| Upcoming | Green | `bg-emerald-500/10 text-emerald-600` |
| Past | Gray | `secondary` |
| Draft | Amber | `bg-amber-500/10 text-amber-600` |

### Responsive Design
- **Desktop (lg):** 3-column grid
- **Tablet (md):** 2-column grid
- **Mobile:** Single column, full-width cards

---

## Component Hierarchy

```text
MyTrips (page)
├── Header
├── Back Button
├── Page Header
│   ├── Title "My Trips"
│   └── New Trip Button
├── Tabs (All | Upcoming | Past | Drafts)
└── Content Area
    ├── TripCard (x n)
    │   ├── Image with Status Badge
    │   ├── Title
    │   ├── Stats Row
    │   └── Action Button
    └── EmptyTripsState (when no trips)
```

---

## Sample Mock Data

```typescript
export const savedTrips: SavedTrip[] = [
  {
    id: "jordan-honeymoon",
    title: "7-Day Luxury Jordan Honeymoon",
    image: tripAmman,
    dates: "May 1 - 9, 2025",
    status: "upcoming",
    stats: { days: 8, cities: 5 },
    lastModified: "2025-01-20",
  },
  {
    id: "italy-family",
    title: "Family - Europe Trip",
    image: italyImage,
    dates: "Jun 15 - 25, 2025",
    status: "upcoming",
    stats: { days: 10, cities: 4 },
    lastModified: "2025-01-18",
  },
  {
    id: "ireland-road-trip",
    title: "Ireland Highlands Road Trip",
    image: irelandImage,
    dates: "Aug 5 - 12, 2024",
    status: "past",
    stats: { days: 7, cities: 6 },
    lastModified: "2024-08-15",
  },
  {
    id: "japan-draft",
    title: "Japan Cherry Blossom Adventure",
    image: heroJapan,
    dates: "TBD",
    status: "draft",
    stats: { days: 14, cities: 5 },
    lastModified: "2025-01-22",
  },
];
```

---

## Animation Details

**Page Entry:**
- Staggered fade-in for trip cards using framer-motion
- Cards animate in with slight upward motion

**Card Interactions:**
- Hover: Subtle scale (1.02) and shadow increase
- Image: Scale to 1.1 on hover with smooth transition
- Action button: Arrow moves right on hover

**Tab Transitions:**
- Smooth fade between tab content
- AnimatePresence for empty state transitions
