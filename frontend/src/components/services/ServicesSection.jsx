import React from 'react';
import { ServicesHero } from './ServicesHero';
import { ServicesGrid } from './ServicesGrid';
import { ServicesWorkflow } from './ServicesWorkflow';
import { ServicesCTA } from './ServicesCTA';

/**
 * HashHarbour Homepage — Services Section Master Component (Light Theme)
 * Expanded max-w-[1650px] container wrapper for near-full-viewport width visual presence.
 */
export function ServicesSection() {
  return (
    <section
      id="services"
      aria-label="HashHarbour Services Infrastructure"
      className="relative w-full min-h-screen bg-gradient-to-b from-[#061426]/90 via-[#061426] to-surface-900 text-white pt-[88px] lg:pt-[96px] pb-10 sm:pb-12 lg:pb-14 px-4 sm:px-8 lg:px-12 overflow-hidden flex flex-col items-center justify-start border-t border-white/5"
    >
      {/* Background Decorative Layer (Matching About Page Theme with Fainter Grid) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Radial Cyan Atmosphere Glow */}
        <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-[#00C8F5]/5 rounded-full blur-[140px]" />

        {/* Faint Square Grid Pattern (Subtler/Fainter opacity than About page's 0.04) */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #00C8F5 1px, transparent 1px), linear-gradient(to bottom, #00C8F5 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Main Structural Container (Expanded to near-full-viewport width) */}
      <div className="w-full max-w-[1650px] mx-auto z-10 flex flex-col items-center">
        <ServicesHero />
        <ServicesGrid />
        <ServicesWorkflow />
        <ServicesCTA />
      </div>
    </section>
  );
}

export default ServicesSection;
