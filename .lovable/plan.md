
# Premium Upgrade Drawer Implementation

## Overview
Create an animated bottom drawer that appears when clicking any "Add" button on the trip details page if the user is on a free plan. The drawer will prompt users to upgrade to a premium plan with subscription options, matching the design shown in the screenshots.

## Design Details (from screenshots)

### Drawer Content
- **Title**: "Unlock Your Full Trip" (large, centered)
- **Subtitle**: "Continue with Premium for unlimited planning and exclusive savings."
- **Benefits banner** (lavender background):
  - Star icon + "Know your trip works - before you go"
  - Star icon + "Exclusive member-only prices"
- **Subscription options** (radio group):
  - "Start with a free 3-day trial" (with checkmark, selected by default)
    - Subtitle: "Cancel anytime"
  - "Annual" 
    - Price: "166.58 /month" (strikethrough style)
  - "Show other option" expandable link (for monthly plan)
- **CTA Button**: "Unlock now" (full-width, dark/primary)

### Animation
- Drawer slides up from bottom with spring animation
- Uses the existing `vaul` drawer component
- Background dims with overlay

---

## Technical Implementation

### Files to Create

**1. `src/components/trip/PremiumUpgradeDrawer.tsx`**
New component for the premium upgrade drawer with:
- Props: `open`, `onOpenChange`
- Uses existing Drawer component from `@/components/ui/drawer`
- RadioGroup for plan selection
- Collapsible section for "Show other option"
- State for selected plan
- Styled with lavender accent background for benefits section

### Files to Modify

**2. `src/pages/TripDetails.tsx`**
- Add state for `premiumDrawerOpen`
- Add mock `isFreePlan` state (defaulting to `true` for demo)
- Pass `onAddClick` callback to `DayPlanSection`
- Render `PremiumUpgradeDrawer` component

**3. `src/components/trip/DayPlanSection.tsx`**
- Add `onAddClick` prop to handle Add button clicks
- Wire up Add button onClick to call `onAddClick`

---

## Component Structure

```text
PremiumUpgradeDrawer
+----------------------------------------+
|            [Drag Handle]               |
+----------------------------------------+
|                                        |
|       Unlock Your Full Trip            |  <- Title (serif font)
|                                        |
|    Continue with Premium for           |  <- Subtitle
|    unlimited planning and savings      |
|                                        |
| +------------------------------------+ |
| | [lavender background]              | |
| | * Know your trip works - before go | |
| | * Exclusive member-only prices     | |
| +------------------------------------+ |
|                                        |
| +------------------------------------+ |
| | (o) Start with a free 3-day trial  | |  <- Selected by default
| |     Cancel anytime                 | |
| +------------------------------------+ |
|                                        |
| +------------------------------------+ |
| | ( ) Annual                         | |
| |     ~166.58~ /month                | |
| +------------------------------------+ |
|                                        |
|    Show other option  v                |  <- Collapsible
|                                        |
| +------------------------------------+ |
| |          Unlock now                | |  <- Primary button
| +------------------------------------+ |
+----------------------------------------+
```

---

## State Management

- `isFreePlan`: Boolean flag to simulate user's plan status (for demo, defaults to `true`)
- `premiumDrawerOpen`: Controls drawer visibility
- `selectedPlan`: Tracks which subscription option is selected ("trial" | "annual" | "monthly")
- `showOtherOption`: Controls visibility of additional plan options

---

## Implementation Steps

### Step 1: Create PremiumUpgradeDrawer Component
- Use existing Drawer primitives from `@/components/ui/drawer`
- Implement the UI matching the screenshot design
- Use RadioGroup for plan selection
- Add Collapsible for "Show other option" section
- Style with project's color tokens (lavender-surface for benefits section)

### Step 2: Update DayPlanSection
- Add `onAddClick?: () => void` prop
- Attach onClick handler to all "Add" buttons
- When clicked, call `onAddClick()` callback

### Step 3: Update TripDetails Page
- Import `PremiumUpgradeDrawer`
- Add state: `premiumDrawerOpen`, `isFreePlan`
- Define `handleAddClick` function:
  - If `isFreePlan`, open the premium drawer
  - Otherwise, proceed with normal add flow (future implementation)
- Pass `onAddClick={handleAddClick}` to `DayPlanSection`
- Render `PremiumUpgradeDrawer` with open/onOpenChange props

---

## Styling Notes

- Use `lavender-surface` CSS utility for the benefits section background
- Star icons use yellow/gold color (`text-yellow-500`)
- Selected radio option has a checkmark icon instead of filled circle
- Annual price shows strikethrough styling
- "Show other option" uses a text button with chevron down icon
- Main CTA uses `variant="hero"` for the dark button style
- Drawer has rounded top corners (already in drawer component)
