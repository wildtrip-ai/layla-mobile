

# Settings Page Implementation Plan

## Overview
Create a new Settings page with a two-column layout matching the AI Trip Planner structure. The left sidebar will contain navigation menu items (Profile, Notifications, Manage Subscription), while the right side displays the settings content for each section.

## Page Structure

```text
+------------------+------------------------------------------+
|  Settings Menu   |          Settings Content Area           |
|  (340px width)   |              (flexible)                  |
|                  |                                          |
|  [Profile]       |   Profile                                |
|  [Notifications] |   +----------------------------------+   |
|  [Subscription]  |   | Avatar  |  John Down            |   |
|                  |   +----------------------------------+   |
|                  |   | First Name        |    [John]   |   |
|                  |   +----------------------------------+   |
|                  |   | Last Name         |    [Down]   |   |
|                  |   +----------------------------------+   |
|                  |   | Email             | email@...   |   |
|                  |   +----------------------------------+   |
|                  |   | Currency          |    [USD]    |   |
|                  |   +----------------------------------+   |
|                  |   | Language          |    [EN]     |   |
|                  |   +----------------------------------+   |
|                  |                                          |
|                  |   +----------------------------------+   |
|                  |   | Delete account    | [Delete]    |   |
|                  |   +----------------------------------+   |
+------------------+------------------------------------------+
```

## Files to Create

### 1. `src/pages/Settings.tsx`
Main settings page with two-column layout matching NewTripPlanner proportions.

### 2. `src/components/settings/SettingsSidebar.tsx`
Left sidebar menu with navigation items:
- Profile (User icon)
- Notifications (Bell icon)  
- Manage Subscription (Crown icon)

Matches the NewTripSidebar card styling:
- `bg-card rounded-2xl border border-border shadow-lg`
- `h-[calc(100vh-180px)] sticky top-24`
- Header with icon and title similar to "Voyager AI Trip Planner"

### 3. `src/components/settings/ProfileSettings.tsx`
Profile content section containing:
- User header card with avatar and full name
- Editable fields (First Name, Last Name) with rounded input boxes
- Read-only Email field (displayed as text, not editable)
- Currency selector (opens SelectionDialog)
- Language selector (opens SelectionDialog)
- Delete account section (separate card at bottom)

### 4. `src/components/settings/NotificationSettings.tsx`
Placeholder for notification preferences with toggles for:
- Email notifications
- Push notifications
- Trip reminders
- Promotional offers

### 5. `src/components/settings/SubscriptionSettings.tsx`
Subscription management section showing:
- Current Plan card (Free/Premium with Upgrade button)
- Payment Method card (with Add Payment Method button)
- Billing History section

## Files to Modify

### 1. `src/App.tsx`
Add route for `/settings` page

### 2. `src/components/Header.tsx`
Make Settings dropdown menu item link to `/settings` route

## Technical Details

### Layout Implementation
- Uses same grid layout as NewTripPlanner: `lg:grid-cols-[340px_1fr] gap-6`
- Mobile: Stack layout with sidebar as horizontal tabs or accordion
- Sticky sidebar with same height calculation: `h-[calc(100vh-180px)] sticky top-24`

### State Management
- Use React useState for form fields (firstName, lastName, currency, language)
- Initialize with mock user data from Header.tsx pattern
- Currency and Language use existing SelectionDialog component with languages/currencies data

### Form Field Pattern
Based on the reference screenshot, each field uses a row layout:
```tsx
<div className="flex items-center justify-between py-4 border-b border-border">
  <label className="text-foreground font-medium">First Name</label>
  <Input 
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    className="w-48 text-right rounded-full border-border"
  />
</div>
```

### Email Field (Immutable)
- Displayed as plain text without input styling
- Shows the email address right-aligned
- No edit capability

### Currency/Language Selectors
- Display current selection as a button/pill
- On click, opens SelectionDialog (reusing existing component)
- Updates local state on selection

### Delete Account Section
- Separate card at bottom
- Destructive action button styled with red text
- Consider adding confirmation dialog

## Implementation Sequence

1. Create SettingsSidebar component with menu items
2. Create ProfileSettings component with form fields
3. Create NotificationSettings placeholder
4. Create SubscriptionSettings placeholder  
5. Create main Settings page combining components
6. Add route to App.tsx
7. Link Settings menu item in Header

## Styling Notes

- Match the rounded card aesthetic from reference screenshots
- Use `rounded-2xl` or `rounded-3xl` for main cards
- Form rows with `border-b border-border` separators
- Input fields: `rounded-full` for the pill/rounded look shown in screenshots
- Avatar: Use existing Avatar component with green background and initial
- Consistent with existing app typography (font-serif for headings)

