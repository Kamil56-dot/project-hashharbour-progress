import React from 'react';
import { Anchor } from 'lucide-react';

/**
 * ServicesHero Component — Light Theme Centered Hero Layout
 * Clean white background styling, bold black typography, neutral grey subtitle.
 */
export function ServicesHero() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center mb-3 sm:mb-4 lg:mb-5">
      {/* Category Badge — Dark Theme High Contrast */}
      <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-badge text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 shadow-xs">
          <Anchor className="w-3.5 h-3.5 text-cyan-400" />
          OUR SERVICES
        </span>
      </div>

      {/* Section Main Title — Bold Solid White & Cyan Accent */}
      <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-white leading-[1.12] mb-3.5 sm:mb-4 text-center">
        Comprehensive Services.<br />
        <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
          Seamless Global Trade.
        </span>
      </h1>

      {/* Supporting Narrative — Light Slate Subtitle */}
      <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl text-center mx-auto">
        Powering every step of your EXIM journey with intelligent solutions
        that connect people, processes and possibilities across the globe.
      </p>
    </div>
  );
}

export default ServicesHero;
