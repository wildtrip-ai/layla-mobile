
# City Navigation with Map Animation

## Overview
When clicking on a city in the timeline (TripHeader) or the "Next City" button (DayPlanSection), the map will open and animate to that city's location using Leaflet's `flyTo` function.

## Current Architecture
- **TripHeader.tsx**: Contains the city timeline with clickable city stops
- **DayPlanSection.tsx**: Contains the "Next City" button at the bottom
- **TripMap.tsx**: Contains the static map preview and renders MapDialog
- **MapDialog.tsx**: Full interactive map with existing `flyTo` capability via `window.__mapFlyTo`
- **TripDetails.tsx**: Parent component that coordinates all sections

## Implementation Strategy

### 1. Lift Map Dialog State to TripDetails
Move the `dialogOpen` state from TripMap to TripDetails so it can be controlled by both TripHeader and DayPlanSection.

### 2. Add Selected City State
Create state to track which city should be focused when the map opens. This allows the map to automatically animate to that city after opening.

### 3. Make City Stops Clickable in TripHeader
Add click handlers to each city in the timeline that:
- Set the selected city
- Open the map dialog

### 4. Add Current City Tracking for "Next City" Button
Pass the current city index and city stops to DayPlanSection so the "Next City" button knows which city to navigate to.

### 5. Animate to City After Map Opens
Use a `useEffect` in MapDialog to detect when both the dialog is open and a target city is set, then call `flyTo` with a small delay to ensure the map has fully loaded.

---

## Technical Details

### File: `src/pages/TripDetails.tsx`
- Add `mapDialogOpen` state (boolean)
- Add `selectedCityIndex` state (number | null)
- Add `currentCityIndex` state for tracking which city the user is viewing (default: 0)
- Pass handlers down to child components:
  - `onCityClick(cityIndex)` to TripHeader
  - `onNextCity()` to DayPlanSection

### File: `src/components/trip/TripHeader.tsx`
- Accept new prop: `onCityClick?: (cityIndex: number) => void`
- Add cursor-pointer and hover styles to city stop cards
- Call `onCityClick(index)` when a city is clicked

### File: `src/components/trip/DayPlanSection.tsx`
- Accept new props:
  - `cityStops: CityStop[]`
  - `currentCityIndex: number`
  - `onNextCity?: () => void`
- Update "Next City" button to call `onNextCity` and show the next city name
- Disable or hide the button if on the last city

### File: `src/components/trip/TripMap.tsx`
- Accept new props:
  - `dialogOpen: boolean`
  - `onDialogOpenChange: (open: boolean) => void`
  - `targetCityIndex?: number | null`
  - `onCityAnimationComplete?: () => void`
- Remove internal `dialogOpen` state (now controlled by parent)
- Pass `targetCityIndex` to MapDialog

### File: `src/components/trip/MapDialog.tsx`
- Accept new prop: `targetCityIndex?: number | null`
- Add `useEffect` that watches for changes to `targetCityIndex`:
  - When both `open === true` and `targetCityIndex` is set
  - Wait ~500ms for map to initialize
  - Call `window.__mapFlyTo(coords, 12)` to animate to the city
- Highlight the selected city in the route list

---

## User Flow

```text
1. User clicks "Amman" in timeline
   └─> TripHeader calls onCityClick(0)
       └─> TripDetails sets selectedCityIndex=0, opens dialog
           └─> MapDialog opens, waits for map to load
               └─> Calls flyTo(Amman coords, zoom 12)
                   └─> Map smoothly animates to Amman

2. User clicks "Next City" button
   └─> DayPlanSection calls onNextCity()
       └─> TripDetails increments currentCityIndex
           └─> Same flow as above, map animates to next city
```

---

## Visual Enhancements
- Add hover state to city cards in timeline: `hover:bg-secondary/70 hover:border-primary/30 transition-colors cursor-pointer`
- Show which city is currently active/selected with a subtle ring or different background
- The "Next City" button shows the destination: "Next City: Wadi Rum"
