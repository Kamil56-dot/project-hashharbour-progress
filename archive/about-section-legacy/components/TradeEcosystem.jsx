import React from 'react';
import { Anchor, Eye, Cpu, FileCheck, Network, MapPin, ShieldCheck } from 'lucide-react';

const CAPABILITIES = [
  { id: 'cap-1', title: 'Trade Visibility', icon: Eye, description: 'Complete lifecycle clarity across all shipments.' },
  { id: 'cap-2', title: 'Shipment Intelligence', icon: Cpu, description: 'Data-driven insights for smarter trade decisions.' },
  { id: 'cap-3', title: 'Digital Documentation', icon: FileCheck, description: 'Centralized eBL, invoicing, and clearance records.' },
  { id: 'cap-4', title: 'Global Coordination', icon: Network, description: 'Seamless orchestration between trade partners.' },
  { id: 'cap-5', title: 'Real-Time Tracking', icon: MapPin, description: 'Satellite AIS telemetry and live route updates.' },
  { id: 'cap-6', title: 'Compliance Ready', icon: ShieldCheck, description: 'Automated regulatory standards and auditability.' },
];

export function TradeEcosystem() {
  return (
    <div className="w-full max-w-[1380px] mx-auto mb-24 lg:mb-32">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-accent-400 bg-[#00C8F5]/10 border border-[#00C8F5]/30 mb-4">
          CAPABILITIES CONSTELLATION
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">
          ONE PLATFORM. ONE CONNECTED{' '}
          <span className="text-accent-400 bg-gradient-to-r from-[#00C8F5] via-[#19BFEF] to-[#00C8F5] bg-clip-text text-transparent">
            TRADE ECOSYSTEM.
          </span>
        </h3>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
          A unified network architecture linking 6 core digital capabilities around a central intelligent hub.
        </p>
      </div>

      {/* Constellation Network Graphic Container */}
      <div className="relative p-6 sm:p-10 lg:p-12 rounded-3xl bg-[#0A1B31]/70 backdrop-blur-xl border border-[#00C8F5]/25 shadow-[0_12px_40px_rgba(0,0,0,0.3)] overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Center Node (HASHHARBOUR Core Hub) */}
        <div className="flex flex-col items-center justify-center mb-12 relative z-10">
          <div className="relative group">
            {/* Slow Pulsing Outer Cyan Glow Ring */}
            <div className="absolute -inset-2 rounded-full bg-[#00C8F5]/20 blur-md animate-pulse" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#0D233F] border-2 border-[#00C8F5] flex flex-col items-center justify-center text-center p-2 shadow-[0_0_30px_rgba(0,200,245,0.3)]">
              <Anchor className="w-8 h-8 text-accent-400 mb-1" />
              <span className="text-[11px] font-extrabold font-mono text-white tracking-wider">
                HASHHARBOUR
              </span>
              <span className="text-[9px] text-accent-400 font-mono">
                CORE HUB
              </span>
            </div>
          </div>
        </div>

        {/* 6 Capability Radial Constellation Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {CAPABILITIES.map((cap) => {
            const IconComponent = cap.icon;

            return (
              <div
                key={cap.id}
                className="group relative p-5 rounded-2xl bg-[#0A1B31]/80 border border-[#00C8F5]/25 hover:border-[#00C8F5]/60 hover:bg-[#0D233F]/90 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_28px_rgba(0,200,245,0.18)] flex items-start gap-4"
              >
                {/* Cyan Node Connector Dot & Line Indicator */}
                <div className="w-10 h-10 rounded-xl bg-[#00C8F5]/10 border border-[#00C8F5]/30 flex items-center justify-center text-accent-400 shrink-0 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-5 h-5 stroke-[1.75]" />
                </div>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-accent-400 group-hover:animate-ping" />
                    <h4 className="text-base font-bold text-white group-hover:text-accent-400 transition-colors">
                      {cap.title}
                    </h4>
                  </div>
                  <p className="text-xs text-text-secondary leading-snug font-normal">
                    {cap.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
