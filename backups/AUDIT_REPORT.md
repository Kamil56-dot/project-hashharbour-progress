# HASHHARBOUR — COMPREHENSIVE CODEBASE AUDIT & TECHNICAL ASSESSMENT REPORT

**Date of Audit:** September 23, 2026  
**Audit Scope:** Full Project Analysis (`frontend/`, `backend/`, `archive/`, root configuration files)  
**Execution Mode:** Read-Only Audit (Source files preserved; `AUDIT_REPORT.md` created as requested)  
**Operating System:** Windows (PowerShell)  

---

## 1. Project Summary & Architecture Overview

### 1.1 Plain Terms: What HashHarbour Does
**HashHarbour** is a unified digital Export-Import (EXIM) trade and container logistics platform designed to digitize freight forwarding, ISO shipping container management, and maritime logistics.

The platform provides four core capabilities:
1. **Interactive 3D Shipping Container Inspection:** A client-side WebGL 3D model (built with Three.js and React Three Fiber) allowing logistics operators to inspect a 20-foot standard ISO shipping container with 360-degree orbital rotation, interactive color customizations, and procedural ISO 6346 markings/stencils.
2. **Real-Time Multimodal Shipment Tracking:** A shipment tracking modal and backend REST API where users input container tracking numbers (e.g. `HH-100293`, `HH-849201`) to view transit progress percentages, origin/destination ports, vessel names, and estimated times of arrival (ETAs).
3. **EXIM Trade Services Directory:** A showcase of digital trade services (Container Booking, Shipment Tracking, Trade Documentation, Route Management, Customs Compliance) rendered with orthographic 3D container representations.
4. **Global Logistics Network Visualization:** An interactive 3D metallic canvas globe displaying animated trade arcs connecting global ports, accompanied by core architectural trade pillars and platform statistics.

---

### 1.2 Tech Stack

| Layer / Component | Technology & Framework | Version / Configuration | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.2.8` | Component UI tree and reactive state management |
| **Frontend Build Tool** | Vite | `^8.2.0` (`@vitejs/plugin-react` `^6.0.5`) | Fast HMR dev server and Rollup production bundler |
| **Client-Side Routing** | React Router DOM | `^7.18.3` | SPA routing (`/`, `/about`, `/services`, `/container-section`, `/home-preview`) |
| **3D Graphics & Canvas** | Three.js & React Three Fiber | `three` `^0.185.1`, `@react-three/fiber` `^9.7.0`, `@react-three/drei` `^10.7.8` | Real-time WebGL PBR container model rendering and 2D canvas globe |
| **Styling & CSS** | Tailwind CSS | `3.4.19`, `postcss` `8.5.25`, `autoprefixer` `10.5.4` | Utility-first responsive design tokens and glassmorphism styling |
| **Animation & UI Icons** | GSAP & Lucide React | `gsap` `^3.15.0`, `lucide-react` `^1.28.0` | Entrance timelines, staggered text reveals, and UI icons |
| **Backend Framework** | Django | `6.0.6` in `requirements.txt` | REST API backend and ORM data layer |
| **API Framework** | Django REST Framework (DRF) | `>=3.15.0` | ViewSets, ModelSerializers, and JSON API routing |
| **CORS Middleware** | `django-cors-headers` | `>=4.7.0` | Cross-Origin Resource Sharing handling for React SPA |
| **Database** | SQLite 3 | Built-in Python driver (`backend/db.sqlite3`) | Local relational storage with Django ORM migrations |
| **Package Managers** | `npm` (Frontend) / `pip` (Backend) | `package.json` / `requirements.txt` | Dependency manifests for client and server |

---

### 1.3 Folder Structure & Entry Points

```
HashHarbour/
├── .gitignore                                 # Project gitignore rules (logs, venv, node_modules, sqlite3)
├── package-lock.json                          # Stray root npm lockfile (empty packages object)
├── README.md                                  # Project overview and setup instructions
├── AUDIT_REPORT.md                            # Comprehensive technical audit report (this document)
│
├── backend/                                   # Django REST API Backend
│   ├── manage.py                              # Django CLI management entry point
│   ├── seed.py                                # Database seeder script (StatItems, FeatureCards, Shipments)
│   ├── requirements.txt                       # Python dependencies (Django, DRF, django-cors-headers)
│   ├── package-lock.json                      # Stray backend npm lockfile (empty packages object)
│   ├── api/                                   # Core Django REST API application
│   │   ├── apps.py                            # ApiConfig application definition
│   │   ├── models.py                          # StatItem, FeatureCard, Shipment ORM models
│   │   ├── serializers.py                     # DRF ModelSerializers
│   │   ├── urls.py                            # DefaultRouter registering /stats, /features, /shipments
│   │   ├── views.py                           # ReadOnlyModelViewSets & custom track() action
│   │   └── migrations/
│   │       └── 0001_initial.py                # Initial database migration schema
│   └── hashharbour_backend/                   # Django Project Configuration
│       ├── settings.py                        # App settings, CORS, DRF, and database configurations
│       ├── urls.py                            # Root URL routing (/admin/, /api/)
│       └── wsgi.py                            # WSGI deployment application entry point
│
├── frontend/                                  # React 19 + Vite 8 SPA Client
│   ├── package.json                           # Dependencies and scripts (dev, build, preview)
│   ├── package-lock.json                      # NPM lockfile
│   ├── vite.config.js                         # Bundler configuration, path aliases, Rollup chunks
│   ├── tailwind.config.js                     # Design tokens, color palette, responsive breakpoints
│   ├── postcss.config.js                      # PostCSS pipeline (Tailwind, Autoprefixer)
│   ├── index.html                             # SPA HTML entry point (SEO, Google fonts)
│   ├── public/                                # Public static assets (logos, fallback video, images)
│   └── src/
│       ├── main.jsx                           # Application root mount (<BrowserRouter> wrapping <App>)
│       ├── App.jsx                            # Root layout, routing table, suspense fallbacks
│       ├── config/
│       │   └── index.js                       # Environment config (MODE, PROD, DEV)
│       ├── constants/
│       │   ├── navigation.js                  # Nav links and action definitions
│       │   ├── statistics.js                  # Platform statistics constant dataset
│       │   └── taglines.js                    # Rotating hero typewriter slogans
│       ├── hooks/
│       │   ├── useMediaQuery.js               # Responsive matchMedia & desktop video detection
│       │   ├── useReducedMotion.js            # Accessibility prefers-reduced-motion hook
│       │   ├── useScrollPosition.js           # RAF-throttled scroll position hook
│       │   └── useTypewriter.js               # Multi-line looping typewriter hook
│       ├── utils/
│       │   ├── cn.js                          # ClassName merging utility (clsx wrapper)
│       │   ├── accessibility.js               # Keyboard & ARIA accessibility utilities
│       │   └── performance.js                 # RAF throttle and debounce helpers
│       ├── styles/
│       │   ├── index.css                      # CSS custom properties, glassmorphism utilities
│       │   └── animations.css                 # Keyframe animations (float, pulse, sweep)
│       ├── assets/
│       │   ├── fonts/                         # Custom font assets (includes 10.78 MB TTF file)
│       │   ├── icons/                         # SVG icons
│       │   ├── images/                        # Background JPGs and unreferenced PNGs
│       │   └── Videos/                        # Compressed hero background video
│       ├── components/
│       │   ├── layout/                        # Navbar.jsx, NavLinks.jsx, NavActions.jsx, MobileMenu.jsx, Logo.jsx
│       │   ├── home/                          # HomePage.jsx, HomeNavbar.jsx, HomeHero.jsx, HomeContainerSection.jsx, HomeContainerViewer.jsx, HomeStatsBar.jsx
│       │   ├── about/                         # AboutSection.jsx, AboutHero.jsx, AboutNetwork.jsx, AboutGlobeCanvas.jsx, TradePillars.jsx, TrustLayer.jsx, BrandStatement.jsx
│       │   ├── services/                      # ServicesSection.jsx, ServicesHero.jsx, ServicesGrid.jsx, ServiceCard.jsx, StaticServiceContainer.jsx, ServicesWorkflow.jsx, ServicesCTA.jsx
│       │   ├── archived-hero/                 # ArchivedHero.jsx (standalone test preview on /home-preview)
│       │   └── ui/                            # Button.jsx universal primitive
│       └── pages/
│           └── ContainerSection/              # ContainerPage.jsx, ContainerShowcase.jsx, TrackingModal.jsx, 3d/ContainerModel.jsx, 3d/ShippingContainer3D.jsx (plus 10 dead prototype files)
│
└── archive/                                   # Historical Prototypes & Computer Vision Scripts
    ├── about-section-legacy/                  # Earlier isolated About section
    ├── container-section-frontend-prototype/  # Standalone prototype frontend
    └── container-section-tools/               # Python CV & vectorization image processing scripts
```

---

### 1.4 How Data Flows (Frontend -> API -> Database)

```
[User Browser]
      │
      │ 1. User inputs tracking number (e.g. "HH-100293") into TrackingModal.jsx
      │ 2. Clicks "Track Shipment"
      ▼
[React Client: TrackingModal.jsx]
      │
      │ 3. Issues HTTP GET request:
      │    fetch("http://localhost:8000/api/shipments/track/?tracking_no=HH-100293")
      ▼
[Django WSGI Server: port 8000]
      │
      │ 4. Receives request, evaluates CorsMiddleware against CORS_ALLOWED_ORIGINS
      │ 5. Routes request: hashharbour_backend/urls.py -> api/urls.py -> DefaultRouter
      ▼
[DRF ViewSet: api/views.py (ShipmentViewSet.track)]
      │
      │ 6. Extracts query parameter: tracking_no = request.query_params.get('tracking_no')
      │ 7. Executes Django ORM query:
      │    Shipment.objects.get(tracking_number__iexact=tracking_no.strip())
      ▼
[SQLite Database: backend/db.sqlite3]
      │
      │ 8. Executes SQL: SELECT * FROM api_shipment WHERE UPPER(tracking_number) = UPPER('HH-100293')
      │ 9. Returns matching row
      ▼
[DRF Serializer: api/serializers.py (ShipmentSerializer)]
      │
      │ 10. Transforms model instance into JSON:
      │     {
      │       "id": 1,
      │       "tracking_number": "HH-100293",
      │       "status": "In Transit",
      │       "origin": "Shanghai Port, CN",
      │       "destination": "Rotterdam Gateway, NL",
      │       "vessel": "HH Horizon V-402",
      │       "eta": "2026-08-04",
      │       "progress_percent": 68,
      │       "last_update": "Passed Singapore Strait (12:40 UTC)"
      │     }
      ▼
[React Client UI Update: TrackingModal.jsx]
      │
      │ 11. setState(shipmentData) updates state
      │ 12. Renders origin, destination, vessel, ETA badge, and 68% progress bar
```

---

## 2. Comprehensive Findings Table

| ID | Severity | Area | File:Line | Issue Description | Suggested Fix |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | **High** | Bugs / Broken Logic | `frontend/src/pages/ContainerSection/components/3d/ContainerModel.jsx:601-603` | Inside `createServiceSideTexture(...)`, `if (typeof drawHashHarbourSymbol === 'function')` evaluates to `false` because `drawHashHarbourSymbol` was defined as a local inner helper function inside `createISOMarkingsTextures()` (lines 316–422). The brand anchor logo is never drawn on any custom service container side textures. | Move `drawHashHarbourSymbol` up to module scope (outside `createISOMarkingsTextures`) so both texture generators have access to it. |
| **BUG-02** | **Medium** | Bugs / Broken Logic | `frontend/src/components/home/HomeContainerSection.jsx:220, 256, 237-251` | The Chevron Left and Chevron Right carousel buttons below the 3D container viewer have no `onClick` event handlers. Furthermore, the dot indicators hardcode `dot === 0` for active styling instead of binding dynamically to `activeStep`. | Attach `onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}` and `onClick={() => setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1))}` to chevrons, and change `dot === 0` to `dot === activeStep`. |
| **BUG-03** | **Medium** | Bugs / Broken Logic | `frontend/src/components/home/HomeNavbar.jsx:9`, `frontend/src/constants/navigation.js:9, 13-14`, `frontend/src/components/services/ServicesCTA.jsx:34`, `frontend/src/components/archived-hero/HeroActions.jsx:23, 35` | Multiple navigation links and CTA buttons point to non-existent hash anchors: `#routes`, `#login`, `#register`, `#get-started`, `#track`. Clicking them results in a no-op dead link. | Wire hash links to real destination routes (`/services`, `/container-section`), open corresponding modal dialogs, or add matching DOM element IDs. |
| **BUG-04** | **Low** | Bugs / Broken Logic | `frontend/src/pages/ContainerSection/components/ContainerShowcase.jsx:115-122, 214-222` | Two identical "Book My Container" buttons are rendered simultaneously within the same desktop viewport (one in the left column under features, one below the color palette). | Remove the redundant second button on desktop viewports or condition it exclusively for mobile layouts. |
| **BUG-05** | **Low** | Bugs / Broken Logic | `frontend/src/components/home/HomeHero.jsx:21-33` | The `<video>` element specifies both `src={heroVideo}` directly on the video tag and a nested `<source src={heroVideo} type="video/mp4" />`, violating HTML5 best practices and triggering browser console warnings. | Remove the `src` attribute from the `<video>` tag and keep only the inner `<source>` tag. |
| **BUG-06** | **Medium** | Bugs / Broken Logic | `frontend/src/pages/ContainerSection/components/TrackingModal.jsx:28-41` | When an API request fails or the Django backend is offline, any tracking query starting with "HH" silently catches the error and returns hardcoded demo data ("Rotterdam Gateway, NL", 68% progress). This silently masks network/server failures from users. | Display an explicit error alert when the API fails rather than fabricating mock data under silent exception capture. |
| **BUG-07** | **Low** | Bugs / Broken Logic | `frontend/src/pages/ContainerSection/components/TypewriterTagline.jsx:24-28` | An unhandled inner `setTimeout` is fired without cleanup upon component unmount, causing state updates on unmounted component. Additionally, when reaching the final line, `isDeleting` is never set, permanently freezing the animation. | Store the timeout in a `useRef` hook, clear it in the `useEffect` cleanup function, and ensure the loop wraps correctly. |
| **BUG-08** | **Medium** | Bugs / Broken Logic | `README.md:50-55` & `backend/seed.py:15-18` | `README.md` instructs users to run `python seed.py` directly without running `python manage.py migrate`. Since `backend/db.sqlite3` is gitignored and does not exist upon initial clone, running `python seed.py` immediately crashes with `OperationalError: no such table: api_statitem`. | Update `README.md` to include `python manage.py migrate` before `python seed.py`. |
| **BUG-09** | **Medium** | Bugs / Broken Logic | `frontend/src/pages/ContainerSection/` (10 Orphaned Files) | 10 dead prototype files reside in the active `src/pages/ContainerSection/` directory: `App.jsx`, `main.jsx`, `index.css`, `HeroSection.jsx`, `BadgePill.jsx`, `FeatureCards.jsx`, `Navbar.jsx`, `ScrollIndicator.jsx`, `StatsBar.jsx`, `TypewriterTagline.jsx`. None are imported by `ContainerPage.jsx`. | Archive or delete these unused prototype components from the active source tree to eliminate confusion and dead weight. |
| **BUG-10** | **Low** | Bugs / Broken Logic | `frontend/src/components/about/TradeEcosystem.jsx` & `TradeJourney.jsx` | Both components (~260 LOC) exist in `src/components/about/` but are never imported or rendered anywhere in the application. | Either integrate them into `AboutSection.jsx` or remove them to maintain a clean codebase. |
| **AUTH-01** | **High** | Auth & Permissions | `backend/api/views.py:17-19` & `backend/hashharbour_backend/settings.py:93-95` | `ShipmentViewSet` inherits `ReadOnlyModelViewSet` under default `AllowAny` permissions. Any anonymous caller can execute `GET /api/shipments/` and retrieve an unpaginated JSON dump of all sensitive customer shipments, tracking numbers, origins, and ETAs. | Override `get_permissions()` in `ShipmentViewSet` to restrict `list` and `retrieve` actions to `IsAuthenticated` or `IsAdminUser`, leaving only `track()` public. |
| **AUTH-02** | **Medium** | Auth & Permissions | `backend/hashharbour_backend/settings.py:96-99` | Backend only configures `SessionAuthentication` and `BasicAuthentication`. A decoupled React SPA communicating with Django requires CSRF tokens and credentialed cookies for sessions. Stateless Bearer token/JWT authentication is absent. | Integrate `djangorestframework-simplejwt` to provide stateless Bearer token authentication for API requests. |
| **AUTH-03** | **Low** | Auth & Permissions | `frontend/src/components/home/HomeNavbar.jsx:68-83, 127-131` & `frontend/src/components/layout/NavActions.jsx:53-54` | All "Log In" and "Register" buttons in both desktop and mobile navigation bars are purely decorative `<button>` elements with no `onClick` handlers, modal dialogs, or authentication state integration. | Implement authentication modals or dedicated `/login` and `/register` routes connected to backend auth endpoints. |
| **AUTH-04** | **Low** | Auth & Permissions | `backend/hashharbour_backend/urls.py:5` | Django admin is exposed at standard `/admin/` path without IP restriction, rate limiting, or two-factor authentication. | Change admin path to a non-standard URL slug or configure django-admin-honeypot / django-two-factor-auth for production. |
| **SEC-01** | **High** | Security | `backend/hashharbour_backend/settings.py:6` | `SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-dev-key-change-in-production')`. If `DJANGO_SECRET_KEY` is omitted in staging or production, cryptographic signing of sessions, tokens, and CSRF is severely compromised. | Raise an `ImproperlyConfigured` exception if `DJANGO_SECRET_KEY` is not set when `DEBUG is False`. |
| **SEC-02** | **High** | Security | `backend/hashharbour_backend/settings.py:8` | `DEBUG = os.environ.get('DJANGO_DEBUG', 'True').lower() in ('true', '1', 'yes')`. Defaults to `True` if `DJANGO_DEBUG` is not explicitly set, exposing full interactive traceback details, source code, and environment variables on unhandled errors. | Default `DEBUG` to `False` (`os.environ.get('DJANGO_DEBUG', 'False').lower() in ('true', '1', 'yes')`) so production is secure by default. |
| **SEC-03** | **Medium** | Security | `frontend/src/pages/ContainerSection/components/TrackingModal.jsx:20` | `fetch('http://localhost:8000/api/shipments/track/...')` is hardcoded to localhost. On any deployed domain (Vercel, staging, production), client browsers will query their own local machine and fail. | Move the base API URL to `frontend/src/config/index.js` using `import.meta.env.VITE_API_URL || 'http://localhost:8000'` and import `CONFIG.apiUrl`. |
| **SEC-04** | **Medium** | Security | `backend/hashharbour_backend/settings.py:92-100` & `backend/api/views.py:21-33` | DRF lacks throttling configurations (`DEFAULT_THROTTLE_CLASSES` and `DEFAULT_THROTTLE_RATES`). The public tracking endpoint can be brute-forced or scraped without rate limiting. | Add `AnonRateThrottle` and `UserRateThrottle` with limits (e.g. `'anon': '30/minute'`, `'user': '120/minute'`) in `REST_FRAMEWORK` settings. |
| **SEC-05** | **Medium** | Security | `backend/hashharbour_backend/settings.py` | Missing production security headers and cookie flags: `SECURE_HSTS_SECONDS`, `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SECURE_CONTENT_TYPE_NOSNIFF`, `X_FRAME_OPTIONS = 'DENY'`. | Configure standard Django production security headers conditional on `not DEBUG`. |
| **SEC-06** | **Low** | Security | `backend/hashharbour_backend/settings.py:81` | `CORS_ALLOW_ALL_ORIGINS = os.environ.get('CORS_ALLOW_ALL_ORIGINS', 'False').lower() in ('true', '1', 'yes')`. If accidentally set to `True`, any origin on the web can read API responses. | Remove wildcard CORS capability in production and strictly enforce `CORS_ALLOWED_ORIGINS` domain whitelist. |
| **DB-01** | **Medium** | Database | `backend/api/views.py:28` & `backend/api/models.py:38` | `Shipment.objects.get(tracking_number__iexact=tracking_no.strip())` translates to `LOWER(tracking_number) = LOWER(?)`, bypassing the unique B-tree index on `tracking_number` on SQL databases and causing a full table scan. | Normalize tracking numbers to uppercase on save (`self.tracking_number = self.tracking_number.strip().upper()`) and use exact indexed lookup: `get(tracking_number=tracking_no.strip().upper())`. |
| **DB-02** | **Medium** | Database | `backend/api/views.py:8, 13, 18` & `backend/hashharbour_backend/settings.py:92-100` | No pagination is configured on any ViewSet. `GET /api/shipments/` loads every row in the database into server memory and transmits an unbounded JSON response payload. | Configure `PageNumberPagination` with `PAGE_SIZE = 20` globally in `REST_FRAMEWORK` settings. |
| **DB-03** | **Low** | Database | `backend/api/models.py:44` | `progress_percent = models.IntegerField(default=50)` lacks validation constraints. Out-of-range values like `-50` or `500` can be saved via ORM or admin, distorting client progress bars. | Add `validators=[MinValueValidator(0), MaxValueValidator(100)]` to `progress_percent`. |
| **DB-04** | **Low** | Database | `backend/api/models.py:45` | `last_update = models.CharField(max_length=255)` stores unstructured free-form text. The schema lacks a relational `ShipmentEvent` table to record timestamped waypoints, port codes, or transit status history. | Design a `ShipmentEvent` model with a `ForeignKey` to `Shipment`, timestamp, status choice, and location fields. |
| **DB-05** | **Low** | Database | `backend/api/views.py:28-32` | `Shipment.objects.get(...)` only catches `Shipment.DoesNotExist`. If duplicate or corrupt data creates multiple records matching `__iexact`, the endpoint crashes with unhandled `MultipleObjectsReturned` (HTTP 500). | Wrap lookup with `except (Shipment.DoesNotExist, Shipment.MultipleObjectsReturned):` or use `.filter(...).first()`. |
| **UI-01** | **High** | Frontend / UI | `frontend/src/components/layout/Navbar.jsx:35` (z-[30]) vs `frontend/src/components/layout/MobileMenu.jsx:16` (z-[40]) | `MobileMenu` has `z-[40]` and full-screen `fixed inset-0`, covering the `Navbar` (`z-[30]`) where the toggle button resides. Because `MobileMenu` has no internal close button, users cannot dismiss the menu without clicking a navigation link. | Add an explicit `X` close button inside `MobileMenu.jsx` and synchronize z-index hierarchy with a backdrop dismiss handler. |
| **UI-02** | **High** | Frontend / UI | `frontend/src/components/layout/NavActions.jsx:29-49` | In `NavActions.jsx`, the hamburger menu button lacks the `lg:hidden` utility class. On desktop screens (> 1024px), the hamburger icon is rendered alongside the full desktop navigation links. Clicking it on desktop executes a no-op because `MobileMenu` has `lg:hidden`. | Add `lg:hidden` to the hamburger button and its divider in `NavActions.jsx` (lines 26 and 35). |
| **UI-03** | **Medium** | Frontend / UI | `frontend/src/components/services/ServicesGrid.jsx:70-95` & `StaticServiceContainer.jsx:70-88` | Renders 5 simultaneous `<Canvas>` WebGL instances on `/services`. On mobile devices and budget laptops, this easily hits browser context limits (8–16 contexts) and causes `WEBGL_CONTEXT_LOST` crashes. | Render static pre-rendered 3D container images/SVGs for inactive service cards or use a single shared canvas viewport with Three.js scissor testing. |
| **UI-04** | **Low** | Frontend / UI | `frontend/src/components/ui/Button.jsx:35` | The `nav-primary` button uses `bg-[#00d4ff] text-white`, yielding a contrast ratio of 1.6:1 (violates WCAG 2.1 AA minimum requirement of 4.5:1). The text is almost illegible. | Change text color to dark navy (`text-[#060a14]` or `text-text-inverse`) to restore crisp legibility and pass WCAG AA standards. |
| **UI-05** | **Low** | Frontend / UI | `frontend/src/components/home/HomeStatsBar.jsx:12-28` vs `frontend/src/constants/statistics.js:8-33` | Conflicting business metrics: `HomeStatsBar` displays "25K+ Containers, 120+ Countries", while `HeroStatsBar` and backend `seed.py` display "1200+ Shipments, 95+ Countries". | Consolidate metrics into a single source of truth in `frontend/src/constants/statistics.js` or fetch them dynamically from `/api/stats/`. |
| **UI-06** | **Low** | Frontend / UI | `frontend/src/styles/index.css:281` & `frontend/index.html:24-26` | CSS declares `.font-brand { font-family: 'Permanent Marker', cursive, sans-serif; }`, but `Permanent Marker` is missing from the Google Fonts stylesheet link in `index.html`. | Add `family=Permanent+Marker` to the Google Fonts link in `index.html` or replace the class with an active project font. |
| **UI-07** | **Low** | Frontend / UI | `frontend/src/components/about/AboutGlobeCanvas.jsx:20-21, 87` | The 2D canvas sizing ignores `window.devicePixelRatio`, resulting in blurry globe rendering on Retina and 4K high-DPI displays. | Multiply `canvas.width` and `canvas.height` by `window.devicePixelRatio` and scale the 2D context accordingly. |
| **PERF-01** | **High** | Performance | `frontend/src/assets/fonts/ZiKuXingQiuFeiYangTi.ttf` (10.78 MB) & `HeroHeading.jsx:2, 14` | A 10.78 MB Chinese TTF font file containing thousands of CJK glyphs is bundled in active assets and loaded at runtime via JavaScript `new FontFace()` on `/home-preview` just to render the word "#HASHHARBOUR". | Remove the font or replace it with a subsetted WOFF2 font (< 50 KB) containing only required alphanumeric characters. |
| **PERF-02** | **High** | Performance | `frontend/src/assets/images/` & `frontend/public/` (~8 MB of Unused / Duplicated Media) | Multiple unreferenced and duplicated media files sit in the active source tree: `ChatGPT Image ... 12_38_08 PM.png` (2.43 MB), `ChatGPT Image ... 10_55_33 AM.png` (2.25 MB), `1783581067448.png` (959 KB), `file_00000000817881fdbd12771b0dd1e00c.png` (273 KB in both folders), and duplicate `Background.png` (2.13 MB). | Prune unreferenced images from `frontend/src/assets/images/` and deduplicate identical background files. |
| **PERF-03** | **Medium** | Performance | `frontend/index.html:24-26` | `index.html` loads 11 font families (`Inter`, `Anton`, `Road Rage`, `Rock Salt`, `Sedgwick Ave Display`, `Dokdo`, `East Sea Dokdo`, `Rubik Wet Paint`, `Rubik Glitch`, `Rubik Marker Hatch`, `Knewave`) in a single blocking stylesheet, 9 of which are unused. | Prune the Google Fonts `<link>` to request only active fonts (`Inter` and `Anton`), reducing FCP delay. |
| **PERF-04** | **Medium** | Performance | `frontend/src/pages/ContainerSection/components/3d/ContainerModel.jsx:583-585` | Each service container card creates a 2048x1024 canvas texture in memory, totaling ~40 MB of uncompressed bitmap memory on GPU across the 5 simultaneous service cards. | Downscale service card canvas textures to 1024x512 or 512x256, which provides identical visual sharpness for card-sized meshes. |
| **PERF-05** | **Low** | Performance | `frontend/package.json:16, 20` | `lenis` (`^1.3.26`) and `react-icons` (`^5.7.0`) are declared as production dependencies but never imported or utilized anywhere in `frontend/src`. | Remove `lenis` and `react-icons` from `package.json` to reduce install size and dependency surface. |
| **CODE-01** | **Medium** | Code Quality | `frontend/src/components/home/HomeContainerViewer.jsx` vs `frontend/src/pages/ContainerSection/components/3d/ShippingContainer3D.jsx` | Substantial code duplication (~350 LOC): Both components duplicate OrbitControls lerping, studio lighting rigs, loading overlays, progress rings, and color swatch arrays. | Extract shared 3D viewport scaffolding into a reusable `ContainerCanvasViewer.jsx` component accepting theme props. |
| **CODE-02** | **Medium** | Code Quality | `frontend/package.json` & `backend/` | Zero automated tests (unit, integration, or E2E) exist across frontend and backend. No test runner script is defined in `package.json` or `requirements.txt`. | Add `vitest` and `@testing-library/react` to frontend; add Django `APITestCase` tests for `/api/shipments/track/` and models. |
| **CODE-03** | **Low** | Code Quality | `frontend/src/pages/ContainerSection/components/ContainerShowcase.jsx:17-20` | UI feature list advertises "Export Ready / Download as GLB/GLTF model", but no GLTF export utility or download action exists in the codebase. | Implement a GLTFExporter download utility or update the feature label to reflect actual capabilities. |
| **CODE-04** | **Low** | Code Quality | `frontend/package.json:6-10` | No code quality or linting scripts (`lint`, `format`) are configured in `package.json`. | Add `eslint` and `prettier` configurations and scripts to prevent formatting discrepancies and catch errors early. |
| **CONF-01** | **Medium** | Config / Deployment | `frontend/` & `backend/` | Neither frontend nor backend provides a `.env.example` file documenting required environment variables (`DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `VITE_API_URL`). | Create `.env.example` templates in both `frontend/` and `backend/` directories with clear defaults and instructions. |
| **CONF-02** | **Medium** | Config / Deployment | `backend/requirements.txt` & `backend/hashharbour_backend/settings.py:78` | `requirements.txt` lacks a production WSGI server (`gunicorn` / `uvicorn`) and static asset handler (`whitenoise`). In addition, `STATIC_ROOT` is not configured in `settings.py`, causing `collectstatic` to fail. | Add `gunicorn>=23.0.0` and `whitenoise>=6.8.0` to `requirements.txt`, and define `STATIC_ROOT = BASE_DIR / 'staticfiles'` in `settings.py`. |
| **CONF-03** | **Low** | Config / Deployment | `package-lock.json` (Root) & `backend/package-lock.json` | Empty dummy `package-lock.json` files (`"packages": {}`) exist in root and `backend/` without corresponding `package.json` files, which can confuse CI/CD buildpack auto-detection. | Delete stray `package-lock.json` files from root and `backend/`. |
| **CONF-04** | **Low** | Config / Deployment | `backend/requirements.txt:1` | Strict pinning `Django==6.0.6` while other dependencies use `>=`. Django 6.x is unreleased / experimental in production ecosystems. | Relax pinning to `Django>=5.1.0,<6.1.0` or pin compatible enterprise LTS versions. |

---

## 3. Top 10 Priority Fixes in Order

1. **[BUG-01] Fix `drawHashHarbourSymbol` Scope in Container Model (`frontend/src/pages/ContainerSection/components/3d/ContainerModel.jsx:601`):**  
   *Why First:* Directly breaks core visual branding on all service container cards. Moving `drawHashHarbourSymbol` to module scope takes 2 minutes and immediately restores the anchor emblem on all 3D service container meshes.
2. **[AUTH-01] Restrict Permissions on `ShipmentViewSet` (`backend/api/views.py:17-19`):**  
   *Why Second:* Critical data exposure risk. Any unauthenticated anonymous visitor can dump all customer shipments and logistics route data via `GET /api/shipments/`. Restrict `list` and `retrieve` to authenticated admin users while keeping only `track()` public.
3. **[SEC-01 & SEC-02] Secure Production Django Settings (`backend/hashharbour_backend/settings.py:6, 8`):**  
   *Why Third:* Prevents high-severity security breaches. Prevent running with the default insecure secret key when `DEBUG` is False, and ensure `DEBUG` defaults to `False` in production to prevent stack trace and credential leakage.
4. **[SEC-03] Replace Hardcoded Localhost API URL (`frontend/src/pages/ContainerSection/components/TrackingModal.jsx:20`):**  
   *Why Fourth:* Total functional blocker in production. As soon as the frontend is deployed to any domain, all shipment tracking fails because the browser tries to connect to `http://localhost:8000`. Use `import.meta.env.VITE_API_URL`.
5. **[UI-01] Resolve Mobile Menu Drawer Trap (`frontend/src/components/layout/Navbar.jsx:35` & `MobileMenu.jsx:16`):**  
   *Why Fifth:* Major mobile usability flaw. Opening the mobile drawer traps the user because the header toggle is obscured under `z-[40]` and the drawer lacks a close button.
6. **[UI-02] Fix Hamburger Menu Visibility on Desktop (`frontend/src/components/layout/NavActions.jsx:29-49`):**  
   *Why Sixth:* Visual polish and layout bug. The mobile hamburger menu icon is displayed on wide desktop viewports alongside desktop links. Add `lg:hidden`.
7. **[PERF-01] Remove 10.78 MB Chinese TTF Font from Assets (`frontend/src/assets/fonts/ZiKuXingQiuFeiYangTi.ttf`):**  
   *Why Seventh:* Extreme asset bloat. A 10.78 MB font is loaded to display a single word. Eliminating this reduces asset weight by over 80%.
8. **[UI-03] Optimize 5 Concurrent WebGL Canvases on Services Page (`frontend/src/components/services/ServicesGrid.jsx:70-95`):**  
   *Why Eighth:* Stability hazard on mobile devices. Prevents `WEBGL_CONTEXT_LOST` crashes by replacing inactive canvases with pre-rendered assets or sharing a canvas context.
9. **[DB-01] Optimize Shipment Tracking Query to Utilize Index (`backend/api/views.py:28` & `api/models.py:38`):**  
   *Why Ninth:* Scalability fix. Normalize tracking numbers to uppercase on save and perform exact lookups (`get(tracking_number=...)`) instead of `__iexact` to avoid table scans on production SQL databases.
10. **[BUG-02] Connect Home Container Chevrons & Dots (`frontend/src/components/home/HomeContainerSection.jsx:220, 256`):**  
    *Why Tenth:* Broken UI control. Attaching click handlers to the carousel chevrons and linking the dots to `activeStep` restores expected interactive navigation.

---

## 4. Quick Wins (Under 30 Minutes Each)

1. **Move `drawHashHarbourSymbol` to Module Scope** (`frontend/src/pages/ContainerSection/components/3d/ContainerModel.jsx:317`):  
   Cut lines 317–422 and paste above line 315. Takes 2 minutes.
2. **Add `lg:hidden` to Desktop Hamburger Icon** (`frontend/src/components/layout/NavActions.jsx:26, 35`):  
   Add `hidden lg:hidden` to the divider and menu button. Takes 1 minute.
3. **Fix Nav Button Contrast WCAG Violation** (`frontend/src/components/ui/Button.jsx:35`):  
   Change `text-white` to `text-[#060a14]` for `nav-primary`. Takes 1 minute.
4. **Add `onClick` to Home Container Chevrons** (`frontend/src/components/home/HomeContainerSection.jsx:220, 256`):  
   Add `onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}` and `onClick={() => setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1))}`. Takes 2 minutes.
5. **Link Active Carousel Dot Indicators** (`frontend/src/components/home/HomeContainerSection.jsx:241`):  
   Replace `dot === 0` with `dot === activeStep`. Takes 1 minute.
6. **Prune Render-Blocking Unused Fonts** (`frontend/index.html:24-26`):  
   Remove the 9 unused font families from the Google Fonts request URL, keeping only `Inter` and `Anton`. Takes 2 minutes.
7. **Add Close Button to Mobile Menu Drawer** (`frontend/src/components/layout/MobileMenu.jsx:16`):  
   Add a top-right `X` icon button that calls `onClose`. Takes 5 minutes.
8. **Fix Video Syntax Warning** (`frontend/src/components/home/HomeHero.jsx:21`):  
   Remove `src={heroVideo}` from the `<video>` tag. Takes 1 minute.
9. **Add Integer Range Validators to `progress_percent`** (`backend/api/models.py:44`):  
   Add `validators=[MinValueValidator(0), MaxValueValidator(100)]`. Takes 3 minutes.
10. **Add Missing `python manage.py migrate` to README** (`README.md:52`):  
    Insert `python manage.py migrate` before `python seed.py`. Takes 1 minute.
11. **Delete Stray Root and Backend `package-lock.json` Files**:  
    Remove empty dummy lockfiles from root and `backend/`. Takes 1 minute.
12. **Create `.env.example` Templates** (`frontend/.env.example` & `backend/.env.example`):  
    Provide default configuration templates. Takes 5 minutes.

---

## 5. Items Not Verified & Technical Rationale

1. **Automated Unit & End-to-End Test Execution:**  
   *Reason:* Neither `frontend` nor `backend` contains automated test suites (`*.test.jsx`, `test_*.py`) or test runner configurations (Vitest, Jest, Pytest). All logic and security analysis was performed through static code inspection and AST verification.
2. **Frontend Production Build Verification (`vite build`):**  
   *Reason:* `node_modules` was not pre-installed in the workspace repository. In accordance with audit safety rules ("No installs that change lockfiles"), `npm install` was not executed.
3. **Django Checks Against Installed Virtual Environment:**  
   *Reason:* The host's global Python environment lacks `djangorestframework` and `django-cors-headers`. The backend virtual environment was not pre-activated or checked into the workspace.
4. **Production SQL Database Query Plans:**  
   *Reason:* The workspace uses SQLite. Database indexing and full-table scan behaviors on `__iexact` were evaluated based on standard PostgreSQL/MySQL B-tree indexing specifications.
5. **Physical Mobile Device WebGL Context Exhaustion Limits:**  
   *Reason:* Audit execution environment is a headless Windows development host. Context limit behaviors (8–16 simultaneous WebGL contexts) were evaluated from WebGL specifications and React Three Fiber architecture.
