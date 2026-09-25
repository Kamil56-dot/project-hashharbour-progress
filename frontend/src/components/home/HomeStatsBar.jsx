import React from 'react';
import { Ship, Globe, Clock, Users } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * HomeStatsBar — Stats bar at the bottom of the container section.
 * Reuses the same data shape as StatsBar.jsx but styled for the home page palette.
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
    <section
      className={`w-full border-t transition-colors duration-200 ${
        isDark
          ? 'bg-surface-850 border-white/[0.06]'
          : 'bg-gray-50 border-gray-100'
      }`}
      style={{
        paddingTop: 'clamp(28px, 4vh, 48px)',
        paddingBottom: 'clamp(28px, 4vh, 48px)',
        paddingLeft: 'clamp(16px, 4vw, 64px)',
        paddingRight: 'clamp(16px, 4vw, 64px)',
      }}
    >
      <div
        className="w-full mx-auto grid grid-cols-2 lg:grid-cols-4"
        style={{
          maxWidth: '1100px',
          gap: 'clamp(20px, 3vw, 48px)',
        }}
      >
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3"
            >
              {/* Icon */}
              <div
                className={`shrink-0 flex items-center justify-center shadow-sm ${
                  isDark
                    ? 'bg-surface-800 border border-slate-700 text-slate-400'
                    : 'bg-white border border-gray-100 text-gray-500'
                }`}
                style={{
                  width: 'clamp(40px, 3.5vw, 52px)',
                  height: 'clamp(40px, 3.5vw, 52px)',
                  borderRadius: 'clamp(10px, 0.8vw, 14px)',
                }}
              >
                <Icon
                  style={{
                    width: 'clamp(18px, 1.4vw, 24px)',
                    height: 'clamp(18px, 1.4vw, 24px)',
                    strokeWidth: 1.6,
                  }}
                />
              </div>

              {/* Number + Label */}
              <div className="flex flex-col">
                <span
                  className={`font-extrabold leading-none tracking-tight ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                  style={{ fontSize: 'clamp(20px, 2vw, 32px)' }}
                >
                  {stat.number}
                </span>
                <span
                  className={`font-medium leading-tight ${
                    isDark ? 'text-slate-500' : 'text-gray-400'
                  }`}
                  style={{
                    fontSize: 'clamp(10px, 0.75vw, 13px)',
                    marginTop: 'clamp(2px, 0.3vh, 4px)',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
