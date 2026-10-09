# HashHarbour — About Section Package

Is folder me HashHarbour About Section se related sabhi structural components, styling, animations, tokens aur utility files ko collect aur organize kiya gaya hai.

---

## 📁 Directory Structure

```
About Section/
├── components/           # All 11 About Section JSX Components
│   ├── AboutSection.jsx          # Master Section Container (GSAP & IntersectionObserver)
│   ├── AboutHero.jsx             # Intro Header & Infrastructure Subtitle
│   ├── AboutNetwork.jsx          # Interactive 3D Globe & Core Principles Grid
│   ├── AboutGlobeCanvas.jsx      # HTML5 Canvas 3D Rotating Earth & Trade Arcs
│   ├── AboutContent.jsx          # Content Overlay & Metric Highlights
│   ├── AboutFloatingCards.jsx    # Glassmorphic Infrastructure Cards
│   ├── TradePillars.jsx          # 3 Trade Visibility & Risk Assurance Pillars
│   ├── TradeJourney.jsx          # Interactive 4-Step Logistics Workflow Stepper
│   ├── TrustLayer.jsx            # Security, Encryption & Compliance Layer
│   ├── TradeEcosystem.jsx        # Connected Trade Stakeholders Showcase
│   └── BrandStatement.jsx        # Brand Manifesto & Action CTA
│
├── ui/                   # Shared UI Primitives
│   └── Button.jsx                # Universal Button Primitive
│
├── styles/               # CSS Design System & Keyframe Animations
│   ├── index.css                 # Base Design System, Glassmorphism & Utilities
│   └── animations.css            # Hover Interactions & Micro-animations
│
├── theme/                # Design Tokens
│   └── tokens.js                 # Theme Colors, Spacing & Elevation Tokens
│
└── utils/                # Utility Functions
    ├── accessibility.js          # Accessibility Helpers & Reduced Motion
    ├── cn.js                     # Tailwind Class Merging Utility
    └── performance.js            # RAF Throttling Utilities
```

---

## 🚀 Key Features Included

1. **3D Globe Canvas:** Interactive rotating Earth visualization rendered on HTML5 Canvas with glowing trade arcs (`AboutGlobeCanvas.jsx`).
2. **Trade Stepper:** 4-step interactive supply chain workflow stepper (`TradeJourney.jsx`).
3. **Trade Pillars:** 3-pillar trade visibility and assurance showcase (`TradePillars.jsx`).
4. **Glassmorphism & Neon Cyan Theme:** Dark navy (`#061426` / `#0A1B31`) background with cyan (`#00D4FF`) glowing accents and glassmorphic panels (`index.css` & `tokens.js`).
