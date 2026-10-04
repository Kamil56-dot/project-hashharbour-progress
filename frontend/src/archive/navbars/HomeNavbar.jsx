import React, { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../layout/Logo';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Routes', href: '#routes' },
];

/**
 * Home page navbar — dual-theme.
 * Light: Original pill-within-pill design on light blue-tinted strip.
 * Dark: Sleek translucent dark bar with cyan accents, matching the Services page Navbar aesthetic.
 */
export function HomeNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav
      className={`w-full flex items-center shrink-0 relative z-30 py-3 sm:py-3.5 lg:py-4 transition-colors duration-200 ${
        isDark
          ? 'bg-surface-900/90 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-[#EEF5FC]'
      }`}
    >
      {/* 3-Part Layout: Logo (left flex-1) | Center Nav Track (centered) | Auth Buttons (right flex-1) */}
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between">

        {/* Left: Logo */}
        <div className="flex-1 flex items-center justify-start">
          <Logo
            className={
              isDark
                ? '' /* White text + cyan anchor from default Logo styling */
                : 'text-heading-navy [&_.brand-anchor-svg]:!text-brand-500'
            }
          />
        </div>

        {/* Center: Nav links inside pill track (desktop) */}
        <div className="hidden lg:flex items-center justify-center shrink-0">
          <div
            className={`p-1 rounded-full flex items-center gap-1 ${
              isDark
                ? 'bg-white/[0.06] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]'
                : 'bg-[#E3EEFA] shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]'
            }`}
          >
            {NAV_LINKS.map((link) => {
              const isRoute = link.href.startsWith('/');
              // On "/" route, "About" is active by default to match reference showcase
              const isActive = isRoute
                ? pathname === link.href || (pathname === '/' && link.href === '/about')
                : false;

              const baseClasses = `relative px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isDark
                  ? isActive
                    ? 'bg-white/[0.1] text-cyan-400 shadow-sm'
                    : 'text-slate-300 hover:text-cyan-400 hover:bg-white/[0.06]'
                  : isActive
                    ? 'bg-[#CFE5FC] text-brand-500 shadow-sm'
                    : 'text-[#4B5E76] hover:text-brand-500 hover:bg-white/40'
              }`;

              if (isRoute) {
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={baseClasses}
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={baseClasses}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Right: Auth buttons (desktop) + Theme Toggle + Mobile hamburger */}
        <div className="flex-1 flex items-center justify-end">
          {/* Desktop auth buttons & Theme toggle */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-150 focus-visible:outline-2 ${
                isDark
                  ? 'text-amber-300 hover:text-amber-200 hover:bg-white/10 focus-visible:outline-cyan-400'
                  : 'text-slate-700 hover:text-brand-500 hover:bg-white/60 focus-visible:outline-brand-500'
              }`}
            >
              {isDark ? (
                <Sun className="w-5 h-5 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 hover:-rotate-12 transition-transform" />
              )}
            </button>

            <Link
              to="/login"
              className={`font-medium text-sm transition-colors duration-150 ${
                isDark
                  ? 'text-slate-300 hover:text-cyan-400'
                  : 'text-[#4B5E76] hover:text-brand-500'
              }`}
            >
              Log In
            </Link>
            <button
              className={`font-medium text-sm px-6 py-2 rounded-full shadow-sm hover:shadow transition-all duration-150 ${
                isDark
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                  : 'bg-brand-500 hover:bg-brand-600 text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Mobile actions (Theme toggle + hamburger) */}
          <div className="flex items-center lg:hidden gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className={`p-2 rounded-lg ${
                isDark
                  ? 'text-amber-300 hover:text-amber-200'
                  : 'text-slate-700 hover:text-brand-500'
              }`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 rounded-lg ${
                isDark
                  ? 'text-white hover:text-cyan-400'
                  : 'text-gray-700 hover:text-brand-500'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div
          className={`lg:hidden absolute top-full left-0 right-0 shadow-lg z-40 ${
            isDark
              ? 'bg-surface-900/95 backdrop-blur-xl border-b border-white/[0.06]'
              : 'bg-[#EEF5FC] border-b border-blue-100'
          }`}
        >
          <div className="flex flex-col px-6 py-4 gap-2">
            <div
              className={`p-1.5 rounded-2xl flex flex-col gap-1 ${
                isDark ? 'bg-white/[0.06]' : 'bg-[#E3EEFA]'
              }`}
            >
              {NAV_LINKS.map((link) => {
                const isRoute = link.href.startsWith('/');
                const isActive = isRoute
                  ? pathname === link.href || (pathname === '/' && link.href === '/about')
                  : false;

                const mobileClasses = `px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  isDark
                    ? isActive
                      ? 'bg-white/[0.1] text-cyan-400 font-semibold'
                      : 'text-slate-300 hover:text-cyan-400'
                    : isActive
                      ? 'bg-[#CFE5FC] text-brand-500 font-semibold'
                      : 'text-[#4B5E76] hover:text-brand-500'
                }`;

                if (isRoute) {
                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      className={mobileClasses}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className={mobileClasses}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
            <hr className={isDark ? 'border-white/[0.08] my-2' : 'border-blue-100 my-2'} />
            <div className="flex items-center justify-between px-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className={`font-medium text-sm ${
                  isDark
                    ? 'text-slate-300 hover:text-cyan-400'
                    : 'text-[#4B5E76] hover:text-brand-500'
                }`}
              >
                Log In
              </Link>
              <button
                className={`font-medium text-sm rounded-full px-6 py-2 ${
                  isDark
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                    : 'bg-brand-500 hover:bg-brand-600 text-white'
                }`}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
