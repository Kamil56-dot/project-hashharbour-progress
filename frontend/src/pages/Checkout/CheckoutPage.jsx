import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Lock, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getContainerData, DEFAULT_BILLING_ADDRESS, FEES_DEMO, formatCurrency } from './checkoutData';
import { BookingSummaryCard } from './components/BookingSummaryCard';
import { ShippingDetailsCard } from './components/ShippingDetailsCard';
import { BillingAddressCard } from './components/BillingAddressCard';
import { PaymentMethodCard } from './components/PaymentMethodCard';
import { OrderSummaryCard } from './components/OrderSummaryCard';
import { TrustBar } from './components/TrustBar';

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

/** Session storage key for checkout draft (used for login redirect flow) */
const DRAFT_KEY = 'hh_checkout_draft';

/**
 * CheckoutPage — Phase 1, 2 & 3
 * Route: /checkout
 * URL query parameters:
 *  - ?type=standard-dry|oil-tank|reefer (defaults to standard-dry)
 *  - ?qty=1 (defaults to 1)
 */
export function CheckoutPage() {
  const { isDark } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

  // Shared quantity state lifted to page level (used by Order Summary)
  const [quantity, setQuantity] = useState(initialQty);

  // Lifted billing address state (to be sent to backend in Phase 4)
  const [billingAddress, setBillingAddress] = useState(DEFAULT_BILLING_ADDRESS);

  // Phase 3 state: payment method, insurance, and Pay Now messaging
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [insuranceSelected, setInsuranceSelected] = useState(true);
  const [payNowMessage, setPayNowMessage] = useState('');

  // ─── RESTORE DRAFT FROM SESSION STORAGE (login redirect flow) ───
  useEffect(() => {
    try {
      const draftJson = sessionStorage.getItem(DRAFT_KEY);
      if (!draftJson) return;

      const draft = JSON.parse(draftJson);

      // Only restore if the draft container type matches the current URL type
      if (draft.containerType !== container.id) return;

      // URL ?qty= is source of truth for quantity if present;
      // only restore quantity from draft if URL doesn't specify it
      if (!searchParams.get('qty') && typeof draft.quantity === 'number' && draft.quantity >= 1) {
        setQuantity(draft.quantity);
      }

      // Restore fields the URL doesn't specify
      if (draft.insuranceSelected !== undefined) {
        setInsuranceSelected(!!draft.insuranceSelected);
      }
      if (draft.paymentMethod && ['card', 'upi', 'bank', 'wallet'].includes(draft.paymentMethod)) {
        setPaymentMethod(draft.paymentMethod);
      }
      if (draft.billingAddress && typeof draft.billingAddress === 'object') {
        setBillingAddress(draft.billingAddress);
      }

      // Remove draft after restoring
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // Invalid draft — ignore silently
      sessionStorage.removeItem(DRAFT_KEY);
    }
  }, []); // Run once on mount

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

  const handleToggleInsurance = useCallback(() => {
    setInsuranceSelected((prev) => !prev);
  }, []);

  // ─── PAY NOW HANDLER ───
  const handlePayNow = useCallback(() => {
    setPayNowMessage('');

    // (a) Reefer container — not available for booking yet
    if (container.id === 'reefer') {
      setPayNowMessage('This container type is not available for booking yet.');
      return;
    }

    // Check login status
    const hasToken = !!localStorage.getItem('hh_access_token');

    if (!hasToken) {
      // (b) Not logged in — save draft and redirect to /login
      const draft = {
        containerType: container.id,
        quantity,
        insuranceSelected,
        paymentMethod,
        billingAddress,
      };
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));

      // Build returnUrl — the current /checkout URL with query params
      const currentUrl = `/checkout${window.location.search}`;
      navigate(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }

    // (c) Logged in, not reefer — TODO Phase 4: save booking
    // No-op handler. Nothing visible happens.
    // TODO Phase 4: save booking to backend, show "Booking Completed" popup.
  }, [container.id, quantity, insuranceSelected, paymentMethod, billingAddress, navigate]);

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

           <div
          id="checkout-columns-container"
          className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] xl:grid-cols-[1.51fr_1fr] gap-6 lg:gap-7 xl:gap-8 items-start"
        >
          {/* ─── LEFT COLUMN: Booking Summary Outer Card ─── */}
          <div
            id="checkout-left-column"
            className={`rounded-hh-card border p-5 sm:p-6 xl:p-8 transition-colors duration-200 ${
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

          {/* ─── RIGHT COLUMN: Payment Method + Order Summary + Pay Now ─── */}
          <div
            id="checkout-right-column"
            aria-label="Payment and order summary"
          >
            <div
              className={`rounded-hh-card border p-5 sm:p-6 xl:p-8 transition-colors duration-200 ${
                isDark
                  ? 'bg-[#0A101D] border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
                  : 'bg-white border-blue-100/70 shadow-[0_8px_30px_rgba(15,40,80,0.04)]'
              }`}
            >
              {/* Payment Method Selection */}
              <PaymentMethodCard
                paymentMethod={paymentMethod}
                onChangePaymentMethod={setPaymentMethod}
                isDark={isDark}
              />

              {/* Order Summary */}
              <OrderSummaryCard
                container={container}
                quantity={quantity}
                insuranceSelected={insuranceSelected}
                onToggleInsurance={handleToggleInsurance}
                isDark={isDark}
              />

              {/* Pay Now Button */}
              <button
                id="pay-now-btn"
                type="button"
                onClick={handlePayNow}
                className="group w-full h-[52px] rounded-full bg-[#1E88E5] hover:bg-[#1976D2] active:scale-[0.99] text-white font-semibold text-[15px] sm:text-[16px] flex items-center justify-center gap-2.5 shadow-[0_4px_14px_rgba(30,136,229,0.35)] hover:shadow-[0_6px_20px_rgba(30,136,229,0.45)] transition-all duration-200 cursor-pointer"
              >
                <Lock className="w-[16px] h-[16px]" />
                <span>Pay Now</span>
                <ArrowRight className="w-[16px] h-[16px] transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              {/* Inline Pay Now message (reefer unavailable / etc.) */}
              {payNowMessage && (
                <div
                  id="pay-now-message"
                  className={`mt-3 px-4 py-2.5 rounded-xl text-[13px] sm:text-[14px] font-medium flex items-center gap-2 animate-in fade-in duration-150 ${
                    isDark
                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                      : 'bg-amber-50 border border-amber-200 text-amber-700'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{payNowMessage}</span>
                </div>
              )}

              {/* SSL Encryption Note */}
              <p
                className={`mt-4 flex items-center justify-center gap-1.5 text-[11px] sm:text-[12px] font-normal ${
                  isDark ? 'text-slate-500' : 'text-[#94A3B8]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </p>
            </div>
          </div>

        </div>

        {/* ─── TRUST BAR ─── */}
        <TrustBar isDark={isDark} />

      </div>
    </div>
  );
}

export default CheckoutPage;
