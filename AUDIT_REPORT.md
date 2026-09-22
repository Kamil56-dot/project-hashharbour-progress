# HASHHARBOUR — COMPREHENSIVE CODEBASE AUDIT & TECHNICAL ASSESSMENT REPORT

**Date of Audit:** September 22, 2026  
**Audit Type:** Full Architecture, Logic, Security, Performance, Database, UI, and Code Quality Audit  
**Operating System:** Windows  
**Audit Scope:** Full Project Analysis (`frontend/`, `backend/`, `archive/`, root configuration files)  
**Execution Mode:** Read-Only Analysis (Source files unchanged; `AUDIT_REPORT.md` created as specified)

---

## 1. Project Summary & Architecture Overview

### 1.1 Plain Terms: What HashHarbour Does
**HashHarbour** is a unified digital Export-Import (EXIM) trade and container logistics platform. It enables trade operators, freight forwarders, and logistics managers to:
1. **Inspect 3D ISO Shipping Containers:** Interactive WebGL 3D rendering (Three.js / React Three Fiber) with real-time 360° rotation, color customization, and ISO 6346 marking stencils.
2. **Track Multimodal Shipments in Real Time:** Query container and bill of lading numbers (e.g. `HH-100293`) to retrieve transit status, vessels, origin/destination ports, ETAs, and voyage progress percentages.
3. **Manage EXIM Trade Operations:** Explore automated trade documentation workflows, customs compliance guides, route management, and digital trade corridors.

### 1.2 Tech Stack
| Component | Technologies & Frameworks | Version / Notes |
| :--- | :--- | :--- |
| **Frontend SPA** | React 19.2.8, Vite 8.2.0 | Single-Page Application with code splitting |
| **Client Routing** | React Router DOM 7.18.3 | HTML5 pushState routing (`/`, `/about`, `/services`, `/container-section`, `/home-preview`) |
| **Styling & Design System** | Tailwind CSS 3.4.19, PostCSS 8.5.25, Autoprefixer 10.5.4 | Dual theme architecture (Light landing page + Dark navy glassmorphism sections) |
| **3D & Canvas Graphics** | Three.js 0.185.1, `@react-three/fiber` 9.7.0, `@react-three/drei` 10.7.8 | Client-side WebGL PBR container renderer & 2D HTML5 canvas globe |
| **Animations & Smooth Scroll** | GSAP 3.15.0, Lenis 1.3.26, Lucide React 1.28.0 | Hardware-accelerated UI transitions |
| **Backend Framework** | Django 6.0.7, Django REST Framework (DRF) 3.18.1 | REST API backend with `DefaultRouter` endpoints |
| **CORS & Middleware** | `django-cors-headers` 4.9.0 | Configurable origin whitelisting |
| **Database** | SQLite 3 (`backend/db.sqlite3`) | Local relational storage with Django ORM |
| **Package Managers** | `npm` 11.19.0 (frontend), `pip` / `requirements.txt` (backend) | Separated workspace package management |

### 1.3 Folder Structure & Entry Points
```
HashHarbour/
├── backend/                               # Django REST Framework API Server
│   ├── manage.py                          # Django management CLI
│   ├── seed.py                            # Database seeder (Stats, Features, Sample Shipments)
│   ├── requirements.txt                   # Python dependency manifest (Django, DRF, CORS)
│   ├── db.sqlite3                         # Local SQLite database
│   ├── api/                               # Core REST API Application
│   │   ├── apps.py                        # ApiConfig definition
│   │   ├── models.py                      # StatItem, FeatureCard, Shipment models
│   │   ├── serializers.py                 # DRF ModelSerializers
│   │   ├── urls.py                        # Router registration (/api/stats, /api/features, /api/shipments)
│   │   ├── views.py                       # ReadOnlyModelViewSets & custom track() action
│   │   └── migrations/                    # Database migration history (0001_initial.py)
│   └── hashharbour_backend/               # Django Root Configuration
│       ├── settings.py                    # Environment settings, CORS, DRF configuration
│       ├── urls.py                        # Root URL routing (/admin/, /api/)
│       └── wsgi.py                        # WSGI entry point
│
├── frontend/                              # React 19 + Vite 8 Client SPA
│   ├── package.json                       # Dependencies, build scripts (dev, build, preview)
│   ├── vite.config.js                     # Vite configuration, aliases (@, @components), Rollup chunking
│   ├── tailwind.config.js                 # Design tokens (colors, font families, custom animations)
│   ├── postcss.config.js                  # Tailwind & Autoprefixer plugin config
│   ├── index.html                         # SPA HTML entry point (SEO, fonts, favicon)
│   ├── public/                            # Static assets (logos, background images, videos)
│   └── src/
│       ├── main.jsx                       # React root entry point (BrowserRouter mount)
│       ├── App.jsx                        # Application root, routing table, suspense fallbacks
│       ├── config/index.js                # App environment configuration (MODE, PROD, DEV)
│       ├── constants/                     # navigation.js, statistics.js, taglines.js
│       ├── hooks/                         # useMediaQuery, useReducedMotion, useScrollPosition, useTypewriter
│       ├── utils/                         # cn.js, accessibility.js, performance.js
│       ├── styles/                        # index.css (CSS variables), animations.css
│       ├── theme/tokens.js                # Design tokens & color definitions
│       ├── assets/                        # Fonts, icons, images, videos (includes 10.8MB font & heavy MP4s)
│       ├── components/
│       │   ├── layout/                    # Navbar.jsx, NavLinks.jsx, NavActions.jsx, MobileMenu.jsx, Logo.jsx
│       │   ├── home/                      # HomePage.jsx, HomeNavbar.jsx, HomeHero.jsx, HomeContainerSection.jsx, HomeContainerViewer.jsx, HomeStatsBar.jsx
│       │   ├── about/                     # AboutSection.jsx, AboutHero.jsx, AboutNetwork.jsx, AboutGlobeCanvas.jsx, TradePillars.jsx, TrustLayer.jsx, BrandStatement.jsx
│       │   ├── services/                  # ServicesSection.jsx, ServicesHero.jsx, ServicesGrid.jsx, ServiceCard.jsx, StaticServiceContainer.jsx, ServicesWorkflow.jsx, ServicesCTA.jsx
│       │   ├── archived-hero/             # ArchivedHero.jsx (standalone test preview on /home-preview)
│       │   └── ui/                        # Universal Button.jsx primitive
│       └── pages/
│           └── ContainerSection/          # ContainerPage.jsx, ContainerShowcase.jsx, TrackingModal.jsx, 3d/ContainerModel.jsx, 3d/ShippingContainer3D.jsx
│
├── archive/                               # Historical Prototypes & Computer Vision Scripts
│   ├── about-section-legacy/              # Original standalone About Section package
│   ├── container-section-frontend-prototype/ # Isolated earlier prototype frontend
│   └── container-section-tools/           # Vectorization & logo processing Python scripts
│
├── .gitignore                             # Git ignore rules
├── README.md                              # Main documentation & run guide
└── AUDIT_REPORT.md                        # Master audit and technical assessment report
```

### 1.4 How Data Flows (Frontend -> API -> DB)
1. **Client Action:** The user enters a tracking number (e.g. `HH-100293`) in `TrackingModal.jsx` (mounted on `/container-section` when clicking "Book My Container").
2. **HTTP Request:** The client triggers an asynchronous `fetch` request:  
   `GET http://localhost:8000/api/shipments/track/?tracking_no=HH-100293`
3. **API Routing:** Django receives the request at `hashharbour_backend/urls.py`, directs it to `api/urls.py`, and maps it via DRF `DefaultRouter` to `ShipmentViewSet.track()` in `api/views.py`.
4. **Database Query:** The Django ORM executes:  
   `Shipment.objects.get(tracking_number__iexact=tracking_no.strip())` querying `backend/db.sqlite3`.
5. **Serialization & Response:** The record is serialized using `ShipmentSerializer` and returned as a JSON object containing status, origin, destination, vessel, ETA, and progress percentage.
6. **UI Rendering:** `TrackingModal.jsx` sets `shipmentData` state, rendering the live shipment route, animated progress bar, and vessel information.

---

## 2. Comprehensive Findings Table

| ID | Severity | Area | File:Line | Issue Description | Suggested Fix |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | **High** | Broken Logic / Scope | `frontend/src/pages/ContainerSection/components/3d/ContainerModel.jsx:601` | Inside `createServiceSideTexture(...)`, `if (typeof drawHashHarbourSymbol === 'function')` evaluates to `false` because `drawHashHarbourSymbol` is scoped privately inside `createISOMarkingsTextures()` (lines 317–422). The brand logo is never painted on custom service container meshes. | Move `drawHashHarbourSymbol` outside `createISOMarkingsTextures` to top-level module scope so both texture generators can call it. |
| **BUG-02** | **Medium** | Broken UI Controls | `frontend/src/components/home/HomeContainerSection.jsx:220, 256` | The Left/Right Chevron buttons have no `onClick` handlers attached. In addition, the dot indicators (lines 237–251) are hardcoded with `dot === 0` active instead of binding dynamically to `activeStep`. | Attach `onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}` and `onClick={() => setActiveStep((prev) => Math.min(STEPS.length - 1, prev + 1))}` to chevrons, and bind dot active styling to `dot === activeStep`. |
| **BUG-03** | **Medium** | Dead / Orphaned Links | `frontend/src/components/home/HomeNavbar.jsx:9-11` & `frontend/src/constants/navigation.js:9-11, 15-16` | Navigation items `Routes` (`#routes`), `Vaults` (`#vaults`), `Community` (`#community`), `Overview` (`#overview`), `Log In` (`#login`), and `Register` (`#register`) point to non-existent DOM element IDs, resulting in dead links. | Create target section anchors/pages or replace `#hash` links with active routes or modal triggers. |
| **BUG-04** | **Low** | Duplicate UI Elements | `frontend/src/pages/ContainerSection/components/ContainerShowcase.jsx:118-122` & `215-222` | Two identical "Book My Container" buttons are rendered simultaneously within the same viewport section (one in the left column text block, one below the color palette). | Remove the redundant second button or reposition it for mobile viewports only. |
| **BUG-05** | **Low** | Video Syntax Redundancy | `frontend/src/components/home/HomeHero.jsx:21-33` | `<video>` element specifies both `src={heroVideo}` on the `<video>` tag and a nested `<source src={heroVideo} type="video/mp4" />` tag, triggering HTML validation warnings in some browsers. | Remove the `src` attribute from the `<video>` tag and rely entirely on the inner `<source>` tag. |
| **AUTH-01** | **High** | Missing Endpoint Authorization | `backend/api/views.py:17-19` & `backend/hashharbour_backend/settings.py:93-95` | `ShipmentViewSet` extends `ReadOnlyModelViewSet` under default `AllowAny` permissions. Any unauthenticated caller can execute `GET /api/shipments/` and dump all customer shipments (tracking numbers, vessel names, origins, destinations, ETAs). | Override `get_permissions()` in `ShipmentViewSet` to restrict `list` and `retrieve` to `IsAuthenticated` or `IsAdminUser`, keeping only the `track` action public. |
| **AUTH-02** | **Medium** | Missing Token/JWT Auth | `backend/hashharbour_backend/settings.py:96-99` | Backend only configures `SessionAuthentication` and `BasicAuthentication`. For a decoupled React SPA communicating with Django, session cookies require CORS credentials and CSRF tokens. Modern token/JWT auth is missing. | Integrate `djangorestframework-simplejwt` or `dj-rest-auth` for stateless Bearer token authentication. |
| **AUTH-03** | **Low** | Non-Functional Auth UI | `frontend/src/components/home/HomeNavbar.jsx:70-84` & `frontend/src/components/layout/NavActions.jsx:53-54` | All "Log In" and "Register" buttons in desktop and mobile navbars are static placeholders with no click handlers, forms, or authentication state management. | Implement modal login/register dialogs or create `/login` and `/register` routes connected to backend auth endpoints. |
| **SEC-01** | **High** | Insecure Fallback Secret Key | `backend/hashharbour_backend/settings.py:6` | `SECRET_KEY` falls back to `'django-insecure-dev-key-change-in-production'`. If `DJANGO_SECRET_KEY` is omitted in staging or production, cryptographic signatures are compromised. | Enforce that `DJANGO_SECRET_KEY` must be provided in production, or raise an `ImproperlyConfigured` exception when `DEBUG` is `False`. |
| **SEC-02** | **High** | Insecure Default Debug Mode | `backend/hashharbour_backend/settings.py:8` | `DEBUG` defaults to `True` if `DJANGO_DEBUG` environment variable is not explicitly set to `False`/`0`, exposing traceback details and environment parameters on runtime errors. | Default `DEBUG` to `False` unless explicitly set to `True` in local development (`os.environ.get('DJANGO_DEBUG', 'False') in ('True', '1', 'true')`). |
| **SEC-03** | **Medium** | Hardcoded Localhost API URL | `frontend/src/pages/ContainerSection/components/TrackingModal.jsx:20` | `fetch('http://localhost:8000/api/shipments/track/...')` is hardcoded to localhost. In any staging or production deployment, all tracking API requests will fail in user browsers. | Move API endpoint to `frontend/src/config/index.js` using `import.meta.env.VITE_API_URL || 'http://localhost:8000'` and import `CONFIG.apiUrl`. |
| **SEC-04** | **Medium** | Missing API Rate Limiting | `backend/hashharbour_backend/settings.py:92-100` & `backend/api/views.py:22-33` | No DRF throttling classes (`AnonRateThrottle`, `UserRateThrottle`) are configured. The public `track` endpoint can be enumerated or brute-forced without restriction. | Add `DEFAULT_THROTTLE_CLASSES` and `DEFAULT_THROTTLE_RATES` (e.g. `'anon': '30/minute'`, `'user': '120/minute'`) in `REST_FRAMEWORK` settings. |
| **SEC-05** | **Medium** | Missing Security Headers & Cookie Flags | `backend/hashharbour_backend/settings.py` | Missing production security settings: `SECURE_HSTS_SECONDS`, `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SECURE_CONTENT_TYPE_NOSNIFF`, `SECURE_BROWSER_XSS_FILTER`. | Add standard Django production security headers conditional on `not DEBUG`. |
| **DB-01** | **Medium** | Index Bypass via `__iexact` | `backend/api/views.py:28` & `backend/api/models.py:38` | `Shipment.objects.get(tracking_number__iexact=tracking_no.strip())` performs `LOWER()` comparison, bypassing standard B-tree index on `tracking_number` on SQL engines and causing full table scans. | Normalize tracking numbers to uppercase on model save (`self.tracking_number = self.tracking_number.strip().upper()`) and use exact match `get(tracking_number=tracking_no.strip().upper())`. |
| **DB-02** | **Medium** | Missing Unbounded Query Pagination | `backend/api/views.py:8, 13, 18` | `StatItemViewSet`, `FeatureCardViewSet`, and `ShipmentViewSet` have no pagination configured. `GET /api/shipments/` loads the entire table into memory and transmits it in a single response payload. | Configure `PAGE_SIZE = 20` and `DEFAULT_PAGINATION_CLASS = 'rest_framework.pagination.PageNumberPagination'` in `REST_FRAMEWORK` settings. |
| **DB-03** | **Low** | Missing Integer Range Validation | `backend/api/models.py:44` | `Shipment.progress_percent` is defined as a plain `IntegerField(default=50)` without `validators=[MinValueValidator(0), MaxValueValidator(100)]`. Invalid values can distort UI progress bars. | Add `MinValueValidator(0)` and `MaxValueValidator(100)` to `progress_percent`. |
| **DB-04** | **Low** | Unstructured Tracking Events | `backend/api/models.py:45` | `Shipment.last_update` is a freeform `CharField(max_length=255)`. Lacks a structured relational `ShipmentEvent` model (timestamp, location, status code, latitude/longitude). | Create a `ShipmentEvent` model with a `ForeignKey` to `Shipment` for historical waypoint tracking. |
| **UI-01** | **High** | Mobile Menu Drawer Trapping (Z-Index Conflict) | `frontend/src/components/layout/Navbar.jsx:35` (z-[30]) vs `frontend/src/components/layout/MobileMenu.jsx:16` (z-[40]) | `MobileMenu` has `z-[40]` and no internal close button, while `Navbar` (containing the toggle button) is at `z-[30]`. Opening the menu obscures the toggle and prevents closing without clicking a link. | Place an explicit close (`X`) button inside `MobileMenu.jsx`, or align z-indices and backdrop click handlers so the user can easily dismiss the menu. |
| **UI-02** | **Medium** | 5 Concurrent WebGL Canvases on Services Page | `frontend/src/components/services/ServicesGrid.jsx:70-95` & `StaticServiceContainer.jsx:70-88` | Renders 5 simultaneous `<Canvas>` WebGL contexts on `/services`. On mobile devices and low-end GPUs, this risks exceeding browser WebGL context limits (8–16 max) and triggers `WEBGL_CONTEXT_LOST`. | Render static 3D container images/SVGs for inactive cards, or share a single WebGL canvas across card viewports using Three.js scissor/viewport rendering. |
| **UI-03** | **Low** | Missing Font in Google Fonts Link | `frontend/src/styles/index.css:281` & `frontend/index.html:24-26` | CSS references `.font-brand { font-family: 'Permanent Marker', ... }`, but `index.html` does not include `Permanent Marker` in its Google Fonts stylesheet request. | Add `family=Permanent+Marker` to the Google Fonts `<link>` tag in `index.html`, or replace it with an already-loaded display font. |
| **UI-04** | **Low** | Low Contrast in Primary Nav Button | `frontend/src/components/ui/Button.jsx:35` | `'nav-primary': '... bg-[#00d4ff] text-white ...'` renders white text on bright cyan, producing a 1.3:1 contrast ratio (violates WCAG 2.1 AA requirement of 4.5:1). | Change text color to dark navy (`text-[#060a14]` or `text-text-inverse`) for sharp legibility and WCAG compliance. |
| **UI-05** | **Low** | Inconsistent Business Metrics Across Pages | `frontend/src/components/home/HomeStatsBar.jsx:12-28` vs `frontend/src/constants/statistics.js:8-33` | HomeStatsBar shows "25K+ Containers, 120+ Countries", while HeroStatsBar and backend `seed.py` show "1200+ Shipments, 95+ Countries". | Consolidate statistics into a single source of truth in `frontend/src/constants/statistics.js` or fetch them dynamically from `/api/stats/`. |
| **PERF-01** | **High** | 10.78 MB Chinese TTF Font Bundled in Assets | `frontend/src/assets/fonts/ZiKuXingQiuFeiYangTi.ttf` (10,784 KB) & `HeroHeading.jsx:2` | A 10.8 MB TTF font file is imported in `HeroHeading.jsx` for `/home-preview`, bloating the build output and consuming excessive bandwidth. | Remove or convert the font to a subsetted WOFF2 file (< 100 KB), or load standard web fonts. |
| **PERF-02** | **High** | ~71.6 MB of Unreferenced Media in Active Source | `frontend/src/assets/Videos/` & `frontend/src/assets/images/` | `1000215164_gwr_videomp4.mp4` (30.27 MB), `Cargo_ship...mp4` (13.96 MB), `Container_ship...0709.mp4` (11.97 MB), `Container_ship...0657.mp4` (11.07 MB) exist unreferenced in the active source tree. | Move unused video and raw asset files out of `frontend/src/` into cloud storage / CDN or the `archive/` folder. |
| **PERF-03** | **Medium** | 11 Render-Blocking Google Fonts Requested | `frontend/index.html:24-26` | `index.html` loads 11 font families (`Inter`, `Anton`, `Road Rage`, `Rock Salt`, `Sedgwick Ave Display`, `Dokdo`, `East Sea Dokdo`, `Rubik Wet Paint`, `Rubik Glitch`, `Rubik Marker Hatch`, `Knewave`) in a single blocking stylesheet. | Prune font requests in `index.html` to only active fonts (`Inter` and `Anton`), saving multiple HTTP round-trips and font rendering delay. |
| **PERF-04** | **Medium** | 913 kB Minified 3D Vendor Chunk | `frontend/vite.config.js:28-30` & `dist/assets/vendor-3d-*.js` | Rollup outputs a 913 kB minified chunk for `vendor-3d` (Three.js + Fiber + Drei). | Continue code-splitting 3D routes and explore importing only required Three.js sub-modules. |
| **CODE-01** | **Medium** | Duplicated 3D Viewer Logic | `frontend/src/components/home/HomeContainerViewer.jsx` vs `frontend/src/pages/ContainerSection/components/3d/ShippingContainer3D.jsx` | Both components share ~90% identical OrbitControls lerping, studio lighting, loading overlays, and color swatch palettes. | Refactor shared 3D canvas scaffolding (OrbitControls, Lighting, Color Swatches) into a reusable component in `@components/3d/`. |
| **CODE-02** | **Medium** | Missing Automated Tests | `frontend/package.json` & `backend/api/` | Zero automated tests (unit, integration, or E2E) exist across frontend and backend. No test runner script is configured in `package.json`. | Install `vitest` and `@testing-library/react` for the frontend; create Django `APITestCase` tests for `/api/shipments/track/` and models. |
| **CODE-03** | **Low** | False Feature Advertisement in UI | `frontend/src/pages/ContainerSection/components/ContainerShowcase.jsx:17-20` | Feature bullet advertises "Export Ready / Download as GLB/GLTF model", but no GLTF exporter or download action exists in the code. | Implement a GLTFExporter download utility or update the feature label to reflect actual capabilities. |
| **CONF-01** | **Medium** | Missing Environment Variable Documentation | `frontend/` & `backend/` | Neither frontend nor backend provides a `.env.example` file describing required environment variables (`DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `VITE_API_URL`). | Create `.env.example` in both `frontend/` and `backend/` directories with clear defaults and instructions. |
| **CONF-02** | **Medium** | Missing Production WSGI/ASGI Server & Static Handler | `backend/requirements.txt` | `requirements.txt` lacks `gunicorn`/`uvicorn` for production execution and `whitenoise` for serving Django static assets. | Add `gunicorn>=23.0.0` and `whitenoise>=6.8.0` to `backend/requirements.txt` and configure `STATIC_ROOT` in `settings.py`. |
| **CONF-03** | **Low** | Requirements Version Discrepancy | `backend/requirements.txt:1` | `requirements.txt` specifies `Django==6.0.6`, whereas the virtual environment runs `Django 6.0.7`. | Update `requirements.txt` to `Django>=6.0.7` to match the installed environment. |

---

## 3. Top 10 Priority Fixes in Order

1. **[BUG-01] Fix `drawHashHarbourSymbol` Scope in Container Model (`frontend/src/pages/ContainerSection/components/3d/ContainerModel.jsx:601`):**  
   Move `drawHashHarbourSymbol` outside `createISOMarkingsTextures` so that `createServiceSideTexture` can access it and render the official emblem on all service containers.
2. **[AUTH-01] Restrict Permissions on `ShipmentViewSet` (`backend/api/views.py:17-19`):**  
   Override `get_permissions()` in `ShipmentViewSet` so that listing all shipments requires authentication, preventing anonymous exposure of sensitive customer logistics records.
3. **[SEC-01 & SEC-02] Secure Production Django Settings (`backend/hashharbour_backend/settings.py:6, 8`):**  
   Disallow insecure fallback secret keys when `DEBUG` is `False`, default `DEBUG` to `False` unless explicitly set in local dev, and enforce strict allowed hosts.
4. **[SEC-03] Replace Hardcoded Localhost API URL (`frontend/src/pages/ContainerSection/components/TrackingModal.jsx:20`):**  
   Use `CONFIG.apiUrl` (`import.meta.env.VITE_API_URL`) so that API tracking requests route correctly on deployed environments.
5. **[UI-01] Resolve Mobile Menu Drawer Trap (`frontend/src/components/layout/Navbar.jsx:35` & `MobileMenu.jsx:16`):**  
   Add an explicit close button inside `MobileMenu.jsx` and synchronize z-index hierarchy so mobile users can easily close the navigation drawer.
6. **[PERF-01] Remove 10.78 MB Unused Font from Assets (`frontend/src/assets/fonts/ZiKuXingQiuFeiYangTi.ttf`):**  
   Remove the 10.8 MB Chinese TTF font or replace it with a lightweight subsetted WOFF2 font to eliminate severe bandwidth overhead.
7. **[PERF-02] Purge ~71.6 MB of Unreferenced Video Assets from Source Tree (`frontend/src/assets/Videos/` & `src/assets/images/`):**  
   Remove unreferenced videos (such as `1000215164_gwr_videomp4.mp4` [30.3 MB]) from the active source tree and host media on external object storage or CDN.
8. **[UI-02] Eliminate 5 Concurrent WebGL Canvases on Services Page (`frontend/src/components/services/ServicesGrid.jsx:70-95`):**  
   Replace multi-canvas WebGL grid with static pre-rendered visual assets or a single shared canvas viewport to prevent mobile WebGL context crashes.
9. **[DB-01] Optimize Shipment Tracking Query to Utilize Index (`backend/api/views.py:28` & `api/models.py:38`):**  
   Normalize tracking numbers to uppercase on model save and query with exact match `get(tracking_number=...)` instead of `__iexact` to avoid table scans on production SQL databases.
10. **[BUG-02] Attach Interactive State to Home Container Chevrons & Dots (`frontend/src/components/home/HomeContainerSection.jsx:220, 256`):**  
    Add click handlers to previous/next buttons and link dot indicators to the current `activeStep` state.

---

## 4. Quick Wins (Under 30 Minutes Each)

1. **Fix `drawHashHarbourSymbol` Scope** (`ContainerModel.jsx:601`): Move the helper function up 20 lines to module scope. Takes 2 minutes.
2. **Fix Primary Nav Button Contrast** (`Button.jsx:35`): Change `text-white` to `text-[#060a14]` for `nav-primary` button. Takes 1 minute.
3. **Add `onClick` to Home Chevrons** (`HomeContainerSection.jsx:220, 256`): Add step increment/decrement functions. Takes 3 minutes.
4. **Link Active Dot Indicators** (`HomeContainerSection.jsx:240`): Replace `dot === 0` with `dot === activeStep`. Takes 2 minutes.
5. **Prune Render-Blocking Google Fonts** (`index.html:24-26`): Remove the 9 unused fonts from the Google Fonts request URL. Takes 3 minutes.
6. **Add Close Button to Mobile Menu** (`MobileMenu.jsx`): Add an `X` icon button in top right of drawer. Takes 5 minutes.
7. **Fix Video Syntax Warning** (`HomeHero.jsx:21`): Remove `src={heroVideo}` from `<video>` tag. Takes 1 minute.
8. **Add Integer Validators to `progress_percent`** (`backend/api/models.py:44`): Add `MinValueValidator(0)` and `MaxValueValidator(100)`. Takes 3 minutes.
9. **Create `.env.example` Files** (`frontend/.env.example` & `backend/.env.example`): Document all configuration keys. Takes 5 minutes.
10. **Add Throttling to Django REST Framework** (`backend/hashharbour_backend/settings.py:92`): Add `AnonRateThrottle` settings. Takes 5 minutes.

---

## 5. Items Not Verified & Technical Rationale

1. **Automated End-to-End and Unit Test Suites:**  
   *Reason:* Neither `frontend` nor `backend` contains automated test files (`*.test.jsx`, `test_*.py`) or test runner configurations (Vitest, Jest, Pytest). All logic and security analysis was performed through static code inspection and AST verification.
2. **Live Production Database Performance on PostgreSQL/MySQL:**  
   *Reason:* The local development environment uses SQLite (`backend/db.sqlite3`). Query plans and indexing behaviors under high concurrency (e.g. `__iexact` index bypassing) were evaluated based on standard SQL engine behavior.
3. **Physical Mobile Device WebGL Context Limits:**  
   *Reason:* Audit execution environment is a headless Windows development host. WebGL context limits (8–16 simultaneous contexts) and VRAM pressure were evaluated from WebGL specifications and React Three Fiber architecture.
4. **Live Cross-Origin API Requests on Deployed CDN:**  
   *Reason:* Application is hosted locally; cross-origin CORS headers and production SSL configurations were audited via Django settings inspection.
