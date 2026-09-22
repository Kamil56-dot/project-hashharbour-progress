import React from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';
import { TAGLINE_PHRASES } from '../../constants/taglines';

/**
 * Hero Subheading, Persistent Sequential Tagline Typewriter, and Descriptive Paragraph Component.
 * Source of Truth: User Specification — 3-Line Tagline Loop
 */
export const HeroDescription = React.forwardRef(function HeroDescription(
  { className = '', ...props },
  ref
) {
  const { linesText, activeLine, isHolding, isFading } = useTypewriter(TAGLINE_PHRASES);

  return (
    <div ref={ref} className={`flex flex-col ${className}`} {...props}>
      {/* Subheading (h2): Two-tone 32px Heading */}
      <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-extrabold leading-[1.2] tracking-tight mb-[18px]">
        <span className="text-white block">Next-Gen EXIM Trade &amp;</span>
        <span className="text-accent-500 block mt-[2px]">Logistics Platform</span>
      </h2>

      {/* Tagline Block: 3px Cyan Bar + Dynamic Sequential Typewriter Lines */}
      <div className="flex items-stretch gap-[14px] mb-[20px]">
        {/* Static Cyan Vertical Border Bar */}
        <div className="w-[3px] bg-accent-400 rounded-full shrink-0 shadow-[0_0_12px_rgba(0,212,255,0.4)]" />

        {/* Complete Multiline Text Container with fixed min-height to prevent layout shift */}
        <div
          className={`text-[14px] sm:text-[15px] leading-[1.55] self-center flex flex-col justify-center gap-0.5 min-h-[76px] transition-opacity duration-300 ${
            isFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Line 1: Cyan (#00D4FF) */}
          <div className="text-accent-400 font-medium whitespace-nowrap min-h-[22px] flex items-center">
            <span>{linesText[0]}</span>
            {activeLine === 0 && !isHolding && !isFading && (
              <span className="inline-block w-[2px] h-[15px] bg-accent-400 ml-1.5 animate-pulse shrink-0" />
            )}
          </div>

          {/* Line 2: White/Light */}
          <div className="text-white/90 font-normal whitespace-nowrap min-h-[22px] flex items-center">
            <span>{linesText[1]}</span>
            {activeLine === 1 && !isHolding && !isFading && (
              <span className="inline-block w-[2px] h-[15px] bg-accent-400 ml-1.5 animate-pulse shrink-0" />
            )}
          </div>

          {/* Line 3: White/Light */}
          <div className="text-white/90 font-normal whitespace-nowrap min-h-[22px] flex items-center">
            <span>{linesText[2]}</span>
            {(activeLine === 2 || isHolding) && !isFading && (
              <span className="inline-block w-[2px] h-[15px] bg-accent-400 ml-1.5 animate-pulse shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* Descriptive Paragraph (480px max-width, 15px text) */}
      <p className="max-w-[480px] text-[14px] sm:text-[15px] font-normal leading-[1.65] text-[#9CA3AF]">
        Streamline container booking, shipment tracking, document management, and global trade operations through one modern logistics platform.
      </p>
    </div>
  );
});
