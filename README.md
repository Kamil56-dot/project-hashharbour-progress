# HashHarbour — Next-Gen EXIM Trade & Logistics Platform

HashHarbour is a modern, unified export-import (EXIM) trade and container logistics platform. It features 3D interactive container inspection, real-time multimodal shipment tracking, digital trade documentation management, and trade ecosystem workflows.

---

## 🏗️ Architecture Overview

The repository is organized into a clean decoupled full-stack architecture:

```
HashHarbour/
├── frontend/               # React 19 + Vite 8 SPA Client (Three.js, Tailwind CSS, GSAP)
├── backend/                # Django REST Framework API (Shipment tracking, stats, features)
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

### 1. Backend Setup (Django REST Framework)

#### Prerequisites
- Python 3.10 to 3.14
- `pip` package manager

#### Setup & Run
From the project root:
```bash
# Navigate to backend
cd backend

# (Optional) Create and activate a virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify database and configuration
python manage.py check

# (Optional) Seed demo shipments and stats
python seed.py

# Start the Django development server
python manage.py runserver
```
The backend API will be available at `http://localhost:8000/`.  
Browse API endpoints:
- Shipment Tracking: `http://localhost:8000/api/shipments/track/?tracking_no=HH-100293`
- Shipments List: `http://localhost:8000/api/shipments/`
- Platform Stats: `http://localhost:8000/api/stats/`
- Feature Cards: `http://localhost:8000/api/features/`

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
- **`backend/`**: Active REST API server.
- **`archive/`**: Preserved historical assets:
  - `archive/about-section-legacy/`: Original standalone About section package.
  - `archive/container-section-frontend-prototype/`: Isolated prototype frontend for container section.
  - `archive/container-section-tools/`: Vectorization and image processing Python scripts.
- **`AUDIT_REPORT.md`**: In-depth security, performance, code quality, and logic audit.
