import React from 'react';
import { Globe, Activity, ShieldCheck } from 'lucide-react';

const CARDS_DATA = [
  {
    id: 'global-reach',
    category: 'GLOBAL REACH',
    value: '95+ Countries',
    subtitle: 'Connected trade network',
    icon: Globe,
    positionClass: 'top-3 left-0 sm:left-2 lg:-left-4',
    animationClass: 'animate-float-slow',
  },
  {
    id: 'smart-logistics',
    category: 'SMART LOGISTICS',
    value: 'Real-Time Visibility',
    subtitle: 'Track every movement',
    icon: Activity,
    positionClass: 'top-1/3 -right-2 sm:right-0 lg:-right-6',
    animationClass: 'animate-float-medium',
  },
  {
    id: 'trusted-network',
    category: 'TRUSTED NETWORK',
    value: 'Secure & Compliant',
    subtitle: 'Built for modern trade',
    icon: ShieldCheck,
    positionClass: 'bottom-4 left-4 sm:left-8 lg:left-2',
    animationClass: 'animate-float-fast',
  },
];

/**
 * 3 Floating Glass Cards surrounding the 3D Globe Visual
 */
export function AboutFloatingCards() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {CARDS_DATA.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`absolute pointer-events-auto transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${card.positionClass} ${card.animationClass}`}
          >
            <div className="flex items-center gap-3 px-4 py-3 sm:px-4.5 sm:py-3.5 rounded-xl bg-[#0A1B31]/75 backdrop-blur-xl border border-[#00C8F5]/30 shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:border-[#00C8F5]/60 hover:shadow-[0_0_20px_rgba(0,200,245,0.25)] transition-all duration-300">
              {/* Icon Container */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#00C8F5]/10 border border-[#00C8F5]/30 flex items-center justify-center text-accent-400 shrink-0 shadow-[0_0_10px_rgba(0,200,245,0.15)]">
                <IconComponent className="w-5 h-5 stroke-[1.75]" />
              </div>

              {/* Card Content */}
              <div className="flex flex-col text-left">
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-accent-400/90 mb-0.5">
                  {card.category}
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-white leading-tight">
                  {card.value}
                </span>
                <span className="text-[11.5px] font-normal text-text-secondary">
                  {card.subtitle}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
