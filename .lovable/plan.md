
# Activity Details Page Implementation Plan

## Overview
Create a dedicated activity details page that displays comprehensive information when users click on an activity in the trip day plan. The design follows the pattern shown in the reference screenshot with a header, hero image, overview, FAQ accordion, location map, and a sticky bottom bar.

## Page Structure (Based on Reference Design)

The new activity page will include:
- **Breadcrumb navigation**: Trip plan > Activity Name
- **Type badge**: ATTRACTION, RESTAURANT, or ACTIVITY
- **Title**: Activity name
- **Hero image**: Full-width image
- **Overview section**: Detailed description
- **FAQ accordion**: Frequently asked questions specific to the activity
- **Location section**: Interactive Leaflet map showing the activity location
- **Sticky bottom bar**: Date, "Added to Trip" dropdown, and "Explore Options" button

---

## Implementation Steps

### 1. Add Route in App.tsx
Add a new route for activity details:
```
/trip/:id/activity/:activityId
```

### 2. Create ActivityDetails Page
Create `src/pages/ActivityDetails.tsx` with the following sections:

**Header & Breadcrumb**
- Back navigation to trip plan
- Breadcrumb: Trip plan > Activity Name

**Activity Header**
- Type badge (ATTRACTION / RESTAURANT / ACTIVITY)
- Activity title
- Hero image (full-width, rounded corners)

**Overview Section**
- Generated description based on activity type and title
- Mock content specific to Jordan attractions

**FAQ Accordion**
- Collapsible questions and answers
- Generic questions like opening hours, booking requirements, tour availability, accessibility, best time to visit

**Location Section**
- Interactive Leaflet map (same pattern as AccommodationDetails)
- Activity marker with name label
- Expand button for fullscreen

**Sticky Bottom Bar**
- Activity date (from day plan context)
- "Added to Trip" dropdown with toggle option
- "Explore Options" external link button

### 3. Extend Activity Data Model
Enhance the `Activity` interface in `src/data/tripData.ts`:
- Add optional `description` field
- Add optional `coordinates` for map location
- Add optional `address` for display
- Add optional `faqs` array

### 4. Create Activity Details Data
Add a `activityDetails` data object with extended information for each activity, including:
- Full descriptions
- Coordinates for map
- Address strings
- FAQ content

### 5. Update ActivityItem Component
Modify `src/components/trip/ActivityItem.tsx`:
- Wrap the activity card in a `Link` component
- Navigate to `/trip/:id/activity/:activityId` on click
- Preserve existing styling and animations
- Make the entire card clickable (except notes)

### 6. Update DayPlanSection
Pass the trip ID to ActivityItem so it can construct the correct link URL.

---

## Technical Details

### New Files
| File | Purpose |
|------|---------|
| `src/pages/ActivityDetails.tsx` | Main activity details page |

### Modified Files
| File | Changes |
|------|---------|
| `src/App.tsx` | Add activity route |
| `src/data/tripData.ts` | Extend Activity interface |
| `src/components/trip/ActivityItem.tsx` | Add navigation link |
| `src/components/trip/DayPlanSection.tsx` | Pass tripId to ActivityItem |

### Dependencies Used
- `leaflet` + `react-leaflet` for interactive maps
- `framer-motion` for animations
- `@radix-ui/react-accordion` for FAQ section
- Existing UI components (Button, Badge, Breadcrumb, DropdownMenu)

### Route Structure
```
/trip/:id                              → TripDetails (existing)
/trip/:id/accommodations              → AccommodationResults (existing)
/trip/:id/accommodation/:accommodationId → AccommodationDetails (existing)
/trip/:id/activity/:activityId        → ActivityDetails (NEW)
```

---

## Component Structure for ActivityDetails.tsx

```text
┌─────────────────────────────────────┐
│  Header (navigation)                │
├─────────────────────────────────────┤
│  Breadcrumb: Trip plan > Activity   │
├─────────────────────────────────────┤
│  ATTRACTION (badge)                 │
│  Activity Title                     │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │       Hero Image              │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  Overview                           │
│  Description text...                │
├─────────────────────────────────────┤
│  Frequently Asked Questions         │
│  ┌─ What are the opening hours?  ─┐ │
│  ├─ Is advance booking required? ─┤ │
│  ├─ Are guided tours available?  ─┤ │
│  └─ Best time to visit?          ─┘ │
├─────────────────────────────────────┤
│  Location                           │
│  ┌───────────────────────────────┐  │
│  │       Leaflet Map             │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  [Sticky Bottom Bar]                │
│  Date  |  Added to Trip ▼  |  Explore│
└─────────────────────────────────────┘
```

---

## Sample Mock Data for Activities

For Jordan trip activities, create detailed mock data including:

**Rainbow Street**
- Description: Popular entertainment district in Amman
- Address: Rainbow St., Jabal Amman, Amman
- Coordinates: [31.9522, 35.9320]
- FAQs about best times, nearby restaurants, etc.

**Amman Citadel**
- Description: Ancient hilltop site with Roman, Byzantine ruins
- Address: K. Ali Ben Al-Hussein St.146, Amman
- Coordinates: [31.9587, 35.9338]
- FAQs about opening hours, guided tours, etc.

**Roman Theater**
- Description: 2nd-century Roman amphitheater
- Address: The Hashemite Plaza, Taha Al-Hashemi St.
- Coordinates: [31.9519, 35.9344]
- FAQs about performances, accessibility, etc.
