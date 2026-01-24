

## Overview

Create a new "Explore Countries" feature with two pages:
1. **All Countries Page** (`/countries`) - Lists all countries in a clean multi-column grid
2. **Country Details Page** (`/country/:slug`) - Shows detailed breakdown of a country with categories

The Footer's "Top Countries" links will navigate to individual country pages, and "All Countries" will link to the countries listing page.

## New Pages Structure

### All Countries Page (`/countries`)
- Header with logo
- Breadcrumb navigation: Home > All Countries
- Title: "All Countries" with a world icon
- Alphabetically sorted grid of country names (3 columns on desktop, 2 on tablet, 1 on mobile)
- Each country name is a clickable link to `/country/:slug`
- Footer included

### Country Details Page (`/country/:slug`)
- Header with logo
- Breadcrumb: Home > All Countries > [Country Name]
- Hero section with country name + flag emoji
- Categorized sections:
  - **Cities** - Top 6 popular cities with images
  - **Restaurants** - Top 4 popular restaurants
  - **Amenities** - Top 4 popular amenities (parks, beaches, etc.)
  - **Museums** - Top 4 popular museums
  - **Historical Sites** - Top 4 landmarks and heritage sites
  - **Natural Attractions** - Top 4 natural wonders
- Each category shows cards with name, image, and brief description
- "View All" link for each category
- Footer included

## Data Structure

New data file: `src/data/countriesData.ts`

```text
Interface structure:
- CountryPlace: { id, name, image, description?, rating? }
- CountryData: {
    slug: string,
    name: string,
    flag: string (emoji),
    heroImage: string,
    cities: CountryPlace[],
    restaurants: CountryPlace[],
    amenities: CountryPlace[],
    museums: CountryPlace[],
    historicalSites: CountryPlace[],
    naturalAttractions: CountryPlace[]
  }
- allCountries: { slug, name, flag }[] (full list for listing page)
```

## File Changes

### New Files
1. `src/pages/Countries.tsx` - All countries listing page
2. `src/pages/CountryDetails.tsx` - Individual country page
3. `src/data/countriesData.ts` - Countries data with sample content

### Modified Files
1. `src/App.tsx` - Add two new routes:
   - `/countries` -> Countries
   - `/country/:slug` -> CountryDetails
2. `src/components/Footer.tsx` - Update country links to use `<Link>` components with proper routing

## UI Components

### Countries Page Layout
```text
+----------------------------------+
| Header                           |
+----------------------------------+
| Breadcrumb: Home > All Countries |
+----------------------------------+
| All Countries                    |
+----------------------------------+
| Afghanistan  | Albania  | Algeria|
| Andorra      | Angola   | ...    |
| ...          | ...      | ...    |
+----------------------------------+
| Footer                           |
+----------------------------------+
```

### Country Details Page Layout
```text
+----------------------------------+
| Header                           |
+----------------------------------+
| Breadcrumb: Home > Countries > IT|
+----------------------------------+
| 🇮🇹 Italy                        |
+----------------------------------+
| Popular Cities          View All |
| [Card] [Card] [Card] [Card]...  |
+----------------------------------+
| Top Restaurants         View All |
| [Card] [Card] [Card] [Card]     |
+----------------------------------+
| Popular Amenities       View All |
| [Card] [Card] [Card] [Card]     |
+----------------------------------+
| Museums                 View All |
| [Card] [Card] [Card] [Card]     |
+----------------------------------+
| Historical Sites        View All |
| [Card] [Card] [Card] [Card]     |
+----------------------------------+
| Natural Attractions     View All |
| [Card] [Card] [Card] [Card]     |
+----------------------------------+
| Footer                           |
+----------------------------------+
```

### Place Card Component
Each place card will include:
- Image with aspect ratio 4:3
- Name
- Optional rating with star
- Optional short description
- Hover animation (scale + shadow)

## Sample Data

Will include sample data for 5 countries referenced in Footer:
- Spain, Italy, Portugal, Indonesia, Germany

Plus a comprehensive list of ~200 countries for the All Countries page.

Each country will have placeholder data for:
- 6 cities (e.g., Rome, Milan, Florence, Venice, Naples, Turin for Italy)
- 4 restaurants (famous local dining spots)
- 4 amenities (parks, beaches, spas)
- 4 museums (national/art museums)
- 4 historical sites (ancient ruins, castles)
- 4 natural attractions (mountains, lakes, coastlines)

## Technical Implementation

### Routing Updates (App.tsx)
```tsx
<Route path="/countries" element={<Countries />} />
<Route path="/country/:slug" element={<CountryDetails />} />
```

### Footer Updates
Convert static links to React Router `<Link>` components:
```tsx
<Link to={`/country/${countrySlug}`}>Spain</Link>
<Link to="/countries">All Countries</Link>
```

### Animation
- Use existing `framer-motion` and `StaggerContainer`/`StaggerItem` patterns
- Cards have hover scale animation matching existing DestinationsSection style
- Page transitions with fade-in effects

### Responsive Design
- Countries grid: 1 col mobile, 2 cols tablet, 3 cols desktop
- Place cards: 1 col mobile, 2 cols tablet, 3-4 cols desktop (depending on section)
- Horizontal scroll option for place cards on mobile

## Additional Categories Added
Beyond what was requested, adding these for a richer experience:
1. **Historical Sites** - Castles, ancient ruins, heritage buildings
2. **Natural Attractions** - Mountains, lakes, beaches, national parks

These complement the requested categories and make the country page more comprehensive for travel planning.

