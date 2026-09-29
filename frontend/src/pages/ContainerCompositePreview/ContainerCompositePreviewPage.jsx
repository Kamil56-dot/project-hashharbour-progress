import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
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
    shadowConfig: {
      contactBottom: 'bottom-[9%]',
      contactWidth: 'w-[88%]',
      contactHeight: 'h-[14px] sm:h-[18px] lg:h-[24px]',
      diffuseBottom: 'bottom-[1%]',
      diffuseWidth: 'w-[104%]',
      diffuseHeight: 'h-[24px] sm:h-[32px] lg:h-[40px]',
    },
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
    shadowConfig: {
      contactBottom: 'bottom-[9%]',
      contactWidth: 'w-[86%]',
      contactHeight: 'h-[10px] sm:h-[14px] lg:h-[18px]',
      diffuseBottom: 'bottom-[1%]',
      diffuseWidth: 'w-[100%]',
      diffuseHeight: 'h-[16px] sm:h-[22px] lg:h-[28px]',
    },
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
    shadowConfig: {
      contactBottom: 'bottom-[4%]',
      contactWidth: 'w-[86%]',
      contactHeight: 'h-[10px] sm:h-[14px] lg:h-[18px]',
      diffuseBottom: '-bottom-[2%]',
      diffuseWidth: 'w-[98%]',
      diffuseHeight: 'h-[16px] sm:h-[22px] lg:h-[26px]',
    },
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
      className={`min-h-screen lg:h-screen lg:max-h-screen w-full transition-colors duration-300 pt-[88px] lg:pt-[102px] pb-2 px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col justify-between overflow-x-hidden ${
        isDark ? 'bg-[#060B14] text-white' : 'bg-[#EBF3FC] text-[#0F172A]'
      }`}
    >
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
            transform: translate(calc(-50% - 450px), -24px) scale(0.68);
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
            transform: translate(calc(-50% + 450px), -24px) scale(0.68);
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
            transform: translate(calc(-50% - 505px), -24px) scale(0.87);
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
            transform: translate(calc(-50% + 505px), -24px) scale(0.87);
          }
        }
      `}</style>

      {/* ─── TOP SECTION: BACK BUTTON & HERO HEADINGS ─── */}
      <div className="w-full max-w-6xl mx-auto flex flex-col shrink-0">
        
        {/* Clean Back Button */}
        <div className="w-full flex items-center justify-start mb-2 lg:mb-2.5">
          <Link
            to="/container-section"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors py-1 px-2.5 -ml-2.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/[0.06]"
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

      {/* ─── CENTER STAGE: 3-CONTAINER SPACIOUS CAROUSEL ─── */}
      <div className="relative w-full max-w-[1440px] mx-auto flex items-center justify-center my-auto shrink-0 px-2 sm:px-6 lg:px-12">
        
        {/* Left Floating Circular Navigation Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous container"
          className={`flex absolute left-1 sm:left-2 lg:left-4 xl:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-12 lg:h-12 rounded-full items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 ${
            isDark
              ? 'bg-white/5 hover:bg-white/15 active:bg-white/20 border border-white/10 text-cyan-400 shadow-lg shadow-black/40 hover:scale-110 active:scale-95'
              : 'bg-blue-500/10 hover:bg-blue-500/20 active:bg-blue-500/25 border border-blue-200/70 text-blue-600 shadow-sm hover:scale-110 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-5 h-5 transition-transform duration-200" />
        </button>

        {/* Right Floating Circular Navigation Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next container"
          className={`flex absolute right-1 sm:right-2 lg:right-4 xl:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-12 lg:h-12 rounded-full items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 ${
            isDark
              ? 'bg-white/5 hover:bg-white/15 active:bg-white/20 border border-white/10 text-cyan-400 shadow-lg shadow-black/40 hover:scale-110 active:scale-95'
              : 'bg-blue-500/10 hover:bg-blue-500/20 active:bg-blue-500/25 border border-blue-200/70 text-blue-600 shadow-sm hover:scale-110 active:scale-95'
          }`}
        >
          <ChevronRight className="w-5 h-5 transition-transform duration-200" />
        </button>

        {/* ── Container Stage (Exact Height & Baseline Ground Plane) ── */}
        <div className="relative w-full h-[260px] sm:h-[290px] md:h-[320px] lg:h-[350px] xl:h-[385px] flex items-end justify-center select-none overflow-visible">
          
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
                {/* Ground Contact Shadow */}
                <div
                  className={`absolute ${container.shadowConfig.contactBottom} left-1/2 -translate-x-1/2 ${container.shadowConfig.contactWidth} ${container.shadowConfig.contactHeight} rounded-[100%] pointer-events-none transition-opacity duration-300`}
                  style={{
                    background: isDark
                      ? 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 0.55) 60%, transparent 80%)'
                      : 'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.52) 0%, rgba(15, 23, 42, 0.22) 55%, transparent 75%)',
                    filter: isDark ? 'blur(6px)' : 'blur(5px)',
                  }}
                />
                {/* Diffuse Floor Shadow */}
                <div
                  className={`absolute ${container.shadowConfig.diffuseBottom} left-1/2 -translate-x-1/2 ${container.shadowConfig.diffuseWidth} ${container.shadowConfig.diffuseHeight} rounded-[100%] pointer-events-none transition-opacity duration-300`}
                  style={{
                    background: isDark
                      ? 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.65) 0%, transparent 70%)'
                      : 'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.2) 0%, transparent 70%)',
                    filter: 'blur(15px)',
                  }}
                />
                {/* Container Image */}
                <img
                  src={container.image}
                  alt={container.alt}
                  className={`w-full h-auto object-contain block relative z-10 select-none ${
                    isCenter
                      ? 'drop-shadow-[0_6px_20px_rgba(0,0,0,0.2)]'
                      : 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
                  }`}
                  loading="eager"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── BOTTOM SECTION: INDICATORS, CTAS & PILLARS (COMPACT) ─── */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center shrink-0">
        
        {/* Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-2 my-0.5" role="tablist" aria-label="Container indicators">
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
                className={`transition-all duration-300 rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 ${
                  isActive
                    ? 'w-6 h-2 bg-[#0088FF] shadow-[0_0_10px_rgba(0,136,255,0.7)] ring-2 ring-[#0088FF]/30'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400 dark:bg-white/20 dark:hover:bg-white/40'
                }`}
              />
            );
          })}
        </div>

        {/* Dynamic Subtitle & Dynamic Book CTA */}
        <div className="text-center mt-0.5">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-cyan-400 mb-0.5 transition-colors duration-200">
            {activeContainer.tag}
          </div>
          <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold tracking-tight text-[#0F172A] dark:text-white mb-0.5 leading-tight transition-colors duration-200">
            {activeContainer.headline}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mb-2 font-normal transition-colors duration-200">
            {activeContainer.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={handleBookContainer}
              type="button"
              aria-label={activeContainer.bookLabel}
              className="inline-flex items-center gap-2 px-5 py-1.5 sm:py-2 rounded-full bg-[#0088FF] hover:bg-[#0077EE] active:bg-[#0066DD] text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{activeContainer.bookLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <Link
              to="/container-section"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <span>Explore All Containers</span>
            </Link>
          </div>
        </div>

        {/* Reference Bottom Feature Pillars */}
        <div className="w-full grid grid-cols-2 gap-4 mt-1.5 pt-1.5 border-t border-black/[0.05] dark:border-white/[0.06]">
          <div className="flex items-center justify-start gap-2 text-left">
            <div className="w-6 h-6 rounded-full bg-blue-500/10 dark:bg-cyan-400/10 flex items-center justify-center text-blue-600 dark:text-cyan-400 shrink-0">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Global Shipping</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Worldwide Coverage</div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 text-right">
            <div className="order-2 w-6 h-6 rounded-full bg-blue-500/10 dark:bg-cyan-400/10 flex items-center justify-center text-blue-600 dark:text-cyan-400 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="order-1">
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Safe & Secure</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Your Cargo, Our Priority</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default ContainerCompositePreviewPage;
