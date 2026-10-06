import React from 'react';
import { formatCurrency } from '../checkoutData';

/**
 * Dimension measurement icons matching Image 1
 */
function LengthIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 4v8M14 4v8M2 8h12M4 6l-2 2 2 2M12 6l2 2-2 2" />
    </svg>
  );
}

function WidthIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 8h12M5 5L2 8l3 3M11 5l3 3-3 3" />
    </svg>
  );
}

function HeightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 2h8M4 14h8M8 2v12M6 4l2-2 2 2M6 12l2 2 2 2" />
    </svg>
  );
}

export function BookingSummaryCard({
  container,
  quantity,
  onIncrement,
  onDecrement,
  isDark,
}) {
  return (
    <div className="w-full">
      {/* Inner Bordered Card */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 lg:p-6 transition-colors duration-200 ${
          isDark
            ? 'bg-white/[0.02] border-white/10'
            : 'bg-white border-blue-100/70 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 lg:gap-6 items-start">
          {/* Left: Soft rounded container image box */}
          <div
            className={`w-full sm:w-[160px] lg:w-[185px] aspect-[4/3] rounded-xl flex items-center justify-center p-2.5 shrink-0 overflow-hidden transition-colors duration-200 ${
              isDark
                ? 'bg-white/[0.04] border border-white/5'
                : 'bg-[#F4F8FC] border border-blue-50'
            }`}
          >
            <img
              src={container.image}
              alt={container.alt}
              className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-105"
              loading="eager"
            />
          </div>

          {/* Right: Details & specs */}
          <div className="flex-1 w-full min-w-0">
            {/* Top row: Title + Pill on left, Price on right */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 min-w-0">
                <h3
                  className={`text-[17px] sm:text-[18px] lg:text-[19px] font-bold tracking-tight truncate ${
                    isDark ? 'text-white' : 'text-[#0F172A]'
                  }`}
                >
                  {container.title}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] sm:text-[12px] font-semibold whitespace-nowrap transition-colors ${
                    isDark
                      ? 'bg-[#1E88E5]/20 text-[#38BDF8] border border-[#1E88E5]/30'
                      : 'bg-[#E1F0FE] text-[#1E88E5]'
                  }`}
                >
                  {container.pill}
                </span>
              </div>

              {/* Price block */}
              <div className="text-right shrink-0">
                <div
                  className={`text-[20px] sm:text-[22px] lg:text-[24px] font-extrabold tracking-tight leading-none ${
                    isDark ? 'text-white' : 'text-[#0F172A]'
                  }`}
                >
                  {formatCurrency(container.price)}
                </div>
                <div
                  className={`text-[11px] sm:text-[12px] font-normal mt-1 ${
                    isDark ? 'text-slate-400' : 'text-[#8FA0B5]'
                  }`}
                >
                  / container
                </div>
              </div>
            </div>

            {/* Specs row: Length, Width, Height */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3.5 mt-3.5 sm:mt-4 pt-1">
              {/* Length */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isDark
                      ? 'bg-white/[0.06] text-[#38BDF8]'
                      : 'bg-[#EBF3FB] text-[#1E88E5]'
                  }`}
                >
                  <LengthIcon />
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-[11px] font-normal leading-tight ${
                      isDark ? 'text-slate-400' : 'text-[#8FA0B5]'
                    }`}
                  >
                    Length
                  </div>
                  <div
                    className={`text-[12px] sm:text-[13px] font-bold leading-tight truncate ${
                      isDark ? 'text-white' : 'text-[#0F172A]'
                    }`}
                  >
                    {container.length}
                  </div>
                </div>
              </div>

              {/* Width */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isDark
                      ? 'bg-white/[0.06] text-[#38BDF8]'
                      : 'bg-[#EBF3FB] text-[#1E88E5]'
                  }`}
                >
                  <WidthIcon />
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-[11px] font-normal leading-tight ${
                      isDark ? 'text-slate-400' : 'text-[#8FA0B5]'
                    }`}
                  >
                    Width
                  </div>
                  <div
                    className={`text-[12px] sm:text-[13px] font-bold leading-tight truncate ${
                      isDark ? 'text-white' : 'text-[#0F172A]'
                    }`}
                  >
                    {container.width}
                  </div>
                </div>
              </div>

              {/* Height */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isDark
                      ? 'bg-white/[0.06] text-[#38BDF8]'
                      : 'bg-[#EBF3FB] text-[#1E88E5]'
                  }`}
                >
                  <HeightIcon />
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-[11px] font-normal leading-tight ${
                      isDark ? 'text-slate-400' : 'text-[#8FA0B5]'
                    }`}
                  >
                    Height
                  </div>
                  <div
                    className={`text-[12px] sm:text-[13px] font-bold leading-tight truncate ${
                      isDark ? 'text-white' : 'text-[#0F172A]'
                    }`}
                  >
                    {container.height}
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity row */}
            <div className="mt-3.5 sm:mt-4 pt-1">
              <span
                className={`block text-[11px] sm:text-[12px] font-medium mb-1.5 ${
                  isDark ? 'text-slate-400' : 'text-[#8FA0B5]'
                }`}
              >
                Quantity
              </span>
              <div className="flex items-center gap-3">
                <span
                  id="checkout-quantity-val"
                  className={`text-[15px] sm:text-[16px] font-bold min-w-[18px] select-none ${
                    isDark ? 'text-white' : 'text-[#0F172A]'
                  }`}
                >
                  {quantity}
                </span>

                {/* Decrement Button */}
                <button
                  type="button"
                  id="checkout-qty-decrement"
                  onClick={onDecrement}
                  disabled={quantity <= 1}
                  aria-label="Decrease container quantity"
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all select-none ${
                    quantity <= 1
                      ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-white/[0.04] text-slate-400'
                      : isDark
                        ? 'bg-white/[0.08] text-[#38BDF8] hover:bg-white/[0.14] active:scale-95 cursor-pointer'
                        : 'bg-[#EBF3FB] text-[#1E88E5] hover:bg-[#D9EAF8] active:scale-95 cursor-pointer'
                  }`}
                >
                  −
                </button>

                {/* Increment Button */}
                <button
                  type="button"
                  id="checkout-qty-increment"
                  onClick={onIncrement}
                  aria-label="Increase container quantity"
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all select-none ${
                    isDark
                      ? 'bg-white/[0.08] text-[#38BDF8] hover:bg-white/[0.14] active:scale-95 cursor-pointer'
                      : 'bg-[#EBF3FB] text-[#1E88E5] hover:bg-[#D9EAF8] active:scale-95 cursor-pointer'
                  }`}
                >
                  +
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingSummaryCard;
