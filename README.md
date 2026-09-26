# HashHarbour — Next-Gen EXIM Trade & Logistics Platform

HashHarbour is a modern, unified export-import (EXIM) trade and container logistics platform. It features 3D interactive container inspection, real-time multimodal shipment tracking, digital trade documentation management, and trade ecosystem workflows.

---

## 🏗️ Architecture Overview

The repository is organized into a clean decoupled full-stack architecture:

```
HashHarbour/
├── frontend/               # React 19 + Vite 8 SPA Client (Three.js, Tailwind CSS, GSAP)
├── backend-php/            # Pure PHP 8.1+ & MySQL 8.0+ REST API (Auth, Containers, Bookings, Shipments)
├── archive/                # Legacy prototypes, standalones, and development CV tools
│   ├── about-section-legacy/
│   ├── container-section-frontend-prototype/
│   └── container-section-tools/
├── AUDIT_REPORT.md         # Full technical analysis & security audit report
├── .gitignore              # Project-wide gitignore rules
└── README.md               # Master project documentation
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup (PHP 8.1+ & MySQL / XAMPP)

#### Prerequisites
- XAMPP (Apache with `mod_rewrite` + MySQL service)
- PHP 8.1 or higher with `pdo_mysql` and `openssl` extensions enabled

#### Setup & Run
1. Start **Apache** and **MySQL** services in the XAMPP Control Panel.
2. Import the database schema and seed data into MySQL:
   ```bash
   mysql -u root hashharbour < backend-php/schema.sql
   ```
3. Map `backend-php/` into XAMPP's `htdocs` directory (e.g. symlink or directory junction):
   ```cmd
   mklink /J "C:\xampp\htdocs\hashharbour-api" "path\to\backend-php"
   ```
4. Verify backend endpoints:
   - Platform Stats: `http://localhost/hashharbour-api/api/stats/`
   - Feature Cards: `http://localhost/hashharbour-api/api/features/`
   - ISO Containers Catalog: `http://localhost/hashharbour-api/api/containers/`
   - Shipment Tracking: `http://localhost/hashharbour-api/api/shipments/track/?tracking_no=HH-100293`
   - Auth Login: `POST http://localhost/hashharbour-api/api/auth/login/`

---

### 2. Frontend Setup (React + Vite)

#### Prerequisites
- Node.js 18.0.0 or higher
- `npm` 9.0.0 or higher

#### Setup & Run
From the project root:
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The web application will open at `http://localhost:5173/`.

#### Build for Production
```bash
cd frontend
npm run build
```
Compiled production assets are output to `frontend/dist/`.

---

## 📦 Repositories & Archives

- **`frontend/`**: Active client application. See [`frontend/README.md`](frontend/README.md) for frontend-specific documentation.
- **`backend-php/`**: Active PHP 8.1+ & MySQL 8.0+ REST API server.
- **`archive/`**: Preserved historical assets:
  - `archive/about-section-legacy/`: Original standalone About section package.
  - `archive/container-section-frontend-prototype/`: Isolated prototype frontend for container section.
  - `archive/container-section-tools/`: Vectorization and image processing Python scripts.
- **`AUDIT_REPORT.md`**: In-depth security, performance, code quality, and logic audit.
