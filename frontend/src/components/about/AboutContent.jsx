import React from 'react';
import { Anchor, Link2, Sliders, Ship } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PRINCIPLES = [
  {
    number: '01',
    title: 'CONNECT',
    description: 'Bring businesses, carriers and logistics partners into one connected trade ecosystem.',
    icon: Link2,
  },
  {
    number: '02',
    title: 'SIMPLIFY',
    description: 'Reduce complexity across booking, documentation, tracking and logistics operations.',
    icon: Sliders,
  },
  {
    number: '03',
    title: 'DELIVER',
    description: 'Provide reliable visibility and smarter logistics from origin to destination.',
    icon: Ship,
  },
];

/**
 * Left Column Content Component for About Section
 * Fully responsive to global ThemeContext (Dark / Light).
 */
export function AboutContent({ elementsRef }) {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col text-left max-w-[620px]">
      {/* 1. Small Pill Badge */}
      <div ref={elementsRef?.badge} className="inline-flex items-center gap-2 mb-4 w-fit">
        <span
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
            isDark
              ? 'text-accent-400 bg-[#00C8F5]/10 border border-[#00C8F5]/30 shadow-[0_0_15px_rgba(0,200,245,0.18)]'
              : 'text-brand-600 bg-brand-500/10 border border-brand-200/80 shadow-xs'
          }`}
        >
          <Anchor className={`w-3.5 h-3.5 ${isDark ? 'text-accent-400' : 'text-brand-500'}`} />
          ABOUT HASHHARBOUR
        </span>
      </div>

      {/* 2. Main Heading */}
      <h2
        ref={elementsRef?.heading}
        className={`text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-[1.18] mb-5 transition-colors duration-200 ${
          isDark ? 'text-white' : 'text-[#0F172A]'
        }`}
      >
        Connecting Trade.{' '}
        <span
          className={
            isDark
              ? 'text-accent-400 bg-gradient-to-r from-[#00C8F5] via-[#19BFEF] to-[#00C8F5] bg-clip-text text-transparent'
              : 'text-brand-600 bg-gradient-to-r from-[#1E88E5] via-[#1976D2] to-[#1565C0] bg-clip-text text-transparent'
          }
        >
          Moving Possibilities.
        </span>
      </h2>

      {/* 3. Body Copy */}
      <div
        ref={elementsRef?.body}
        className={`space-y-3.5 mb-8 text-base sm:text-[16.5px] leading-relaxed font-normal transition-colors duration-200 ${
          isDark ? 'text-text-secondary' : 'text-slate-600'
        }`}
      >
        <p>
          HashHarbour is a next-generation EXIM trade and logistics platform designed to simplify global commerce through smarter digital infrastructure.
        </p>
        <p>
          From container booking and shipment tracking to documentation, route visibility and secure trade operations, HashHarbour brings the entire logistics journey into one connected ecosystem.
        </p>
        <p
          className={`text-sm sm:text-base font-medium border-l-2 pl-3.5 py-0.5 transition-colors duration-200 ${
            isDark
              ? 'text-text-secondary/85 border-accent-400/40'
              : 'text-slate-700 border-brand-500/50'
          }`}
        >
          By connecting exporters, importers, logistics partners, carriers and businesses through a unified digital platform, HashHarbour helps make global trade more visible, efficient and reliable.
        </p>
      </div>

      {/* 4. Three Compact Glass Rows */}
      <div ref={elementsRef?.rows} className="flex flex-col gap-3">
        {PRINCIPLES.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.number}
              className={`group relative flex items-start gap-4 p-3.5 sm:p-4 rounded-xl backdrop-blur-md border transition-all duration-300 ease-out hover:-translate-y-1 ${
                isDark
                  ? 'bg-[#0A1B31]/65 border-[#00C8F5]/25 hover:border-[#00C8F5]/60 hover:bg-[#0D233F]/85 hover:shadow-[0_8px_25px_rgba(0,200,245,0.18)]'
                  : 'bg-white/90 border-blue-100/90 shadow-[0_4px_16px_rgba(15,40,80,0.06)] hover:border-brand-400 hover:bg-white hover:shadow-[0_8px_25px_rgba(30,136,229,0.16)]'
              }`}
            >
              {/* Number + Cyan/Blue Accent Indicator */}
              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                <span
                  className={`text-xs font-bold font-mono tracking-wider transition-colors duration-200 ${
                    isDark ? 'text-accent-400' : 'text-brand-600'
                  }`}
                >
                  {item.number}
                </span>
                <span
                  className={`w-2.5 h-[1.5px] transition-colors duration-200 ${
                    isDark ? 'bg-accent-400/70' : 'bg-brand-500/70'
                  }`}
                />
                <div
                  className={`w-7 h-7 rounded-md border flex items-center justify-center shrink-0 transition-colors duration-200 ${
                    isDark
                      ? 'bg-[#00C8F5]/10 border-[#00C8F5]/30 text-accent-400'
                      : 'bg-brand-500/10 border-brand-200 text-brand-600'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col text-left">
                <span
                  className={`text-sm font-bold tracking-wide mb-0.5 transition-colors duration-200 ${
                    isDark
                      ? 'text-white group-hover:text-accent-400'
                      : 'text-[#0F172A] group-hover:text-brand-600'
                  }`}
                >
                  {item.title}
                </span>
                <p
                  className={`text-xs sm:text-[13px] leading-snug transition-colors duration-200 ${
                    isDark ? 'text-text-secondary' : 'text-slate-600'
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
