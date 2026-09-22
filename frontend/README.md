# HashHarbour — Frontend Client

The frontend client for the **HashHarbour** Next-Gen EXIM Trade & Logistics Platform. Built with React 19, Vite 8, Tailwind CSS, Three.js / React Three Fiber for 3D container visualization, and GSAP.

---

## 🛠️ Tech Stack

- **Framework:** React 19 (`react`, `react-dom`)
- **Bundler:** Vite 8 (`@vitejs/plugin-react`)
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v3, PostCSS, Autoprefixer
- **3D Visualization:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations:** GSAP, Lenis (Smooth Scroll)
- **Icons:** Lucide React, React Icons

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation
From the `frontend/` directory:
```bash
npm install
```

### Development Server
Start the local Vite development server:
```bash
npm run dev
```
The application will open at `http://localhost:5173`.

### Production Build
Compile and bundle production assets:
```bash
npm run build
```
Built files will be output to the `frontend/dist/` directory.

### Preview Production Build
Locally preview the production build:
```bash
npm run preview
```

---

## 📁 Directory Structure

```
frontend/
├── public/                 # Static public assets (SVGs, logos, videos)
├── src/
│   ├── animations/         # GSAP animation variants and timing curves
│   ├── assets/             # Media assets (images, fonts, custom graphics)
│   ├── components/
│   │   ├── about/          # About section (interactive 3D globe, trade pillars)
│   │   ├── archived-hero/  # Standalone archived hero preview (/home-preview)
│   │   ├── home/           # Home page components (light navbar, hero, track bar, container viewer)
│   │   ├── layout/         # Shared global navigation, logo, mobile menu
│   │   ├── services/       # Services section (stacked container pyramid)
│   │   └── ui/             # Reusable UI primitives (Button)
│   ├── config/             # Runtime environment configuration
│   ├── constants/          # Navigation links, stats, taglines
│   ├── hooks/              # Custom hooks (typewriter, reduced motion, scroll)
│   ├── pages/              # Page views (ContainerPage 3D showcase)
│   ├── styles/             # Global CSS and keyframe animations
│   ├── theme/              # Design tokens and color scales
│   ├── utils/              # Helper utilities (cn, accessibility, performance)
│   ├── App.jsx             # Main application layout and routes
│   └── main.jsx            # React root mount point
├── index.html              # HTML template entry
├── package.json            # Node manifest and dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite build configuration with path aliases
```

---

## 🔌 API Integration

The frontend connects to the Django REST backend at `http://localhost:8000/api/`. Ensure the backend server is running when testing tracking and booking functionality.
