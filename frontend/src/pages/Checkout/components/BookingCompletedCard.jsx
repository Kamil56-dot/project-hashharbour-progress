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
      {/* Scoped Keyframes for Light Entrance Animation */}
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
        @media (prefers-reduced-motion: reduce) {
          .hh-entrance-card,
          .hh-ring-pop,
          .hh-check-pop {
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
        {/* Top 3-Column Slot Row: Empty Left & Right slots for Phase 2 illustrations */}
        <div className="flex items-center justify-between w-full max-w-[440px] mx-auto mb-4 sm:mb-6">
          {/* Left Slot: Empty (Phase 2 party popper) */}
          <div className="w-[72px] sm:w-[90px] h-[72px] sm:h-[90px] shrink-0 pointer-events-none" aria-hidden="true" />

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
                <Check className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Right Slot: Empty (Phase 2 party popper) */}
          <div className="w-[72px] sm:w-[90px] h-[72px] sm:h-[90px] shrink-0 pointer-events-none" aria-hidden="true" />
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

        {/* Booked Container Image + Elliptical Ground Shadow */}
        <div className="relative w-full max-w-[360px] mx-auto mt-5 sm:mt-6 flex flex-col items-center">
          <img
            src={container?.successImage || container?.image}
            alt={container?.alt || container?.title || 'Booked Container'}
            className="w-[280px] sm:w-[320px] md:w-[340px] max-w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm"
            draggable={false}
          />
          {/* Soft Elliptical Ground Shadow */}
          <div
            className="w-[240px] sm:w-[280px] md:w-[300px] h-[14px] sm:h-[16px] bg-black/10 dark:bg-black/50 blur-[8px] rounded-[100%] mx-auto mt-[-6px] sm:mt-[-8px]"
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
