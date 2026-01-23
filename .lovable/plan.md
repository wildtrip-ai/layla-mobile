
# Hotel Details Page Implementation Plan

## Overview
Create a dedicated hotel details page that opens when clicking the "View Details" button on the Accommodation section. The page will display comprehensive hotel information including an overview, AI insight, amenities, confirmation section, location map, and a sticky booking bar.

## Page Structure (Based on Screenshots)

### 1. Header and Navigation
- Breadcrumb: Trip plan > Hotel Name (e.g., "W Amman Hotel")
- Trip date/travelers badge (same as TripDetails page)
- Back arrow linking to trip details

### 2. Accommodation Overview Section
- Hotel name with "Added to Trip" dropdown and "Book Now" button
- Rating badge (8.8 Very Good) with review count
- Address with location pin icon
- Large hero image of the hotel

### 3. AI Insight Section
- "From Layla:" avatar and name
- Expandable text with "Read more" toggle
- Styled with the existing accent background pattern

### 4. Collapsible Sections
- **Accommodation Information**: Grid of amenity badges (Business Center, Room Service, Restaurant, Parking, Swimming pool, Airport shuttle, Valet Parking, Tour Desk, Dry Cleaning, Non-Smoking Rooms)
- **Accommodation Confirmation**: Text about uploading booking documents

### 5. Accommodation Map Section
- Address display
- Leaflet map centered on hotel location
- Fullscreen expand button

### 6. Sticky Bottom Bar (Mobile and Desktop)
- Total price display
- Dates and travelers info
- "Added to Trip" button with dropdown
- "Book Now" button

---

## Technical Implementation

### Files to Create

**1. `src/pages/AccommodationDetails.tsx`** - Main hotel details page
- Uses existing Header component
- Implements breadcrumb navigation
- Contains all sections described above
- Uses Leaflet for the location map
- Implements collapsible sections using Accordion component

### Files to Modify

**2. `src/App.tsx`** - Add new route
- Add route: `/trip/:id/accommodation/:accommodationId`

**3. `src/components/trip/AccommodationCard.tsx`** - Wire up "View Details" button
- Add navigation to the new details page on button click

**4. `src/pages/AccommodationResults.tsx`** - Wire up "View Details" button
- Add navigation for the View Details button in `AccommodationResultCard`

**5. `src/components/trip/AccommodationMap.tsx`** - Wire up "View Details" button
- Add navigation in the selected hotel card

### Data Structure
The existing `Accommodation` interface in `tripData.ts` will be extended to include:
- `address`: string (for display and map location)
- `amenities`: string array (for the amenities badges)
- `coordinates`: [number, number] (for map positioning)

Alternatively, we can define the extended data directly in the details page (following the pattern used in `AccommodationResults.tsx` with `moreAccommodations`).

---

## Implementation Steps

### Step 1: Create AccommodationDetails Page
Create the main page component with:
- Route params handling (`useParams` for tripId and accommodationId)
- State for expanded AI insight text
- Accordion state for collapsible sections
- Map initialization with Leaflet

### Step 2: Add Route to App.tsx
Add the new route pattern to handle accommodation detail views.

### Step 3: Update AccommodationCard Component
Modify the "View Details" button to navigate to the new page using `useNavigate`.

### Step 4: Update AccommodationResults Page
Update the `AccommodationResultCard` component to navigate to details on "View Details" click.

### Step 5: Update AccommodationMap Component
Add navigation to the "View Details" button in the selected hotel popup card.

---

## Component Breakdown

### AccommodationDetails Page Structure
```text
+----------------------------------+
|          Header                  |
+----------------------------------+
| < Trip plan > Hotel Name         |  <- Breadcrumb
+----------------------------------+
| Accommodation Overview           |
| [Hotel Name]    [Added][Book Now]|
| 8.8 Very Good (1932 reviews)     |
| @ Address                        |
| [    Large Hero Image           ]|
+----------------------------------+
| From Layla:                      |  <- AI Insight
| "This luxury 5-star hotel..."   |
+----------------------------------+
| Accommodation Information    [^] |  <- Collapsible
| [amenity badges grid]            |
+----------------------------------+
| Accommodation Confirmation   [v] |  <- Collapsible
+----------------------------------+
| Accommodation Map                |
| @ Address                        |
| [      Leaflet Map              ]|
+----------------------------------+
|                                  |
+----------------------------------+
| UAH 17,437  [Added to Trip][Book]|  <- Sticky bottom
| May 01 - May 03 - 2 travellers   |
+----------------------------------+
```

### Amenities List
Using icons from lucide-react:
- Business Center (Building2)
- Room Service (Utensils)
- Restaurant (UtensilsCrossed)
- Parking (ParkingCircle / CircleParking)
- Swimming pool (Waves)
- Airport shuttle (Bus)
- Valet Parking (Car)
- Tour Desk (Ticket)
- Dry Cleaning (Shirt)
- Non-Smoking Rooms (CircleSlash)

---

## Styling Notes

- Follow existing patterns from TripDetails and AccommodationResults pages
- Use framer-motion for animations (scroll-in effects)
- Maintain consistent spacing and typography
- Cards use `bg-card rounded-xl border border-border`
- Sections separated by spacing, not dividers
- Sticky bottom bar: `fixed bottom-0 bg-background/80 backdrop-blur-lg border-t`
