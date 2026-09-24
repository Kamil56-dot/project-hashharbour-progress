import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { NAV_LINKS } from '../../constants/navigation';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

/**
 * Mobile Drawer Navigation Overlay Component.
 * Source of Truth: architecture_blueprint.md Step 6, forensic_audit.md §15
 */
export function MobileMenu({ isOpen, onClose }) {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      id="mobile-navigation-drawer"
      className={`fixed inset-0 z-[40] backdrop-blur-xl lg:hidden flex flex-col pt-[88px] px-6 pb-8 transition-all duration-200 ${
        isDark ? 'bg-surface-950/95 text-text-primary' : 'bg-white/95 text-[#0F172A]'
      }`}
    >
      {/* Explicit Close (X) Button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close navigation menu"
        className={`absolute top-6 right-6 w-10 h-10 flex items-center justify-center transition-colors duration-150 rounded-sm focus-visible:outline-2 ${
          isDark
            ? 'text-text-primary hover:text-accent-500 focus-visible:outline-accent-500'
            : 'text-slate-800 hover:text-brand-500 focus-visible:outline-brand-500'
        }`}
      >
        <X className="w-6 h-6 stroke-[2]" />
      </button>

      <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full">
        {/* Nav Links Stack */}
        <nav aria-label="Mobile Navigation">
          <ul className="flex flex-col space-y-4 list-none p-0 m-0">
            {NAV_LINKS.map((link) => {
              const isRoute = link.href.startsWith('/');
              const linkClasses = `block py-3 text-[18px] font-semibold border-b transition-colors duration-150 ${
                isDark
                  ? 'text-text-primary hover:text-accent-500 border-border-subtle'
                  : 'text-slate-800 hover:text-brand-600 border-slate-200'
              }`;

              return (
                <li key={link.id}>
                  {isRoute ? (
                    <Link
                      to={link.href}
                      onClick={onClose}
                      className={linkClasses}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={onClose}
                      className={linkClasses}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Auth CTAs */}
        <div className="flex flex-col space-y-3 pt-6">
          <Button
            variant="ghost"
            label="Login"
            href="/login"
            onClick={onClose}
            className={`w-full h-12 text-body-md ${
              !isDark
                ? '!border-slate-300 !text-slate-800 hover:!border-brand-500 hover:!bg-brand-50 hover:!text-brand-600'
                : ''
            }`}
          />
          <Button
            variant="primary"
            label="Register"
            href="#register"
            onClick={onClose}
            className={`w-full h-12 text-body-md ${
              !isDark
                ? '!bg-brand-500 hover:!bg-brand-600 !text-white !shadow-sm'
                : ''
            }`}
          />
        </div>
      </div>
    </div>
  );
}
