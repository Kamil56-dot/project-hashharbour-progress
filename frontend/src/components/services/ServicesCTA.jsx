import React from 'react';
import { Anchor, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * ServicesCTA Component — High-Contrast Dark Bottom CTA Banner
 * Deep slate-900 background banner providing bold visual contrast on the white page.
 */
export function ServicesCTA() {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 lg:py-5 lg:px-8 w-full relative overflow-hidden border border-slate-800 shadow-xl">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-5 lg:gap-8 relative z-10">
        {/* Left Side: Anchor Circle Icon + Text Copy */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center text-center sm:text-left gap-4 sm:gap-5">
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Anchor className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-white mb-0.5">
              Ready to simplify your global trade?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              Join thousands of businesses already shipping smarter with HashHarbour.
            </p>
          </div>
        </div>

        {/* Right Side: Primary CTA Action Button */}
        <div className="shrink-0 w-full sm:w-auto">
          <Button
            href="#get-started"
            variant="primary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            className="w-full sm:w-auto font-semibold px-7 h-11 text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-none shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ServicesCTA;
