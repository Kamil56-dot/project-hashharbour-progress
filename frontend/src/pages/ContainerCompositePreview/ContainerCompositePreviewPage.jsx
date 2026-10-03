import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ContainerCompositeNavbar } from './ContainerCompositeNavbar';
import redContainerImg from '../../assets/containers/red container.png';
import oilTankImg from '../../assets/containers/oil-tank-container.png';
import reeferImg from '../../assets/containers/reefer container.png';
import { ChevronLeft, ChevronRight, ArrowRight, Globe, ShieldCheck, ArrowLeft } from 'lucide-react';

/**
 * 3-Item Container Carousel Dataset
 * Sequence ordered so:
 * - Index 0: Standard Dry (Initial Center)
 * - Index 1: Reefer (Initial Right)
 * - Index 2: Oil / Tank (Initial Left)
 */
const CONTAINERS = [
  {
    id: 'standard-dry',
    name: 'Standard Dry',
    label: 'Standard Dry Container',
    bookLabel: 'Book Standard Dry Container',
    tag: 'ISO 20ft / 40ft General Freight',
    headline: 'Flexible. Durable. Global.',
    description: 'Standard 20ft & 40ft ISO dry containers available for global shipping at competitive rates.',
    image: redContainerImg,
    alt: 'Standard Dry Shipping Container',
  },
  {
    id: 'reefer',
    name: 'Reefer',
    label: 'Reefer Container',
    bookLabel: 'Book Reefer Container',
    tag: 'Cold Chain ISO Unit (-30°C to +30°C)',
    headline: 'Precision Temperature Control.',
    description: 'Advanced refrigerated cold-chain containers for perishables, pharmaceuticals, and sensitive cargo.',
    image: reeferImg,
    alt: 'Reefer Temperature-Controlled Container',
  },
  {
    id: 'oil-tank',
    name: 'Oil / Tank',
    label: 'Oil/Tank Container',
    bookLabel: 'Book Oil/Tank Container',
    tag: 'Certified Liquid & Chemical Intermodal Tank',
    headline: 'Certified Safe Bulk Liquids.',
    description: 'High-grade stainless steel ISO tank containers engineered for food-grade liquids and hazardous chemical transport.',
    image: oilTankImg,
    alt: 'Oil and Tank Container',
  },
];

export function ContainerCompositePreviewPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [centerIndex, setCenterIndex] = useState(0);

  /**
   * Determine the current spatial role for each container:
   * - 'center': occupying the foreground anchor position
   * - 'right': occupying the right background slot
   * - 'left': occupying the left background slot
   */
  const getRole = useCallback((index, currentCenter) => {
    if (index === currentCenter) return 'center';
    if (index === (currentCenter + 1) % 3) return 'right';
    return 'left';
  }, []);

  // Advance forward: right arrow moves right item into center, center moves to left
  const handleNext = useCallback(() => {
    setCenterIndex((prev) => (prev + 1) % 3);
  }, []);

  // Reverse backward: left arrow moves left item into center, center moves to right
  const handlePrev = useCallback(() => {
    setCenterIndex((prev) => (prev - 1 + 3) % 3);
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Navigate to container booking flow
  const handleBookContainer = () => {
    const active = CONTAINERS[centerIndex];
    navigate(`/container-section?type=${active.id}&action=book`);
  };

  const activeContainer = CONTAINERS[centerIndex];

  return (
    <div
      className={`min-h-screen lg:h-screen lg:max-h-screen w-full transition-colors duration-300 pt-[78px] lg:pt-[82px] pb-2 px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col justify-between overflow-x-hidden ${
        isDark ? 'bg-transparent text-white' : 'bg-transparent text-[#0F172A]'
      }`}
    >
      {/* ─── DEDICATED PREVIEW NAVBAR ─── */}
      <ContainerCompositeNavbar />

      {/* ─── SCOPED CSS FOR SMOOTH CAROUSEL ROLE TRANSITIONS ─── */}
      <style>{`
        .composite-card {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform-origin: bottom center;
          transition: transform 480ms cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 480ms cubic-bezier(0.22, 1, 0.36, 1),
                      filter 480ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
        }

        /* Center Role: Front, scale 1.0, z-index 20 */
        .composite-card.role-center {
          z-index: 20;
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
          pointer-events: auto;
          cursor: default;
        }

        /* Left Role: Receded back-left, scale 0.65-0.68, z-index 10 */
        .composite-card.role-left {
          z-index: 10;
          opacity: 0.88;
          transform: translate(calc(-50% - 235px), -8px) scale(0.65);
          pointer-events: auto;
          cursor: pointer;
        }
        .composite-card.role-left:hover {
          opacity: 1;
        }
        @media (min-width: 640px) {
          .composite-card.role-left {
            transform: translate(calc(-50% - 290px), -12px) scale(0.66);
          }
        }
        @media (min-width: 768px) {
          .composite-card.role-left {
            transform: translate(calc(-50% - 350px), -16px) scale(0.67);
          }
        }
        @media (min-width: 1024px) {
          .composite-card.role-left {
            transform: translate(calc(-50% - 405px), -20px) scale(0.68);
          }
        }
        @media (min-width: 1280px) {
          .composite-card.role-left {
            transform: translate(calc(-50% - clamp(310px, calc(50vw - 330px), 440px)), -24px) scale(0.68);
          }
        }

        /* Right Role: Receded back-right, scale 0.65-0.68, z-index 10 */
        .composite-card.role-right {
          z-index: 10;
          opacity: 0.88;
          transform: translate(calc(-50% + 235px), -8px) scale(0.65);
          pointer-events: auto;
          cursor: pointer;
        }
        .composite-card.role-right:hover {
          opacity: 1;
        }
        @media (min-width: 640px) {
          .composite-card.role-right {
            transform: translate(calc(-50% + 290px), -12px) scale(0.66);
          }
        }
        @media (min-width: 768px) {
          .composite-card.role-right {
            transform: translate(calc(-50% + 350px), -16px) scale(0.67);
          }
        }
        @media (min-width: 1024px) {
          .composite-card.role-right {
            transform: translate(calc(-50% + 405px), -20px) scale(0.68);
          }
        }
        @media (min-width: 1280px) {
          .composite-card.role-right {
            transform: translate(calc(-50% + clamp(310px, calc(50vw - 330px), 440px)), -24px) scale(0.68);
          }
        }

        /* ─── TANK CONTAINER ASPECT-RATIO HEIGHT COMPENSATION ───
           The Oil/Tank image is 666x375 (0.563 height/width ratio), whereas Standard Dry
           and Reefer are 577x433 (0.750 height/width ratio). Applying uniform scale(0.68)
           rendered the tank 25% shorter than the reefer in the same side slot.
           Scaling the Tank by ~1.28x (scale 0.83-0.87) matches its visual height and prominence
           to the box containers, with lateral offsets tuned to maintain an even visual gap. */
        .composite-card.is-tank.role-left {
          transform: translate(calc(-50% - 260px), -8px) scale(0.835);
        }
        @media (min-width: 640px) {
          .composite-card.is-tank.role-left {
            transform: translate(calc(-50% - 325px), -12px) scale(0.845);
          }
        }
        @media (min-width: 768px) {
          .composite-card.is-tank.role-left {
            transform: translate(calc(-50% - 395px), -16px) scale(0.858);
          }
        }
        @media (min-width: 1024px) {
          .composite-card.is-tank.role-left {
            transform: translate(calc(-50% - 455px), -20px) scale(0.87);
          }
        }
        @media (min-width: 1280px) {
          .composite-card.is-tank.role-left {
            transform: translate(calc(-50% - clamp(340px, calc(50vw - 305px), 485px)), -24px) scale(0.87);
          }
        }

        .composite-card.is-tank.role-right {
          transform: translate(calc(-50% + 260px), -8px) scale(0.835);
        }
        @media (min-width: 640px) {
          .composite-card.is-tank.role-right {
            transform: translate(calc(-50% + 325px), -12px) scale(0.845);
          }
        }
        @media (min-width: 768px) {
          .composite-card.is-tank.role-right {
            transform: translate(calc(-50% + 395px), -16px) scale(0.858);
          }
        }
        @media (min-width: 1024px) {
          .composite-card.is-tank.role-right {
            transform: translate(calc(-50% + 455px), -20px) scale(0.87);
          }
        }
        @media (min-width: 1280px) {
          .composite-card.is-tank.role-right {
            transform: translate(calc(-50% + clamp(340px, calc(50vw - 305px), 485px)), -24px) scale(0.87);
          }
        }

        /* ─── BOOK BUTTON SHINE SWEEP EFFECT ───
           A subtle diagonal light sheen that periodically sweeps across the button.
           3s cycle: ~1.2s sweep across button width (0% to 40%), ~1.8s pause (40% to 100%). */
        @keyframes book-btn-shine {
          0% {
            transform: translateX(-160%) skewX(-20deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          38% {
            transform: translateX(280%) skewX(-20deg);
            opacity: 1;
          }
          39%, 100% {
            transform: translateX(280%) skewX(-20deg);
            opacity: 0;
          }
        }

        .book-btn-shine-streak {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 55%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.06) 20%,
            rgba(255, 255, 255, 0.38) 50%,
            rgba(255, 255, 255, 0.06) 80%,
            transparent 100%
          );
          transform: translateX(-160%) skewX(-20deg);
          animation: book-btn-shine 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          pointer-events: none;
          z-index: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .book-btn-shine-streak {
            animation: none;
            display: none;
          }
        }

        /* Stage clipping: full viewport width, visible so no container is cut off inside stage */
        .composite-stage-clip {
          overflow: visible;
        }
      `}</style>

      {/* ─── TOP SECTION: BACK BUTTON & HERO HEADINGS ─── */}
      <div className="w-full max-w-6xl mx-auto flex flex-col shrink-0">
        
        {/* Clean Back Button */}
        <div className="w-full flex items-center justify-start mb-2 lg:mb-2.5">
          <Link
            to="/container-section"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#475569] hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors py-1 px-2.5 -ml-2.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/[0.06]"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Back to Container Section</span>
          </Link>
        </div>

        {/* Reference Hero Title Block */}
        <div className="text-center my-0.5">
          <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-cyan-400 mb-0.5">
            Global Logistics Solutions
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-extrabold tracking-tight text-[#0F172A] dark:text-white leading-tight mb-0.5">
            Intermodal Cargo Container Platform
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-normal line-clamp-1">
            Reliable containers. Global reach. Flexible solutions for your import and export needs.
          </p>
        </div>
      </div>

      {/* ─── CENTER STAGE: 3-CONTAINER SPACIOUS CAROUSEL (FULL-WIDTH VIEWPORT SECTION) ─── */}
      <div className="relative w-auto -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-12 flex items-center justify-center my-auto shrink-0">

        {/* ── DESKTOP NAV ARROWS (≥1024px) — viewport-edge positioned, clear of containers ── */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous container"
          className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 ${
            isDark
              ? 'bg-slate-800/90 hover:bg-slate-700/90 active:bg-slate-600/90 backdrop-blur-sm border border-white/15 text-cyan-400 shadow-lg shadow-black/40 hover:scale-110 active:scale-95'
              : 'bg-blue-50 hover:bg-blue-100 active:bg-blue-200 backdrop-blur-sm border border-blue-200 text-blue-600 shadow-md hover:scale-110 active:scale-95'
          }`}
          style={{ left: 'clamp(12px, 3vw, 40px)' }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next container"
          className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 ${
            isDark
              ? 'bg-slate-800/90 hover:bg-slate-700/90 active:bg-slate-600/90 backdrop-blur-sm border border-white/15 text-cyan-400 shadow-lg shadow-black/40 hover:scale-110 active:scale-95'
              : 'bg-blue-50 hover:bg-blue-100 active:bg-blue-200 backdrop-blur-sm border border-blue-200 text-blue-600 shadow-md hover:scale-110 active:scale-95'
          }`}
          style={{ right: 'clamp(12px, 3vw, 40px)' }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* ── Container Content Area ── */}
        <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-12">

        {/* ── Container Stage (Exact Height & Baseline Ground Plane) ── */}
        <div className="composite-stage-clip relative w-full h-[260px] sm:h-[290px] md:h-[320px] lg:h-[350px] xl:h-[385px] flex items-end justify-center select-none overflow-visible">
          
          {/* Subtle Studio Floor Atmosphere */}
          <div
            className="absolute inset-x-0 bottom-0 h-[200px] pointer-events-none -z-10"
            style={{
              background: isDark
                ? 'radial-gradient(ellipse 75% 55% at 50% 90%, rgba(14, 27, 49, 0.42) 0%, rgba(6, 11, 20, 0) 80%)'
                : 'radial-gradient(ellipse 75% 55% at 50% 90%, rgba(215, 233, 252, 0.65) 0%, rgba(235, 243, 252, 0) 80%)',
            }}
          />

          {/* 3 Containers with Smooth Role-Based Transitions */}
          {CONTAINERS.map((container, idx) => {
            const role = getRole(idx, centerIndex);
            const isCenter = role === 'center';

            return (
              <div
                key={container.id}
                role="button"
                tabIndex={isCenter ? -1 : 0}
                aria-label={isCenter ? `${container.name} (Centered)` : `Rotate ${container.name} to center`}
                onClick={() => {
                  if (role === 'left') handlePrev();
                  if (role === 'right') handleNext();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (role === 'left') handlePrev();
                    if (role === 'right') handleNext();
                  }
                }}
                className={`composite-card role-${role} ${container.id === 'oil-tank' ? 'is-tank' : 'is-box'} w-[270px] sm:w-[340px] md:w-[410px] lg:w-[470px] xl:w-[520px]`}
              >
                {/* Container Image — all-sides silhouette glow via drop-shadow on alpha channel */}
                <img
                  src={container.image}
                  alt={container.alt}
                  className="w-full h-auto object-contain block relative z-10 select-none"
                  style={{
                    filter: isDark
                      ? 'drop-shadow(0 0 7px rgba(255,255,255,0.22)) drop-shadow(0 0 18px rgba(255,255,255,0.10))'
                      : 'drop-shadow(0 0 7px rgba(15,23,42,0.18)) drop-shadow(0 0 18px rgba(15,23,42,0.08))',
                    transition: 'filter 300ms ease',
                  }}
                  loading="eager"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
        </div>{/* close content area */}
      </div>

      {/* ─── BOTTOM SECTION: INDICATORS, CTAS & PILLARS (UNIFIED AIM ROW) ─── */}
      <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center shrink-0 mb-6">
        
        {/* Pagination Indicator Dots with Mobile Arrows (<1024px) */}
        <div className="flex items-center justify-center gap-2 mt-0 mb-0.5">
          {/* Mobile Left Arrow (< 1024px only) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous container"
            className={`lg:hidden flex w-8 h-8 rounded-full items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 ${
              isDark
                ? 'bg-slate-800/90 hover:bg-slate-700/90 active:bg-slate-600/90 border border-white/15 text-cyan-400'
                : 'bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border border-blue-200 text-blue-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-1.5" role="tablist" aria-label="Container indicators">
            {CONTAINERS.map((c, idx) => {
              const isActive = idx === centerIndex;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Select ${c.name} container`}
                  onClick={() => setCenterIndex(idx)}
                  className="w-6 h-6 min-w-[24px] min-h-[24px] flex items-center justify-center p-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 rounded-full"
                >
                  <span
                    className={`w-[14px] h-[14px] rounded-full transition-all duration-200 ${
                      isActive
                        ? isDark
                          ? 'bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                          : 'bg-[#1E88E5] shadow-[0_2px_6px_rgba(30,136,229,0.4)]'
                        : isDark
                          ? 'bg-white/[0.15] hover:bg-white/[0.25]'
                          : 'bg-[#CFE3FA] hover:bg-[#B5D5F7]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Mobile Right Arrow (< 1024px only) */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next container"
            className={`lg:hidden flex w-8 h-8 rounded-full items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 ${
              isDark
                ? 'bg-slate-800/90 hover:bg-slate-700/90 active:bg-slate-600/90 border border-white/15 text-cyan-400'
                : 'bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border border-blue-200 text-blue-600'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Subtitle & Description Block */}
        <div className="text-center my-0.5 max-w-xl mx-auto">
          <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-cyan-400 mb-0.5 transition-colors duration-200">
            {activeContainer.tag}
          </div>
          <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold tracking-tight text-[#0F172A] dark:text-white mb-0.5 leading-tight transition-colors duration-200">
            {activeContainer.headline}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-normal transition-colors duration-200 line-clamp-2 sm:line-clamp-1">
            {activeContainer.description}
          </p>
        </div>

        {/* ─── BOTTOM CARD WRAPPER ─── */}
        <div
          id="bottom-features-card"
          className={`w-full rounded-[24px] py-[14px] px-4 sm:px-[28px] mt-1.5 transition-all duration-300 ${
            isDark
              ? 'border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
              : 'border border-[rgba(30,136,229,0.18)] shadow-[0_8px_24px_rgba(30,136,229,0.10)]'
          }`}
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #12304F 0%, #0D2340 55%, #0A1B33 100%)'
              : 'linear-gradient(135deg, #EAF3FF 0%, #D6E8FB 55%, #C4DDF7 100%)',
          }}
        >
          {/* Unified Bottom Row: Far-Left Feature | Centered Buttons Pair | Far-Right Feature */}
          <div className="w-full flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-between gap-3 md:gap-2">
            
            {/* Far Left: Global Shipping (Aligned to nav logo edge, icon left, text left-aligned) */}
            <div className="order-2 md:order-1 flex items-center justify-start gap-3 w-full md:w-auto justify-self-start">
              <div className="w-12 h-12 rounded-full bg-white/80 dark:bg-white/[0.08] flex items-center justify-center text-[#1E88E5] dark:text-[#38BDF8] shrink-0 shadow-xs">
                <Globe className="w-[22px] h-[22px] stroke-[1.8]" />
              </div>
              <div className="text-left">
                <div className="text-[14px] font-medium leading-snug text-[#0B192C] dark:text-white">
                  Global Shipping
                </div>
                <div className="text-[13px] text-[#334155] dark:text-slate-300 leading-snug">
                  Worldwide Coverage
                </div>
              </div>
            </div>

            {/* Center: Dynamic Book Button (with periodic shine sweep) + Secondary Explore Button (Refined standard CTA size) */}
            <div className="order-1 md:order-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 justify-self-center">
              <button
                onClick={handleBookContainer}
                type="button"
                aria-label={activeContainer.bookLabel}
                className="relative overflow-hidden inline-flex items-center justify-between gap-2.5 sm:gap-3 h-[42px] sm:h-[44px] pl-4 sm:pl-5 pr-1.5 rounded-full bg-[#1E88E5] hover:bg-[#1976D2] active:scale-[0.99] text-white font-semibold text-[13px] sm:text-[14px] shadow-[0_4px_14px_rgba(30,136,229,0.30)] transition-all cursor-pointer group"
              >
                {/* Periodic diagonal shine sweep effect */}
                <span className="book-btn-shine-streak" aria-hidden="true" />

                <span className="relative z-10">{activeContainer.bookLabel}</span>
                <span className="relative z-10 w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowRight className="w-4 h-4 text-[#1E88E5]" />
                </span>
              </button>

              <Link
                to="/container-section"
                className="inline-flex items-center justify-center h-[42px] sm:h-[44px] px-[18px] sm:px-5 rounded-full border border-slate-300 dark:border-white/20 text-[#0F172A] dark:text-slate-200 bg-white dark:bg-white/[0.04] hover:bg-white/90 dark:hover:bg-white/10 font-semibold text-[13px] sm:text-[14px] transition-colors shadow-xs"
              >
                <span>Explore All Containers</span>
              </Link>
            </div>

            {/* Far Right: Safe & Secure (Aligned to nav hamburger edge, icon left, text left-aligned) */}
            <div className="order-3 md:order-3 flex items-center justify-start md:justify-end gap-3 w-full md:w-auto justify-self-end">
              <div className="w-12 h-12 rounded-full bg-white/80 dark:bg-white/[0.08] flex items-center justify-center text-[#1E88E5] dark:text-[#38BDF8] shrink-0 shadow-xs">
                <ShieldCheck className="w-[22px] h-[22px] stroke-[1.8]" />
              </div>
              <div className="text-left">
                <div className="text-[14px] font-medium leading-snug text-[#0B192C] dark:text-white">
                  Safe & Secure
                </div>
                <div className="text-[13px] text-[#334155] dark:text-slate-300 leading-snug">
                  Your Cargo, Our Priority
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default ContainerCompositePreviewPage;
