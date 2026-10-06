import React from 'react';
import { FEES_DEMO, formatCurrency } from '../checkoutData';

/**
 * OrderSummaryCard — Phase 3
 * Shows line-item pricing, insurance toggle, and computed total.
 *
 * Props:
 *  - container: catalog entry (has .price, .id)
 *  - quantity: current quantity (from CheckoutPage state)
 *  - insuranceSelected: boolean
 *  - onToggleInsurance: () => void
 *  - isDark: boolean
 */
export function OrderSummaryCard({
  container,
  quantity,
  insuranceSelected,
  onToggleInsurance,
  isDark,
}) {
  const containerTotal = container.price * quantity;
  const insuranceAmount = insuranceSelected ? FEES_DEMO.insurance : 0;
  const total = containerTotal + FEES_DEMO.portHandling + FEES_DEMO.documentationFee + insuranceAmount;

  const lineItems = [
    {
      label: `Container Price (${quantity} × 20ft)`,
      value: formatCurrency(containerTotal),
    },
    {
      label: 'Port Handling Charges',
      value: formatCurrency(FEES_DEMO.portHandling),
    },
    {
      label: 'Documentation Fee',
      value: formatCurrency(FEES_DEMO.documentationFee),
    },
  ];

  return (
    <div className="mb-6 sm:mb-7">
      {/* Section Heading */}
      <h3
        className={`text-[17px] sm:text-[18px] font-bold tracking-tight mb-4 ${
          isDark ? 'text-white' : 'text-[#0F172A]'
        }`}
      >
        Order Summary
      </h3>

      {/* Line Items */}
      <div className="flex flex-col gap-3">
        {lineItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3">
            <span
              className={`text-[13px] sm:text-[14px] font-normal ${
                isDark ? 'text-slate-400' : 'text-[#6B7B8D]'
              }`}
            >
              {item.label}
            </span>
            <span
              className={`text-[13px] sm:text-[14px] font-medium tabular-nums ${
                isDark ? 'text-slate-200' : 'text-[#334155]'
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}

        {/* Insurance Line — with toggle switch */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[13px] sm:text-[14px] font-normal ${
                isDark ? 'text-slate-400' : 'text-[#6B7B8D]'
              }`}
            >
              Insurance (Optional)
            </span>

            {/* Compact toggle switch */}
            <button
              id="insurance-toggle"
              type="button"
              role="switch"
              aria-checked={insuranceSelected}
              aria-label="Toggle insurance"
              onClick={onToggleInsurance}
              className={`relative inline-flex h-[18px] w-[32px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E88E5] focus-visible:ring-offset-1 ${
                insuranceSelected
                  ? 'bg-[#1E88E5]'
                  : isDark
                    ? 'bg-white/15'
                    : 'bg-slate-300'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out mt-[2px] ${
                  insuranceSelected ? 'translate-x-[16px] ml-0' : 'translate-x-[2px]'
                }`}
              />
            </button>
          </div>
          <span
            className={`text-[13px] sm:text-[14px] font-medium tabular-nums ${
              isDark ? 'text-slate-200' : 'text-[#334155]'
            }`}
          >
            {insuranceSelected ? formatCurrency(FEES_DEMO.insurance) : '$0'}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        className={`border-t my-4 sm:my-5 ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}
      />

      {/* Total Row */}
      <div className="flex items-center justify-between gap-3">
        <span
          className={`text-[15px] sm:text-[16px] font-bold ${
            isDark ? 'text-white' : 'text-[#0F172A]'
          }`}
        >
          Total Amount
        </span>
        <span
          className={`text-[22px] sm:text-[24px] font-bold tabular-nums tracking-tight ${
            isDark ? 'text-white' : 'text-[#0F172A]'
          }`}
        >
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}

export default OrderSummaryCard;
