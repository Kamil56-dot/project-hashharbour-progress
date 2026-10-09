import React from 'react';
import { Eye, Activity, Globe } from 'lucide-react';

const PILLARS_DATA = [
  {
    id: 'pillar-1',
    number: '01',
    title: 'Trade Visibility',
    description: 'See what is happening across the shipment lifecycle.',
    icon: Eye,
  },
  {
    id: 'pillar-2',
    number: '02',
    title: 'Operational Intelligence',
    description: 'Turn logistics data into faster, smarter decisions.',
    icon: Activity,
  },
  {
    id: 'pillar-3',
    number: '03',
    title: 'Global Connectivity',
    description: 'Connect businesses, carriers and trade networks through one platform.',
    icon: Globe,
  },
];

export function TradePillars() {
  return (
    <div className="w-full max-w-[1380px] mx-auto mb-24 lg:mb-32">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-accent-400 bg-[#00C8F5]/10 border border-[#00C8F5]/30 mb-4">
          CORE TRADE INFRASTRUCTURE
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">
          Three Pillars of Modern{' '}
          <span className="text-accent-400 bg-gradient-to-r from-[#00C8F5] via-[#19BFEF] to-[#00C8F5] bg-clip-text text-transparent">
            Trade Operations
          </span>
        </h3>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
          Designed to eliminate friction, bring total visibility, and connect every phase of global trade.
        </p>
      </div>

      {/* 3 Pillars Grid (3-Card Row on Desktop/Tablet, 1 Column on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {PILLARS_DATA.map((item) => {
          const IconComponent = item.icon;

          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#0A1B31]/70 backdrop-blur-lg border border-[#00C8F5]/25 hover:border-[#00C8F5]/60 hover:bg-[#0D233F]/90 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_36px_rgba(0,200,245,0.2)]"
            >
              <div>
                {/* Header: Number Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono font-bold tracking-widest text-accent-400 px-2.5 py-1 rounded bg-[#00C8F5]/10 border border-[#00C8F5]/25">
                    PILLAR {item.number}
                  </span>
                </div>

                {/* Minimal Cyan Icon & Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00C8F5]/10 border border-[#00C8F5]/30 flex items-center justify-center text-accent-400 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,200,245,0.2)]">
                    <IconComponent className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <h4 className="text-xl font-extrabold text-white group-hover:text-accent-400 transition-colors duration-200">
                    {item.title}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed font-normal">
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
