
# Trip Actions & Booking Page Implementation Plan

## Overview
Add Share, Download, and Book action buttons next to the "Customize this trip" button on the trip details page. When clicking "Book", navigate to a dedicated booking review page that displays all bookable items (flights, hotels, transfers, activities) with "Reserve Now" links that open external booking sites.

## Page Structure

### TripDescription Component - Action Buttons Layout
```text
+---------------------------------------------------------------+
|                      Amman Experience                          |
|        [Trip description paragraph text...]                    |
|                                                                |
| +----------------------------------------------------------+  |
| | [Customize this trip]  [Share] [Download] [Book]         |  |
| +----------------------------------------------------------+  |
+---------------------------------------------------------------+
```

### Booking Review Page - `/trip/:id/booking`
```text
+------------------------------------------------------------------+
| [X Close]         Review Bookings                                 |
|              ESTIMATED PRICES (May 1 - 9)                        |
+------------------------------------------------------------------+
|                                                                   |
| Hotels & Transport                                                |
| Amman, Jordan (Days 1-3)                                         |
| +-------------------------------------------------------------+  |
| | [Flight Badge]                                               |  |
| | [Thumbnail]    Fly Berlin → Amman                            |  |
| |  Estimated     6h 25m                                        |  |
| |                1 Stop, 2 people                              |  |
| |                BER → AMM                   ~UAH 20,425       |  |
| |                                                              |  |
| |                [🔗 Reserve Now]              [🗑 Remove]     |  |
| +-------------------------------------------------------------+  |
|                                                                   |
| +-------------------------------------------------------------+  |
| | [Accommodation Badge]                                        |  |
| | [Hotel Photo] W Amman Hotel                                  |  |
| |               1 rooms                                        |  |
| |               2 people                                       |  |
| |               May 1 - May 3               UAH 17,437         |  |
| |                                                              |  |
| |               [🔗 Reserve Now]              [🗑 Remove]      |  |
| +-------------------------------------------------------------+  |
|                                                                   |
| Optional Activities                                              |
| Amman, Jordan (Days 1-3)                                        |
| +-------------------------------------------------------------+  |
| | [Transfer Badge]                                             |  |
| | [Photo]     Airport Transfer To and From Amman               |  |
| |             60 minutes                                       |  |
| |             2 people                                         |  |
| |                                                              |  |
| |             [🔗 Reserve Now]                [🗑 Remove]      |  |
| +-------------------------------------------------------------+  |
|                                                                   |
| +-------------------------------------------------------------+  |
| | [Activity Badge]                                             |  |
| | [Photo]     Amman Walking Tour: Hidden Gems                  |  |
| |             180 minutes                                      |  |
| |             2 people                                         |  |
| |             From UAH 2,854 /person                           |  |
| |                                                              |  |
| |             [🔗 Reserve Now]                [🗑 Remove]      |  |
| +-------------------------------------------------------------+  |
|                                                                   |
+------------------------------------------------------------------+
|                                                                   |
| [Share Icon]          [Download]          [Book - Primary]       |
|                                                                   |
+------------------------------------------------------------------+
```

## Files to Create

### 1. `src/pages/BookingReview.tsx`
Full-page booking review with all trip items grouped by city.

**Key Features:**
- Close button (X) that navigates back to trip details
- Header with "Review Bookings" title and date range
- Two sections: "Hotels & Transport" and "Optional Activities"
- Items grouped by city stop with subheadings
- Each item shows thumbnail, details, price, and action buttons
- "Reserve Now" opens external booking URL in new tab
- "Remove" button with delete confirmation
- Sticky bottom bar with Share, Download, Book actions

### 2. `src/components/booking/BookingItemCard.tsx`
Reusable card component for displaying bookable items.

**Props:**
```typescript
interface BookingItemCardProps {
  type: "flight" | "accommodation" | "transfer" | "activity" | "restaurant";
  title: string;
  subtitle?: string;
  details: string[];
  price?: string;
  image?: string;
  estimatedBadge?: boolean;
  reserveUrl?: string;
  onRemove?: () => void;
}
```

**Behavior:**
- Displays badge based on type (Flight, Accommodation, Transfer, Activity)
- Shows "Estimated" badge for flights
- "Reserve Now" button opens `reserveUrl` in new tab with `target="_blank"` and `rel="noopener noreferrer"`
- Remove button triggers confirmation and calls `onRemove`

### 3. `src/components/booking/BookingStickyBar.tsx`
Sticky bottom action bar for the booking page.

**Features:**
- Share icon button (uses existing ShareButton component)
- Download outline button
- Primary "Book" button (opens confirmation or summary)
- Mobile-responsive with safe area insets

## Files to Modify

### 1. `src/components/trip/TripDescription.tsx`
Add Share, Download, Book buttons next to "Customize this trip".

**Changes:**
- Add Share icon button (reuses ShareButton pattern)
- Add Download outline button
- Add Book primary button that navigates to `/trip/:id/booking`
- Responsive layout: horizontal on desktop, stacked on mobile

**Updated Layout:**
```tsx
<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
  <Button variant="hero" size="lg" className="gap-2">
    Customize this trip
    <ArrowRight className="h-4 w-4" />
  </Button>
  <ShareButton 
    title={title} 
    text={description}
    className="bg-card border border-border"
  />
  <Button variant="outline" size="lg" className="gap-2">
    <Download className="h-4 w-4" />
    Download
  </Button>
  <Button 
    variant="default" 
    size="lg" 
    className="gap-2 bg-primary"
    onClick={() => navigate(`/trip/${tripId}/booking`)}
  >
    <ShoppingCart className="h-4 w-4" />
    Book
  </Button>
</div>
```

### 2. `src/App.tsx`
Add route for booking page.

**Change:**
```tsx
<Route path="/trip/:id/booking" element={<BookingReview />} />
```

### 3. `src/pages/TripDetails.tsx`
Pass `tripId` to TripDescription component for navigation.

### 4. `src/data/tripData.ts`
Add `bookingUrl` optional field to Transport, Accommodation, and Activity interfaces for external reservation links.

## External Booking URLs

Based on user requirements, implement URL pattern matching:

**Flights → Skyscanner:**
```typescript
const getFlightBookingUrl = (from: string, to: string, date: string, travelers: number) => {
  // Pattern from user: https://www.skyscanner.net/transport/flights/{fromCode}/{toCode}/{date}/?adultsv2={travelers}&...
  return `https://www.skyscanner.net/transport/flights/${from.toLowerCase()}/${to.toLowerCase()}/${formatDate(date)}/?adultsv2=${travelers}&cabinclass=economy&...`;
};
```

**Activities/Transfers → GetYourGuide:**
```typescript
const getActivityBookingUrl = (activityId: string) => {
  // Pattern: https://www.getyourguide.com/...?partner_id=...
  return `https://www.getyourguide.com/...?partner_id=79D3GBH&psrc=partner_api&currency=UAH`;
};
```

**Hotels → Trip.com or Booking.com:**
- Use hotel provider URL from accommodation data

## Component Details

### BookingItemCard Layout
```text
+------------------------------------------------------------------+
| [Type Badge]                                                      |
+------------------------------------------------------------------+
| +----------+                                                      |
| |          |  Title                                     Price     |
| |  Image   |  Detail 1                                           |
| |          |  Detail 2                                           |
| |          |  Detail 3                                           |
| +----------+                                                      |
|                                                                   |
| [🔗 Reserve Now]                                    [🗑 Remove]   |
+------------------------------------------------------------------+
```

### Data Flow
1. `BookingReview` page receives trip data via `useTripData` hook
2. Groups items by city using `cityStops` and date ranges
3. Separates into "Hotels & Transport" (flights, hotels) and "Optional Activities" (transfers, activities)
4. Passes each item to `BookingItemCard` with appropriate booking URL
5. "Reserve Now" opens external site in new tab
6. "Remove" updates local state (not persisted without backend)

## Implementation Sequence

1. Create `BookingItemCard` component with type badges and actions
2. Create `BookingStickyBar` component
3. Create `BookingReview` page with grouped sections
4. Add route to `App.tsx`
5. Update `TripDescription.tsx` with action buttons
6. Update `TripDetails.tsx` to pass tripId
7. Add optional `bookingUrl` fields to data interfaces

## Mobile Responsiveness

- Booking page uses full-width layout
- Cards stack vertically on mobile
- Sticky bar adapts with `pb-[env(safe-area-inset-bottom)]`
- Touch-friendly tap targets (min 44px)
- Download button shows only icon on mobile

## Styling Notes

- Match existing card styling: `bg-card rounded-xl border border-border`
- Badge styles: `<Badge variant="outline">` for type indicators
- "Estimated" badge uses `<Badge variant="secondary">`
- Reserve Now link: flex with `ExternalLink` icon
- Trash button: ghost variant with muted color, destructive on hover
- Section headers use existing font-serif styling
