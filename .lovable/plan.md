
# New Trip Planner Page Implementation Plan

## Overview
Create a new page at `/new-trip-planner` that opens when users click "Create a new trip" or "Inspire me where to go" buttons on the homepage. The page follows the same two-column layout as the Trip Details page: chat assistant on the left, content area on the right. Initially, the right side shows an empty/placeholder state until the AI assistant generates trip content.

---

## Page Structure

The new page layout mirrors `TripDetails.tsx`:

```text
+--------------------------------------------------+
|  Header (navigation)                             |
+--------------------------------------------------+
|  [Date/Travelers Badge - centered, optional]     |
+--------------------------------------------------+
|  <- Back to home                                 |
+--------------------------------------------------+
|  +----------------+  +-------------------------+ |
|  | Chat Sidebar   |  | Empty State / Preview   | |
|  | (reuse/extend  |  | (placeholder until AI   | |
|  | TripSidebar)   |  | generates content)      | |
|  |                |  |                         | |
|  | - AI intro     |  | "Start by describing    | |
|  | - Suggestions  |  | your dream trip..."     | |
|  | - Chat input   |  |                         | |
|  +----------------+  +-------------------------+ |
+--------------------------------------------------+
```

---

## Implementation Steps

### 1. Create NewTripPlanner Page
Create `src/pages/NewTripPlanner.tsx` with:

**Header & Navigation**
- Reuse the existing `Header` component
- Add "Back to home" button (same as TripDetails)

**Two-Column Layout**
- Left: New chat sidebar component (adapted from TripSidebar)
- Right: Empty state initially, then trip preview when generated

**Empty State (Right Side)**
- Centered placeholder content
- Icon or illustration
- Text: "Start by describing your dream trip..."
- Subtle animation to guide attention to chat

**Generated Preview State (Right Side)**
When the AI "generates" a trip:
- Trip header with title, dates, stats (similar to TripHeader)
- City stops timeline
- Interactive map preview
- Activity preview cards

### 2. Create NewTripSidebar Component
Create `src/components/trip/NewTripSidebar.tsx`:

**Adapted from TripSidebar with modifications:**
- Different intro text: "Tell me about your dream trip"
- Different quick suggestions for new trips:
  - "Beach vacation for 2 weeks"
  - "Cultural trip to Europe"
  - "Adventure in Southeast Asia"
- Callback for when AI "generates" a trip
- Pass initial message from hero section (if applicable)

**Initial Message Handling**
- Accept an optional `initialMessage` prop
- Auto-send if provided (e.g., from hero input)

### 3. Update HeroSection.tsx
Modify button click handlers:

**"Create a new trip" button**
- Navigate to `/new-trip-planner`
- No initial message (start fresh)

**"Inspire me where to go" button**
- Navigate to `/new-trip-planner?mode=inspire`
- Could trigger a specific intro flow in the sidebar

**"Plan my trip" button (from textarea)**
- Navigate to `/new-trip-planner?message=<encoded-query>`
- Pass the user's typed query to auto-send

### 4. Add Route in App.tsx
Add new route: `/new-trip-planner`

```tsx
import NewTripPlanner from "./pages/NewTripPlanner";
// ...
<Route path="/new-trip-planner" element={<NewTripPlanner />} />
```

---

## Technical Details

### New Files
| File | Purpose |
|------|---------|
| `src/pages/NewTripPlanner.tsx` | Main trip planner page |
| `src/components/trip/NewTripSidebar.tsx` | Chat sidebar for new trips |
| `src/components/trip/TripPreview.tsx` | Preview component for generated trips |
| `src/components/trip/EmptyTripState.tsx` | Empty state placeholder |

### Modified Files
| File | Changes |
|------|---------|
| `src/App.tsx` | Add new route |
| `src/components/HeroSection.tsx` | Add navigation handlers to buttons |

### State Management
- Local state for generated trip preview
- URL query params for initial message/mode
- Optional: Save draft trips to localStorage

### Navigation Flow
```text
Homepage
  |
  +-- "Create a new trip" --> /new-trip-planner
  |
  +-- "Inspire me where to go" --> /new-trip-planner?mode=inspire
  |
  +-- [Type query] + "Plan my trip" --> /new-trip-planner?message=...
```

---

## Component Details

### NewTripPlanner.tsx Structure
```tsx
export default function NewTripPlanner() {
  const [generatedTrip, setGeneratedTrip] = useState(null);
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message');
  const mode = searchParams.get('mode');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link to="/">
            <Button variant="ghost">Back to home</Button>
          </Link>

          {/* Two Column Layout */}
          <div className="grid grid-cols-[340px_1fr] gap-6">
            {/* Chat Sidebar */}
            <NewTripSidebar 
              initialMessage={initialMessage}
              mode={mode}
              onTripGenerated={setGeneratedTrip}
            />

            {/* Content Area */}
            {generatedTrip ? (
              <TripPreview trip={generatedTrip} />
            ) : (
              <EmptyTripState />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
```

### EmptyTripState.tsx
```tsx
export function EmptyTripState() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <MapPin className="h-16 w-16 text-muted-foreground/30 mb-6" />
      <h2 className="text-2xl font-serif text-foreground mb-2">
        Your adventure starts here
      </h2>
      <p className="text-muted-foreground max-w-md">
        Tell Voyager about your dream destination, travel style, 
        and budget. I'll craft the perfect itinerary for you.
      </p>
    </div>
  );
}
```

### Mock Trip Generation Flow
When user describes a trip:
1. AI shows typing animation
2. AI responds with trip summary
3. After response completes, `onTripGenerated` callback fires
4. Right side transitions from empty state to trip preview
5. Preview shows: title, hero image, dates, city stops, map

---

## Visual States

**Initial State:**
- Left: Chat with intro + suggestions
- Right: Empty placeholder with guidance text

**User Typing:**
- Left: User message appears
- Right: Unchanged

**AI Generating:**
- Left: Typing animation
- Right: Loading skeleton (optional)

**Trip Generated:**
- Left: Chat history with trip details
- Right: Full trip preview with header, map, cities

---

## Dependencies Used
- `react-router-dom` for navigation and query params
- `framer-motion` for animations
- Existing UI components (Button, Card, etc.)
- Leaflet for map preview
