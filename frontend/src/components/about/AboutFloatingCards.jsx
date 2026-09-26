import React from 'react';
import { Globe, Activity, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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
 * Responsive to global ThemeContext (Dark / Light).
 */
export function AboutFloatingCards() {
  const { isDark } = useTheme();

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {CARDS_DATA.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`absolute pointer-events-auto transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${card.positionClass} ${card.animationClass}`}
          >
            <div
              className={`flex items-center gap-3 px-4 py-3 sm:px-4.5 sm:py-3.5 rounded-xl backdrop-blur-xl border transition-all duration-300 ${
                isDark
                  ? 'bg-[#0A1B31]/75 border-[#00C8F5]/30 shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:border-[#00C8F5]/60 hover:shadow-[0_0_20px_rgba(0,200,245,0.25)]'
                  : 'bg-white/95 border-blue-100/90 shadow-[0_8px_32px_rgba(15,40,80,0.12)] hover:border-brand-400 hover:shadow-[0_12px_32px_rgba(30,136,229,0.18)]'
              }`}
            >
              {/* Icon Container */}
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border flex items-center justify-center shrink-0 transition-colors duration-200 ${
                  isDark
                    ? 'bg-[#00C8F5]/10 border-[#00C8F5]/30 text-accent-400 shadow-[0_0_10px_rgba(0,200,245,0.15)]'
                    : 'bg-brand-500/10 border-brand-200 text-brand-600 shadow-xs'
                }`}
              >
                <IconComponent className="w-5 h-5 stroke-[1.75]" />
              </div>

              {/* Card Content */}
              <div className="flex flex-col text-left">
                <span
                  className={`text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider mb-0.5 transition-colors duration-200 ${
                    isDark ? 'text-accent-400/90' : 'text-brand-600'
                  }`}
                >
                  {card.category}
                </span>
                <span
                  className={`text-sm sm:text-[15px] font-bold leading-tight transition-colors duration-200 ${
                    isDark ? 'text-white' : 'text-[#0F172A]'
                  }`}
                >
                  {card.value}
                </span>
                <span
                  className={`text-[11.5px] font-normal transition-colors duration-200 ${
                    isDark ? 'text-text-secondary' : 'text-slate-500'
                  }`}
                >
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
