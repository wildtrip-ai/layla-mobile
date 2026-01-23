
# Login Dialog Implementation Plan

## Overview
Create an animated login dialog that opens from the bottom with a two-panel layout: a form panel on the left and an image/character panel on the right. The dialog will be triggered when clicking "Login" in the Header dropdown menu.

## Design Details (Based on Screenshot)

### Left Panel - Form Section
- **Title**: "Sign In" (centered, serif font)
- **Sign up link**: "New to Layla? Sign up" (with underlined "Sign up")
- **Email input**: Rounded input with placeholder "Email"
- **Password input**: Rounded input with placeholder "Password"
- **Continue button**: Full-width, dark/primary button
- **Forgot password link**: Text button "Forgot password?"
- **Divider**: Visual separator between form and social logins
- **Social login buttons** (outlined style):
  - "Continue with Google" (Google icon)
  - "Continue with Apple" (Apple icon)
  - "Continue with Facebook" (Facebook icon)
- **Terms text**: "By signing up, you agree to our Terms of service and Privacy Policy."

### Right Panel - Image Section
- Background: Sky blue color with a person image
- Speech bubble: "Here's the tea, sign up for a free account and, voilà, we'll continue chatting."
- Close button: Circular white button with X icon in top-right corner

### Animation
- Dialog slides up from bottom using framer-motion
- Overlay fades in
- Similar spring animation pattern to TripDetailsDialog

---

## Technical Implementation

### Files to Create

**1. `src/components/auth/LoginDialog.tsx`** - Main login dialog component
- Props: `open`, `onOpenChange`
- Uses framer-motion for bottom-up slide animation with AnimatePresence
- Two-panel responsive layout (stacks on mobile)
- Form inputs using existing Input component
- Button components with existing variants
- SVG icons for social providers (Google, Apple, Facebook)
- State management for email, password, and form mode (sign in/sign up)

### Files to Modify

**2. `src/components/Header.tsx`** - Wire up Login menu item
- Import LoginDialog component
- Add state: `loginDialogOpen`
- Attach onClick to "Login" dropdown item to open dialog
- Render LoginDialog with open/onOpenChange props

---

## Component Structure

```text
LoginDialog (framer-motion animated)
+------------------------------------------------------------------+
|                                                                  |
| +---------------------------+  +-------------------------------+ |
| |                           |  |           [X] close btn       | |
| |         Sign In           |  |                               | |
| |                           |  |   +-------------------+       | |
| |  New to Layla? Sign up    |  |   | Speech bubble:    |       | |
| |                           |  |   | "Here's the tea..." |     | |
| |  +---------------------+  |  |   +-------------------+       | |
| |  | Email               |  |  |                               | |
| |  +---------------------+  |  |         [Person Image]        | |
| |                           |  |                               | |
| |  +---------------------+  |  |                               | |
| |  | Password            |  |  |                               | |
| |  +---------------------+  |  |                               | |
| |                           |  |                               | |
| |  [    Continue        ]   |  |                               | |
| |                           |  |                               | |
| |  Forgot password?         |  |                               | |
| |                           |  |                               | |
| |  ───────────────────────  |  |                               | |
| |                           |  |                               | |
| |  [G] Continue with Google |  |                               | |
| |  [] Continue with Apple  |  |                               | |
| |  [f] Continue with FB     |  |                               | |
| |                           |  |                               | |
| |  Terms and Privacy links  |  |                               | |
| +---------------------------+  +-------------------------------+ |
+------------------------------------------------------------------+
```

---

## Implementation Details

### Animation Pattern
Following the TripDetailsDialog pattern with framer-motion:
```typescript
// Overlay
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}

// Dialog content - slide from bottom
initial={{ opacity: 0, y: "100%" }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: "100%" }}
transition={{ type: "spring", damping: 25, stiffness: 200 }}
```

### Social Login Icons
Create inline SVG components for:
- Google (multicolor G logo)
- Apple (black apple logo)
- Facebook (blue f logo)

### Form Inputs
Use the existing Input component with custom styling:
- Rounded-full shape (rounded-full class)
- Larger padding for a softer appearance
- Light gray border

### Responsive Behavior
- Desktop: Two-column layout with image panel visible
- Mobile/Tablet: Single column with form only, image panel hidden

### State Management
- `email`: string - controlled input state
- `password`: string - controlled input state
- `isSignUp`: boolean - toggle between Sign In and Sign Up modes

---

## Implementation Steps

### Step 1: Create LoginDialog Component
- Create new file `src/components/auth/LoginDialog.tsx`
- Implement the animated two-panel layout
- Add form inputs with controlled state
- Add social login buttons with SVG icons
- Include terms and privacy policy links

### Step 2: Update Header Component
- Import LoginDialog
- Add `loginDialogOpen` state
- Wire up Login menu item onClick
- Render LoginDialog component

---

## Styling Notes

- Dialog uses `bg-card` for form panel background
- Right panel uses a blue gradient or image background (`bg-sky-400`)
- Form panel max-width: ~400px
- Speech bubble: white background with rounded corners and a tail/pointer
- Social buttons: outlined style with left-aligned icon
- Input fields: `rounded-full` for pill shape matching the screenshot
- Use `font-serif` for the "Sign In" title
- Close button: white circular button with subtle shadow
