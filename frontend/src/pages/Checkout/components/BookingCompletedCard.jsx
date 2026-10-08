import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Container, MapPin, CalendarDays } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { SHIPPING_DEMO, CONTAINER_SHORT_NAMES } from '../checkoutData';

/**
 * BookingCompletedCard — Phase 1 Success View
 * Displayed in-place on /checkout when a booking is confirmed (HTTP 201).
 *
 * Design matches Reference Image 1:
 * - Centered 24px-radius card (~790px desktop)
 * - Blue check icon inside a soft ring
 * - Empty 3-column top slots reserved for Phase 2 party popper illustrations
 * - Booking ID pill with one-click copy feedback
 * - Real container image with soft elliptical ground shadow
 * - 4-cell info strip: Container Type, From, To, Transit Time (dividers adapt on mobile)
 * - Single "Back to Home" pill button
 * - Light entrance animation (fade + scale + upward slide) with reduced motion support
 */
/**
 * Phase 2 Party Popper Inline SVG Component
 * Plays a one-time burst on mount, then remains static.
 * Matches reference image shapes, colors, and placement.
 */
function PartyPopper({ idSuffix, prefersReducedMotion }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={`cone-clip-${idSuffix}`}>
          <path d="M 18 80 L 40 47 Q 52 58 62 66 Z" />
        </clipPath>
        <linearGradient id={`cone-blue-${idSuffix}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1565C0" />
          <stop offset="55%" stopColor="#1E88E5" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>

      {/* Confetti Particles (settled static state) */}
      <g
        className="hh-confetti-particle"
        style={prefersReducedMotion ? { animation: 'none', opacity: 1, transform: 'none' } : undefined}
      >
        {/* Left cyan flake */}
        <path d="M 8 50 C 7 54 9 58 13 59" stroke="#00C49F" strokeWidth="3" strokeLinecap="round" />
        {/* Star top right */}
        <polygon points="90,12 91.4,16.2 95.8,16.4 92.2,19.1 93.4,23.3 90,20.8 86.6,23.3 87.8,19.1 84.2,16.4 88.6,16.2" fill="#FBBF24" />
        {/* Slate dot upper right */}
        <rect x="71" y="32" width="3.5" height="3.5" rx="0.8" fill="#64748B" transform="rotate(20 71 32)" />
        {/* Slate dot lower right */}
        <rect x="83" y="76" width="3.5" height="3.5" rx="0.8" fill="#64748B" transform="rotate(30 83 76)" />
        {/* Tiny cyan dot */}
        <circle cx="64" cy="76" r="1.6" fill="#00C49F" />
      </g>

      {/* Streamers Bursting Out */}
      <g
        className="hh-confetti-streamers"
        style={prefersReducedMotion ? { animation: 'none', opacity: 1, transform: 'none' } : undefined}
      >
        {/* 1. Blue Streamer (curving up) */}
        <path
          d="M 48 48 C 52 36 50 27 46 19 C 45 16 42 16 42 18"
          stroke="#1E88E5"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 2. Golden Yellow Streamer (arching up-right) */}
        <path
          d="M 52 51 C 59 41 67 36 73 31 C 75 29 77 30 76 32"
          stroke="#FBBF24"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 3. Teal Wavy Streamer (horizontal S-curve to right) */}
        <path
          d="M 56 55 C 64 56 69 50 77 49 C 83 48 88 53 94 51"
          stroke="#00C49F"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 4. Orange Streamer (arching down-right) */}
        <path
          d="M 54 59 C 61 62 68 63 75 67 C 78 69 79 72 77 73"
          stroke="#F97316"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Popper Cone Body */}
      <g
        className="hh-popper-cone"
        style={prefersReducedMotion ? { animation: 'none', opacity: 1, transform: 'none' } : undefined}
      >
        <path d="M 18 80 L 40 47 L 62 66 Z" fill={`url(#cone-blue-${idSuffix})`} />
        {/* Yellow Stripes clipped inside cone */}
        <g clipPath={`url(#cone-clip-${idSuffix})`}>
          <path d="M 23 73 L 32 66 Q 38 70 44 75 L 36 82 Q 29 78 23 73 Z" fill="#FEF08A" />
          <path d="M 32 60 L 41 53 Q 48 58 54 64 L 46 70 Q 39 65 32 60 Z" fill="#FEF08A" />
        </g>
        {/* Cone tip */}
        <circle cx="19" cy="79.5" r="2.4" fill="#1565C0" />
        {/* Cone mouth ellipse */}
        <ellipse cx="51" cy="56.5" rx="7" ry="13" transform="rotate(-40 51 56.5)" fill="#1565C0" />
        <ellipse cx="51" cy="56.5" rx="5.5" ry="11" transform="rotate(-40 51 56.5)" fill="#0D47A1" />
      </g>
    </svg>
  );
}

export function BookingCompletedCard({ bookingData, container, isDark }) {
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [animationEnded, setAnimationEnded] = useState(false);

  const bookingReference = bookingData?.booking_reference || '';
  const shortTypeName = container?.shortName || CONTAINER_SHORT_NAMES[container?.id] || '20ft Standard';
  const transitTime = SHIPPING_DEMO.transit || SHIPPING_DEMO.transitTime || '10 - 12 Days';

  // Accessibility: scroll to top and focus the card heading upon mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    if (headingRef.current) {
      headingRef.current.focus({ preventScroll: true });
    }
  }, [prefersReducedMotion]);

  // Copy booking ID to clipboard (only the reference value)
  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText && bookingReference) {
        await navigator.clipboard.writeText(bookingReference);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      // Do nothing visible and do not throw if clipboard fails
    }
  };

  return (
    <>
      {/* Scoped Keyframes for Light Entrance Animation & Phase 2 Party Popper Burst */}
      <style>{`
        @keyframes hhCardEntrance {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes hhRingFade {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes hhCheckPop {
          0% {
            opacity: 0;
            transform: scale(0.6);
          }
          75% {
            transform: scale(1.06);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes hhPopperConePop {
          0% {
            opacity: 0;
            transform: scale(0.65) translate(-4px, 4px);
          }
          60% {
            opacity: 1;
            transform: scale(1.05) translate(1px, -1px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translate(0, 0);
          }
        }
        @keyframes hhConfettiBurst {
          0% {
            opacity: 0;
            transform: translate(-18px, 16px) scale(0.15);
          }
          65% {
            opacity: 1;
            transform: translate(2px, -2px) scale(1.08);
          }
          100% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
        }
        @keyframes hhConfettiParticle {
          0% {
            opacity: 0;
            transform: translate(-14px, 12px) scale(0);
          }
          70% {
            opacity: 1;
            transform: translate(3px, -2px) scale(1.12);
          }
          100% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
        }
        .hh-popper-cone {
          animation: hhPopperConePop 750ms cubic-bezier(0.16, 1, 0.3, 1) 150ms 1 forwards;
          transform-origin: 20px 80px;
        }
        .hh-confetti-streamers {
          animation: hhConfettiBurst 850ms cubic-bezier(0.16, 1, 0.3, 1) 200ms 1 forwards;
          transform-origin: 52px 55px;
        }
        .hh-confetti-particle {
          animation: hhConfettiParticle 850ms cubic-bezier(0.16, 1, 0.3, 1) 220ms 1 forwards;
          transform-origin: 52px 55px;
        }
        @media (prefers-reduced-motion: reduce) {
          .hh-entrance-card,
          .hh-ring-pop,
          .hh-check-pop,
          .hh-popper-cone,
          .hh-confetti-streamers,
          .hh-confetti-particle {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <section
        id="booking-completed-card"
        aria-labelledby="booking-completed-heading"
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget) {
            setAnimationEnded(true);
          }
        }}
        className={`hh-entrance-card relative z-0 w-full max-w-[790px] mx-auto rounded-[24px] p-6 sm:p-8 md:p-10 lg:p-12 transition-colors duration-200 ${
          isDark
            ? 'bg-[#0A101D] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]'
            : 'bg-white border border-blue-100/70 shadow-[0_12px_45px_rgba(15,40,80,0.06)]'
        }`}
        style={
          !(prefersReducedMotion || animationEnded)
            ? { animation: 'hhCardEntrance 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards' }
            : { opacity: 1, transform: 'none' }
        }
      >
        {/* Top 3-Column Slot Row: Party Poppers (Item 1) + Sharp Check Circle (Item 2) */}
        <div className="flex items-center justify-between w-full max-w-[440px] mx-auto mb-4 sm:mb-6">
          {/* Left Slot: Party Popper (One-time burst on mount, then static) */}
          <div
            className="w-[72px] sm:w-[90px] h-[72px] sm:h-[90px] shrink-0 pointer-events-none select-none flex items-center justify-center"
            aria-hidden="true"
          >
            <PartyPopper idSuffix="left" prefersReducedMotion={prefersReducedMotion} />
          </div>

          {/* Center Check Circle in Soft Ring */}
          <div className="relative flex items-center justify-center shrink-0">
            <div
              className={`hh-ring-pop w-[96px] h-[96px] sm:w-[104px] sm:h-[104px] rounded-full flex items-center justify-center transition-colors ${
                isDark ? 'bg-[#1E88E5]/20' : 'bg-[#E1F0FE]'
              }`}
              style={
                !(prefersReducedMotion || animationEnded)
                  ? { animation: 'hhRingFade 350ms ease-out 150ms both' }
                  : { opacity: 1, transform: 'none' }
              }
            >
              <div
                className="hh-check-pop w-[66px] h-[66px] sm:w-[72px] sm:h-[72px] rounded-full bg-[#1E88E5] flex items-center justify-center text-white shadow-md"
                style={
                  !(prefersReducedMotion || animationEnded)
                    ? { animation: 'hhCheckPop 350ms cubic-bezier(0.34, 1.56, 0.64, 1) 150ms both' }
                    : { opacity: 1, transform: 'none' }
                }
              >
                {/* Sharp Custom SVG Checkmark (Item 2) */}
                <svg
                  className="w-8 h-8 sm:w-9 sm:h-9 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  shapeRendering="geometricPrecision"
                >
                  <path
                    d="M10.8 16.5L6.0 11.7L7.5 10.2L10.8 13.5L17.5 6.8L19.0 8.3L10.8 16.5Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Slot: Mirrored Party Popper */}
          <div
            className="w-[72px] sm:w-[90px] h-[72px] sm:h-[90px] shrink-0 pointer-events-none select-none flex items-center justify-center"
            style={{ transform: 'scaleX(-1)' }}
            aria-hidden="true"
          >
            <PartyPopper idSuffix="right" prefersReducedMotion={prefersReducedMotion} />
          </div>
        </div>

        {/* H1 Heading (accessible focus target) */}
        <h1
          id="booking-completed-heading"
          ref={headingRef}
          tabIndex={-1}
          className={`text-[26px] sm:text-[32px] md:text-[34px] font-extrabold tracking-tight text-center leading-tight outline-none ${
            isDark ? 'text-white' : 'text-[#0F172A]'
          }`}
        >
          Booking Completed!
        </h1>

        {/* Subtitle */}
        <p
          className={`text-[13px] sm:text-[14px] md:text-[15px] font-normal text-center mt-1.5 sm:mt-2 leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-[#64748B]'
          }`}
        >
          Your container booking has been confirmed successfully.
        </p>

        {/* Booking ID Pill with Copy Button */}
        {bookingReference && (
          <div className="flex justify-center mt-3 sm:mt-4">
            <div
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border transition-colors ${
                isDark
                  ? 'bg-[#1E88E5]/15 border-[#1E88E5]/25 text-[#38BDF8]'
                  : 'bg-[#EBF3FB] border-blue-200/60 text-[#1E88E5]'
              }`}
            >
              <span className="text-[12px] sm:text-[13px] font-semibold tracking-tight">
                Booking ID: {bookingReference}
              </span>
              <button
                type="button"
                id="copy-booking-id-btn"
                onClick={handleCopy}
                aria-label="Copy booking ID"
                className={`p-1 rounded-md transition-colors cursor-pointer select-none ${
                  isDark
                    ? 'hover:bg-white/10 active:bg-white/15'
                    : 'hover:bg-blue-100/70 active:bg-blue-200/70'
                }`}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-current opacity-80 hover:opacity-100" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Booked Container Image + Elliptical Ground Shadow + Backdrop Blobs (Item 3) */}
        <div className="relative w-full max-w-[360px] mx-auto mt-5 sm:mt-6 flex flex-col items-center">
          {/* Soft Decorative Blobs BEHIND the container image only (Item 3) */}
          <div
            className="absolute inset-0 -z-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <svg
              className="w-[480px] sm:w-[500px] max-w-none h-[210px] sm:h-[220px]"
              viewBox="0 0 500 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left soft organic lobe (bulging out behind the left container doors) */}
              <path
                d="M 120 135 C 75 140 40 120 38 95 C 36 70 70 52 105 60 C 120 63 130 75 135 88 Z"
                fill={isDark ? '#1E88E5' : '#E8F3FD'}
                opacity={isDark ? 0.18 : 0.9}
              />
              {/* Right upper organic lobe (bulging out behind top-right of container) */}
              <path
                d="M 370 75 C 390 55 420 40 445 52 C 468 64 465 92 440 102 C 415 112 385 100 370 75 Z"
                fill={isDark ? '#1E88E5' : '#E8F3FD'}
                opacity={isDark ? 0.15 : 0.85}
              />
              {/* Right lower organic lobe (bulging out behind lower-right of container) */}
              <path
                d="M 380 120 C 410 112 455 118 472 138 C 488 158 468 185 435 182 C 402 178 375 155 372 135 Z"
                fill={isDark ? '#1E88E5' : '#E8F3FD'}
                opacity={isDark ? 0.15 : 0.85}
              />
              {/* Center connecting soft wash behind container */}
              <ellipse
                cx="250"
                cy="115"
                rx="180"
                ry="65"
                fill={isDark ? '#38BDF8' : '#EDF5FD'}
                opacity={isDark ? 0.1 : 0.75}
              />
            </svg>
          </div>

          <img
            src={container?.successImage || container?.image}
            alt={container?.alt || container?.title || 'Booked Container'}
            className="w-[280px] sm:w-[320px] md:w-[340px] max-w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm relative z-10"
            draggable={false}
          />
          {/* Soft Elliptical Ground Shadow */}
          <div
            className="w-[240px] sm:w-[280px] md:w-[300px] h-[14px] sm:h-[16px] bg-black/10 dark:bg-black/50 blur-[8px] rounded-[100%] mx-auto mt-[-6px] sm:mt-[-8px] relative z-10"
            aria-hidden="true"
          />
        </div>

        {/* Info Strip (4 Cells: Responsive 2x2 grid < 768px; 4 cells in 1 row >= 768px) */}
        <div
          className={`w-full max-w-[690px] mx-auto mt-6 sm:mt-7 p-3.5 sm:p-4 rounded-2xl border transition-colors ${
            isDark
              ? 'bg-white/[0.03] border-white/10'
              : 'bg-[#F8FAFC] border-slate-100 shadow-xs'
          }`}
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-0 md:divide-x md:divide-slate-200 dark:md:divide-white/10">
            {/* Cell 1: Container Type */}
            <div className="flex flex-col items-center text-center px-2">
              <div className="flex items-center justify-center text-[#1E88E5] dark:text-[#38BDF8]">
                <Container className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </div>
              <span className="text-[11px] sm:text-[12px] font-normal text-[#64748B] dark:text-slate-400 mt-1.5 leading-none">
                Container Type
              </span>
              <span className="text-[13px] sm:text-[14px] font-bold text-[#0F172A] dark:text-white mt-1 leading-tight truncate max-w-full">
                {shortTypeName}
              </span>
            </div>

            {/* Cell 2: From */}
            <div className="flex flex-col items-center text-center px-2">
              <div className="flex items-center justify-center text-[#1E88E5] dark:text-[#38BDF8]">
                <MapPin className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </div>
              <span className="text-[11px] sm:text-[12px] font-normal text-[#64748B] dark:text-slate-400 mt-1.5 leading-none">
                From
              </span>
              <span className="text-[13px] sm:text-[14px] font-bold text-[#0F172A] dark:text-white mt-1 leading-tight truncate max-w-full">
                {SHIPPING_DEMO.from}
              </span>
            </div>

            {/* Cell 3: To */}
            <div className="flex flex-col items-center text-center px-2">
              <div className="flex items-center justify-center text-[#1E88E5] dark:text-[#38BDF8]">
                <MapPin className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </div>
              <span className="text-[11px] sm:text-[12px] font-normal text-[#64748B] dark:text-slate-400 mt-1.5 leading-none">
                To
              </span>
              <span className="text-[13px] sm:text-[14px] font-bold text-[#0F172A] dark:text-white mt-1 leading-tight truncate max-w-full">
                {SHIPPING_DEMO.to}
              </span>
            </div>

            {/* Cell 4: Transit Time */}
            <div className="flex flex-col items-center text-center px-2">
              <div className="flex items-center justify-center text-[#1E88E5] dark:text-[#38BDF8]">
                <CalendarDays className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </div>
              <span className="text-[11px] sm:text-[12px] font-normal text-[#64748B] dark:text-slate-400 mt-1.5 leading-none">
                Transit Time
              </span>
              <span className="text-[13px] sm:text-[14px] font-bold text-[#0F172A] dark:text-white mt-1 leading-tight truncate max-w-full">
                {transitTime}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Single "Back to Home" Full-Pill Button */}
        <div className="flex justify-center mt-6 sm:mt-7">
          <button
            id="booking-back-home-btn"
            type="button"
            onClick={() => navigate('/')}
            className="w-full max-w-[310px] h-[52px] rounded-full bg-[#1E88E5] hover:bg-[#1976D2] active:scale-[0.99] text-white font-semibold text-[15px] sm:text-[16px] shadow-[0_4px_14px_rgba(30,136,229,0.35)] hover:shadow-[0_6px_20px_rgba(30,136,229,0.45)] transition-all duration-200 flex items-center justify-center cursor-pointer select-none"
          >
            Back to Home
          </button>
        </div>
      </section>
    </>
  );
}

export default BookingCompletedCard;
