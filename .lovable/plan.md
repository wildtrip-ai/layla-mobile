
# Country Places API Integration Plan

## Overview
Replace the static country data on the CountryDetails page (`/country/:slug`) with dynamic data from the API endpoint `http://internal-api.emiratesescape.com/v1.0/countries/{slug}/places`. The implementation will include skeleton loading states and localStorage caching with weekly eviction, following the established pattern from `useCountries`.

## API Response Analysis

The endpoint returns a flat list of places with an `is_featured` flag:
```typescript
{
  items: [
    {
      id: string;
      name: string;
      slug: string;
      image_url: string;
      thumbnail_url: string | null;
      description: string;
      short_description: string | null;
      rating: string;  // Note: string not number
      review_count: number;
      city: string | null;
      region: string | null;
      is_featured: boolean;
      tags: string[] | null;
    }
  ],
  next_cursor: string | null;
  has_more: boolean;
}
```

Based on the sample data:
- **Featured places** (`is_featured: true`) include destinations, cities, and island regions (Costa del Sol, Madrid, Barcelona, Ibiza, Seville, Canary Islands, Balearic Islands)
- **Non-featured places** include additional cities and restaurants (Valencia, Granada, Bilbao, El Celler de Can Roca, Tickets, Asador Etxebarri, DiverXO)

## Implementation Approach

Since the API returns a flat list without explicit categories, we'll use the `is_featured` flag combined with name/slug pattern matching to categorize places:

### Categorization Logic
```typescript
// Featured items become "Top Destinations" (destinations + island regions)
// Cities are identified by known city patterns or all non-restaurant featured items
// Restaurants are identified by restaurant-specific data patterns
```

Given the current API structure doesn't provide explicit category types, we'll simplify:
- **"Featured Places"** section: All `is_featured: true` items
- **"More to Explore"** section: All `is_featured: false` items

This matches the screenshot showing "Top Destinations" and "Popular Cities" which are essentially featured vs. non-featured splits.

## Files to Create

### 1. `src/hooks/useCountryPlaces.ts`
Custom hook for fetching and caching country places.

**Features:**
- Accepts `countrySlug` parameter
- localStorage cache with key `country_places_{slug}`
- Weekly cache eviction (7 days)
- Returns `{ places, isLoading, error }`
- Transforms API response to match existing `CountryPlace` interface

**Interface:**
```typescript
interface ApiPlace {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  thumbnail_url: string | null;
  description: string;
  short_description: string | null;
  rating: string;
  review_count: number;
  city: string | null;
  region: string | null;
  is_featured: boolean;
  tags: string[] | null;
}

interface CountryPlacesResult {
  featuredPlaces: CountryPlace[];
  otherPlaces: CountryPlace[];
  isLoading: boolean;
  error: string | null;
}
```

### 2. `src/components/PlaceCardSkeleton.tsx`
Skeleton component for place cards during loading.

**Layout:**
```text
+----------------------------------+
|  [Image Skeleton - 4:3 aspect]   |
+----------------------------------+
| [Title skeleton]    [Rating]     |
| [Description skeleton line 1]    |
| [Description skeleton line 2]    |
+----------------------------------+
```

**Exports:**
- `PlaceCardSkeleton` - Single card skeleton
- `PlacesSectionSkeleton` - Section with 4 skeleton cards

## Files to Modify

### 1. `src/pages/CountryDetails.tsx`

**Changes:**
1. Import `useCountryPlaces` hook
2. Replace `getCountryBySlug(slug)` with hook data
3. Use basic country info from `useCountries` for header (flag, name)
4. Show skeleton loading state while places are loading
5. Update `CategorySection` to handle dynamic places

**Updated Structure:**
```text
+-----------------------------------------------+
| [Hero with country flag and name]             |
| (Uses useCountries for basic info)            |
+-----------------------------------------------+
| [Breadcrumb]                                  |
+-----------------------------------------------+
| Top Destinations (Featured)                   |
| [PlaceCard] [PlaceCard] [PlaceCard] [PlaceCard]|
| (if loading: [Skeleton] [Skeleton]...)        |
+-----------------------------------------------+
| Popular Cities (Featured cities)              |
| [PlaceCard] [PlaceCard] [PlaceCard]           |
+-----------------------------------------------+
| Top Restaurants (Non-featured restaurants)    |
| [PlaceCard] [PlaceCard] [PlaceCard] [PlaceCard]|
+-----------------------------------------------+
```

**Key Logic:**
```typescript
const { slug } = useParams();
const { countries } = useCountries(); // For basic country info
const { featuredPlaces, otherPlaces, isLoading, error } = useCountryPlaces(slug);

// Get country basic info (name, flag) from countries list
const countryInfo = countries.find(c => c.slug === slug);

// Separate featured into destinations vs cities based on is_featured
// Restaurants identified from otherPlaces (non-featured with restaurant patterns)
```

### 2. `src/data/countriesData.ts`

**Changes:**
- Update `hasDetailedData()` function to return `true` for all countries (since API provides data)
- Keep the function but make it always return true, or remove the check

## Data Flow

```text
User navigates to /en/country/spain
         |
         v
+---------------------------+
| CountryDetails component  |
| calls useCountryPlaces()  |
+---------------------------+
         |
         v
+---------------------------+
| Check localStorage for    |
| country_places_spain      |
+---------------------------+
    |           |
  Cached      Not cached
    |           |
    v           v
Return     Fetch from API
cached     POST /countries/spain/places
    |           |
    |           v
    |     Cache response
    |     in localStorage
    |           |
    +-----+-----+
          |
          v
+---------------------------+
| Transform API response:   |
| - Split by is_featured    |
| - Map to CountryPlace     |
+---------------------------+
          |
          v
+---------------------------+
| Render CategorySection    |
| with places or skeletons  |
+---------------------------+
```

## Technical Details

### Cache Key Pattern
```typescript
const CACHE_KEY_PREFIX = "country_places_";
const getCacheKey = (slug: string) => `${CACHE_KEY_PREFIX}${slug}`;
```

### Transformation Function
```typescript
const transformApiPlace = (apiPlace: ApiPlace): CountryPlace => ({
  id: apiPlace.id,
  name: apiPlace.name,
  image: apiPlace.image_url,
  description: apiPlace.description || apiPlace.short_description || "",
  rating: parseFloat(apiPlace.rating) || undefined,
});
```

### Fallback for Country Info
Since `useCountryPlaces` only returns places (not country metadata), we need the country name/flag from either:
1. The existing `useCountries` hook (has flag_emoji, name)
2. The static `allCountries` array in countriesData.ts

We'll use `useCountries` as primary source.

## Skeleton Loading Layout

```text
+-----------------------------------------------+
| [Hero - Uses country info from useCountries]  |
+-----------------------------------------------+
| [Breadcrumb]                                  |
+-----------------------------------------------+
| Top Destinations                              |
| +--------+ +--------+ +--------+ +--------+   |
| |skeleton| |skeleton| |skeleton| |skeleton|   |
| +--------+ +--------+ +--------+ +--------+   |
+-----------------------------------------------+
| Popular Cities                                |
| +--------+ +--------+ +--------+              |
| |skeleton| |skeleton| |skeleton|              |
| +--------+ +--------+ +--------+              |
+-----------------------------------------------+
```

## Implementation Sequence

1. Create `PlaceCardSkeleton.tsx` component
2. Create `useCountryPlaces.ts` hook with caching
3. Update `CountryDetails.tsx` to use the new hook
4. Update `countriesData.ts` to enable all countries
5. Test loading states and error handling

## Error Handling

- Show error message if API fails
- Fallback to static data if available (for countries with existing data)
- Retry button for failed requests

## Mobile Responsiveness

- Skeleton cards match the responsive grid layout
- 1 column on mobile, 2 on sm, 3 on lg, 4 on xl
- Same dimensions as actual PlaceCard component
