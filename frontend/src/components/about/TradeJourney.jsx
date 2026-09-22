import React, { useState } from 'react';
import { Package, Ship, MapPin, FileCheck, CheckCircle } from 'lucide-react';

const WORKFLOW_STAGES = [
  {
    step: '01',
    code: 'SOURCE',
    title: 'SOURCE',
    icon: Package,
    description: 'Trade & shipment initiated.',
    supporting: 'Cargo requirements and supplier trade parameters established at origin.',
  },
  {
    step: '02',
    code: 'BOOK',
    title: 'BOOK',
    icon: Ship,
    description: 'Container and logistics coordination.',
    supporting: 'Carrier slot allocation, ISO container assignment, and vessel scheduling.',
  },
  {
    step: '03',
    code: 'TRACK',
    title: 'TRACK',
    icon: MapPin,
    description: 'Real-time shipment visibility.',
    supporting: 'Continuous satellite AIS monitoring and multimodal location updates.',
  },
  {
    step: '04',
    code: 'DOCUMENT',
    title: 'DOCUMENT',
    icon: FileCheck,
    description: 'Centralized trade documentation.',
    supporting: 'Digital bill of lading, customs filings, and verified trade compliance.',
  },
  {
    step: '05',
    code: 'DELIVER',
    title: 'DELIVER',
    icon: CheckCircle,
    description: 'Reliable destination execution.',
    supporting: 'Port discharge clearance, inland drayage, and final handover.',
  },
];

export function TradeJourney() {
  const [selectedStage, setSelectedStage] = useState(0);

  const current = WORKFLOW_STAGES[selectedStage];
  const StageIcon = current.icon;

  return (
    <div className="w-full max-w-[1380px] mx-auto mb-24 lg:mb-32">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-accent-400 bg-[#00C8F5]/10 border border-[#00C8F5]/30 mb-4">
          FIVE-STAGE WORKFLOW
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">
          End-to-End EXIM{' '}
          <span className="text-accent-400 bg-gradient-to-r from-[#00C8F5] via-[#19BFEF] to-[#00C8F5] bg-clip-text text-transparent">
            Logistics Pipeline
          </span>
        </h3>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
          A structured 5-stage progression from initial trade sourcing to destination delivery.
        </p>
      </div>

      {/* Interactive 5-Stage Connecting Route Line & Stepper Bar */}
      <div className="relative mb-8">
        {/* Connecting Cyan Route Line behind stepper buttons */}
        <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] -translate-y-1/2 h-[2px] bg-[#00C8F5]/25 z-0">
          {/* Animated Traveling Pulse along the Route Line */}
          <div
            className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-[#00C8F5] to-transparent animate-pulse"
            style={{
              left: `${(selectedStage / 4) * 80}%`,
              transition: 'left 0.4s ease-in-out',
            }}
          />
        </div>

        {/* 5 Stage Stepper Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 relative z-10">
          {WORKFLOW_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = selectedStage === idx;

            return (
              <button
                key={stage.step}
                type="button"
                onClick={() => setSelectedStage(idx)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 ${
                  isActive
                    ? 'bg-[#0D233F] border-[#00C8F5] text-white shadow-[0_0_20px_rgba(0,200,245,0.25)] scale-[1.02]'
                    : 'bg-[#0A1B31]/70 border-[#00C8F5]/20 text-text-secondary hover:border-[#00C8F5]/40 hover:bg-[#0A1B31]/90'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold mb-2 transition-colors ${
                    isActive
                      ? 'bg-[#00C8F5] text-[#0A1B31]'
                      : 'bg-[#00C8F5]/10 text-accent-400 border border-[#00C8F5]/30'
                  }`}
                >
                  {stage.step}
                </div>
                <span className="text-xs font-bold text-white tracking-wider">
                  {stage.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Panel (Restrained, subtle glow & copy) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0A1B31]/80 backdrop-blur-xl border border-[#00C8F5]/30 shadow-[0_12px_36px_rgba(0,0,0,0.35)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#00C8F5]/10 border border-[#00C8F5]/30 flex items-center justify-center text-accent-400 shrink-0 shadow-[0_0_15px_rgba(0,200,245,0.2)]">
            <StageIcon className="w-7 h-7 stroke-[1.75]" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-accent-400 bg-[#00C8F5]/15 border border-[#00C8F5]/30 px-2 py-0.5 rounded">
                STAGE {current.step}
              </span>
              <span className="text-sm font-extrabold text-white">
                {current.title}
              </span>
            </div>
            <p className="text-base font-semibold text-white mb-0.5">
              {current.description}
            </p>
            <p className="text-xs sm:text-sm text-text-secondary font-normal">
              {current.supporting}
            </p>
          </div>
        </div>

        {/* Subtle Indicator Tag */}
        <div className="shrink-0 px-4 py-2 rounded-lg bg-[#00C8F5]/10 border border-[#00C8F5]/25 text-xs font-mono text-accent-400 font-semibold">
          STAGE {current.step} OF 05 ACTIVE
        </div>
      </div>
    </div>
  );
}
