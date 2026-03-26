# TrendDrop

## Current State
The Navbar component (src/frontend/src/components/Navbar.tsx) has a row of icon buttons on the top right: User, Heart, Cart, and a mobile menu toggle. There is no share functionality.

## Requested Changes (Diff)

### Add
- A Share icon button in the top-right icon group of the Navbar (before the mobile menu toggle)
- A share panel/popover that opens when the button is clicked, containing:
  - Copy Link (copies current URL to clipboard, shows confirmation)
  - WhatsApp share
  - Facebook share
  - Twitter/X share
  - Native share sheet (Web Share API, shown on mobile/supported devices)

### Modify
- Navbar.tsx: Add Share button and share panel logic

### Remove
- Nothing

## Implementation Plan
1. Add `Share2` icon from lucide-react to Navbar imports
2. Add state for share panel open/closed and copy confirmation
3. Insert Share button in the icon row (top right, before mobile menu toggle)
4. Render a dropdown/popover share panel with:
   - Copy Link option (uses navigator.clipboard, shows "Copied!" briefly)
   - WhatsApp: `https://wa.me/?text=<encoded url>`
   - Facebook: `https://www.facebook.com/sharer/sharer.php?u=<encoded url>`
   - Twitter/X: `https://twitter.com/intent/tweet?url=<encoded url>&text=Check out TrendDrop!`
   - Native share: `navigator.share` if available
5. Panel closes on outside click or pressing Escape
