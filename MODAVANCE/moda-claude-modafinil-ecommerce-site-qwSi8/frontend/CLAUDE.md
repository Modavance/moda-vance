# Modavance — Claude Code Project Guide

> This file is for Claude Code. It describes the project so future sessions can orient quickly.

## Quick Start

```bash
cd /home/user/moda/frontend
npm run dev        # Dev server (Vite, http://localhost:5173)
npm run build      # Production build → dist/
npm test           # Vitest watch mode
npm run test:run   # Single test run
npm run deploy     # Build + deploy to Cloudflare Pages
```

## What This Project Is

**Modavance** is a modafinil/armodafinil e-commerce store. Frontend-only (no backend), all data in the browser via IndexedDB (Dexie.js). Deployed to Cloudflare Pages.

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| UI | React | 19 |
| Language | TypeScript | ~5.9 |
| Bundler | Vite | 8 |
| Routing | React Router DOM | 7 |
| State | Zustand (with persist) | 5 |
| Server state | TanStack React Query | 5 |
| DB | Dexie.js (IndexedDB) | 4 |
| Forms | React Hook Form + Zod | 7 / 4 |
| Styling | Tailwind CSS | 4 |
| Icons | Lucide React | latest |
| Charts | Recharts | 3 |
| Animations | Framer Motion | 12 |
| UI Primitives | Radix UI (accordion, dialog, select, tabs, toast, dropdown-menu) | latest |
| Tests | Vitest + @testing-library/react + fake-indexeddb | 4 |

---

## Folder Structure

```
/home/user/moda/
├── backend/                     ← reserved for future backend
├── frontend/                    ← app root (this file: frontend/CLAUDE.md)
│   ├── package.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── wrangler.toml            ← Cloudflare Pages config
│   ├── index.html
│   └── src/
│       ├── main.tsx             ← entry point
│       ├── App.tsx              ← QueryClientProvider + RouterProvider
│       ├── router/
│       │   └── index.tsx        ← all routes (see Routes section)
│       ├── types/
│       │   └── index.ts         ← all TypeScript interfaces
│       ├── db/
│       │   ├── database.ts      ← Dexie DB class (v4 schema)
│       │   └── seed.ts          ← seeds products/blog/faq on first load
│       ├── store/               ← Zustand stores
│       │   ├── adminStore.ts    ← admin auth, email/password change
│       │   ├── authStore.ts     ← user auth (login, register)
│       │   ├── cartStore.ts     ← cart items, coupon, persisted
│       │   └── notificationStore.ts ← toast notification helpers
│       ├── services/            ← DB query helpers
│       │   ├── productService.ts
│       │   ├── orderService.ts
│       │   └── authService.ts
│       ├── hooks/
│       │   └── useRecentlyViewed.ts  ← localStorage, tracks viewed product IDs
│       ├── utils/
│       │   ├── cn.ts            ← clsx + tailwind-merge
│       │   └── formatters.ts    ← formatPrice, formatDate, slugify, etc.
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Layout.tsx         ← wraps public pages (Header + Outlet + Footer)
│       │   │   ├── Header.tsx
│       │   │   ├── Footer.tsx
│       │   │   └── CartDrawer.tsx
│       │   ├── admin/
│       │   │   └── AdminLayout.tsx    ← sidebar + NotificationBell + ProfileMenu
│       │   ├── home/
│       │   │   ├── Hero.tsx
│       │   │   ├── Features.tsx
│       │   │   ├── HowItWorks.tsx
│       │   │   ├── Testimonials.tsx
│       │   │   ├── TrustSection.tsx
│       │   │   └── NewsletterSection.tsx
│       │   ├── shop/
│       │   │   └── ProductCard.tsx
│       │   └── ui/
│       │       ├── Badge.tsx
│       │       ├── Button.tsx
│       │       ├── Input.tsx
│       │       ├── Logo.tsx
│       │       ├── Notifications.tsx  ← toast system
│       │       ├── Spinner.tsx
│       │       └── StarRating.tsx
│       ├── pages/               ← public pages
│       │   ├── HomePage.tsx
│       │   ├── ShopPage.tsx
│       │   ├── ProductPage.tsx
│       │   ├── CartPage.tsx
│       │   ├── CheckoutPage.tsx
│       │   ├── OrderSuccessPage.tsx
│       │   ├── OrderDetailPage.tsx
│       │   ├── TrackOrderPage.tsx     ← /track — no login required
│       │   ├── AccountPage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── AboutPage.tsx
│       │   ├── FAQPage.tsx
│       │   ├── ContactPage.tsx
│       │   ├── BlogPage.tsx
│       │   ├── BlogPostPage.tsx
│       │   ├── PrivacyPage.tsx
│       │   ├── TermsPage.tsx
│       │   ├── NotFoundPage.tsx
│       │   ├── OrderConfirmationPage.tsx
│       │   ├── admin/
│       │   │   ├── AdminLoginPage.tsx
│       │   │   ├── AdminDashboard.tsx
│       │   │   ├── AdminOrdersPage.tsx    ← status change + confirmation dialog + timeline log
│       │   │   ├── AdminProductsPage.tsx  ← multi-image support
│       │   │   ├── AdminCustomersPage.tsx
│       │   │   ├── AdminCouponsPage.tsx
│       │   │   ├── AdminAnalyticsPage.tsx
│       │   │   ├── AdminBlogPage.tsx
│       │   │   ├── AdminFAQPage.tsx
│       │   │   ├── AdminContactPage.tsx
│       │   │   ├── AdminSettingsPage.tsx
│       │   │   └── AdminProfilePage.tsx   ← email + password change
│       │   └── __tests__/
│       │       ├── couponValidation.test.ts
│       │       └── shopSort.test.ts
│       ├── services/__tests__/
│       │   ├── productService.test.ts
│       │   ├── orderService.test.ts
│       │   └── orderStatusLog.test.ts
│       ├── store/__tests__/
│       │   └── adminStore.test.ts
│       ├── utils/__tests__/
│       │   └── formatters.test.ts
│       └── test/
│           └── setup.ts         ← @testing-library/jest-dom + fake-indexeddb/auto
```

---

## Routes

### Public (wrapped in `<Layout>`)

| Path | Component | Notes |
|---|---|---|
| `/` | `HomePage` | Featured products + Recently Viewed |
| `/shop` | `ShopPage` | Filter/sort/search |
| `/products/:slug` | `ProductPage` | Tracks view in localStorage |
| `/cart` | `CartPage` | |
| `/checkout` | `CheckoutPage` | Requires items in cart |
| `/track` | `TrackOrderPage` | No login required |
| `/order-confirmation/:orderId` | `OrderSuccessPage` | After checkout |
| `/orders/:orderId` | `OrderDetailPage` | Order status + items |
| `/account` | `AccountPage` | Login required |
| `/about` | `AboutPage` | |
| `/faq` | `FAQPage` | |
| `/contact` | `ContactPage` | |
| `/blog` | `BlogPage` | |
| `/blog/:slug` | `BlogPostPage` | |
| `/privacy` | `PrivacyPage` | |
| `/terms` | `TermsPage` | |

### Auth (no Layout)

| Path | Component |
|---|---|
| `/login` | `LoginPage` |
| `/register` | `RegisterPage` |
| `/admin/login` | `AdminLoginPage` |

### Admin (guarded by `AdminGuard`, wrapped in `<AdminLayout>`)

| Path | Component |
|---|---|
| `/admin` | `AdminDashboard` |
| `/admin/orders` | `AdminOrdersPage` |
| `/admin/products` | `AdminProductsPage` |
| `/admin/customers` | `AdminCustomersPage` |
| `/admin/coupons` | `AdminCouponsPage` |
| `/admin/analytics` | `AdminAnalyticsPage` |
| `/admin/blog` | `AdminBlogPage` |
| `/admin/faq` | `AdminFAQPage` |
| `/admin/contact` | `AdminContactPage` |
| `/admin/settings` | `AdminSettingsPage` |
| `/admin/profile` | `AdminProfilePage` |

Default admin credentials: `admin@modavance.com` / `admin123`

---

## Database Schema (Dexie v4)

Database name: `ModavanceDB`

| Table | Primary Key | Indexes |
|---|---|---|
| `products` | `id` | `slug, category, brand, featured, inStock` |
| `orders` | `id` | `userId, status, createdAt` |
| `users` | `id` | `email` |
| `reviews` | `id` | `productId, userId, rating` |
| `blogPosts` | `id` | `slug, category` |
| `coupons` | `code` | — |
| `faqItems` | `id` | `section` |
| `contactSubmissions` | `id` | `createdAt` |
| `settings` | `key` | — |
| `orderStatusLogs` | `id` | `orderId, changedAt` |

### Key TypeScript types (src/types/index.ts)

- `Product` — id, name, slug, brand, category, strength, pillsPerStrip, image, **images[]** (multi-image), variants[], featured (boolean), inStock (boolean), ...
- `ProductVariant` — id, quantity (pills), price (USD), originalPrice?, savings?, label?
- `Order` — id (`ORD-{timestamp}-{random}`), userId, items[], status, subtotal, shipping, discount, total, shippingAddress, paymentMethod, trackingNumber?, estimatedDelivery?, createdAt, updatedAt
- `OrderStatus` — `'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'`
- `OrderStatusLog` — id, orderId, fromStatus (null = creation), toStatus, changedAt, note?
- `Coupon` — code, discount, type (`'percent' | 'fixed'`), minOrder, expiresAt
- `ContactSubmission` — id, name, email, subject, message, **read** (boolean), createdAt
- `PaymentMethod` — `'bitcoin' | 'ethereum' | 'zelle' | 'bill'`

---

## State Management

### Zustand Stores

**`cartStore`** (persisted as `modavance-cart`)
- `items: CartItem[]`, `couponCode?`, `discount?`
- Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `applyCoupon`, `removeCoupon`

**`authStore`** (persisted as `modavance-auth`)
- `user: User | null`, `isAuthenticated`
- Actions: `login`, `logout`, `register`, `updateAddress`

**`adminStore`** (persisted as `modavance-admin`)
- `isAuthenticated`, `email`, `password`
- Actions: `login(password)→boolean`, `logout`, `changePassword(current,next)→boolean`, `changeEmail(email)`

**`notificationStore`**
- Toast notifications (success, error, info, warning)
- Used everywhere as `const notify = useNotificationStore(...)`

---

## Key Patterns & Gotchas

### Dexie boolean fields
**DO NOT** use `.where('featured').equals(1)` — Dexie v4 doesn't coerce. Use:
```ts
db.products.filter(p => p.featured === true).toArray()
```

### Dexie sort + reverse
**DO NOT** chain `.reverse().sortBy()` — throws error. Use:
```ts
db.orders.where('userId').equals(id).sortBy('createdAt').then(r => r.reverse())
```

### Checkout race condition (useRef guard)
After `clearCart()` + `navigate()`, React batches the state update causing `items.length === 0` guard to fire before navigation. Fix: `const orderPlaced = useRef(false)` set to `true` before clearing:
```ts
const orderPlaced = useRef(false);
// guard:
if (items.length === 0 && !orderPlaced.current) { navigate('/shop'); return null; }
// in submit:
orderPlaced.current = true;
clearCart();
navigate(`/order-confirmation/${order.id}`);
```

### Recently Viewed (localStorage)
Key: `modavance-recently-viewed`, max 8 IDs.
- Write: `trackProductView(productId)` — call in ProductPage useEffect
- Read: `getRecentlyViewedIds()` — used by HomePage RecentlyViewedSection

### Admin notification bell (localStorage)
Orders "seen at" timestamp: key `modavance-orders-seen-at` (ISO string).
Bell combines contact submissions (unread from DB) + new orders (createdAt > seenAt).
Mark all read: updates `contactSubmissions.read = true` in DB + sets new seenAt timestamp.

### Coupon validation (CheckoutPage)
Check expiry BEFORE applying:
```ts
if (new Date(coupon.expiresAt) < new Date()) { notify.error('This coupon has expired'); return; }
```

### Order ID format
`ORD-{Date.now()}-{Math.random().toString(36).slice(2,7).toUpperCase()}`
Example: `ORD-1718123456789-ABC12`

### Shipping logic
- subtotal >= $150 → free shipping
- subtotal < $150 → $9.99 shipping
- total = subtotal - discount + shipping

---

## Tests (70 tests across 7 files)

| File | What it tests |
|---|---|
| `src/services/__tests__/productService.test.ts` | getFeatured boolean, getBySlug, getAll, getByCategory, search |
| `src/services/__tests__/orderService.test.ts` | create (fields/shipping/discount/IDs), getByUser (sort), getById |
| `src/services/__tests__/orderStatusLog.test.ts` | persist, query by orderId, sort, note, null fromStatus, full flow |
| `src/store/__tests__/adminStore.test.ts` | login, logout, changePassword scenarios, changeEmail |
| `src/utils/__tests__/formatters.test.ts` | formatPrice, formatPricePerPill, formatDate, slugify |
| `src/pages/__tests__/couponValidation.test.ts` | expiry, minOrder, percent/fixed discount math |
| `src/pages/__tests__/shopSort.test.ts` | sort logic, filter, no-crash with empty variants |

Run: `cd frontend && npm run test:run`

---

## Admin Features Summary

- **Orders**: view all orders, change status via dropdown or modal buttons, confirmation dialog (shows from→to, red warning for cancellation, optional note field), status change timeline log
- **Products**: full CRUD, multi-image support (ImageManager component — first image = main), product cards show image count badge
- **Customers**: view users registered via IndexedDB
- **Coupons**: full CRUD, percent/fixed type, minOrder, expiry date
- **Analytics**: charts (orders, revenue) via Recharts
- **Blog**: full CRUD for blog posts
- **FAQ**: full CRUD for FAQ items by section
- **Contact**: view contact form submissions, mark read
- **Settings**: site settings (stored in `settings` table)
- **Profile** (`/admin/profile`): change email + change password (requires current password)
- **Notification Bell**: shows unread contact messages + new orders since last check
- **Profile Circle**: dropdown menu → My Profile, Settings, View Store, Sign Out

---

## Deployment

Cloudflare Pages via `wrangler`. Config in `wrangler.toml`.
```bash
npm run deploy          # prod
npm run deploy:preview  # preview branch
```
