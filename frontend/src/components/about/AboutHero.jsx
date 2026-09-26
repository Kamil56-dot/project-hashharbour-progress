import React from 'react';
import { Anchor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * AboutHero Component — Aligned with Approved Specifications
 * High-impact introductory header for HashHarbour About Section.
 * Fully responsive to global ThemeContext (Dark / Light).
 */
export function AboutHero() {
  const { isDark } = useTheme();

  return (
    <div className="w-full text-center max-w-4xl mx-auto mb-16 lg:mb-20 pt-4">
      {/* Category Pill Badge */}
      <div className="inline-flex items-center gap-2 mb-5">
        <span
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
            isDark
              ? 'text-accent-400 bg-[#00C8F5]/10 border border-[#00C8F5]/30 shadow-[0_0_20px_rgba(0,200,245,0.2)]'
              : 'text-brand-600 bg-brand-500/10 border border-brand-200/80 shadow-xs'
          }`}
        >
          <Anchor className={`w-3.5 h-3.5 ${isDark ? 'text-accent-400' : 'text-brand-500'}`} />
          ABOUT HASHHARBOUR PLATFORM
        </span>
      </div>

      {/* Main Title */}
      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] mb-6 transition-colors duration-200 ${
          isDark ? 'text-white' : 'text-[#0F172A]'
        }`}
      >
        Architecting the Digital Corridor for{' '}
        <span
          className={
            isDark
              ? 'text-accent-400 bg-gradient-to-r from-[#00C8F5] via-[#19BFEF] to-[#00C8F5] bg-clip-text text-transparent'
              : 'text-brand-600 bg-gradient-to-r from-[#1E88E5] via-[#1976D2] to-[#1565C0] bg-clip-text text-transparent'
          }
        >
          Global EXIM Commerce
        </span>
      </h2>

      {/* Narrative Lead */}
      <p
        className={`text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed transition-colors duration-200 ${
          isDark ? 'text-text-secondary' : 'text-slate-600'
        }`}
      >
        HashHarbour transforms fragmented international trade into a unified, transparent, and intelligent digital logistics ecosystem—empowering businesses to move cargo with unprecedented precision.
      </p>
    </div>
  );
}
