import React from 'react';
import { Anchor, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

/**
 * ServicesCTA Component — Adaptive Bottom CTA Banner
 * Dark Mode: Deep slate-900 background with glowing cyan action button.
 * Light Mode: Clean white card with vibrant brand-blue gradient action button.
 */
export function ServicesCTA() {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-2xl lg:rounded-[24px] p-6 sm:p-7 lg:py-6 lg:px-9 w-full relative overflow-hidden border transition-all duration-300 ${
        isDark
          ? 'bg-slate-900 text-white border-slate-800 shadow-xl'
          : 'bg-white text-[#0F172A] border-blue-100/90 shadow-[0_12px_36px_-10px_rgba(15,40,80,0.08)]'
      }`}
    >
      {/* Background Subtle Ambient Glow */}
      <div
        className={`absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-cyan-500/10' : 'bg-brand-500/5'
        }`}
      />

      <div className="flex flex-col md:flex-row items-center justify-between gap-5 lg:gap-8 relative z-10">
        {/* Left Side: Anchor Circle Icon + Text Copy */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center text-center sm:text-left gap-4 sm:gap-5">
          <div
            className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
              isDark
                ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                : 'bg-brand-500/10 border border-brand-500/25 text-brand-600 shadow-[0_4px_16px_rgba(30,136,229,0.15)]'
            }`}
          >
            <Anchor className="w-6 h-6" />
          </div>
          <div>
            <h3
              className={`text-lg sm:text-xl lg:text-xl font-bold mb-0.5 ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}
            >
              Ready to simplify your global trade?
            </h3>
            <p
              className={`text-xs sm:text-sm font-normal ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
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
            className={
              isDark
                ? 'w-full sm:w-auto font-semibold px-7 h-11 text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-none shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300'
                : 'w-full sm:w-auto font-semibold px-7 h-11 text-sm bg-gradient-to-r from-[#1E88E5] via-[#1976D2] to-[#1565C0] hover:from-[#1976D2] hover:to-[#0D47A1] text-white border-none shadow-[0_4px_14px_rgba(30,136,229,0.35)] hover:shadow-[0_6px_20px_rgba(30,136,229,0.45)] transition-all duration-300'
            }
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ServicesCTA;
