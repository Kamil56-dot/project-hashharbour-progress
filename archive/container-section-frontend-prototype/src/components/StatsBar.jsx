import React, { useEffect, useRef } from 'react';
import { Ship, Box, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const defaultStats = [
  {
    id: 1,
    icon: Ship,
    number: '1200+',
    val: 1200,
    suffix: '+',
    label: 'Shipments Delivered',
    sublabel: 'Across the Globe',
  },
  {
    id: 2,
    icon: Box,
    number: '850+',
    val: 850,
    suffix: '+',
    label: 'Global Routes',
    sublabel: 'Optimized & Reliable',
  },
  {
    id: 3,
    icon: Users,
    number: '980+',
    val: 980,
    suffix: '+',
    label: 'Trusted Clients',
    sublabel: 'Businesses Worldwide',
  },
  {
    id: 4,
    icon: Globe,
    number: '95+',
    val: 95,
    suffix: '+',
    label: 'Countries Connected',
    sublabel: 'One Global Network',
  },
];

export default function StatsBar({ stats = defaultStats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="glass-stats rounded-[16px] p-7 md:px-10 md:py-8 my-6 relative z-10"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 lg:divide-x divide-[#00E5FF]/15">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon || Ship;
          return (
            <div
              key={stat.id || idx}
              className={`flex items-center gap-4 ${idx > 0 ? 'pt-6 sm:pt-0 lg:pl-8' : ''}`}
            >
              {/* Stat Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] shrink-0">
                <IconComponent className="w-6 h-6 stroke-[1.75]" />
              </div>

              {/* Stat Text */}
              <div className="flex flex-col">
                <span className="text-[32px] md:text-[36px] font-bold text-[#00E5FF] leading-none tracking-tight">
                  {stat.number}
                </span>
                <span className="text-[14px] font-semibold text-white mt-1 leading-tight">
                  {stat.label}
                </span>
                <span className="text-[12px] font-normal text-white/50 mt-0.5 leading-tight">
                  {stat.sublabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
