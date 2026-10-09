import React from 'react';
import { Anchor } from 'lucide-react';

/**
 * AboutHero Component — Aligned with Approved Specifications
 * High-impact introductory header for HashHarbour About Section.
 */
export function AboutHero() {
  return (
    <div className="w-full text-center max-w-4xl mx-auto mb-16 lg:mb-20 pt-4">
      {/* Category Pill Badge */}
      <div className="inline-flex items-center gap-2 mb-5">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-accent-400 bg-[#00C8F5]/10 border border-[#00C8F5]/30 shadow-[0_0_20px_rgba(0,200,245,0.2)]">
          <Anchor className="w-3.5 h-3.5 text-accent-400" />
          ABOUT HASHHARBOUR PLATFORM
        </span>
      </div>

      {/* Main Title */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15] mb-6">
        Architecting the Digital Corridor for{' '}
        <span className="text-accent-400 bg-gradient-to-r from-[#00C8F5] via-[#19BFEF] to-[#00C8F5] bg-clip-text text-transparent">
          Global EXIM Commerce
        </span>
      </h2>

      {/* Narrative Lead */}
      <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto font-normal leading-relaxed">
        HashHarbour transforms fragmented international trade into a unified, transparent, and intelligent digital logistics ecosystem—empowering businesses to move cargo with unprecedented precision.
      </p>
    </div>
  );
}
