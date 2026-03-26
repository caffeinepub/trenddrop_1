# TrendDrop Admin Dashboard

## Current State
- TrendDrop has a full marketplace with products, cart, checkout, PWA, and share features.
- Backend already has: `getAllOrders()`, `updateOrderStatus()`, `getOrdersByEmail()`, `placeOrder()`, `isCallerAdmin()`, `getNewsletterEmails()`, and product management APIs.
- No admin UI exists yet.
- Authorization component is installed (role-based, admin vs user vs guest).

## Requested Changes (Diff)

### Add
- Admin dashboard page (`/admin`) accessible via a hidden route (no link in main nav)
- Password gate: simple hardcoded password check ("trenddrop2025") on the frontend before showing the dashboard — no Internet Identity needed
- Admin stats bar: total orders, total revenue, avg order value, pending orders count
- Orders table: customer name, email, phone, items summary, total, date, status badge, action dropdown to change status (Pending → Processing → Shipped → Fulfilled → Cancelled)
- Filter bar: filter orders by status (All / Pending / Processing / Shipped / Fulfilled / Cancelled)
- Top Products widget: derived from order data, ranked by units sold
- Recent Activity feed: last 5 orders as a live mini-feed on the right side
- Quick-copy buttons next to customer email and shipping address
- Newsletter subscriber count card (calls `getNewsletterEmails()` for count)
- Responsive layout — works on mobile and desktop
- "Back to Store" button linking to `/`

### Modify
- App.tsx: add route handling to show AdminDashboard when path is `/admin`, otherwise show the normal store

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/AdminDashboard.tsx` — full admin UI with password gate, stats, orders table, filters, top products, activity feed
2. Update `src/frontend/src/App.tsx` — check `window.location.pathname === '/admin'` and render `<AdminDashboard />` instead of the normal store
3. Use existing backend APIs via `useActor` hook — `getAllOrders()`, `updateOrderStatus()`, `getNewsletterEmails()`
4. No new backend changes needed — all APIs already exist
