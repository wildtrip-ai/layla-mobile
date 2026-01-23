
# City-Focused View Implementation

## Overview
When clicking on a city in the timeline, instead of opening the full map dialog, the app will:
1. Zoom the static preview map to show only that city
2. Filter all content sections to display only city-relevant data
3. Keep the "View full map" button to open the complete route dialog

## Current Behavior
- Clicking a city opens the MapDialog with fly-to animation
- All content shows the entire trip (all cities, all days, all transports)

## New Behavior
- Clicking a city updates `currentCityIndex` and zooms the static map
- Content below filters to show only that city's data
- "View full map" button still opens the MapDialog for the complete route

---

## Technical Implementation

### 1. StaticLeafletMap - Add Dynamic Center/Zoom Support

Currently the map is initialized once and never updates. We need to add the ability to animate to a new center point.

**Changes:**
- Store the Leaflet map instance in a ref that persists across renders
- Add a `useEffect` that calls `map.flyTo(center, zoom)` when center/zoom props change
- Expose a `selectedIndex` prop to highlight the active city marker

### 2. TripMap - Pass Selected City Information

Update to calculate and pass city-specific center and zoom level.

**Changes:**
- Accept `selectedCityIndex` prop
- When a city is selected, compute that city's coordinates as the center
- Use a higher zoom level (e.g., 11-12) for single city view vs 7 for full route
- Pass `selectedIndex` to StaticLeafletMap for marker highlighting

### 3. TripDetails - Change City Click Behavior

Instead of opening the map dialog, just update the current city.

**Changes to `handleCityClick`:**
```
Before: Opens map dialog + sets selectedCityIndex
After:  Sets currentCityIndex only (no dialog)
```

### 4. Filter Trip Data by City

The sample trip data has 3 city stops with these date ranges:
- Amman: May 1-3 (Days 1-2)
- Wadi Rum: May 3-5 (Day 3+)
- Petra: May 5-7 (future days)

Create filtering logic for each section:

**Day Plans:**
- Filter `dayPlans` to only show days that belong to the current city
- Use date ranges from `cityStops[currentCityIndex].dates`

**Accommodations:**
- Filter accommodations by matching date ranges to current city dates
- Show only hotels for the selected city period

**Transports:**
- Show transports relevant to arriving at or departing from the current city
- For first city: show incoming transport
- For subsequent cities: show transfer to that city

**Description:**
- Update to show city-specific description (may require data structure update)
- Alternative: show same description but update section header with city name

**Image Gallery:**
- Filter to show only images from activities in the current city's day plans

### 5. Update Section Headers

Each section should indicate which city's content is being shown:
- "Accommodation in Amman" instead of "Accommodation"
- "Day-by-Day Plan: Amman" instead of generic header
- "Transport to Amman" / "Transport from Amman"

---

## File Changes Summary

### `src/components/trip/StaticLeafletMap.tsx`
- Add `selectedIndex` prop to highlight active marker
- Make map reactive to `center` and `zoom` changes with `flyTo` animation
- Highlight selected city marker with different style (larger, colored ring)

### `src/components/trip/TripMap.tsx`
- Accept `selectedCityIndex` to determine map focus
- Calculate city-specific center when a city is selected
- Use zoom level 11 for single city, 7 for full route view

### `src/pages/TripDetails.tsx`
- Change `handleCityClick` to only update `currentCityIndex` (no dialog open)
- Add helper functions to filter data by city:
  - `getFilteredDayPlans(cityIndex)`
  - `getFilteredAccommodations(cityIndex)`
  - `getFilteredTransports(cityIndex)`
  - `getFilteredImages(cityIndex)`
- Pass filtered data to child components
- Update `dates` prop for sections to show city dates

### `src/components/trip/DayPlanSection.tsx`
- Update header to show city name: "Day-by-Day Plan: {cityName}"

### `src/components/trip/AccommodationSection.tsx`
- Update header to show city name: "Accommodation in {cityName}"
- Accept optional `cityName` prop

### `src/components/trip/TransportSection.tsx`
- Update header to show context: "Getting to {cityName}"
- Accept optional `cityName` prop

---

## Data Filtering Logic

### Mapping Days to Cities
Based on the sample trip data:
```
City 0 (Amman): May 1-3 -> Days 1, 2
City 1 (Wadi Rum): May 3-5 -> Day 3
City 2 (Petra): May 5-7 -> (no days in current data)
```

Create a mapping function that parses city date ranges and matches to day plan dates.

### Filter Implementation (in TripDetails.tsx)
```typescript
// Example filtering logic
const getCityDayPlans = (cityIndex: number) => {
  const city = sampleTrip.cityStops[cityIndex];
  // Parse "May 1 - May 3" to get date range
  // Filter dayPlans where day.date falls within range
};

const getCityAccommodations = (cityIndex: number) => {
  const city = sampleTrip.cityStops[cityIndex];
  // Filter accommodations where dates overlap with city dates
};
```

---

## Visual Behavior

### Map Animation
When selecting a city:
1. Static map smoothly animates (`flyTo`) to city coordinates
2. Zoom increases from 7 to 11 for closer view
3. Selected city marker gets highlighted (colored ring or glow)

### Content Transition
When city changes:
1. Content sections fade/animate to new data
2. Section headers update to reflect current city
3. "Next City" button shows destination for next city

### City Timeline
- Current city shows primary highlight (existing pulsing dot)
- Clicking a city makes it the current city (content updates)
- Timeline scrolls to keep current city visible

---

## Edge Cases

1. **City with no activities**: Show empty state "No activities planned for this city yet"
2. **City with no accommodations**: Show "No accommodation booked for {city}"
3. **First city transport**: Show incoming flight/transfer
4. **Last city**: "Next City" button shows "End of Trip"
