import React from 'react';
import { Anchor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ServicesHero Component — Adaptive Hero Layout
 * Dark Theme: Solid white typography with vibrant cyan gradient accent.
 * Light Theme: Dark navy typography (#0F172A) with brand blue gradient accent.
 */
export function ServicesHero() {
  const { isDark } = useTheme();

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center mb-3 sm:mb-4 lg:mb-5">
      {/* Category Badge */}
      <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-badge text-xs font-bold uppercase tracking-wider shadow-xs transition-colors duration-200 ${
            isDark
              ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
              : 'text-brand-600 bg-brand-500/10 border border-brand-200/80'
          }`}
        >
          <Anchor className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-brand-500'}`} />
          OUR SERVICES
        </span>
      </div>

      {/* Section Main Title */}
      <h1
        className={`text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight leading-[1.12] mb-3.5 sm:mb-4 text-center transition-colors duration-200 ${
          isDark ? 'text-white' : 'text-[#0F172A]'
        }`}
      >
        Comprehensive Services.<br />
        <span
          className={
            isDark
              ? 'bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-[#1E88E5] via-[#1976D2] to-[#1565C0] bg-clip-text text-transparent'
          }
        >
          Seamless Global Trade.
        </span>
      </h1>

      {/* Supporting Narrative */}
      <p
        className={`text-sm sm:text-base font-normal leading-relaxed max-w-xl text-center mx-auto transition-colors duration-200 ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        Powering every step of your EXIM journey with intelligent solutions
        that connect people, processes and possibilities across the globe.
      </p>
    </div>
  );
}

export default ServicesHero;

