

## Overview

Update the `TripSidebar` component's visual layout to match the `NewTripSidebar` design while preserving all existing functionality including:
- Predefined action suggestions
- Chat history with interactive chips
- Undo functionality
- Trip modification callbacks

## Layout Changes

### Header Section
The current large emoji + title style will be replaced with a compact card-style header:
- Small circular icon container with Sparkles icon
- "Voyager" title with "AI Trip Planner" subtitle
- Separated from content by a border

### Messages Area
- Keep the existing scrollable messages area
- Update message bubble styling to match (rounded-2xl with rounded-tl-md for assistant)
- Maintain the typing indicator and chips functionality

### Quick Suggestions
Change from vertical full-width buttons to horizontal pill-style chips:
- Wrap in a horizontal flex container
- Use smaller, rounded-full styling
- Keep the same suggestions with emojis

### Input Area
Simplify the input design to match:
- Mic button on the left
- Rounded input field in the center
- Send button on the right (rounded-full, hero variant)
- Move undo button to a less prominent position
- Remove the "Instant replies" footer text

## Technical Details

### Files to Modify
- `src/components/trip/TripSidebar.tsx`

### Key Changes
1. Import `Sparkles` icon from lucide-react
2. Update the header JSX structure to match NewTripSidebar's format
3. Restructure the input form layout
4. Convert suggestion buttons to horizontal chip layout
5. Keep all existing state, handlers, and callback logic intact
6. Maintain the `canUndo` button but integrate it into the new simpler input layout

### Before and After Structure

Current header:
```
[🌍 emoji] [Large title]
[Paragraph description]
```

New header:
```
[Border card]
  [Circle bg] [Sparkles icon]
  [Title: Voyager]
  [Subtitle: AI Trip Planner]
[/Border card]
```

Current suggestions:
```
[Full-width button]
[Full-width button]
[Full-width button]
```

New suggestions:
```
[Pill chip] [Pill chip] [Pill chip]
```

Current input:
```
[Input box with multiple rows]
  [Text input]
  [Undo] [Calendar] [Mic]     [Send]
[Footer text]
```

New input:
```
[Mic] [Rounded input field] [Send]
```

The undo button will be moved into the header area as a small icon button to maintain the functionality without cluttering the simplified input.

