import React, { Suspense, lazy, useState } from 'react';
import {
  ShieldCheck,
  Layers,
  Lock,
  CloudRain,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/* Lazy-load the 3D viewer so Three.js lives in its own chunk */
const HomeContainerViewer = lazy(() => import('./HomeContainerViewer'));

/* ─── Steps Data ─── */
const STEPS = [
  { number: '01', label: 'Overview' },
  { number: '02', label: 'Specifications' },
  { number: '03', label: '360° View' },
  { number: '04', label: 'Features' },
];

/* ─── Features Data ─── */
const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'ISO 668 Certified',
    description: 'Built to international standards',
  },
  {
    icon: Layers,
    title: 'Corrosion Resistant',
    description: 'Marine-grade corten steel',
  },
  {
    icon: Lock,
    title: 'Secure Locking',
    description: 'Advanced locking systems',
  },
  {
    icon: CloudRain,
    title: 'Weather Proof',
    description: 'Built for all environments',
  },
];

/* ─── 3D Loading Skeleton ─── */
function ViewerSkeleton() {
  return (
    <div
      className="w-full flex items-center justify-center bg-gray-50 animate-pulse"
      style={{
        aspectRatio: '4 / 3',
        minHeight: 'clamp(280px, 40vh, 500px)',
        borderRadius: 'clamp(12px, 1vw, 16px)',
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-500 animate-spin" />
        <span
          className="text-gray-400 font-medium"
          style={{ fontSize: 'clamp(11px, 0.8vw, 13px)' }}
        >
          Loading 3D Container...
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN EXPORT — HomeContainerSection
   ═══════════════════════════════════════ */
export function HomeContainerSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      className="w-full bg-white"
      style={{
        paddingTop: 'clamp(48px, 6vh, 80px)',
        paddingBottom: 'clamp(48px, 6vh, 80px)',
        paddingLeft: 'clamp(16px, 4vw, 64px)',
        paddingRight: 'clamp(16px, 4vw, 64px)',
      }}
    >
      <div className="w-full mx-auto" style={{ maxWidth: '1240px' }}>
        {/* Section Header */}
        <div
          className="text-center"
          style={{ marginBottom: 'clamp(32px, 5vh, 64px)' }}
        >
          <h2
            className="font-extrabold text-gray-900 uppercase tracking-tight leading-none"
            style={{
              fontSize: 'clamp(24px, 3vw, 42px)',
              marginBottom: 'clamp(8px, 1vh, 16px)',
            }}
          >
            20FT ISO Standard
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div
              className="bg-gray-900"
              style={{
                width: 'clamp(24px, 3vw, 48px)',
                height: '2px',
              }}
            />
            <p
              className="text-gray-400 font-medium uppercase tracking-widest"
              style={{ fontSize: 'clamp(10px, 0.75vw, 13px)' }}
            >
              Shipping Container
            </p>
            <div
              className="bg-gray-900"
              style={{
                width: 'clamp(24px, 3vw, 48px)',
                height: '2px',
              }}
            />
          </div>
        </div>

        {/* 3-Column Grid */}
        <div
          className="grid items-center"
          style={{
            gridTemplateColumns: 'clamp(140px, 18%, 220px) 1fr clamp(180px, 24%, 280px)',
            gap: 'clamp(16px, 2vw, 40px)',
          }}
        >
          {/* ── LEFT COLUMN — Steps List ── */}
          <div className="hidden lg:flex flex-col self-center">
            {STEPS.map((step, idx) => {
              const isActive = idx === activeStep;
              return (
                <div key={step.number} className="flex items-start gap-3">
                  {/* Vertical connector + circle */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setActiveStep(idx)}
                      className={`shrink-0 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none ${
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-400 border-2 border-gray-200 hover:border-gray-400'
                      }`}
                      style={{
                        width: 'clamp(28px, 2.5vw, 36px)',
                        height: 'clamp(28px, 2.5vw, 36px)',
                      }}
                      aria-label={`Step ${step.number}: ${step.label}`}
                    >
                      <span
                        className="font-bold"
                        style={{ fontSize: 'clamp(9px, 0.7vw, 11px)' }}
                      >
                        {step.number}
                      </span>
                    </button>
                    {/* Connector line */}
                    {idx < STEPS.length - 1 && (
                      <div
                        className="w-px bg-gray-200"
                        style={{
                          height: 'clamp(20px, 2.5vh, 36px)',
                          marginTop: 'clamp(4px, 0.5vh, 8px)',
                          marginBottom: 'clamp(4px, 0.5vh, 8px)',
                        }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`font-semibold uppercase tracking-wider transition-colors duration-200 ${
                      isActive ? 'text-gray-900' : 'text-gray-400'
                    }`}
                    style={{
                      fontSize: 'clamp(10px, 0.8vw, 13px)',
                      marginTop: 'clamp(5px, 0.6vw, 8px)',
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── CENTER COLUMN — 3D Container ── */}
          <div className="relative flex flex-col items-center col-span-full lg:col-span-1 order-first lg:order-none">
            {/* Ghost "20FT" text behind container */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span
                className="font-extrabold text-gray-100 uppercase leading-none"
                style={{
                  fontSize: 'clamp(100px, 14vw, 220px)',
                  letterSpacing: '0.05em',
                }}
                aria-hidden="true"
              >
                20FT
              </span>
            </div>

            {/* 3D Viewer */}
            <div className="relative z-10 w-full">
              <Suspense fallback={<ViewerSkeleton />}>
                <HomeContainerViewer />
              </Suspense>
            </div>

            {/* Nav Arrows */}
            <div
              className="flex items-center justify-center gap-3"
              style={{ marginTop: 'clamp(8px, 1vh, 16px)' }}
            >
              <button
                className="flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all duration-150 cursor-pointer"
                style={{
                  width: 'clamp(28px, 2.5vw, 36px)',
                  height: 'clamp(28px, 2.5vw, 36px)',
                }}
                aria-label="Previous view"
              >
                <ChevronLeft
                  style={{
                    width: 'clamp(14px, 1vw, 18px)',
                    height: 'clamp(14px, 1vw, 18px)',
                  }}
                />
              </button>

              {/* Dot indicators */}
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className={`rounded-full transition-all duration-200 ${
                      dot === 0
                        ? 'bg-gray-900'
                        : 'bg-gray-200'
                    }`}
                    style={{
                      width: dot === 0 ? 'clamp(16px, 1.4vw, 22px)' : 'clamp(5px, 0.4vw, 7px)',
                      height: 'clamp(5px, 0.4vw, 7px)',
                      borderRadius: '100px',
                    }}
                  />
                ))}
              </div>

              <button
                className="flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all duration-150 cursor-pointer"
                style={{
                  width: 'clamp(28px, 2.5vw, 36px)',
                  height: 'clamp(28px, 2.5vw, 36px)',
                }}
                aria-label="Next view"
              >
                <ChevronRight
                  style={{
                    width: 'clamp(14px, 1vw, 18px)',
                    height: 'clamp(14px, 1vw, 18px)',
                  }}
                />
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Feature Grid ── */}
          <div
            className="hidden lg:flex flex-col self-center"
            style={{ gap: 'clamp(16px, 2.5vh, 32px)' }}
          >
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="flex items-start gap-3 group">
                  {/* Icon box */}
                  <div
                    className="shrink-0 flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-500 rounded-lg group-hover:bg-gray-100 group-hover:text-gray-700 transition-all duration-200"
                    style={{
                      width: 'clamp(36px, 3vw, 46px)',
                      height: 'clamp(36px, 3vw, 46px)',
                    }}
                  >
                    <Icon
                      style={{
                        width: 'clamp(16px, 1.3vw, 20px)',
                        height: 'clamp(16px, 1.3vw, 20px)',
                        strokeWidth: 1.75,
                      }}
                    />
                  </div>
                  {/* Text */}
                  <div className="flex flex-col">
                    <span
                      className="font-bold text-gray-900 leading-tight"
                      style={{ fontSize: 'clamp(12px, 0.9vw, 15px)' }}
                    >
                      {feat.title}
                    </span>
                    <span
                      className="text-gray-400 font-medium leading-snug"
                      style={{
                        fontSize: 'clamp(10px, 0.7vw, 12px)',
                        marginTop: '2px',
                      }}
                    >
                      {feat.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile: Steps + Features below 3D (visible below lg) ── */}
        <div
          className="lg:hidden grid grid-cols-2 gap-4"
          style={{ marginTop: 'clamp(24px, 4vh, 40px)' }}
        >
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-lg"
              >
                <div className="shrink-0 w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-gray-500 rounded-md">
                  <Icon className="w-4 h-4" style={{ strokeWidth: 1.75 }} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-gray-900 leading-tight">
                    {feat.title}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium leading-snug mt-0.5">
                    {feat.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
