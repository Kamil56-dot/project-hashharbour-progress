import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Anchor, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function BrandStatement() {
  const { isDark } = useTheme();

  return (
    <div className="w-full max-w-[1380px] mx-auto text-center pt-6">
      <div
        className={`relative p-8 sm:p-12 lg:p-16 rounded-3xl border overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-r from-[#0A1B31] via-[#0D233F] to-[#0A1B31] border-[#00C8F5]/35 shadow-[0_16px_50px_rgba(0,200,245,0.18)]'
            : 'bg-gradient-to-r from-[#FFFFFF] via-[#F0F7FE] to-[#FFFFFF] border-blue-200/80 shadow-[0_16px_50px_rgba(30,136,229,0.12)]'
        }`}
      >
        {/* Background Ambient Glows & Grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] ${
              isDark ? 'bg-accent-500/10' : 'bg-brand-500/10'
            }`}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: isDark
                ? 'linear-gradient(to right, #00C8F5 1px, transparent 1px), linear-gradient(to bottom, #00C8F5 1px, transparent 1px)'
                : 'linear-gradient(to right, #1E88E5 1px, transparent 1px), linear-gradient(to bottom, #1E88E5 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Top Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 transition-colors duration-200 ${
              isDark
                ? 'text-accent-400 bg-[#00C8F5]/10 border border-[#00C8F5]/30'
                : 'text-brand-600 bg-brand-500/10 border border-brand-200/80 shadow-xs'
            }`}
          >
            <Anchor className={`w-3.5 h-3.5 ${isDark ? 'text-accent-400' : 'text-brand-500'}`} />
            THE HASHHARBOUR VISION
          </div>

          {/* Headline */}
          <h3
            className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-6 transition-colors duration-200 ${
              isDark ? 'text-white' : 'text-[#0F172A]'
            }`}
          >
            WE DON'T JUST MOVE SHIPMENTS.<br />
            <span
              className={
                isDark
                  ? 'text-accent-400 bg-gradient-to-r from-[#00C8F5] via-[#19BFEF] to-[#00C8F5] bg-clip-text text-transparent'
                  : 'text-brand-600 bg-gradient-to-r from-[#1E88E5] via-[#1976D2] to-[#1565C0] bg-clip-text text-transparent'
              }
            >
              WE CONNECT THE INTELLIGENCE BEHIND GLOBAL TRADE.
            </span>
          </h3>

          {/* Narrative */}
          <p
            className={`text-base sm:text-lg leading-relaxed font-normal mb-8 max-w-2xl transition-colors duration-200 ${
              isDark ? 'text-text-secondary' : 'text-slate-600'
            }`}
          >
            HashHarbour brings booking, tracking, documentation, visibility and logistics coordination into one connected digital ecosystem.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <Link
              to="/services"
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 group ${
                isDark
                  ? 'bg-accent-500 hover:bg-accent-400 text-surface-950 shadow-[0_0_25px_rgba(0,212,255,0.4)] hover:shadow-[0_0_35px_rgba(0,212,255,0.6)]'
                  : 'bg-brand-500 hover:bg-brand-600 text-white shadow-[0_4px_20px_rgba(30,136,229,0.3)] hover:shadow-[0_6px_25px_rgba(30,136,229,0.45)]'
              }`}
            >
              <span>Explore Our Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm border transition-all duration-200 flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-surface-850/80 hover:bg-surface-800 text-white border-white/15 hover:border-accent-500/40'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-brand-400 shadow-xs'
              }`}
            >
              <span>View Network Status</span>
              <ShieldCheck className={`w-4 h-4 ${isDark ? 'text-accent-400' : 'text-brand-500'}`} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
