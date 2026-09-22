import React from 'react';
import { Calendar, FileText, Ship, MapPin, Package, ChevronRight } from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    id: 'step-book',
    label: 'BOOK',
    subtitle: 'Book with confidence',
    icon: Calendar,
  },
  {
    id: 'step-document',
    label: 'DOCUMENT',
    subtitle: 'Prepare & comply',
    icon: FileText,
  },
  {
    id: 'step-move',
    label: 'MOVE',
    subtitle: 'We move it smartly',
    icon: Ship,
  },
  {
    id: 'step-track',
    label: 'TRACK',
    subtitle: 'Real-time visibility',
    icon: MapPin,
  },
  {
    id: 'step-deliver',
    label: 'DELIVER',
    subtitle: 'Safe & on time',
    icon: Package,
  },
];

/**
 * ServicesWorkflow Component — Light Theme 5-Step Process Pipeline
 * "HOW HASHHARBOUR SIMPLIFIES TRADE" workflow strip.
 */
export function ServicesWorkflow() {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 lg:py-4 lg:px-7 mb-6 lg:mb-8 w-full overflow-hidden relative border border-slate-800 shadow-xl">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 relative z-10">
        {/* Left Column: Section Title & Narrative */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col items-start text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">
            HOW HASHHARBOUR
          </span>
          <h3 className="text-lg sm:text-xl lg:text-lg font-black text-white leading-tight mb-1">
            SIMPLIFIES TRADE
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            From booking to delivery, we simplify complexity and move your trade
            forward.
          </p>
        </div>

        {/* Right Column: 5-Step Process Pipeline */}
        <div className="w-full lg:flex-1 grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between gap-4 lg:gap-2">
          {WORKFLOW_STEPS.map((step, index) => {
            const IconComp = step.icon;
            const isLast = index === WORKFLOW_STEPS.length - 1;

            return (
              <div
                key={step.id}
                className="flex items-center justify-between relative group flex-1"
              >
                {/* Step Item */}
                <div className="flex flex-col items-center text-center w-full p-2 lg:p-2 rounded-xl transition-colors duration-200 hover:bg-slate-800/60">
                  <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400 mb-2 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/15 group-hover:text-cyan-300 transition-colors duration-200 shrink-0 shadow-2xs">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-white mb-0.5">
                    {step.label}
                  </span>
                  <span className="text-xs text-slate-400 leading-tight max-w-[120px]">
                    {step.subtitle}
                  </span>
                </div>

                {/* Connector Arrow (Desktop only) */}
                {!isLast && (
                  <div className="hidden lg:flex items-center justify-center text-slate-600 px-0.5 shrink-0">
                    <ChevronRight className="w-4.5 h-4.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ServicesWorkflow;
