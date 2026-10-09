import React from 'react';
import { Ship, Navigation, ShieldCheck } from 'lucide-react';

const defaultFeatures = [
  {
    id: 1,
    icon: Ship,
    title: 'Smart Booking',
    description: 'Book containers instantly with real-time availability and the most competitive rates.',
  },
  {
    id: 2,
    icon: Navigation,
    title: 'Real-Time Tracking',
    description: 'Track your shipments in real-time across sea, air, and land with complete visibility.',
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: 'Secure & Compliant',
    description: 'Built with global compliance standards to ensure secure and reliable trade operations.',
  },
];

export default function FeatureCards({ features = defaultFeatures, onCardClick }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 relative z-10">
      {features.map((feature, idx) => {
        const IconComponent = feature.icon || Ship;
        return (
          <div
            key={feature.id || idx}
            onClick={() => onCardClick?.(feature)}
            className="glass-panel rounded-[14px] p-7 cursor-pointer transition-all duration-300 card-hover-glow hover:-translate-y-1 flex flex-col justify-between group animate-fade-in-up"
            style={{ animationDelay: `${200 + idx * 150}ms` }}
          >
            <div>
              {/* Icon Container */}
              <div className="w-[44px] h-[44px] rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] mb-5 group-hover:bg-[#00E5FF]/20 group-hover:border-[#00E5FF]/50 transition-all duration-300">
                <IconComponent className="w-6 h-6 stroke-[1.75]" />
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-semibold text-white mb-2.5 tracking-wide group-hover:text-[#00E5FF] transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[13px] font-normal text-white/60 leading-relaxed">
                {feature.description}
              </p>
            </div>

            {/* Bottom accent glow bar on hover */}
            <div className="w-0 h-[2px] bg-gradient-to-r from-[#00E5FF] to-transparent mt-6 group-hover:w-full transition-all duration-500 rounded-full" />
          </div>
        );
      })}
    </div>
  );
}
