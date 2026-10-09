import React from 'react';
import { Anchor, Link2, Sliders, Ship } from 'lucide-react';

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
 */
export function AboutContent({ elementsRef }) {
  return (
    <div className="flex flex-col text-left max-w-[620px]">
      {/* 1. Small Pill Badge */}
      <div ref={elementsRef?.badge} className="inline-flex items-center gap-2 mb-4 w-fit">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-accent-400 bg-[#00C8F5]/10 border border-[#00C8F5]/30 shadow-[0_0_15px_rgba(0,200,245,0.18)]">
          <Anchor className="w-3.5 h-3.5 text-accent-400" />
          ABOUT HASHHARBOUR
        </span>
      </div>

      {/* 2. Main Heading */}
      <h2
        ref={elementsRef?.heading}
        className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-white leading-[1.18] mb-5"
      >
        Connecting Trade.{' '}
        <span className="text-accent-400 bg-gradient-to-r from-[#00C8F5] via-[#19BFEF] to-[#00C8F5] bg-clip-text text-transparent">
          Moving Possibilities.
        </span>
      </h2>

      {/* 3. Body Copy (Exact prompt text) */}
      <div ref={elementsRef?.body} className="space-y-3.5 mb-8 text-text-secondary text-base sm:text-[16.5px] leading-relaxed font-normal">
        <p>
          HashHarbour is a next-generation EXIM trade and logistics platform designed to simplify global commerce through smarter digital infrastructure.
        </p>
        <p>
          From container booking and shipment tracking to documentation, route visibility and secure trade operations, HashHarbour brings the entire logistics journey into one connected ecosystem.
        </p>
        <p className="text-sm sm:text-base text-text-secondary/85 font-medium border-l-2 border-accent-400/40 pl-3.5 py-0.5">
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
              className="group relative flex items-start gap-4 p-3.5 sm:p-4 rounded-xl bg-[#0A1B31]/65 backdrop-blur-md border border-[#00C8F5]/25 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#00C8F5]/60 hover:bg-[#0D233F]/85 hover:shadow-[0_8px_25px_rgba(0,200,245,0.18)]"
            >
              {/* Number + Cyan Accent Indicator */}
              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                <span className="text-xs font-bold text-accent-400 font-mono tracking-wider">
                  {item.number}
                </span>
                <span className="w-2.5 h-[1.5px] bg-accent-400/70" />
                <div className="w-7 h-7 rounded-md bg-[#00C8F5]/10 border border-[#00C8F5]/30 flex items-center justify-center text-accent-400 shrink-0">
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white tracking-wide mb-0.5 group-hover:text-accent-400 transition-colors duration-200">
                  {item.title}
                </span>
                <p className="text-xs sm:text-[13px] text-text-secondary leading-snug">
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
