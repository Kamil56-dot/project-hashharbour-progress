import React from 'react';
import { Link } from 'react-router-dom';

/**
 * HashHarbour Brand Logo Component — "Anchor Pulse + Brand Energy Sweep" Interactive Unit.
 * Source of Truth: Reference Image — [ANCHOR + LARGE H] HashHarbour
 *
 * Sequence on Hover (~500ms total):
 * 1. Anchor Pulse: Luminous cyan pulse from center + subtle fluke trace + subtle cyan-white tint.
 * 2. Wordmark Energy Sweep: Soft, fast cyan light sweep left -> right across "HashHarbour".
 * 3. Micro Brand Lift: 1px upward lift.
 * 4. Secondary Soft Aura: Low-intensity cyan aura lingering around lockup.
 * 5. Clean Exit: Smooth reset on mouse leave.
 */
export function Logo({ className = '' }) {
  const hasTextColor = /\btext-/.test(className);

  return (
    <Link
      to="/"
      aria-label="HashHarbour — Return to homepage"
      className={`brand-lockup-unit inline-flex items-center gap-2.5 sm:gap-3 ${hasTextColor ? '' : 'text-white'} focus-visible:outline-2 focus-visible:outline-accent-500 focus-visible:outline-offset-4 rounded-sm ${className}`}
    >
      {/* Anchor Emblem Wrapper */}
      <div className="brand-anchor-wrapper">
        {/* Luminous Center Pulse */}
        <span className="anchor-center-pulse" aria-hidden="true" />

        {/* Lower Fluke Signal Trace */}
        <span className="anchor-fluke-signal" aria-hidden="true" />

        {/* Authentic Refined SVG Anchor Artwork */}
        <svg
          width="34"
          height="38"
          viewBox="0 0 34 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="brand-anchor-svg shrink-0"
        >
          {/* ZONE 1: TOP RING & UPPER STOCK CROSSBAR */}
          <circle cx="17" cy="4" r="2.5" stroke="currentColor" strokeWidth="2.4" fill="none" />
          <line x1="10.5" y1="9" x2="23.5" y2="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />

          {/* UPPER VERTICAL STEM SHAFT */}
          <line x1="17" y1="6.5" x2="17" y2="15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />

          {/* LOWER VERTICAL STEM SHAFT */}
          <line x1="17" y1="21" x2="17" y2="33.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />

          {/* ZONE 2: SELF-CONTAINED CAPITAL 'H' MOTIF */}
          <line x1="9.5" y1="13" x2="9.5" y2="23" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="24.5" y1="13" x2="24.5" y2="23" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="6.5" y1="18" x2="27.5" y2="18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />

          {/* ZONE 3: LOWER CRESCENT FLUKES WITH HOOKED BARBS */}
          <path
            d="M 5.5 27 C 5.5 34.5, 10.5 36.5, 17 36.5 C 23.5 36.5, 28.5 34.5, 28.5 27"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Left Hooked Fluke Tip */}
          <path
            d="M 3 27.5 L 5.5 23.5 L 8.5 27.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Right Hooked Fluke Tip */}
          <path
            d="M 25.5 27.5 L 28.5 23.5 L 31 27.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Wordmark Container ("HashHarbour" + Light Sweep Overlay) */}
      <div className="brand-wordmark-wrapper">
        <span className="brand-wordmark-text font-sans font-bold text-[22px] sm:text-[23.5px] leading-none tracking-tight whitespace-nowrap">
          HashHarbour
        </span>
        <span className="wordmark-sweep" aria-hidden="true" />
      </div>
    </Link>
  );
}

export default Logo;
