import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Anchor, ShieldCheck } from 'lucide-react';

export function BrandStatement() {
  return (
    <div className="w-full max-w-[1380px] mx-auto text-center pt-6">
      <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-r from-[#0A1B31] via-[#0D233F] to-[#0A1B31] border border-[#00C8F5]/35 shadow-[0_16px_50px_rgba(0,200,245,0.18)] overflow-hidden">
        {/* Background Ambient Glows & Grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #00C8F5 1px, transparent 1px), linear-gradient(to bottom, #00C8F5 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-accent-400 bg-[#00C8F5]/10 border border-[#00C8F5]/30 mb-6">
            <Anchor className="w-3.5 h-3.5 text-accent-400" />
            THE HASHHARBOUR VISION
          </div>

          {/* Headline — Exact Approved Two-Line Statement */}
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            WE DON'T JUST MOVE SHIPMENTS.<br />
            <span className="text-accent-400 bg-gradient-to-r from-[#00C8F5] via-[#19BFEF] to-[#00C8F5] bg-clip-text text-transparent">
              WE CONNECT THE INTELLIGENCE BEHIND GLOBAL TRADE.
            </span>
          </h3>

          {/* Narrative — Exact Approved Supporting Copy */}
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal mb-8 max-w-2xl">
            HashHarbour brings booking, tracking, documentation, visibility and logistics coordination into one connected digital ecosystem.
          </p>

          {/* CTA Buttons — Seamless Transition to Dedicated Routes */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <Link
              to="/services"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-surface-950 font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(0,212,255,0.4)] hover:shadow-[0_0_35px_rgba(0,212,255,0.6)] transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface-850/80 hover:bg-surface-800 text-white font-semibold text-sm border border-white/15 hover:border-accent-500/40 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>View Network Status</span>
              <ShieldCheck className="w-4 h-4 text-accent-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
