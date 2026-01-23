

# Trip Details Editor Dialog Implementation

## Overview

This plan implements an interactive dialog that opens when clicking the trip date/travelers badge at the top of the trip details page. The dialog will allow users to:
- View and modify the trip overview with all destination stops
- Skip/remove specific stops from the itinerary
- Change dates for each leg of the journey
- Adjust the number of adults and children

The dialog will feature smooth open/close animations and a muted overlay background.

## Visual Reference

Based on the uploaded screenshots, the dialog will have:
- A centered modal with rounded corners
- Trip overview section with numbered rows
- Each row showing: stop number, origin city, transport icon (plane/car), destination city, date picker, and remove button
- Travelers section at the bottom with Adults and Children counters
- Apply button in the footer

## Architecture

```text
+------------------------------------------------------------------+
|                        TripDetails.tsx                            |
|  +------------------------------------------------------------+  |
|  |                  TripDetailsDialog                          |  |
|  |  +-------------------------------------------------------+  |  |
|  |  |  DialogOverlay (muted bg with animation)             |  |  |
|  |  +-------------------------------------------------------+  |  |
|  |  +-------------------------------------------------------+  |  |
|  |  |  DialogContent (animated scale + fade)               |  |  |
|  |  |                                                       |  |  |
|  |  |   [X]              Select Your Stay Details           |  |  |
|  |  |                                                       |  |  |
|  |  |   Trip Overview                                       |  |  |
|  |  |   +-----------------------------------------------+   |  |  |
|  |  |   |  TripStopRow (for each destination)          |   |  |  |
|  |  |   |  [ 1 ] [Origin] [icon] [Dest] [Date] [X]     |   |  |  |
|  |  |   +-----------------------------------------------+   |  |  |
|  |  |                                                       |  |  |
|  |  |   Travelers                                           |  |  |
|  |  |   +-----------------------------------------------+   |  |  |
|  |  |   |  Adults   [-] 4 [+]                          |   |  |  |
|  |  |   |  Children [-] 0 [+]                          |   |  |  |
|  |  |   +-----------------------------------------------+   |  |  |
|  |  |                                                       |  |  |
|  |  |                           [Apply Button]              |  |  |
|  |  +-------------------------------------------------------+  |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

## Implementation Steps

### Step 1: Create TripDetailsDialog Component
Create a new component at `src/components/trip/TripDetailsDialog.tsx` that contains:
- Dialog with custom animations using framer-motion
- State management for trip stops, dates, and travelers
- Trip stop rows with ability to remove stops
- Date picker integration for each stop
- Adults/Children counter controls

### Step 2: Create TripStopRow Component
Create `src/components/trip/TripStopRow.tsx` for individual stop rows:
- Stop number badge
- Origin and destination city inputs (read-only display)
- Transport type icon (plane or car)
- Date picker button with popover calendar
- Remove button (X) to skip this stop

### Step 3: Create TravelerCounter Component
Create `src/components/trip/TravelerCounter.tsx`:
- Reusable counter with increment/decrement buttons
- Icon for Adults/Children
- Minimum value constraints (at least 1 adult)

### Step 4: Update TripDetails.tsx
- Make the existing date/travelers badge clickable
- Add dialog state management
- Pass trip data to the dialog
- Handle applying changes from the dialog

### Step 5: Add Custom Dialog Animations
Update the Dialog component or create motion variants for:
- Smooth scale-in (from 95% to 100%) on open
- Fade-in on overlay
- Smooth scale-out on close
- Spring-based easing for natural feel

## Technical Details

### New Files to Create
1. `src/components/trip/TripDetailsDialog.tsx` - Main dialog component
2. `src/components/trip/TripStopRow.tsx` - Individual trip stop row
3. `src/components/trip/TravelerCounter.tsx` - Traveler count control

### Files to Modify
1. `src/pages/TripDetails.tsx` - Add dialog trigger and state
2. `src/data/tripData.ts` - May need to extend interface for editing state

### Component Props

**TripDetailsDialog:**
```typescript
interface TripDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripData: TripData;
  onApply: (updatedData: EditableTripData) => void;
}
```

**TripStopRow:**
```typescript
interface TripStopRowProps {
  index: number;
  origin: string;
  destination: string;
  transportType: "flight" | "car";
  date: Date;
  onDateChange: (date: Date) => void;
  onRemove: () => void;
  canRemove: boolean;
}
```

**TravelerCounter:**
```typescript
interface TravelerCounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  icon: React.ReactNode;
}
```

### Animation Configuration
Using framer-motion for smooth animations:
- Overlay: `opacity` 0 to 1 with 200ms duration
- Content: `scale` from 0.95 to 1, `opacity` 0 to 1, with spring animation
- Exit animations mirroring entry in reverse

### State Management
The dialog will maintain local state for edits:
```typescript
interface EditableTripData {
  stops: Array<{
    id: string;
    origin: string;
    destination: string;
    transportType: "flight" | "car";
    date: Date;
    isSkipped: boolean;
  }>;
  adults: number;
  children: number;
}
```

### Calendar Integration
Using the existing Calendar component with Popover for date selection:
- `pointer-events-auto` class to ensure interactivity inside dialog
- Proper z-index management for nested popovers

