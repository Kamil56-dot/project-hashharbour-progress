import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { useTheme } from '../../context/ThemeContext';

// Import local high-resolution thematic illustrations
import containerBookingImg from '../../assets/images/services/container-booking.jpg';
import shipmentTrackingImg from '../../assets/images/services/shipment-tracking.jpg';
import tradeDocumentationImg from '../../assets/images/services/trade-documentation.jpg';
import routeManagementImg from '../../assets/images/services/route-management.jpg';
import customsComplianceImg from '../../assets/images/services/customs-compliance.jpg';

/**
 * 5 Thematic Services matching exact specification
 */
const SERVICES_DATA = [
  {
    id: 'container-booking',
    title: 'Container Booking',
    description:
      'Search availability, compare options and book containers instantly with the best rates.',
    image: containerBookingImg,
  },
  {
    id: 'shipment-tracking',
    title: 'Shipment Tracking',
    description:
      'Track your shipments in real-time across sea, air and land with complete visibility.',
    image: shipmentTrackingImg,
  },
  {
    id: 'trade-documentation',
    title: 'Trade Documentation',
    description:
      'Automate documentation, ensure compliance and reduce paperwork across every shipment.',
    image: tradeDocumentationImg,
  },
  {
    id: 'route-management',
    title: 'Route Management',
    description:
      'Optimize routes with smart planning to reduce transit time, costs and operational delays.',
    image: routeManagementImg,
  },
  {
    id: 'customs-compliance',
    title: 'Customs & Compliance',
    description:
      'Streamline customs clearance with expert support and up-to-date regulatory compliance.',
    image: customsComplianceImg,
  },
];

/**
 * ServicesGrid Component
 * - Horizontal scroll-snap carousel with buttery-smooth momentum drag (desktop) & touch-swipe (mobile)
 * - Curve-following motion: card translateY & tilt dynamically follow the rope curve via requestAnimationFrame
 * - Hover focus effect: hovered card sharpens & scales up; all other cards blur & dim
 * - Isolated scrolling: vertical page scroll is completely free and uninterrupted (touch-action: pan-y)
 * - 3 cards centered and fully visible, with outer cards peeking on the edges
 */
export function ServicesGrid() {
  const { isDark } = useTheme();
  const trackRef = useRef(null);

  // Drag & Motion state refs (Zero React re-renders during motion)
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const hasMovedRef = useRef(false);
  const rafCurveRef = useRef(null);
  const throttleTimerRef = useRef(null);

  // High-level navigation states
  const [activeIndex, setActiveIndex] = useState(2);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /**
   * Hardware-accelerated curve calculation:
   * Sets --card-y and --card-rot directly on card DOM nodes at 120fps.
   * As cards move left/right, they rise and fall along the rope curve.
   */
  const updateCardTransforms = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const halfSpan = Math.max(260, rect.width * 0.44);

    const cards = track.querySelectorAll('[data-service-card]');
    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const dist = cardCenterX - centerX;
      const norm = Math.max(-1.18, Math.min(1.18, dist / halfSpan));

      // Parabolic drop along the hanging rope (dips in center, rises at edges)
      const drop = Math.max(0, 58 * (1 - norm * norm));
      // Tangent tilt along the curve
      const tilt = norm * 4.8;

      card.style.setProperty('--card-y', `${drop.toFixed(1)}px`);
      card.style.setProperty('--card-rot', `${tilt.toFixed(2)}deg`);
    });
  }, []);

  /**
   * Throttled UI state updater (dots & buttons) to prevent re-render jank
   */
  const updateUIStateThrottled = useCallback(() => {
    if (throttleTimerRef.current) return;

    throttleTimerRef.current = setTimeout(() => {
      throttleTimerRef.current = null;
      const track = trackRef.current;
      if (!track) return;

      setCanScrollLeft(track.scrollLeft > 15);
      setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 15);

      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      const cards = track.querySelectorAll('[data-service-card]');
      let closestIdx = 0;
      let minDiff = Infinity;

      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const diff = Math.abs(cardCenter - trackCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      setActiveIndex(closestIdx);
    }, 80);
  }, []);

  // Center on middle card (Trade Documentation) on initial load
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = track.querySelectorAll('[data-service-card]');
    if (cards[2]) {
      const targetCard = cards[2];
      const targetScroll =
        targetCard.offsetLeft - (track.clientWidth - targetCard.clientWidth) / 2;
      track.scrollTo({ left: targetScroll, behavior: 'instant' });
    }

    // Run initial curve calculation
    requestAnimationFrame(updateCardTransforms);
    updateUIStateThrottled();

    const handleResize = () => {
      requestAnimationFrame(updateCardTransforms);
      updateUIStateThrottled();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCardTransforms, updateUIStateThrottled]);

  /**
   * Scroll listener with RAF throttle
   */
  const handleScroll = () => {
    if (!rafCurveRef.current) {
      rafCurveRef.current = requestAnimationFrame(() => {
        updateCardTransforms();
        rafCurveRef.current = null;
      });
    }
    updateUIStateThrottled();
  };

  /**
   * Snap to closest card
   */
  const snapToNearest = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    const cards = track.querySelectorAll('[data-service-card]');
    let targetCard = null;
    let minDiff = Infinity;

    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const diff = Math.abs(cardCenter - trackCenter);
      if (diff < minDiff) {
        minDiff = diff;
        targetCard = card;
      }
    });

    if (targetCard) {
      const targetScroll =
        targetCard.offsetLeft - (track.clientWidth - targetCard.clientWidth) / 2;
      track.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  }, []);

  /**
   * Mouse Drag Movement & Momentum:
   * Event listeners are strictly attached ONLY during active mousedown hold
   * and immediately detached on mouseup/blur/mouseleave.
   */
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only primary (left) button
    const track = trackRef.current;
    if (!track) return;

    isDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftStartRef.current = track.scrollLeft;
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    track.style.cursor = 'grabbing';
    track.style.scrollBehavior = 'auto';
    track.style.scrollSnapType = 'none';

    // Active drag handlers
    const onMouseMove = (moveEvent) => {
      // Must be actively pressing primary button (e.buttons & 1)
      if (!isDownRef.current || (moveEvent.buttons & 1) !== 1) {
        onMouseUp();
        return;
      }

      const dx = moveEvent.pageX - startXRef.current;
      if (Math.abs(dx) > 3) {
        hasMovedRef.current = true;
      }

      const now = performance.now();
      const dt = now - lastTimeRef.current;
      if (dt > 0) {
        velocityRef.current = (moveEvent.pageX - lastXRef.current) / dt;
      }
      lastXRef.current = moveEvent.pageX;
      lastTimeRef.current = now;

      track.scrollLeft = scrollLeftStartRef.current - dx;

      if (!rafCurveRef.current) {
        rafCurveRef.current = requestAnimationFrame(() => {
          updateCardTransforms();
          rafCurveRef.current = null;
        });
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('blur', onMouseUp);

      if (!isDownRef.current) return;
      isDownRef.current = false;

      track.style.cursor = 'grab';
      track.style.scrollBehavior = 'smooth';
      track.style.scrollSnapType = 'x mandatory';

      // Inertial momentum snapping
      const v = velocityRef.current;
      if (Math.abs(v) > 0.35) {
        const dir = v < 0 ? 1 : -1;
        const nextIdx = Math.max(0, Math.min(SERVICES_DATA.length - 1, activeIndex + dir));
        scrollToCard(nextIdx);
      } else {
        snapToNearest();
      }

      setTimeout(() => {
        hasMovedRef.current = false;
      }, 60);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: false });
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('blur', onMouseUp);
  };

  // Navigate to specific card
  const scrollToCard = (index) => {
    const track = trackRef.current;
    if (!track) return;

    const cards = track.querySelectorAll('[data-service-card]');
    if (cards[index]) {
      const target = cards[index];
      const targetScroll =
        target.offsetLeft - (track.clientWidth - target.clientWidth) / 2;
      track.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const scrollDirection = (dir) => {
    const nextIdx =
      dir === 'left'
        ? Math.max(0, activeIndex - 1)
        : Math.min(SERVICES_DATA.length - 1, activeIndex + 1);
    scrollToCard(nextIdx);
  };

  return (
    <div className="services-track-container relative w-full max-w-[1520px] mx-auto pt-4 sm:pt-8 pb-8 sm:pb-12 px-1 sm:px-4 select-none">
      {/* ── Scoped CSS for Pure Hover Focus Effect & Scrollbar Elimination ── */}
      <style>{`
        /* Hide scrollbars completely on the track across all browsers */
        .services-track-container [data-carousel-track] {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .services-track-container [data-carousel-track]::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* When any card is hovered, all cards dim, blur slightly, and scale down */
        .services-track-container:has([data-service-card]:hover) [data-service-card] .service-card-wrapper {
          opacity: 0.35;
          filter: blur(2.5px);
          transform: translate3d(0, var(--card-y, 0px), 0) rotate(var(--card-rot, 0deg)) scale(0.96) !important;
        }

        /* The hovered card stays sharp, scales up slightly, straightens, and lifts */
        .services-track-container [data-service-card]:hover .service-card-wrapper {
          opacity: 1 !important;
          filter: blur(0px) !important;
          transform: translate3d(0, calc(var(--card-y, 0px) - 10px), 0) rotate(0deg) scale(1.04) !important;
          z-index: 50 !important;
        }
      `}</style>

      {/* ── Fixed Decorative Curved Dashed Rope Spanning Center 3 Cards ── */}
      <div className="absolute top-[8px] sm:top-[14px] lg:top-[16px] left-1/2 -translate-x-1/2 w-full max-w-[1300px] pointer-events-none z-0 hidden sm:block overflow-visible px-4">
        <svg
          viewBox="0 0 1200 180"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-[145px] lg:h-[165px]"
          aria-hidden="true"
        >
          {/* Subtle Ambient Glow Behind Rope */}
          {isDark && (
            <path
              d="M 30,25 Q 600,165 1170,25"
              stroke="#00E5FF"
              strokeOpacity="0.22"
              strokeWidth="6"
              strokeLinecap="round"
            />
          )}

          {/* Main Curved Dashed Line */}
          <path
            d="M 30,25 Q 600,165 1170,25"
            stroke={isDark ? '#00E5FF' : '#0284C7'}
            strokeOpacity={isDark ? '0.65' : '0.5'}
            strokeWidth="2.5"
            strokeDasharray="9 7"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* ── Desktop Left Navigation Arrow ── */}
      <button
        onClick={() => scrollDirection('left')}
        disabled={!canScrollLeft}
        aria-label="Previous card"
        className={`hidden sm:flex absolute left-2 sm:left-4 lg:left-6 top-[42%] -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full items-center justify-center transition-all duration-300 ${
          !canScrollLeft
            ? 'opacity-20 cursor-not-allowed pointer-events-none'
            : 'opacity-85 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer'
        } ${
          isDark
            ? 'bg-[#061426]/80 border border-cyan-400/30 text-[#00E5FF] shadow-[0_4px_20px_rgba(0,0,0,0.6),0_0_15px_rgba(0,229,255,0.2)] hover:border-[#00E5FF] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)]'
            : 'bg-white/90 border border-sky-200 text-[#0284C7] shadow-[0_4px_16px_rgba(15,40,80,0.12)] hover:border-brand-400'
        } backdrop-blur-md`}
      >
        <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {/* ── Desktop Right Navigation Arrow ── */}
      <button
        onClick={() => scrollDirection('right')}
        disabled={!canScrollRight}
        aria-label="Next card"
        className={`hidden sm:flex absolute right-2 sm:right-4 lg:right-6 top-[42%] -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full items-center justify-center transition-all duration-300 ${
          !canScrollRight
            ? 'opacity-20 cursor-not-allowed pointer-events-none'
            : 'opacity-85 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer'
        } ${
          isDark
            ? 'bg-[#061426]/80 border border-cyan-400/30 text-[#00E5FF] shadow-[0_4px_20px_rgba(0,0,0,0.6),0_0_15px_rgba(0,229,255,0.2)] hover:border-[#00E5FF] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)]'
            : 'bg-white/90 border border-sky-200 text-[#0284C7] shadow-[0_4px_16px_rgba(15,40,80,0.12)] hover:border-brand-400'
        } backdrop-blur-md`}
      >
        <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {/* ── Draggable & Scroll-Snap Horizontal Cards Track (Generous vertical padding eliminates clipping) ── */}
      <div
        ref={trackRef}
        data-carousel-track
        onMouseDown={handleMouseDown}
        onScroll={handleScroll}
        className="relative z-10 w-full flex items-start gap-4 sm:gap-6 lg:gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory pt-10 sm:pt-14 lg:pt-16 pb-20 sm:pb-24 lg:pb-28 cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y pinch-zoom', // Free vertical page scrolling
          paddingLeft: 'max(1.5rem, calc(50vw - 170px))',
          paddingRight: 'max(1.5rem, calc(50vw - 170px))',
        }}
      >
        {SERVICES_DATA.map((service, idx) => (
          <div
            key={service.id}
            data-service-card
            className="shrink-0 snap-center w-[82vw] min-w-[270px] max-w-[320px] sm:w-[330px] lg:w-[350px] xl:w-[370px]"
            onClickCapture={(e) => {
              if (hasMovedRef.current) {
                e.stopPropagation();
                e.preventDefault();
              }
            }}
          >
            <ServiceCard
              title={service.title}
              description={service.description}
              image={service.image}
              onClick={() => scrollToCard(idx)}
            />
          </div>
        ))}
      </div>

      {/* ── Slide Navigation Indicators (Dots + Mobile Arrows) ── */}
      <div className="flex justify-center items-center gap-3 sm:gap-2 mt-4 sm:mt-6 z-20 relative">
        {/* Mobile Left Arrow */}
        <button
          onClick={() => scrollDirection('left')}
          disabled={!canScrollLeft}
          aria-label="Previous card"
          className={`sm:hidden p-1.5 rounded-full border transition-all ${
            !canScrollLeft ? 'opacity-20 pointer-events-none' : 'opacity-80 hover:opacity-100'
          } ${
            isDark
              ? 'bg-[#0B1E36] border-cyan-400/30 text-[#00E5FF]'
              : 'bg-white border-blue-200 text-sky-600'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {SERVICES_DATA.map((service, idx) => (
          <button
            key={service.id}
            onClick={() => scrollToCard(idx)}
            aria-label={`Go to ${service.title}`}
            className={`transition-all duration-300 rounded-full ${
              activeIndex === idx
                ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.7)]'
                : isDark
                ? 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-600/50 hover:bg-slate-400'
                : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}

        {/* Mobile Right Arrow */}
        <button
          onClick={() => scrollDirection('right')}
          disabled={!canScrollRight}
          aria-label="Next card"
          className={`sm:hidden p-1.5 rounded-full border transition-all ${
            !canScrollRight ? 'opacity-20 pointer-events-none' : 'opacity-80 hover:opacity-100'
          } ${
            isDark
              ? 'bg-[#0B1E36] border-cyan-400/30 text-[#00E5FF]'
              : 'bg-white border-blue-200 text-sky-600'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default ServicesGrid;
