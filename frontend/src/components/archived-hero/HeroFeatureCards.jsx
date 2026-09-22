import React from 'react';
import { Ship, MapPin, ShieldCheck } from 'lucide-react';

const FEATURE_CARDS = [
  {
    id: 'smart-booking',
    icon: Ship,
    title: 'Smart Booking',
    description: 'Book containers instantly with real-time availability and the most competitive rates.',
  },
  {
    id: 'real-time-tracking',
    icon: MapPin,
    title: 'Real-Time Tracking',
    description: 'Track your shipments in real-time across sea, air, and land with complete visibility.',
  },
  {
    id: 'secure-compliant',
    icon: ShieldCheck,
    title: 'Secure & Compliant',
    description: 'Built with global compliance standards to ensure secure and reliable trade operations.',
  },
];

/**
 * Hero 3-Column Feature Cards Component.
 * Source of Truth: hero page reference.jpeg & Phase 3.5 Specification
 */
export const HeroFeatureCards = React.forwardRef(function HeroFeatureCards(
  { className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`w-full max-w-[960px] grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 ${className}`}
      {...props}
    >
      {FEATURE_CARDS.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="group relative flex items-center gap-3.5 sm:gap-4 p-4 sm:p-4.5 lg:p-5 min-h-[100px] rounded-xl border border-white/10 bg-[#0B1528]/75 backdrop-blur-md shadow-card transition-all duration-300 ease-out hover:bg-[#0E1B33]/85 overflow-hidden"
          >
            {/* Free-Standing Cyan Line Icon on Left (Vertically Centered) */}
            <div className="shrink-0 flex items-center justify-center">
              <IconComponent className="w-9 h-9 sm:w-10 sm:h-10 text-accent-400 stroke-[1.65]" />
            </div>

            {/* Right Text Column: Title + Description (Left Aligned) */}
            <div className="flex flex-col flex-1 text-left">
              <h3 className="text-[16px] sm:text-[17px] font-semibold text-white mb-1.5 leading-snug tracking-tight">
                {card.title}
              </h3>
              <p className="text-[13px] sm:text-[13.5px] font-normal text-text-secondary leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Left-to-Right Luminous Cyan Bottom Energy Line Animation */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none rounded-b-xl overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-accent-400 via-[#00D4FF] to-accent-400 shadow-[0_0_12px_rgba(0,212,255,0.95)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
            </div>
          </div>
        );
      })}
    </div>
  );
});
