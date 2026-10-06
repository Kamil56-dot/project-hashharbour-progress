import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getContainerData, DEFAULT_BILLING_ADDRESS } from './checkoutData';
import { BookingSummaryCard } from './components/BookingSummaryCard';
import { ShippingDetailsCard } from './components/ShippingDetailsCard';
import { BillingAddressCard } from './components/BillingAddressCard';

/**
 * Checkout Stepper Steps Configuration
 * Step 2 "Payment" is the current active step for this page.
 */
const STEPS = [
  { number: 1, label: 'Booking' },
  { number: 2, label: 'Payment' },
  { number: 3, label: 'Confirmation' },
];

const ACTIVE_STEP = 2;

/**
 * CheckoutPage — Phase 1 & 2: Route, Stepper, Heading, Left Column
 * Route: /checkout
 * URL query parameters:
 *  - ?type=standard-dry|oil-tank|reefer (defaults to standard-dry)
 *  - ?qty=1 (defaults to 1)
 */
export function CheckoutPage() {
  const { isDark } = useTheme();
  const [searchParams] = useSearchParams();

  // Container selection strictly by URL query (?type=standard-dry|oil-tank|reefer)
  // Missing or invalid falls back to standard-dry
  const containerType = searchParams.get('type');
  const container = getContainerData(containerType);

  // Initial quantity from ?qty= or default 1
  const initialQty = (() => {
    const rawQty = searchParams.get('qty');
    if (rawQty) {
      const parsed = parseInt(rawQty, 10);
      if (!isNaN(parsed) && parsed >= 1) {
        return parsed;
      }
    }
    return 1;
  })();

  // Shared quantity state lifted to page level (used by upcoming Order Summary in Phase 3)
  const [quantity, setQuantity] = useState(initialQty);

  // Lifted billing address state (to be sent to backend in Phase 4)
  const [billingAddress, setBillingAddress] = useState(DEFAULT_BILLING_ADDRESS);

  // Sync quantity to live cart badge on SiteNavbar
  useEffect(() => {
    window.__hh_checkout_qty = quantity;
    window.dispatchEvent(
      new CustomEvent('hh-cart-qty-change', { detail: { qty: quantity } })
    );
  }, [quantity]);

  const handleIncrement = () => {
    setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden pt-[78px] lg:pt-[82px] transition-colors duration-300 ${
        isDark ? 'bg-transparent text-white' : 'bg-transparent text-[#0F172A]'
      }`}
    >
      {/* Page Content Container — matches project content left-edge standard */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">

        {/* ─── STEPPER ─── */}
        <nav
          aria-label="Checkout progress"
          className="pt-6 pb-4 sm:pt-7 sm:pb-5"
        >
          <ol className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {STEPS.map((step, idx) => {
              const isActive = step.number === ACTIVE_STEP;

              return (
                <li key={step.number} className="flex items-center gap-2 sm:gap-3">
                  {/* Step item: active step is enclosed in a rounded pill capsule as shown in Image 1 */}
                  {isActive ? (
                    <span
                      className={`inline-flex items-center gap-2 pl-1 pr-3.5 py-1 rounded-full transition-colors duration-200 select-none ${
                        isDark
                          ? 'bg-[#1E88E5]/15 border border-[#1E88E5]/25'
                          : 'bg-[#E1F0FE]'
                      }`}
                    >
                      {/* Active filled blue circle with number */}
                      <span className="flex items-center justify-center w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] rounded-full bg-[#1E88E5] text-white text-[12px] sm:text-[13px] font-bold shrink-0 shadow-xs">
                        {step.number}
                      </span>
                      {/* Active blue label */}
                      <span className="text-[13px] sm:text-[14px] font-semibold text-[#1E88E5] tracking-tight whitespace-nowrap">
                        {step.label}
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 select-none">
                      {/* Inactive light circle with muted number */}
                      <span
                        className={`flex items-center justify-center w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] rounded-full text-[12px] sm:text-[13px] font-semibold shrink-0 transition-colors duration-200 ${
                          isDark
                            ? 'bg-white/[0.08] text-slate-400'
                            : 'bg-[#E1F0FE] text-[#5A8BB8]'
                        }`}
                      >
                        {step.number}
                      </span>
                      {/* Inactive muted label */}
                      <span
                        className={`text-[13px] sm:text-[14px] font-medium transition-colors duration-200 whitespace-nowrap ${
                          isDark ? 'text-slate-400' : 'text-[#8FA0B5]'
                        }`}
                      >
                        {step.label}
                      </span>
                    </span>
                  )}

                  {/* Chevron separator (not after last step) */}
                  {idx < STEPS.length - 1 && (
                    <ChevronRight
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors duration-200 ${
                        isDark ? 'text-white/20' : 'text-[#CBD5E1]'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* ─── HEADING ─── */}
        <div className="pb-6 sm:pb-8">
          <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-extrabold tracking-tight leading-tight text-hh-heading transition-colors duration-200">
            Checkout &amp; Payment
          </h1>
          <p className="mt-1.5 sm:mt-2 text-[14px] sm:text-[15px] lg:text-[16px] font-normal leading-relaxed text-hh-body transition-colors duration-200">
            Complete your booking and make the secure payment.
          </p>
        </div>

        {/* ─── TWO-COLUMN AREA (Phase 2 Left Card + Phase 3 Right Card Placeholder) ─── */}
        <div
          id="checkout-columns-container"
          className="grid grid-cols-1 lg:grid-cols-[1.51fr_1fr] gap-6 lg:gap-8 items-start pb-12 sm:pb-16"
        >
          {/* ─── LEFT COLUMN: Booking Summary Outer Card ─── */}
          <div
            id="checkout-left-column"
            className={`rounded-hh-card border p-5 sm:p-7 lg:p-8 transition-colors duration-200 ${
              isDark
                ? 'bg-[#0A101D] border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
                : 'bg-white border-blue-100/70 shadow-[0_8px_30px_rgba(15,40,80,0.04)]'
            }`}
          >
            {/* Card Heading: Booking Summary */}
            <h2
              className={`text-[19px] sm:text-[21px] lg:text-[22px] font-bold tracking-tight mb-4 sm:mb-5 ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}
            >
              Booking Summary
            </h2>

            {/* 1. Inner Bordered Card (Container preview, specs row, quantity) */}
            <BookingSummaryCard
              container={container}
              quantity={quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              isDark={isDark}
            />

            {/* 2. Shipping Details */}
            <ShippingDetailsCard
              container={container}
              isDark={isDark}
            />

            {/* 3. Billing Address */}
            <BillingAddressCard
              billingAddress={billingAddress}
              onSaveBillingAddress={setBillingAddress}
              isDark={isDark}
            />
          </div>

          {/* ─── RIGHT COLUMN: Empty Container (Phase 3) ─── */}
          <div
            id="checkout-right-column"
            aria-label="Payment method and order summary area — coming in Phase 3"
          >
            {/* Right card (Payment Method, Order Summary, Pay Now) will be added in Phase 3 */}
          </div>

        </div>

      </div>
    </div>
  );
}

export default CheckoutPage;
