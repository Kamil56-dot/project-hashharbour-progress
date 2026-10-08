import React from 'react';
import { MapPin, Clock, Check } from 'lucide-react';
import { SHIPPING_DEMO } from '../checkoutData';

export function ShippingDetailsCard({ container, isDark }) {
  return (
    <div className="w-full mt-6 sm:mt-7 lg:mt-8 hh-shipping-container">
      {/* Section Heading */}
      <h3
        className={`text-[17px] sm:text-[18px] lg:text-[19px] font-bold tracking-tight mb-3.5 sm:mb-4 hh-shipping-heading ${
          isDark ? 'text-white' : 'text-[#0F172A]'
        }`}
      >
        Shipping Details
      </h3>

      {/* Two-Panel Layout (stacks below 768px md breakpoint) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5 hh-shipping-grid">
        {/* Left Panel: From, To, Transit Time */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between gap-3.5 hh-shipping-panel hh-shipping-panel-gap transition-colors duration-200 ${
            isDark
              ? 'bg-white/[0.02] border-white/10'
              : 'bg-white border-blue-100/70 shadow-xs'
          }`}
        >
          {/* From */}
          <div className="flex items-center gap-3">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                isDark
                  ? 'bg-white/[0.06] text-[#38BDF8]'
                  : 'bg-[#EBF3FB] text-[#1E88E5]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current/20" />
            </div>
            <div className="min-w-0">
              <span
                className={`block text-[11px] font-normal leading-tight ${
                  isDark ? 'text-slate-400' : 'text-[#8FA0B5]'
                }`}
              >
                From
              </span>
              <span
                className={`block text-[13px] sm:text-[14px] font-bold leading-snug truncate ${
                  isDark ? 'text-white' : 'text-[#0F172A]'
                }`}
              >
                {SHIPPING_DEMO.from}
              </span>
            </div>
          </div>

          {/* To */}
          <div className="flex items-center gap-3">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                isDark
                  ? 'bg-white/[0.06] text-[#38BDF8]'
                  : 'bg-[#EBF3FB] text-[#1E88E5]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current/20" />
            </div>
            <div className="min-w-0">
              <span
                className={`block text-[11px] font-normal leading-tight ${
                  isDark ? 'text-slate-400' : 'text-[#8FA0B5]'
                }`}
              >
                To
              </span>
              <span
                className={`block text-[13px] sm:text-[14px] font-bold leading-snug truncate ${
                  isDark ? 'text-white' : 'text-[#0F172A]'
                }`}
              >
                {SHIPPING_DEMO.to}
              </span>
            </div>
          </div>

          {/* Transit Time */}
          <div className="flex items-center gap-3">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                isDark
                  ? 'bg-white/[0.06] text-[#38BDF8]'
                  : 'bg-[#EBF3FB] text-[#1E88E5]'
              }`}
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <span
                className={`block text-[11px] font-normal leading-tight ${
                  isDark ? 'text-slate-400' : 'text-[#8FA0B5]'
                }`}
              >
                Transit Time
              </span>
              <span
                className={`block text-[13px] sm:text-[14px] font-bold leading-snug truncate ${
                  isDark ? 'text-white' : 'text-[#0F172A]'
                }`}
              >
                {SHIPPING_DEMO.transitTime}
              </span>
            </div>
          </div>
        </div>

        {/* Right Tinted Panel: Your Container Includes */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-center hh-shipping-panel transition-colors duration-200 ${
            isDark
              ? 'bg-[#1E88E5]/[0.08] border-[#1E88E5]/20'
              : 'bg-[#F0F6FC] border-blue-100/60'
          }`}
        >
          <h4
            className={`text-[13px] sm:text-[14px] font-bold tracking-tight mb-3.5 sm:mb-4 hh-shipping-includes-gap ${
              isDark ? 'text-[#38BDF8]' : 'text-[#1E88E5]'
            }`}
          >
            Your Container Includes
          </h4>

          <ul className="space-y-2.5 sm:space-y-3 hh-shipping-includes-list">
            {/* Line 1: Container-specific line */}
            <li className="flex items-center gap-2.5">
              <Check
                className={`w-4 h-4 shrink-0 stroke-[2.5] ${
                  isDark ? 'text-[#38BDF8]' : 'text-[#1E88E5]'
                }`}
                aria-hidden="true"
              />
              <span
                className={`text-[12px] sm:text-[13px] font-medium leading-tight ${
                  isDark ? 'text-slate-300' : 'text-[#475569]'
                }`}
              >
                {container.includesTitle}
              </span>
            </li>

            {/* Line 2-4: Common inclusions */}
            {SHIPPING_DEMO.includes.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2.5">
                <Check
                  className={`w-4 h-4 shrink-0 stroke-[2.5] ${
                    isDark ? 'text-[#38BDF8]' : 'text-[#1E88E5]'
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`text-[12px] sm:text-[13px] font-medium leading-tight ${
                    isDark ? 'text-slate-300' : 'text-[#475569]'
                  }`}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ShippingDetailsCard;
