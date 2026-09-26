# HASHHARBOUR BACKEND AUDIT REPORT & PHP+MYSQL MIGRATION BLUEPRINT
**Phase 0 Deliverable — Architecture & Component Inventory**
**Date:** September 2026  
**Status:** Audit Complete (Read-Only Analysis; No source files modified)  
**Target Migration Stack:** PHP 8.x + MySQL (PDO, XAMPP compatible) + `firebase/php-jwt`

---

## 1. Django Apps & Folder Structure Inventory

The existing Django backend is structured as follows:

```
backend/
├── .env.example                       # Environment variable template
├── requirements.txt                   # Python package dependencies
├── manage.py                          # Django management CLI script
├── seed.py                            # Database seeder (StatItems, FeatureCards, Shipments, Demo User)
├── package-lock.json                  # Stray empty npm lockfile (0 packages)
│
├── hashharbour_backend/               # Django Root Project Configuration
│   ├── __init__.py
│   ├── settings.py                    # Core project settings (CORS, DRF, JWT, DB, Apps)
│   ├── urls.py                        # Root URL router mapping /admin/ and /api/
│   └── wsgi.py                        # WSGI entry point for web deployment
│
└── api/                               # Core Application Module ('api.apps.ApiConfig')
    ├── __init__.py
    ├── apps.py                        # ApiConfig definition
    ├── models.py                      # ORM Models: StatItem, FeatureCard, Shipment
    ├── serializers.py                 # DRF ModelSerializers
    ├── views.py                       # ReadOnlyModelViewSets + custom track() action
    ├── auth_views.py                  # EmailTokenObtainPairView (custom JWT email/password login)
    ├── urls.py                        # DRF DefaultRouter + Auth URL routes
    └── migrations/                    # Database schema migrations
        ├── __init__.py
        ├── 0001_initial.py            # Initial StatItem, FeatureCard, Shipment tables
        └── 0002_alter_shipment_progress_percent.py # Progress percentage min/max validator
```

---

## 2. Model Inventory: Implemented vs. Planned

### 2.1 Implemented Models (in `backend/api/models.py` & Django Auth)

| Model Name | Table Name (SQLite) | Fields & Types | Constraints & Attributes | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`StatItem`** | `api_statitem` | • `id` (AutoField/BigAutoField)<br>• `number` (VARCHAR(50))<br>• `label` (VARCHAR(100))<br>• `sublabel` (VARCHAR(150))<br>• `icon_name` (VARCHAR(50))<br>• `order` (INTEGER) | `ordering = ['order']`<br>Default icon: `"Ship"`<br>Default order: `0` | Platform statistics displayed on landing page (e.g. "1200+ Shipments Delivered") |
| **`FeatureCard`** | `api_featurecard` | • `id` (AutoField/BigAutoField)<br>• `title` (VARCHAR(100))<br>• `description` (TEXT)<br>• `icon_name` (VARCHAR(50))<br>• `order` (INTEGER) | `ordering = ['order']`<br>Default icon: `"Ship"`<br>Default order: `0` | Core capability highlight cards (Smart Booking, Real-Time Tracking, etc.) |
| **`Shipment`** | `api_shipment` | • `id` (AutoField/BigAutoField)<br>• `tracking_number` (VARCHAR(50))<br>• `status` (VARCHAR(50))<br>• `origin` (VARCHAR(150))<br>• `destination` (VARCHAR(150))<br>• `vessel` (VARCHAR(100))<br>• `eta` (DATE)<br>• `progress_percent` (INTEGER)<br>• `last_update` (VARCHAR(255))<br>• `created_at` (DATETIME)<br>• `updated_at` (DATETIME) | `UNIQUE(tracking_number)`<br>Status Choices: `'Booked'`, `'In Transit'`, `'Customs Cleared'`, `'Delivered'`<br>Progress Validators: `0 <= val <= 100`<br>`auto_now_add=True`, `auto_now=True` | Active multimodal freight container shipment tracking |
| **`User`** | `auth_user` | • `id` (BigAutoField)<br>• `username` (VARCHAR(150))<br>• `email` (VARCHAR(254))<br>• `password` (VARCHAR(128))<br>• `first_name` (VARCHAR(150))<br>• `last_name` (VARCHAR(150))<br>• `is_active` (BOOLEAN)<br>• `is_staff` (BOOLEAN)<br>• `is_superuser` (BOOLEAN)<br>• `date_joined` (DATETIME)<br>• `last_login` (DATETIME) | Standard `django.contrib.auth.models.User`<br>`UNIQUE(username)`<br>Password hashed via PBKDF2-SHA256 | Authentication & account identity |

### 2.2 Planned Models (Required for Phases 1–3 Migration)

These models are referenced in the platform architecture and migration specifications, but were not yet created in Django ORM:

| Planned Model | Target MySQL Table | Fields & Types | Key Business Rules & Relationships |
| :--- | :--- | :--- | :--- |
| **`User` (Enhanced)** | `users` | • `id` (INT PK AUTO_INCREMENT)<br>• `username` (VARCHAR(150) UNIQUE)<br>• `email` (VARCHAR(255) UNIQUE)<br>• `password_hash` (VARCHAR(255))<br>• `first_name` (VARCHAR(100))<br>• `last_name` (VARCHAR(100))<br>• `role` (ENUM('customer', 'operator', 'admin') DEFAULT 'customer')<br>• `is_active` (TINYINT(1) DEFAULT 1)<br>• `created_at` (TIMESTAMP)<br>• `updated_at` (TIMESTAMP) | Includes the explicit **`role`** field required to enforce role-based access control (RBAC) on write operations (e.g. only admin/operators can modify containers). |
| **`Container`** | `containers` | • `id` (INT PK AUTO_INCREMENT)<br>• `container_code` (VARCHAR(50) UNIQUE)<br>• `type` (VARCHAR(100))<br>• `size_ft` (INT, e.g. 20, 40)<br>• `category` (VARCHAR(100))<br>• `price` (DECIMAL(10,2))<br>• `capacity` (VARCHAR(100))<br>• `is_bookable` (TINYINT(1) DEFAULT 1)<br>• `created_at` (TIMESTAMP)<br>• `updated_at` (TIMESTAMP) | Catalogue of ISO containers. Standard 20ft/40ft types (Dry Standard, High Cube, Refrigerated, Open Top, Flat Rack). `is_bookable` toggles availability. |
| **`Booking`** | `bookings` | • `id` (INT PK AUTO_INCREMENT)<br>• `booking_reference` (VARCHAR(50) UNIQUE)<br>• `user_id` (INT, FK -> users.id)<br>• `container_id` (INT, FK -> containers.id)<br>• `price_snapshot` (DECIMAL(10,2))<br>• `status` (ENUM('pending', 'confirmed', 'in_transit', 'completed', 'cancelled') DEFAULT 'confirmed')<br>• `origin_port` (VARCHAR(150))<br>• `destination_port` (VARCHAR(150))<br>• `start_date` (DATE)<br>• `end_date` (DATE)<br>• `created_at` (TIMESTAMP)<br>• `updated_at` (TIMESTAMP) | **Price-Snapshot Pattern:** `price_snapshot` locks the exact rate agreed at booking time. Even if `containers.price` changes later, the customer's booked price is preserved. |

---

## 3. API Endpoints Inventory

Base URL prefix in Django: `/api/`

| HTTP Method | Route / Path | Django Handler | Auth Required? | Request Payload | Response Shape / Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login/` | `api.auth_views.EmailTokenObtainPairView` | None (`AllowAny`) | `{"email": "...", "password": "..."}` | **200 OK:**<br>`{"access": "<jwt>", "refresh": "<jwt>", "user": {"id": 1, "email": "...", "username": "...", "first_name": "...", "last_name": "..."}}`<br>**401 Unauthorized:**<br>`{"error": "Invalid email address or password.", "details": {...}}` |
| **POST** | `/api/auth/token/refresh/` | `rest_framework_simplejwt.views.TokenRefreshView` | None (`AllowAny`) | `{"refresh": "<jwt_refresh_token>"}` | **200 OK:**<br>`{"access": "<new_jwt_access_token>", "refresh": "<new_jwt_refresh_token>"}` |
| **GET** | `/api/stats/` | `api.views.StatItemViewSet.list` | None (`AllowAny`) | None | **200 OK:**<br>`[{"id": 1, "number": "1200+", "label": "Shipments Delivered", "sublabel": "Across the Globe", "icon_name": "Ship", "order": 1}, ...]` |
| **GET** | `/api/stats/{id}/` | `api.views.StatItemViewSet.retrieve` | None (`AllowAny`) | None | **200 OK:** Single StatItem object |
| **GET** | `/api/features/` | `api.views.FeatureCardViewSet.list` | None (`AllowAny`) | None | **200 OK:**<br>`[{"id": 1, "title": "Smart Booking", "description": "...", "icon_name": "Ship", "order": 1}, ...]` |
| **GET** | `/api/features/{id}/` | `api.views.FeatureCardViewSet.retrieve` | None (`AllowAny`) | None | **200 OK:** Single FeatureCard object |
| **GET** | `/api/shipments/` | `api.views.ShipmentViewSet.list` | None (`AllowAny`) | None | **200 OK:** Array of all Shipment objects |
| **GET** | `/api/shipments/{id}/` | `api.views.ShipmentViewSet.retrieve` | None (`AllowAny`) | None | **200 OK:** Single Shipment object |
| **GET** | `/api/shipments/track/?tracking_no={no}` | `api.views.ShipmentViewSet.track` | None (`AllowAny`) | Query param: `tracking_no` | **200 OK:**<br>`{"id": 1, "tracking_number": "HH-100293", "status": "In Transit", "origin": "Shanghai Port, CN", "destination": "Rotterdam Gateway, NL", "vessel": "HH Horizon V-402", "eta": "2026-08-04", "progress_percent": 68, "last_update": "Passed Singapore Strait (12:40 UTC)", "created_at": "...", "updated_at": "..."}`<br>**400 Bad Request:** `{"error": "Tracking number parameter is required."}`<br>**404 Not Found:** `{"error": "Shipment not found"}` |

---

## 4. Authentication System Details

### 4.1 Django Setup
- **Library:** `djangorestframework-simplejwt` (v5.5.0)
- **Token Type:** Dual-token JWT (Access + Refresh tokens)
- **Access Lifetime:** 60 minutes (`ACCESS_TOKEN_LIFETIME = timedelta(minutes=60)`)
- **Refresh Lifetime:** 7 days (`REFRESH_TOKEN_LIFETIME = timedelta(days=7)`)
- **Rotation:** `ROTATE_REFRESH_TOKENS = True` (new refresh token issued on refresh)
- **Header Format:** `Authorization: Bearer <token>`
- **Custom Login View:** `EmailTokenObtainPairView` in `backend/api/auth_views.py`:
  - Accepts `email` and `password`.
  - Performs case-insensitive email lookup: `User.objects.filter(email__iexact=email).first()`.
  - Checks password against stored hash using `user.check_password(password)`.
  - Validates `user.is_active`.
  - Issues tokens via `RefreshToken.for_user(user)`.
  - Injects `user` object (`id`, `email`, `username`, `first_name`, `last_name`) directly into the JSON response.
- **Frontend Storage (`frontend/src/pages/LoginPage.jsx`):**
  - `localStorage.setItem('hh_access_token', data.access)`
  - `localStorage.setItem('hh_refresh_token', data.refresh)`
  - `localStorage.setItem('hh_user', JSON.stringify(data.user))`
- **Seeded Demo User:**
  - Email: `demo@hashharbour.com`
  - Password: `password123`
  - Username: `demo_user`
  - First Name: `Demo`, Last Name: `User`

---

## 5. Configuration & Settings Inventory (`settings.py`)

- **Environment-based Configuration:**
  - `DJANGO_SECRET_KEY`: Fallback `django-insecure-dev-key-change-in-production`
  - `DJANGO_DEBUG`: Evaluates `DJANGO_DEBUG` env var (defaults to `True`)
  - `DJANGO_ALLOWED_HOSTS`: Comma-separated env var (defaults to `localhost,127.0.0.1,[::1]`)
  - `CORS_ALLOW_ALL_ORIGINS`: Defaults to `False`
  - `CORS_ALLOWED_ORIGINS`: Defaults to `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:5174`, `http://127.0.0.1:5174`
- **Database Configuration:**
  - Engine: `django.db.backends.sqlite3`
  - Path: `BASE_DIR / 'db.sqlite3'`
- **Installed Applications:**
  - Django built-in: `admin`, `auth`, `contenttypes`, `sessions`, `messages`, `staticfiles`
  - Third-party: `rest_framework`, `rest_framework_simplejwt`, `corsheaders`
  - Project app: `api.apps.ApiConfig`
- **Middleware Pipeline:**
  1. `corsheaders.middleware.CorsMiddleware` (handles CORS preflight `OPTIONS` and headers)
  2. `django.middleware.security.SecurityMiddleware`
  3. `django.contrib.sessions.middleware.SessionMiddleware`
  4. `django.middleware.common.CommonMiddleware`
  5. `django.middleware.csrf.CsrfViewMiddleware`
  6. `django.contrib.auth.middleware.AuthenticationMiddleware`
  7. `django.contrib.messages.middleware.MessageMiddleware`
  8. `django.middleware.clickjacking.XFrameOptionsMiddleware`

---

## 6. Custom Business Logic to Preserve

1. **Shipment Tracking Lookup Logic:**
   - Parameter `tracking_no` extracted and whitespace trimmed.
   - Case-insensitive search (`tracking_number__iexact`).
   - Clean 400 error if missing, 404 error if not found, 200 with full shipment payload if matched.
2. **Price-Snapshot Pattern (Bookings):**
   - Freight container pricing fluctuates dynamically.
   - When a booking is created, the system copies the container's current catalog price into `bookings.price_snapshot`.
   - The booking record must perpetually retain this price snapshot regardless of subsequent catalog changes.
3. **Barcode / Image / Vision Tracking (`archive/container-section-tools`):**
   - Repository contains Python computer vision scripts using `Pillow` (PIL) and contour inspection for container branding, ISO markings, and emblem boundaries.
   - For backend tracking in PHP, container ISO 6346 markings and tracking codes should support QR code/barcode generation or parsing via lightweight PHP libraries (e.g. `chillerlan/php-qrcode` or standard SVG barcode generation).
4. **Demo Account & Data Seeder:**
   - Pre-populated statistics (1200+ Shipments, 850+ Routes, 980+ Clients, 95+ Countries).
   - Pre-populated feature cards (Smart Booking, Real-Time Tracking, Secure & Compliant).
   - Pre-populated tracking shipments (`HH-100293` In Transit 68%, `HH-849201` Customs Cleared 92%).
   - Demo user account: `demo@hashharbour.com` / `password123`.

---

## 7. Static & Media File Handling

- Django configuration currently specifies only `STATIC_URL = 'static/'`.
- No active Django user file upload or dynamic media directories (`MEDIA_ROOT` / `MEDIA_URL`) are configured.
- In PHP, static assets will either continue to be served by Vite (frontend) or placed in a standard `backend-php/public/` or `uploads/` directory with Apache directory index protection (`Options -Indexes`).

---

## 8. Dependencies in `requirements.txt`

```text
Django==6.0.6
djangorestframework>=3.15.0
django-cors-headers>=4.7.0
djangorestframework-simplejwt>=5.5.0
```

---

## 9. Proposed PHP + MySQL Architecture & Direct Equivalents

| Django / Python Component | Proposed PHP + MySQL Equivalent | Implementation Details & Strategy |
| :--- | :--- | :--- |
| **Runtime & Server** | PHP 8.2+ running on Apache / XAMPP | Runs on standard XAMPP stack (`http://localhost/backend-php` or Apache virtual host). |
| **Database (SQLite)** | MySQL 8.0+ via PDO (`PDO::ATTR_ERRMODE => ERRMODE_EXCEPTION`, UTF8mb4) | Connection configured in `backend-php/config/db.php`. Default XAMPP settings: `host=localhost`, `port=3306`, `user=root`, `password=""`, `dbname=hashharbour`. Prepared statements used for 100% of queries. |
| **JWT Authentication** (`simplejwt`) | `firebase/php-jwt` (v6.x via Composer) or zero-dependency native HMAC-SHA256 JWT helper | Dual token flow matching Django: Access token (1 hour expiry) + Refresh token (7 days expiry). HS256 algorithm with a shared secret key. |
| **`EmailTokenObtainPairView`** | `POST /api/auth/login.php` (or router `POST /api/auth/login/`) | Queries `SELECT * FROM users WHERE LOWER(email) = LOWER(:email) LIMIT 1`. Verifies password with `password_verify($password, $user['password_hash'])`. Returns identical JSON: `{"access": "...", "refresh": "...", "user": {...}}`. |
| **Token Refresh View** | `POST /api/auth/refresh.php` | Validates refresh token signature, checks expiration, issues a newly signed access token. |
| **Auth Middleware (`IsAuthenticated`)** | Shared helper `includes/auth.php` (`require_auth()`) | Reads `getallheaders()['Authorization']` or `$_SERVER['HTTP_AUTHORIZATION']`, extracts `Bearer <token>`, decodes JWT via secret. If invalid or expired, immediately outputs HTTP 401 JSON and halts execution (`exit`). |
| **Role Guard (`IsAdmin` / `IsOperator`)** | Shared helper `require_role('admin')` | Checks token payload `'role'`. If insufficient privileges, responds with HTTP 403 Forbidden. |
| **CORS Middleware (`django-cors-headers`)** | Shared helper `includes/cors.php` | Outputs CORS headers on every response:<br>`Access-Control-Allow-Origin: *`<br>`Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`<br>`Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`<br>Handles `OPTIONS` preflight requests immediately with HTTP 200/204. |
| **API Response Serialization** | Shared helper `includes/response.php` (`send_json($data, $code)`) | Standardized JSON emitter: sets `Content-Type: application/json`, HTTP response code, encodes JSON with `JSON_UNESCAPED_SLASHES`. |
| **Shipment Tracking Endpoint** | `GET /api/shipments/track.php?tracking_no=...` | Prepares `SELECT * FROM shipments WHERE UPPER(tracking_number) = UPPER(:tracking_no) LIMIT 1`. Outputs matching shipment object or 404 error matching DRF response. |
| **Containers CRUD** | `api/containers/index.php` | • `GET`: Public listing and detail view<br>• `POST`: Requires `require_auth()` + admin/operator role<br>• `PUT`: Requires admin/operator role<br>• `DELETE`: Requires admin role |
| **Bookings API & Price Snapshot** | `api/bookings/index.php` | • Requires `require_auth()`.<br>• On `POST`: Validates `container_id`. Queries `containers` table to fetch current `price`. Inserts new record into `bookings` storing `price_snapshot = $container['price']`.<br>• On `GET`: Returns bookings for the authenticated user (or all bookings if admin). |
| **Database Seeder** | `database/seed.sql` + `database/schema.sql` | SQL schema script creating all tables, indexes, and constraints + seed script populating demo user (with `PASSWORD_BCRYPT` hash of `password123`), stats, features, shipments, and containers. |

---

## 10. Audit Sign-Off & Verification

This report captures the complete state of the Django backend and establishes the precise technical specification for Phase 1. 

**Next Action:** Awaiting explicit user confirmation before initiating **Phase 1 — Scaffold**. No files in `backend/` have been altered, and no PHP code has been authored.
