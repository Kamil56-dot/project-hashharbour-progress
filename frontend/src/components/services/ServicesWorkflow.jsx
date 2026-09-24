import React from 'react';
import { Calendar, FileText, Ship, MapPin, Package, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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
 * ServicesWorkflow Component — Adaptive 5-Step Process Pipeline
 * Dark Mode: Sleek slate-900 panel with cyan glowing accents.
 * Light Mode: Crisp white card with soft blue borders and brand-blue accents.
 */
export function ServicesWorkflow() {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-2xl lg:rounded-[24px] p-5 sm:p-6 lg:py-5 lg:px-8 mb-6 lg:mb-8 w-full overflow-hidden relative border transition-all duration-300 ${
        isDark
          ? 'bg-slate-900 text-white border-slate-800 shadow-xl'
          : 'bg-white text-[#0F172A] border-blue-100/90 shadow-[0_12px_36px_-10px_rgba(15,40,80,0.08)]'
      }`}
    >
      {/* Background Subtle Ambient Glow */}
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-cyan-500/5' : 'bg-brand-500/5'
        }`}
      />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 relative z-10">
        {/* Left Column: Section Title & Narrative */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col items-start text-left">
          <span
            className={`text-xs font-bold uppercase tracking-widest mb-1 ${
              isDark ? 'text-cyan-400' : 'text-brand-600'
            }`}
          >
            HOW HASHHARBOUR
          </span>
          <h3
            className={`text-lg sm:text-xl lg:text-lg font-black leading-tight mb-1 ${
              isDark ? 'text-white' : 'text-[#0F172A]'
            }`}
          >
            SIMPLIFIES TRADE
          </h3>
          <p
            className={`text-xs sm:text-sm font-normal leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
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
                <div
                  className={`flex flex-col items-center text-center w-full p-2 lg:p-2 rounded-xl transition-colors duration-200 ${
                    isDark ? 'hover:bg-slate-800/60' : 'hover:bg-blue-50/60'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-2 transition-colors duration-200 shrink-0 shadow-2xs ${
                      isDark
                        ? 'bg-slate-800/80 border-slate-700/80 text-cyan-400 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/15 group-hover:text-cyan-300'
                        : 'bg-[#F0F7FF] border-blue-100 text-brand-600 group-hover:border-brand-300 group-hover:bg-brand-50 group-hover:text-brand-700'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                      isDark ? 'text-white' : 'text-[#0F172A]'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span
                    className={`text-xs leading-tight max-w-[120px] ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {step.subtitle}
                  </span>
                </div>

                {/* Connector Arrow (Desktop only) */}
                {!isLast && (
                  <div
                    className={`hidden lg:flex items-center justify-center px-0.5 shrink-0 ${
                      isDark ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
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
