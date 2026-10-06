import React, { useCallback } from 'react';
import { CreditCard, Smartphone, Landmark, Wallet } from 'lucide-react';

// Cropped logo PNGs from Image 1 (stored in frontend/src/assets/payment/)
import visaPng from '../../../assets/payment/visa.png';
import mastercardPng from '../../../assets/payment/mastercard.png';
import rupayPng from '../../../assets/payment/rupay.png';
import upiPng from '../../../assets/payment/upi.png';
import paytmPng from '../../../assets/payment/paytm.png';
import phonepePng from '../../../assets/payment/phonepe.png';
import googleGPng from '../../../assets/payment/google_g.png';

/**
 * Payment method options configuration
 */
const PAYMENT_METHODS = [
  {
    id: 'card',
    icon: CreditCard,
    title: 'Credit / Debit Card',
    subtitle: 'Visa, Mastercard, Rupay',
    logos: [
      { name: 'Visa', src: visaPng, h: 'h-[14px]' },
      { name: 'Mastercard', src: mastercardPng, h: 'h-[18px]' },
      { name: 'RuPay', src: rupayPng, h: 'h-[14px]' },
    ],
  },
  {
    id: 'upi',
    icon: Smartphone,
    title: 'UPI',
    subtitle: 'Pay with UPI apps',
    logos: [
      { name: 'UPI', src: upiPng, h: 'h-[16px]' },
    ],
  },
  {
    id: 'bank',
    icon: Landmark,
    title: 'Bank Transfer',
    subtitle: 'Direct bank transfer',
    isBankIcon: true,
  },
  {
    id: 'wallet',
    icon: Wallet,
    title: 'Wallet',
    subtitle: 'Paytm, PhonePe, Google Pay',
    logos: [
      { name: 'Paytm', src: paytmPng, h: 'h-[13px]' },
      { name: 'PhonePe', src: phonepePng, h: 'h-[18px]' },
      { name: 'Google Pay', src: googleGPng, h: 'h-[18px]' },
    ],
  },
];

/**
 * Right-side logos renderer
 * Renders the cropped PNG logos from Image 1.
 * In dark theme, wraps logos in a subtle light pill with slight backdrop so dark logos (Visa, UPI) remain crisp and readable.
 */
function PaymentLogos({ method, isDark }) {
  if (method.isBankIcon) {
    return (
      <div className="flex items-center shrink-0 ml-auto">
        <Landmark
          className={`w-[18px] h-[18px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 shrink-0 ml-auto transition-colors duration-200 ${
        isDark ? 'bg-white/10 px-2 py-1 rounded-md' : ''
      }`}
    >
      {method.logos.map((logo) => (
        <img
          key={logo.name}
          src={logo.src}
          alt={logo.name}
          className={`${logo.h} w-auto object-contain select-none`}
          loading="lazy"
        />
      ))}
    </div>
  );
}

/**
 * PaymentMethodCard — Phase 3
 * Accessible radio group with 4 payment options.
 */
export function PaymentMethodCard({ paymentMethod, onChangePaymentMethod, isDark }) {
  const handleKeyDown = useCallback(
    (e) => {
      const currentIndex = PAYMENT_METHODS.findIndex((m) => m.id === paymentMethod);
      let nextIndex = currentIndex;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % PAYMENT_METHODS.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + PAYMENT_METHODS.length) % PAYMENT_METHODS.length;
      } else if (e.key === ' ') {
        e.preventDefault();
        return;
      } else {
        return;
      }

      onChangePaymentMethod(PAYMENT_METHODS[nextIndex].id);
      const radioEl = document.getElementById(`payment-radio-${PAYMENT_METHODS[nextIndex].id}`);
      if (radioEl) radioEl.focus();
    },
    [paymentMethod, onChangePaymentMethod]
  );

  return (
    <div className="mb-6 sm:mb-7">
      {/* Section Heading */}
      <h3
        className={`text-[17px] sm:text-[18px] font-bold tracking-tight mb-4 ${
          isDark ? 'text-white' : 'text-[#0F172A]'
        }`}
      >
        Payment Method
      </h3>

      {/* Radio Group */}
      <div
        role="radiogroup"
        aria-label="Payment method"
        onKeyDown={handleKeyDown}
        className="flex flex-col gap-2.5"
      >
        {PAYMENT_METHODS.map((method) => {
          const isSelected = paymentMethod === method.id;
          const Icon = method.icon;

          return (
            <div
              key={method.id}
              id={`payment-radio-${method.id}`}
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChangePaymentMethod(method.id)}
              className={`flex items-center gap-3 sm:gap-3.5 px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#1E88E5] focus-visible:ring-offset-1 select-none ${
                isSelected
                  ? isDark
                    ? 'bg-[#1E88E5]/10 border border-[#1E88E5]/25'
                    : 'bg-[#E8F2FD] border border-[#1E88E5]/20'
                  : isDark
                    ? 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]'
                    : 'bg-white border border-slate-100 hover:bg-slate-50/60'
              }`}
            >
              {/* Custom Radio Circle: selected has blue dot inside */}
              <span
                className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                  isSelected
                    ? isDark
                      ? 'border-[#1E88E5] bg-[#0A101D]'
                      : 'border-[#1E88E5] bg-white'
                    : isDark
                      ? 'border-white/25 bg-transparent'
                      : 'border-slate-300 bg-transparent'
                }`}
                aria-hidden="true"
              >
                {isSelected && (
                  <span className="w-[8px] h-[8px] rounded-full bg-[#1E88E5]" />
                )}
              </span>

              {/* Icon Badge */}
              <span
                className={`w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                  isDark
                    ? 'bg-[#1E88E5]/15 text-[#5BB5F5]'
                    : 'bg-[#DBEAFE] text-[#1E88E5]'
                }`}
              >
                <Icon className="w-[16px] h-[16px]" />
              </span>

              {/* Title + Subtitle */}
              <div className="flex-1 min-w-0 pr-1">
                <span
                  className={`block text-[13px] sm:text-[14px] font-semibold leading-tight whitespace-nowrap ${
                    isDark ? 'text-white' : 'text-[#0F172A]'
                  }`}
                >
                  {method.title}
                </span>
                <span
                  className={`block text-[11px] sm:text-[12px] font-normal leading-tight mt-0.5 whitespace-nowrap ${
                    isDark ? 'text-slate-400' : 'text-[#8FA0B5]'
                  }`}
                >
                  {method.subtitle}
                </span>
              </div>

              {/* Right-side Logos */}
              <PaymentLogos method={method} isDark={isDark} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PaymentMethodCard;
