import React from 'react';
import { Ship, Globe, Clock, Users } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * HomeStatsBar — Compact rounded glass stats pill.
 * Centered below the hero video row with thin dividers.
 * 2x2 grid on mobile/tablet, single row on desktop.
 * Supports dark and light themes.
 */

const STATS = [
  {
    icon: Ship,
    number: '25K+',
    label: 'Containers Delivered',
  },
  {
    icon: Globe,
    number: '120+',
    label: 'Countries Served',
  },
  {
    icon: Clock,
    number: '99.9%',
    label: 'On-Time Delivery',
  },
  {
    icon: Users,
    number: '8K+',
    label: 'Happy Clients',
  },
];

export function HomeStatsBar() {
  const { isDark } = useTheme();

  return (
    <div
      className={`w-full max-w-[820px] mx-auto rounded-hh-card border border-hh-card-border shadow-hh-card max-md:!py-1.5 transition-colors duration-200 motion-reduce:transition-none ${
        isDark
          ? 'bg-[var(--glass-bg)] backdrop-blur-md'
          : 'bg-white/80 backdrop-blur-md'
      }`}
      style={{
        padding: 'clamp(8px, 1vh, 14px) clamp(12px, 1.6vw, 32px)',
      }}
    >
      <div className="grid grid-cols-2 gap-y-2 md:gap-y-3 gap-x-2 sm:gap-x-4 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2.5 lg:flex-1 lg:justify-center">
                <div
                  className={`shrink-0 flex items-center justify-center rounded-lg ${
                    isDark
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'bg-brand-500/10 text-brand-700'
                  }`}
                  style={{
                    width: 'clamp(28px, 2vw, 34px)',
                    height: 'clamp(28px, 2vw, 34px)',
                  }}
                >
                  <Icon
                    style={{
                      width: 'clamp(14px, 1vw, 17px)',
                      height: 'clamp(14px, 1vw, 17px)',
                    }}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`font-extrabold leading-none tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                    style={{ fontSize: 'clamp(14px, 0.95vw + 0.1vh, 18px)' }}
                  >
                    {stat.number}
                  </span>
                  <span
                    className={`font-medium leading-tight whitespace-nowrap truncate ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                    style={{
                      fontSize: 'clamp(10px, 0.65vw, 12px)',
                      marginTop: '2px',
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              </div>
              {idx < STATS.length - 1 && (
                <div
                  className={`hidden lg:block h-6 w-px shrink-0 ${
                    isDark ? 'bg-white/10' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
