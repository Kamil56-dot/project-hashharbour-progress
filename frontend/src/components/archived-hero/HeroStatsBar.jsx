import React from 'react';
import { Ship, Package, Users, Globe } from 'lucide-react';
import { STATS_DATA } from '../../constants/statistics';

// Map icon names from STATS_DATA to Lucide icons
const ICON_MAP = {
  Ship: Ship,
  Container: Package,
  Package: Package,
  Users: Users,
  Globe: Globe,
};

/**
 * HASHHARBOUR — HERO STATISTICS / METRICS BAR COMPONENT
 * Source of Truth: target reference design (Image 1)
 *
 * Full-width translucent glass container with 4 equal columns displaying:
 * - Shipments Delivered (1200+)
 * - Global Routes (850+)
 * - Trusted Clients (980+)
 * - Countries Connected (95+)
 */
export const HeroStatsBar = React.forwardRef(function HeroStatsBar(
  { className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`w-full max-w-[1350px] rounded-xl border border-white/10 bg-[#0B1528]/75 backdrop-blur-md shadow-card transition-all duration-200 ${className}`}
      {...props}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
        {STATS_DATA.map((stat) => {
          const IconComponent = ICON_MAP[stat.iconName] || Globe;
          return (
            <div
              key={stat.id}
              className="flex items-center gap-3.5 sm:gap-4 p-4 sm:p-4.5 lg:p-5"
            >
              {/* Free-Standing Cyan Line Icon */}
              <div className="shrink-0 flex items-center justify-center">
                <IconComponent className="w-9 h-9 sm:w-10 sm:h-10 text-accent-400 stroke-[1.65]" />
              </div>

              {/* Text / Metric Content */}
              <div className="flex flex-col">
                <div className="text-2xl sm:text-[28px] font-bold text-accent-400 tracking-tight leading-none mb-1">
                  {stat.number}
                  {stat.suffix}
                </div>
                <div className="text-[14px] sm:text-[15px] font-semibold text-white leading-tight">
                  {stat.primaryLabel}
                </div>
                <div className="text-[12px] sm:text-[13px] font-normal text-text-secondary leading-tight mt-0.5">
                  {stat.secondaryLabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default HeroStatsBar;
