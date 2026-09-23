import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '../ui/Button';
import { NAV_ACTIONS } from '../../constants/navigation';

/**
 * Right-side Utility & Auth Actions Component.
 * Source of Truth: reference image (top-right) & forensic_audit.md §2, §15
 *
 * Sequence:
 * [Cart 24px] -> 16px -> [Hamburger 24px] -> 20px -> [Log In 88x40px] -> 12px -> [Register 96x40px]
 */
export function NavActions({ onMenuToggle, isMenuOpen, className = '' }) {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Shopping Cart Icon (24px x 24px) */}
      <button
        type="button"
        aria-label="Shopping cart"
        className="w-10 h-10 flex items-center justify-center text-text-primary hover:text-accent-500 hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.4)] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-accent-500 focus-visible:outline-offset-2 rounded-sm mr-3"
      >
        <ShoppingCart className="w-6 h-6 stroke-[1.75]" />
      </button>

      {/* Subtle Vertical Icon Divider */}
      <div className="h-5 w-[1px] bg-white/20 mr-3.5 lg:hidden" aria-hidden="true" />

      {/* Hamburger / Menu Icon (24px x 24px box, two horizontal bars with gap) */}
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation-drawer"
        className="w-10 h-10 flex lg:hidden items-center justify-center text-text-primary hover:text-accent-500 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent-500 focus-visible:outline-offset-2 rounded-sm mr-[20px]"
      >
        <div className="w-[20px] h-[20px] flex flex-col justify-center items-center gap-[5px]">
          <span
            className={`w-[20px] h-[2px] bg-current transition-transform duration-200 ${
              isMenuOpen ? 'rotate-45 translate-y-[3.5px]' : ''
            }`}
          />
          <span
            className={`w-[20px] h-[2px] bg-current transition-transform duration-200 ${
              isMenuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''
            }`}
          />
        </div>
      </button>

      {/* Auth Buttons: Log In (88x40px) & Register (96x40px) */}
      <div className="flex items-center space-x-[12px]">
        <Button variant={NAV_ACTIONS.login.variant} label={NAV_ACTIONS.login.label} href={NAV_ACTIONS.login.href} />
        <Button variant={NAV_ACTIONS.register.variant} label={NAV_ACTIONS.register.label} href={NAV_ACTIONS.register.href} />
      </div>
    </div>
  );
}
