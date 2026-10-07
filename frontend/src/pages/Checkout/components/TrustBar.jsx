import React from 'react';
import { ShieldCheck, Globe, Headset, Users } from 'lucide-react';

/**
 * Trust Bar — Phase 3
 * 4 trust items in a row below the two-column checkout layout.
 * Matching Image 1 reference:
 * - Circular light-blue icon badge on left
 * - Bold title + muted subtitle on right
 * - Responsive: 4 cols >= 1024px, 2x2 below 1024px, 1 col below 480px.
 */

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    subtitle: '256-bit SSL encryption',
  },
  {
    icon: Globe,
    title: 'Global Shipping',
    subtitle: 'Worldwide Coverage',
  },
  {
    icon: Headset,
    title: '24/7 Support',
    subtitle: "We're here to help",
  },
  {
    icon: Users,
    title: 'Trusted by Businesses',
    subtitle: '1000+ Happy Clients',
  },
];

export function TrustBar({ isDark }) {
  return (
    <div
      id="checkout-trust-bar"
      className="w-full pt-8 sm:pt-10 pb-10 sm:pb-14 transition-colors duration-200"
    >
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-center gap-3.5 text-left"
            >
              {/* Circular light-blue icon badge */}
              <div
                className={`w-[44px] h-[44px] sm:w-[46px] sm:h-[46px] rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                  isDark
                    ? 'bg-[#1E88E5]/15 text-[#5BB5F5]'
                    : 'bg-[#DBEAFE] text-[#1E88E5]'
                }`}
              >
                <Icon className="w-[20px] h-[20px]" />
              </div>

              {/* Title + Subtitle */}
              <div className="min-w-0">
                <span
                  className={`block text-[14px] sm:text-[15px] font-bold leading-snug tracking-tight ${
                    isDark ? 'text-white' : 'text-[#0F172A]'
                  }`}
                >
                  {item.title}
                </span>
                <span
                  className={`block text-[12px] sm:text-[13px] font-normal leading-snug mt-0.5 ${
                    isDark ? 'text-slate-400' : 'text-[#8FA0B5]'
                  }`}
                >
                  {item.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrustBar;
