import React from 'react';
import { ShoppingCart, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import { NAV_ACTIONS } from '../../constants/navigation';
import { useTheme } from '../../context/ThemeContext';

/**
 * Right-side Utility & Auth Actions Component.
 * Source of Truth: reference image (top-right) & forensic_audit.md §2, §15
 *
 * Sequence:
 * [Cart 24px] -> [Theme Toggle 24px] -> [Hamburger 24px] -> [Log In 88x40px] -> [Register 96x40px]
 */
export function NavActions({ onMenuToggle, isMenuOpen, className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`flex items-center ${className}`}>
      {/* Shopping Cart Icon (24px x 24px) */}
      <button
        type="button"
        aria-label="Shopping cart"
        className={`w-10 h-10 flex items-center justify-center transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm mr-1 sm:mr-2 ${
          isDark
            ? 'text-text-primary hover:text-accent-500 hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.4)] focus-visible:outline-accent-500'
            : 'text-slate-700 hover:text-brand-500 focus-visible:outline-brand-500'
        }`}
      >
        <ShoppingCart className="w-6 h-6 stroke-[1.75]" />
      </button>

      {/* Theme Toggle Button (Sun/Moon) */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 mr-2 sm:mr-3 ${
          isDark
            ? 'text-amber-300 hover:text-amber-200 hover:bg-white/10 focus-visible:outline-accent-500'
            : 'text-slate-700 hover:text-brand-600 hover:bg-black/5 focus-visible:outline-brand-500'
        }`}
      >
        {isDark ? (
          <Sun className="w-5 h-5 transition-transform duration-200 hover:rotate-45" />
        ) : (
          <Moon className="w-5 h-5 transition-transform duration-200 hover:-rotate-12" />
        )}
      </button>

      {/* Subtle Vertical Icon Divider */}
      <div
        className={`h-5 w-[1px] mr-3.5 lg:hidden ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}
        aria-hidden="true"
      />

      {/* Hamburger / Menu Icon (24px x 24px box, two horizontal bars with gap) */}
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation-drawer"
        className={`w-10 h-10 flex lg:hidden items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm mr-[20px] ${
          isDark
            ? 'text-text-primary hover:text-accent-500 focus-visible:outline-accent-500'
            : 'text-slate-800 hover:text-brand-500 focus-visible:outline-brand-500'
        }`}
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
        <Button
          variant={NAV_ACTIONS.login.variant}
          label={NAV_ACTIONS.login.label}
          href={NAV_ACTIONS.login.href}
          className={
            !isDark
              ? '!border-slate-300 !text-slate-800 hover:!border-brand-500 hover:!bg-brand-50 hover:!text-brand-500'
              : ''
          }
        />
        <Button
          variant={NAV_ACTIONS.register.variant}
          label={NAV_ACTIONS.register.label}
          href={NAV_ACTIONS.register.href}
          className={
            !isDark
              ? '!bg-brand-500 hover:!bg-brand-600 !text-white !shadow-sm hover:!shadow'
              : ''
          }
        />
      </div>
    </div>
  );
}
