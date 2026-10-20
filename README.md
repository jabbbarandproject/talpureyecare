# Talpur Eye Care — Ophthalmology Clinic & Optical Shop

A full React.js e-commerce + clinic website for **Talpur Eye Care**. Patients can book eye exams and other services, browse a catalog of prescription glasses, sunglasses, contact lenses and accessories, and complete a full cart → slide-out drawer → checkout → confirmation flow. The storefront is now backed by a real lightweight REST API (Express + a JSON-file database) instead of only static mock data.

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend build tool | [Vite](https://vitejs.dev/) |
| UI library | React 19 (functional components + hooks) |
| Routing | React Router v7 (`react-router-dom`) |
| Global state | [Zustand](https://github.com/pmndrs/zustand) + `persist` middleware (cart/orders/appointments persisted to localStorage) |
| Styling | Plain **CSS Modules** per component/page + a shared design-token stylesheet (`src/styles/tokens.css`) and global utility classes (`src/styles/base.css`) |
| Notifications | `react-hot-toast` |
| Fonts | Google Fonts — Fraunces (display) + Plus Jakarta Sans (body) |
| Icons | [`react-icons`](https://react-icons.github.io/react-icons/) — Feather icon set (`react-icons/fi`), used everywhere in place of emoji glyphs |
| Product imagery | Hand-built, reusable **SVG glasses illustrations** (vector line-art, recolored per product) — see [Product Imagery](#product-imagery) below |
| **Backend** | **Node.js + Express**, JSON-file database via [`lowdb`](https://github.com/typicode/lowdb) (`server/`) |

No real database server, no real payment gateway. Product catalog, orders, appointments, and contact messages are now served by a real HTTP API and persisted to a JSON file on disk (`server/data/db.json`) — cart contents remain in the browser's `localStorage` (that's standard e-commerce practice; the cart is a draft until checkout creates the order on the server).

## Folder Structure

```
eyecare-ecommerce/
├── index.html                  # HTML shell, Google Fonts, favicon, meta tags
├── public/
│   ├── eye-icon.svg            # Favicon (teal/purple gradient eye-and-wave)
│   └── talpur-eyecare-logo.jpg # Apple touch icon / logo asset copy
├── server/                      # ── Backend (Express API) ──
│   ├── package.json
│   ├── index.js                 # All REST routes
│   ├── db.js                    # lowdb JSON-file database wrapper + seeding
│   └── data/
│       ├── seed-products.js     # 27-product seed catalog
│       └── db.json              # Runtime JSON "database" (gitignored, auto-created)
├── src/
│   ├── main.jsx                 # App entry, BrowserRouter mount
│   ├── App.jsx                  # Route table, Header/Footer shell, Toaster, CartDrawer
│   ├── assets/brand/
│   │   └── talpur-eyecare-logo.jpg  # Brand logo (header + favicon source)
│   ├── components/              # Reusable UI
│   │   ├── Header.jsx                # Sticky header: logo, nav, search, cart icon
│   │   ├── Footer.jsx
│   │   ├── Logo.jsx                  # Renders the real logo image + wordmark
│   │   ├── CartDrawer.jsx            # ⭐ Slide-out cart panel (see below)
│   │   ├── StyleFilterBar.jsx        # ⭐ Shop-by-style chip bar
│   │   ├── ProductCard.jsx
│   │   ├── ProductCardSkeleton.jsx
│   │   ├── StarRating.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── glasses-svg/              # ⭐ Reusable SVG glasses illustration set
│   │       ├── shapes.jsx            # 10 frame-shape SVG components (tintable)
│   │       ├── ProductGlassesImage.jsx   # Product-image wrapper (grid/detail sizing)
│   │       └── ProductGlassesImage.module.css
│   ├── pages/                   # One file (+ CSS module) per route
│   │   ├── Home.jsx / .module.css
│   │   ├── Services.jsx / .module.css
│   │   ├── BookAppointment.jsx / .module.css   — now POSTs to the backend
│   │   ├── Shop.jsx / .module.css              — now fetches from the backend
│   │   ├── ProductDetail.jsx / .module.css     — now fetches from the backend
│   │   ├── Cart.jsx / .module.css
│   │   ├── Checkout.jsx / .module.css          — now POSTs orders to the backend
│   │   ├── OrderConfirmation.jsx / .module.css
│   │   ├── About.jsx / .module.css
│   │   ├── Contact.jsx / .module.css           — now POSTs to the backend
│   │   └── NotFound.jsx / .module.css
│   ├── store/                   # Zustand stores
│   │   ├── useCartStore.js          # cart items, promo codes, totals (persisted)
│   │   ├── useCartDrawerStore.js    # ⭐ drawer open/close UI state (not persisted)
│   │   ├── useOrdersStore.js        # local order history cache (persisted)
│   │   └── useAppointmentsStore.js  # local appointment cache (persisted)
│   ├── data/                    # Non-product mock data + small helpers
│   │   ├── products.js          # Filter-option constants + pure helpers (catalog itself is server-side now)
│   │   ├── services.js          # 8 ophthalmology services + booking doctor list
│   │   ├── doctors.js           # 3 doctor profiles for the About page
│   │   └── testimonials.js      # Patient testimonials + trust badges
│   ├── styles/
│   │   ├── tokens.css           # Design tokens: color, type, spacing, shadows
│   │   └── base.css             # Resets, layout helpers, buttons, forms, cards
│   └── utils/
│       ├── api.js               # ⭐ Fetch client for the backend (products/orders/appointments/contact)
│       ├── useProducts.js       # ⭐ useProducts / useProduct / useRelatedProducts hooks
│       ├── format.js            # Price formatting, mock order/appointment IDs
│       └── useSimulatedLoading.js
└── README.md
```

## Getting Started

This project has **two halves that run as separate processes**: the Vite frontend (`localhost:5173`) and the Express backend (`localhost:3001`, configurable).

### 1. Install dependencies (both halves)

```bash
npm install --include=dev        # frontend (project root)
npm run server:install           # backend (installs server/ deps)
```

> If your shell has `NODE_ENV=production` set globally, `npm install` will skip devDependencies (including Vite itself). The `--include=dev` flag above forces them to install regardless.

### 2. Run both servers together

```bash
npm run dev:all
```

This uses `concurrently` to run the Vite dev server and the Express API side-by-side in one terminal (color-coded `WEB` / `API` log prefixes).

**— or run them separately in two terminals** (equally supported, useful for separate log streams):

```bash
# terminal 1
npm run server      # starts the Express API on http://localhost:3001

# terminal 2
npm run dev          # starts the Vite dev server on http://localhost:5173
```

Visit `http://localhost:5173`. The frontend talks to the backend at `http://localhost:3001` by default; override with `VITE_API_URL` (see `.env.example`) if you run the API on a different port/host.

### 3. Building for production (frontend)

```bash
npm run build
```

Output is written to `dist/`. This has been verified to build cleanly with no errors (see **Verification** below). Preview locally with `npm run preview`. The backend (`server/`) is a plain Node process — run it with `npm run server` (or `node server/index.js`) wherever you deploy it; it does not need a build step.

## Backend Architecture

The `server/` folder is a small, dependency-light Express API:

- **Data layer:** [`lowdb`](https://github.com/typicode/lowdb) reading/writing a single JSON file (`server/data/db.json`). No Postgres/Mongo/SQLite setup required — the file is created and seeded automatically on first run from `server/data/seed-products.js` (27 products).
- **CORS:** enabled for all origins so the Vite dev server can call the API freely during development.
- **Validation:** each `POST` route does basic required-field / email-format / payload-shape validation and returns `400` with a descriptive `{ error }` message on failure.
- **IDs:** orders get `TLP-XXXXXXXX` ids, appointments get `APT-XXXXX` ids — generated server-side so the frontend never has to invent canonical identifiers.

### API Endpoint Reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check — returns `{ status: "ok", ... }` |
| `GET` | `/api/products` | List products. Query params: `category`, `frameShape`, `gender` (comma-separated for multiple values), `priceMin`, `priceMax`, `search`, `sort` (`popularity` \| `price-asc` \| `price-desc` \| `rating`) |
| `GET` | `/api/products/:id` | Fetch a single product by id. `404` if not found |
| `POST` | `/api/orders` | Create an order. Body: `{ items[], shippingAddress, paymentMethod, discount?, shipping?, promoCode? }`. Returns the persisted order with a generated `id` |
| `GET` | `/api/orders/:id` | Fetch a single order by id |
| `POST` | `/api/appointments` | Book an appointment. Body: `{ fullName, phone, email, date, time, serviceId, serviceName?, doctorId?, doctorName?, reason?, notes? }` |
| `GET` | `/api/appointments` | List all booked appointments (used for admin/debugging — no auth in this demo) |
| `POST` | `/api/contact` | Submit a contact-form message. Body: `{ name, email, message }` |

All list/detail `GET` responses are wrapped as `{ products: [...], total }` / `{ product }` / `{ order }` / `{ appointment }` / `{ appointments }` for consistency.

### Frontend ↔ Backend wiring

- `src/utils/api.js` — thin `fetch` wrapper with a friendly connection-error message if the backend isn't running.
- `src/utils/useProducts.js` — `useProducts(filters)` / `useProduct(id)` / `useRelatedProducts(product)` hooks wrap the API calls with `loading` / `error` state, reused across Home, Shop, and Product Detail.
- **Shop** page filters/sorts are sent as query params to `GET /api/products` — filtering happens server-side, not just in a client-side `useMemo` anymore.
- **Checkout** → `POST /api/orders`, **Book an Eye Exam** → `POST /api/appointments`, **Contact** → `POST /api/contact`. Each page still keeps a local Zustand-persisted copy of what it just created (so Order Confirmation / local history work instantly), but the source of truth and the generated IDs come from the server.
- **Cart** is the one piece of state that intentionally stays frontend-only in `localStorage` (via `useCartStore`) — it's a draft/session concept, not a persisted business record, which matches how most real storefronts treat an unauthenticated cart.

## Design System — "Aurora Optic" (Gold + Blue + White Rebrand)

Originally launched with a teal/purple palette; **re-themed to Gold + Blue + White** for a more premium, optical/medical feel — deep navy blue as the primary dark color, a rich gold/amber as the accent, and white/off-white as the background (the classic "premium optician" look). The "TALPUR EYE CARE" logo artwork itself (`src/assets/brand/talpur-eyecare-logo.jpg`) was left untouched — only the surrounding UI chrome (header, buttons, links, badges, footer, hover states, cart drawer, etc.) was re-themed to harmonize with it.

**Color palette** (`src/styles/tokens.css`):

- **Deep navy blue** (`#0D2137`, `#0A1A2B` family) — primary brand color, used for the header, hero banners, primary buttons, and body text accents.
- **Gold / amber** (`#C9972C` family, `--color-gold-*`) — primary accent (`--accent-primary`), used for CTA buttons, active filter chips, badges, star ratings, and highlights.
- **White / off-white** — background (`--bg-page`, `--bg-surface`), keeps the shop feeling light, clean, and premium rather than cluttered.
- The old `--color-teal-*` / `--color-purple-*` token **names** are kept as thin aliases onto the new navy/gold values (so nothing silently breaks if referenced elsewhere) — new code should prefer `--color-navy-*` / `--color-gold-*` directly.

**Typography** (unchanged from the original build):

- **Fraunces** (variable serif) for all headings/display text.
- **Plus Jakarta Sans** (geometric sans) for body copy and UI.

**Icons:** every emoji glyph previously used as a pseudo-icon (cart, search, star ratings, checkmarks, contact info, service icons, filter chips, close/X, etc.) has been replaced with [`react-icons/fi`](https://react-icons.github.io/react-icons/icons/fi) (Feather icon set) for a consistent, crisp, single-color icon system throughout the app.

## Product Imagery

Since this sandbox has no network image-fetch tools, every product photo is a **hand-built SVG glasses illustration** rather than a stock photo or placeholder:

- `src/components/glasses-svg/shapes.jsx` defines **10 distinct frame-shape vector components** (Round, Rectangle, Cat-Eye, Aviator, Square, Sport Wrap, Rimless, Contact Lens icon, Accessory icon, Kids Round) built on a shared `viewBox="0 0 400 200"` so they stay crisp at any render size. Every shape explicitly draws two clear lens shapes, a visible bridge connecting them, and temple arms extending to both sides, so each illustration unmistakably reads as eyewear at a glance — verified at both grid-thumbnail (~200px) and product-detail (~400px+) render sizes.
- Each shape accepts a `tint` color prop — the seed catalog assigns a different `frameSvg` + `tint` hex per product, so the 27-product grid shows real visual variety instead of 27 identical images.
- Each shape also accepts a `sunglasses` boolean prop: when the product's `category` is `"Sunglasses"`, `ProductGlassesImage` passes `sunglasses={true}` and the lenses render as a **solid tinted fill** (instead of the light outline-only fill used for prescription glasses), so sunglasses are instantly visually distinct from prescription glasses even in the same frame shape.
- `ProductGlassesImage.jsx` wraps a shape in a soft studio-style radial backdrop and exposes `size` (`sm` / `md` / `lg` / `thumb`) and `angle` (0/1/2) props, used for grid thumbnails, the product-detail hero image, and the detail-page "multiple angles" thumbnail row (implemented as subtle scale/rotation variants of the same shape — a reasonable stand-in for multiple real photo angles in a demo).
- Cart, cart-drawer, checkout, and order-confirmation thumbnails all render the same tinted shape component directly (not a cropped image), so the illustration stays sharp at 48px–100% width, and also pass through the `sunglasses` flag (cart items now carry a `category` field for this purpose).

## Slide-Out Cart Drawer

A new quick-access cart layer, in addition to the existing full `/cart` page:

- **Trigger:** clicking the cart icon in the header (from any page), or automatically after clicking "Add to Cart" anywhere (product grid card or product detail page).
- **Behavior:** slides in from the right over a dimmed backdrop; shows line items (SVG thumbnail, name, colorway, price, qty +/- controls, remove), a promo-code input, and a running subtotal.
- **Actions:** "View Full Cart" navigates to the full `/cart` page; "Checkout" navigates straight to `/checkout`.
- **Closing:** backdrop click, the ✕ button, or the <kbd>Escape</kbd> key (keyboard listener is only attached while the drawer is open).
- **Mobile:** the drawer becomes full-viewport-width below 560px instead of a fixed 420px panel.
- **State:** managed by a small non-persisted Zustand store (`useCartDrawerStore`) separate from the persisted cart data (`useCartStore`) — drawer visibility shouldn't survive a page reload, cart contents should.
- **Toast coordination:** while the drawer is open, `react-hot-toast` notifications move from top-right to top-center so they don't visually collide with the drawer's own header/close button (both would otherwise anchor to the same corner).

## Shop-by-Style Filtering

A chip-style filter bar above the Shop grid (`StyleFilterBar.jsx`) lets shoppers jump straight to a frame **style** (Aviator, Round, Cat-Eye, Square, Rectangle, Sport Wrap, Rimless) or a top-level **category** (Contact Lenses, Accessories) with one click — in the spirit of "shop by brand" chip bars on reference optical sites, but organized by original style descriptors since this catalog intentionally avoids real trademarked brand names (see [Product Catalog](#product-catalog) below). The full filter sidebar (category / frame shape / gender / max price / sort) remains available alongside it for more granular filtering.

## Product Catalog

27 products across four categories, migrated from the original 16-product mock catalog and expanded with ~11 new SKUs for a richer, more realistic optical-store feel:

- **Prescription Glasses** (11): round, rectangle, cat-eye, square, aviator, rimless, and two kids' frames.
- **Sunglasses** (8): aviator, cat-eye, square, round, sport-wrap, including a kids' sport style.
- **Contact Lenses** (5): daily disposable, monthly, toric (astigmatism), multifocal, and a cosmetic-tint daily lens.
- **Accessories** (3): cleaning kit, hardshell case, anti-fog wipes.

Style names are original/generic (e.g. "Aviator Classic", "Bold Cat-Eye", "Sport Wrap") — **no real trademarked brand names** (Ray-Ban, Gucci, etc.) are used anywhere in the catalog, per the project's content guidelines. Some products carry an optional `styleInspiration` flavor-text field (e.g. _"Aviator Classic — original pilot shape"_) purely as descriptive color, not a brand claim.

## Core Functionality Implemented

- **Routing:** 11 routes via React Router v7, including a dynamic `/shop/:productId` and a catch-all 404.
- **Backend-driven catalog:** Shop filtering/sorting and Product Detail both hit the real Express API; Home's "Featured" section is the top-4-by-popularity products fetched live.
- **Cart:** Zustand store (`useCartStore`) persisted to `localStorage`. Supports add/update-qty/remove, live navbar badge, derived subtotal/discount/shipping/total getters, and now a slide-out drawer in addition to the full `/cart` page.
- **Promo codes:** `EYECARE10` (10% off) and `TALPUR20` (20% off) are hardcoded in `useCartStore.js`.
- **Checkout validation:** required-field checks, email regex, phone-length check, 16-digit card number (auto-formatted into groups of 4), MM/YY expiry format + expiry-date check, 3–4 digit CVV — all with inline error messages. "Cash on Delivery" skips card fields entirely. Submitting now `POST`s to `/api/orders` and uses the server-generated order id.
- **Appointment booking:** separate form + validation, now `POST`s to `/api/appointments`.
- **Contact form:** now `POST`s to `/api/contact`.
- **Search:** header search bar and an in-page Shop search both filter the catalog via the backend's `search` query param.
- **Filtering & sorting:** category, frame shape, gender, max-price-range filters, style-chip quick filters, plus sort by popularity/price/rating — all now computed server-side.
- **Responsive design:** flexbox/grid layouts with breakpoints at ~960px and ~640px across every page; header collapses into a slide-down mobile menu; Shop filters collapse into a toggle panel on mobile; the cart drawer becomes full-width below 560px.
- **Polish:** shimmer skeleton loaders (now driven by real fetch `loading` state instead of a fake timer on Shop/Product Detail; Home still uses a short simulated delay for its hero reveal), hover-lift + image-zoom on product cards, floating animated badges on the hero, and `react-hot-toast` notifications for cart/checkout/booking/contact actions.

## Mock / Demo Limitations

This is still a **demo-quality storefront**, not a production system. Be aware of:

- **JSON-file database, not a real DB** — `server/data/db.json` is a single file written with `lowdb`. Fine for a demo; would need a real database (Postgres, etc.) and concurrency handling for production traffic.
- **No real payment processing** — the card form validates format only (length/regex); no PCI-compliant gateway (Stripe, etc.) is integrated. Submitting "places" a mock order after the backend validates and persists it.
- **No authentication** — there's no login/account system, and the backend has no auth middleware; `GET /api/appointments` is open (meant for local admin/debugging only, not production-safe as-is).
- **No real inventory/stock tracking** — quantities are not checked against any stock limit.
- **Illustrated, not photographed, products** — every product image is an SVG line-art illustration (see [Product Imagery](#product-imagery)), not real product photography.
- **No real map** — the Contact page uses a styled placeholder box instead of an embedded Google/Mapbox map (to avoid requiring an API key).
- **No email/SMS confirmations** — "booking confirmed" and "order placed" states are shown in-app only; no real email is sent, even though the backend now really does persist the request.
- **Reviews are synthetic** — product review text/names on the Product Detail page are deterministically generated from the product's mock rating, not real customer data.
- **No HTTPS/production hardening on the backend** — `server/index.js` is a plain `http` Express app meant for local development; it has no rate limiting, request size limits beyond Express defaults, or production CORS allowlisting.

## Verification Performed

1. **Backend:** `npm run server:install` then `npm run server` — Express starts and responds on `:3001`; `GET /api/health`, `GET /api/products` (with `category`/`sort` filters), `GET /api/products/:id`, and `POST` to `/api/orders`, `/api/appointments`, `/api/contact` were all exercised via `curl` and returned correct `200`/`201` responses with the expected JSON shapes.
2. **Frontend install & build:** `npm install --include=dev` succeeds; `npm run build` **succeeds with zero errors** (clean Vite production build).
3. **Both servers running together**, then an automated Playwright smoke test against the live Vite dev server covering: Home (new logo/branding visible) → Shop (products load from the backend API — confirmed via network-request assertions, not just static JSON) → style filter chips → Product Detail (SVG glasses image renders) → Add to Cart from the grid **and** from the detail page (drawer auto-opens both times) → qty +/- in the drawer → promo code applied in the drawer → Checkout (drawer → full form fill → `POST /api/orders` confirmed via network assertion) → Order Confirmation (shows the real order id) → Book an Eye Exam (`POST /api/appointments` confirmed) → Contact form (`POST /api/contact` confirmed) → mobile viewport check (drawer goes full-width). **Result: 21/21 automated checks passed, zero browser console errors.**
4. One real bug found and fixed during this pass: the cart drawer's header/close-button briefly sat behind the top-right toast notification (both anchored to the same corner). Fixed by moving toasts to `top-center` while the drawer is open, and raising the drawer's `z-index` above the toast layer as a backstop.
5. **Bug-fix + refinement pass** (this round): re-verified backend + frontend start-up, re-themed to Gold + Blue + White, replaced all emoji icons with `react-icons`, clarified the glasses/sunglasses SVG illustrations, and re-ran the full cart → checkout → order flow plus Book an Eye Exam and Contact form end to end via Playwright against the live dev servers. **Result: every step passed (Home, Shop 27/27 cards, grid add-to-cart, detail-page qty + add-to-cart, promo code, checkout → `POST /api/orders` 201, Order Confirmation with real `TLP-…` id, Book an Eye Exam → `POST /api/appointments` 201 with real `APT-…` id, Contact → `POST /api/contact` 201), zero browser console errors.**

## Known Issues Fixed

- **"Product cards not displaying" on the Shop page** — root cause: the Express backend (`server/`) was not running. The frontend's `fetch` to `GET /api/products` fails with a network-level `ERR_CONNECTION_REFUSED` when the API isn't up (confirmed by deliberately stopping the backend and reloading `/shop` — the grid renders zero cards and the app falls back to its "Couldn't load products" empty state, by design, with no card markup at all). The frontend code itself (`Shop.jsx`, `ProductCard.jsx`, `useProducts.js`, `api.js`) was already correct — field names (`id`, `frameSvg`, `tint`, etc.) match between the backend response shape and what the components expect, and `VITE_API_URL` / CORS were already configured correctly. **Fix:** confirmed the correct startup sequence (`npm run server:install && npm run server` for the API, `npm install --include=dev && npm run dev` for the frontend — or `npm run dev:all` to run both together) and re-verified that with both processes running, all 27 products render correctly on Shop and Home with images, names, prices, and working "Add to Cart" on every card. If this happens again, the first thing to check is whether `:3001` is actually listening (`curl http://localhost:3001/api/health`).

## Suggested Next Step

Deploy it live via the **AgentBase** skill — the frontend builds to a static `dist/` (deploys cleanly as a static site), and the `server/` Express API can run as a small Node service alongside it (e.g. on Render.com, the platform AgentBase is backed by) with `VITE_API_URL` pointed at the deployed API's public URL.
