import React from 'react';
import { Eye, Activity, Globe } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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
  const { isDark } = useTheme();

  return (
    <div className="w-full max-w-[1380px] mx-auto mb-24 lg:mb-32">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 transition-colors duration-200 ${
            isDark
              ? 'text-accent-400 bg-[#00C8F5]/10 border border-[#00C8F5]/30'
              : 'text-brand-600 bg-brand-500/10 border border-brand-200/80 shadow-xs'
          }`}
        >
          CORE TRADE INFRASTRUCTURE
        </div>
        <h3
          className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 transition-colors duration-200 ${
            isDark ? 'text-white' : 'text-[#0F172A]'
          }`}
        >
          Three Pillars of Modern{' '}
          <span
            className={
              isDark
                ? 'text-accent-400 bg-gradient-to-r from-[#00C8F5] via-[#19BFEF] to-[#00C8F5] bg-clip-text text-transparent'
                : 'text-brand-600 bg-gradient-to-r from-[#1E88E5] via-[#1976D2] to-[#1565C0] bg-clip-text text-transparent'
            }
          >
            Trade Operations
          </span>
        </h3>
        <p
          className={`text-sm sm:text-base leading-relaxed font-normal transition-colors duration-200 ${
            isDark ? 'text-text-secondary' : 'text-slate-600'
          }`}
        >
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
              className={`group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl backdrop-blur-lg border transition-all duration-300 hover:-translate-y-1.5 ${
                isDark
                  ? 'bg-[#0A1B31]/70 border-[#00C8F5]/25 hover:border-[#00C8F5]/60 hover:bg-[#0D233F]/90 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_36px_rgba(0,200,245,0.2)]'
                  : 'bg-white/95 border-blue-100/90 shadow-[0_4px_20px_rgba(15,40,80,0.06)] hover:border-brand-400 hover:bg-white hover:shadow-[0_12px_36px_rgba(30,136,229,0.16)]'
              }`}
            >
              <div>
                {/* Header: Number Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`text-xs font-mono font-bold tracking-widest px-2.5 py-1 rounded border transition-colors duration-200 ${
                      isDark
                        ? 'text-accent-400 bg-[#00C8F5]/10 border-[#00C8F5]/25'
                        : 'text-brand-600 bg-brand-500/10 border-brand-200'
                    }`}
                  >
                    PILLAR {item.number}
                  </span>
                </div>

                {/* Minimal Cyan/Blue Icon & Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 ${
                      isDark
                        ? 'bg-[#00C8F5]/10 border-[#00C8F5]/30 text-accent-400 shadow-[0_0_15px_rgba(0,200,245,0.2)]'
                        : 'bg-brand-500/10 border-brand-200 text-brand-600 shadow-xs'
                    }`}
                  >
                    <IconComponent className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <h4
                    className={`text-xl font-extrabold transition-colors duration-200 ${
                      isDark
                        ? 'text-white group-hover:text-accent-400'
                        : 'text-[#0F172A] group-hover:text-brand-600'
                    }`}
                  >
                    {item.title}
                  </h4>
                </div>

                {/* Description */}
                <p
                  className={`text-sm leading-relaxed font-normal transition-colors duration-200 ${
                    isDark ? 'text-text-secondary' : 'text-slate-600'
                  }`}
                >
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
