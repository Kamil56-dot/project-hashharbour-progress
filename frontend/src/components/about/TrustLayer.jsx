import React from 'react';
import { ShieldCheck, Lock, Key, Award, CheckCircle2, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SECURITY_BENCHMARKS = [
  {
    icon: ShieldCheck,
    title: 'Vetted Carrier Verification',
    subtitle: 'KYC / KYB Authenticated',
    description: 'Every carrier, freight forwarder, and customs agent undergoes rigorous identity and compliance vetting.',
  },
  {
    icon: FileText,
    title: 'Immutable Audit Records',
    subtitle: 'Cryptographic Integrity',
    description: 'Tamper-proof ledger tracking every document change, container scan, and customs clearance milestone.',
  },
  {
    icon: Lock,
    title: 'AES-256 Encrypted Data',
    subtitle: 'ISO 27001 & SOC-2 Standards',
    description: 'Bank-grade encryption protecting trade documents, commercial invoices, and sensitive freight pricing.',
  },
  {
    icon: Key,
    title: 'Automated Settlement',
    subtitle: 'Smart Contract Escrow',
    description: 'Milestone-triggered release of trade payments, letters of credit, and automated customs duty reconciliation.',
  },
];

export function TrustLayer() {
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
          SECURITY & COMPLIANCE ARCHITECTURE
        </div>
        <h3
          className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 transition-colors duration-200 ${
            isDark ? 'text-white' : 'text-[#0F172A]'
          }`}
        >
          Enterprise Security &{' '}
          <span
            className={
              isDark
                ? 'text-accent-400 bg-gradient-to-r from-[#00C8F5] via-[#19BFEF] to-[#00C8F5] bg-clip-text text-transparent'
                : 'text-brand-600 bg-gradient-to-r from-[#1E88E5] via-[#1976D2] to-[#1565C0] bg-clip-text text-transparent'
            }
          >
            Trust Infrastructure
          </span>
        </h3>
        <p
          className={`text-sm sm:text-base leading-relaxed font-normal transition-colors duration-200 ${
            isDark ? 'text-text-secondary' : 'text-slate-600'
          }`}
        >
          Built to satisfy global trade compliance standards, safeguard commercial data, and ensure uncompromised integrity across every border.
        </p>
      </div>

      {/* Grid Layout: 4 Security Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SECURITY_BENCHMARKS.map((item, idx) => {
          const IconComp = item.icon;

          return (
            <div
              key={idx}
              className={`group p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 flex flex-col justify-between ${
                isDark
                  ? 'bg-[#0A1B31]/70 border-[#00C8F5]/25 hover:border-[#00C8F5]/60 hover:bg-[#0D233F]/90'
                  : 'bg-white/95 border-blue-100/90 shadow-[0_4px_20px_rgba(15,40,80,0.06)] hover:border-brand-400 hover:bg-white hover:shadow-[0_12px_36px_rgba(30,136,229,0.16)]'
              }`}
            >
              <div>
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform ${
                    isDark
                      ? 'bg-[#00C8F5]/10 border-[#00C8F5]/30 text-accent-400'
                      : 'bg-brand-500/10 border-brand-200 text-brand-600 shadow-xs'
                  }`}
                >
                  <IconComp className="w-5 h-5 stroke-[1.75]" />
                </div>

                <h4
                  className={`text-lg font-bold mb-1 transition-colors ${
                    isDark
                      ? 'text-white group-hover:text-accent-400'
                      : 'text-[#0F172A] group-hover:text-brand-600'
                  }`}
                >
                  {item.title}
                </h4>
                <span
                  className={`text-xs font-mono block mb-3 transition-colors ${
                    isDark ? 'text-accent-400/90' : 'text-brand-600'
                  }`}
                >
                  {item.subtitle}
                </span>

                <p
                  className={`text-xs sm:text-sm leading-relaxed font-normal transition-colors ${
                    isDark ? 'text-text-secondary' : 'text-slate-600'
                  }`}
                >
                  {item.description}
                </p>
              </div>

              <div
                className={`pt-4 mt-4 border-t flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${
                  isDark
                    ? 'border-white/5 text-accent-400'
                    : 'border-blue-100 text-brand-600'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ACTIVE VERIFICATION</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
