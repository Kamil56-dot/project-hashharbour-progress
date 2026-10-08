import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Lock, ArrowRight, ShieldCheck, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { CONFIG } from '../../config';
import {
  CONTAINER_DB_IDS,
  SHIPPING_DEMO,
  getContainerData,
  DEFAULT_BILLING_ADDRESS,
  FEES_DEMO,
  formatCurrency,
} from './checkoutData';
import { BookingSummaryCard } from './components/BookingSummaryCard';
import { ShippingDetailsCard } from './components/ShippingDetailsCard';
import { BillingAddressCard } from './components/BillingAddressCard';
import { PaymentMethodCard } from './components/PaymentMethodCard';
import { OrderSummaryCard } from './components/OrderSummaryCard';
import { TrustBar } from './components/TrustBar';
import { BookingCompletedCard } from './components/BookingCompletedCard';

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
 * CheckoutPage — Phase 1, 2, 3 & 4
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

  // Lifted billing address state
  const [billingAddress, setBillingAddress] = useState(DEFAULT_BILLING_ADDRESS);
  const [isBillingEditing, setIsBillingEditing] = useState(false);

  // Payment method and insurance selection
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [insuranceSelected, setInsuranceSelected] = useState(true);

  // Phase 4 states: submission loading, success booking result, errors, notices
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [payNowError, setPayNowError] = useState('');
  const [payNowWarning, setPayNowWarning] = useState('');

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

  // Sync quantity to live cart badge on SiteNavbar (show 0 when booking completed)
  useEffect(() => {
    if (bookingSuccess) {
      window.__hh_checkout_qty = 0;
      window.dispatchEvent(
        new CustomEvent('hh-cart-qty-change', { detail: { qty: 0 } })
      );
      return;
    }
    window.__hh_checkout_qty = quantity;
    window.dispatchEvent(
      new CustomEvent('hh-cart-qty-change', { detail: { qty: quantity } })
    );
  }, [quantity, bookingSuccess]);

  const handleIncrement = () => {
    setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  const handleToggleInsurance = useCallback(() => {
    setInsuranceSelected((prev) => !prev);
  }, []);

  // ─── PAY NOW HANDLER (Phase 4 Backend Save) ───
  const handlePayNow = useCallback(async () => {
    // If already confirmed or currently sending, do nothing
    if (bookingSuccess || isSubmitting) {
      return;
    }

    setPayNowError('');
    setPayNowWarning('');

    // (a) Reefer container — not available for booking yet
    if (container.id === 'reefer') {
      setPayNowWarning('This container type is not available for booking yet.');
      return;
    }

    // (b) Check login status
    const token = localStorage.getItem('hh_access_token');
    if (!token) {
      // Not logged in — save draft and redirect to /login
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

    // (c) Check if billing address is in edit mode (unsaved) or incomplete
    const isBillingIncomplete =
      !billingAddress ||
      !(billingAddress.fullName || billingAddress.name)?.trim() ||
      !billingAddress.address?.trim() ||
      !billingAddress.city?.trim() ||
      !billingAddress.state?.trim() ||
      !billingAddress.country?.trim() ||
      !(billingAddress.postalCode || billingAddress.postal_code)?.trim();

    if (isBillingEditing || isBillingIncomplete) {
      setPayNowError('Please save your billing address before paying.');
      return;
    }

    // (d) Build payload and execute booking creation
    const containerDbId = CONTAINER_DB_IDS[container.id] || container.dbId || 1;
    const payload = {
      container_id: containerDbId,
      quantity,
      insurance_selected: insuranceSelected,
      payment_method: paymentMethod,
      billing: {
        name: (billingAddress.fullName || billingAddress.name || '').trim(),
        address: (billingAddress.address || '').trim(),
        city: (billingAddress.city || '').trim(),
        state: (billingAddress.state || '').trim(),
        country: (billingAddress.country || '').trim(),
        postal_code: (billingAddress.postalCode || billingAddress.postal_code || '').trim(),
      },
      origin_port: SHIPPING_DEMO.from,
      destination_port: SHIPPING_DEMO.to,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(`${CONFIG.apiUrl}/api/bookings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (response.status === 201 && data) {
        // Success: store result in state for BookingCompletedCard, clear draft, update cart badge to 0
        setBookingSuccess(data);
        sessionStorage.removeItem(DRAFT_KEY);
        window.__hh_checkout_qty = 0;
        window.dispatchEvent(
          new CustomEvent('hh-cart-qty-change', { detail: { qty: 0 } })
        );
        return;
      }

      if (response.status === 401) {
        // Auth expired / invalid: save draft and redirect to login like guest flow without clearing tokens
        const draft = {
          containerType: container.id,
          quantity,
          insuranceSelected,
          paymentMethod,
          billingAddress,
        };
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        const currentUrl = `/checkout${window.location.search}`;
        navigate(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
        return;
      }

      if (response.status === 400 && data && (data.error || data.message)) {
        // Server validation error
        setPayNowError(data.error || data.message);
      } else {
        // 403 / 5xx / unexpected response status
        setPayNowError('Something went wrong. Please try again.');
      }
    } catch {
      // Network failure
      setPayNowError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    bookingSuccess,
    isSubmitting,
    container.id,
    container.dbId,
    quantity,
    insuranceSelected,
    paymentMethod,
    billingAddress,
    isBillingEditing,
    navigate,
  ]);

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden pt-[78px] lg:pt-[82px] hh-checkout-page ${bookingSuccess ? 'hh-checkout-page-completed' : 'hh-checkout-page-form'} transition-colors duration-300 ${
        isDark ? 'bg-transparent text-white' : 'bg-transparent text-[#0F172A]'
      }`}
    >
      {!bookingSuccess ? (
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* ─── STEPPER ─── */}
            <nav
              aria-label="Checkout progress"
              className="pt-6 pb-4 sm:pt-7 sm:pb-5 hh-checkout-stepper"
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
        <div className="pb-6 sm:pb-8 hh-checkout-header">
          <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-extrabold tracking-tight leading-tight text-hh-heading hh-checkout-title transition-colors duration-200">
            Checkout &amp; Payment
          </h1>
          <p className="mt-1.5 sm:mt-2 text-[14px] sm:text-[15px] lg:text-[16px] font-normal leading-relaxed text-hh-body hh-checkout-subtitle transition-colors duration-200">
            Complete your booking and make the secure payment.
          </p>
        </div>

           <div
          id="checkout-columns-container"
          className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] xl:grid-cols-[1.51fr_1fr] gap-6 lg:gap-7 xl:gap-8 items-start hh-checkout-grid"
        >
          {/* ─── LEFT COLUMN: Booking Summary Outer Card ─── */}
          <div
            id="checkout-left-column"
            className={`rounded-hh-card border p-5 sm:p-6 xl:p-8 hh-checkout-card transition-colors duration-200 ${
              isDark
                ? 'bg-[#0A101D] border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
                : 'bg-white border-blue-100/70 shadow-[0_8px_30px_rgba(15,40,80,0.04)]'
            }`}
          >
            {/* Card Heading: Booking Summary */}
            <h2
              className={`text-[19px] sm:text-[21px] lg:text-[22px] font-bold tracking-tight mb-4 sm:mb-5 hh-checkout-card-heading ${
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
              isEditing={isBillingEditing}
              onEditChange={setIsBillingEditing}
            />
          </div>

          {/* ─── RIGHT COLUMN: Payment Method + Order Summary + Pay Now ─── */}
          <div
            id="checkout-right-column"
            aria-label="Payment and order summary"
          >
            <div
              className={`rounded-hh-card border p-5 sm:p-6 xl:p-8 hh-checkout-card transition-colors duration-200 ${
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
                disabled={isSubmitting || Boolean(bookingSuccess)}
                className={`group w-full h-[52px] rounded-full text-white font-semibold text-[15px] sm:text-[16px] flex items-center justify-center gap-2.5 transition-all duration-200 select-none ${
                  isSubmitting || Boolean(bookingSuccess)
                    ? 'bg-[#1E88E5]/75 cursor-not-allowed shadow-none'
                    : 'bg-[#1E88E5] hover:bg-[#1976D2] active:scale-[0.99] shadow-[0_4px_14px_rgba(30,136,229,0.35)] hover:shadow-[0_6px_20px_rgba(30,136,229,0.45)] cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-[18px] h-[18px] animate-spin shrink-0" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-[16px] h-[16px]" />
                    <span>Pay Now</span>
                    <ArrowRight className="w-[16px] h-[16px] transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              {/* Inline validation or server error */}
              {payNowError && (
                <div
                  id="pay-now-message"
                  className={`mt-3 px-4 py-2.5 rounded-xl text-[13px] sm:text-[14px] font-medium flex items-center gap-2 animate-in fade-in duration-150 ${
                    isDark
                      ? 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                      : 'bg-rose-50 border border-rose-200 text-rose-700'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{payNowError}</span>
                </div>
              )}

              {/* Inline Pay Now warning notice (reefer unavailable) */}
              {!payNowError && !bookingSuccess && payNowWarning && (
                <div
                  id="pay-now-message"
                  className={`mt-3 px-4 py-2.5 rounded-xl text-[13px] sm:text-[14px] font-medium flex items-center gap-2 animate-in fade-in duration-150 ${
                    isDark
                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                      : 'bg-amber-50 border border-amber-200 text-amber-700'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{payNowWarning}</span>
                </div>
              )}

              {/* SSL Encryption Note */}
              <p
                className={`mt-4 flex items-center justify-center gap-1.5 text-[11px] sm:text-[12px] font-normal hh-ssl-note ${
                  isDark ? 'text-slate-500' : 'text-[#94A3B8]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </p>
            </div>
          </div>

          {/* ─── TRUST BAR (Form View) ─── */}
          <TrustBar isDark={isDark} variant="form" />
        </div>
      </div>
      ) : (
        /* ─── BOOKING COMPLETED SUCCESS VIEW (Phase 1) ─── */
        <div className="hh-completed-page-layout flex flex-col justify-between">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex-1 flex flex-col justify-center">
            <div className="pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-12 hh-completed-wrapper flex justify-center">
              <BookingCompletedCard
                bookingData={bookingSuccess}
                container={container}
                isDark={isDark}
              />
            </div>
          </div>

          {/* ─── TRUST BAR FOOTER BAND (Completed View) ─── */}
          <div className="w-full hh-completed-footer-band">
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-center">
              <TrustBar isDark={isDark} variant="completed" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
