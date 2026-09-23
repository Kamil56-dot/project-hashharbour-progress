import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../layout/Logo';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Routes', href: '#routes' },
];

/**
 * Light-theme navbar for the Home page.
 * Styled to precisely match the reference design:
 * - Sits on a light blue-tinted background strip (bg-[#EEF5FC]), full width, generous vertical padding.
 * - Nav links sit inside a soft rounded-pill track (bg-[#E3EEFA]), and the active link ("About")
 *   has its own solid sky-blue pill highlight (bg-[#CFE5FC]) — creating the "pill within a pill" look.
 * - Symmetrical 3-part layout: Logo left, nav group dead-center, Log In + Register right.
 * - Anchor icon in logo is vivid brand blue, wordmark is dark navy.
 */
export function HomeNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="w-full bg-[#EEF5FC] flex items-center shrink-0 relative z-30 py-3 sm:py-3.5 lg:py-4 transition-colors">
      {/* 3-Part Layout: Logo (left flex-1) | Center Nav Track (centered) | Auth Buttons (right flex-1) */}
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between">

        {/* Left: Logo with vivid blue anchor + dark navy wordmark */}
        <div className="flex-1 flex items-center justify-start">
          <Logo className="text-heading-navy [&_.brand-anchor-svg]:!text-brand-500" />
        </div>

        {/* Center: Nav links inside pill track (desktop) */}
        <div className="hidden lg:flex items-center justify-center shrink-0">
          <div className="bg-[#E3EEFA] p-1 rounded-full flex items-center gap-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
            {NAV_LINKS.map((link) => {
              const isRoute = link.href.startsWith('/');
              // On "/" route, "About" is active by default to match reference showcase
              const isActive = isRoute
                ? pathname === link.href || (pathname === '/' && link.href === '/about')
                : false;

              const baseClasses = `relative px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
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

        {/* Right: Auth buttons (desktop) + Mobile hamburger */}
        <div className="flex-1 flex items-center justify-end">
          {/* Desktop auth buttons */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              to="/login"
              className="text-[#4B5E76] hover:text-brand-500 font-medium text-sm transition-colors duration-150"
            >
              Log In
            </Link>
            <button className="bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm px-6 py-2 rounded-full shadow-sm hover:shadow transition-all duration-150">
              Register
            </button>
          </div>

          {/* Mobile hamburger toggle (visible below lg) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-gray-700 hover:text-brand-500 p-2 rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#EEF5FC] border-b border-blue-100 shadow-lg z-40">
          <div className="flex flex-col px-6 py-4 gap-2">
            <div className="bg-[#E3EEFA] p-1.5 rounded-2xl flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isRoute = link.href.startsWith('/');
                const isActive = isRoute
                  ? pathname === link.href || (pathname === '/' && link.href === '/about')
                  : false;

                const mobileClasses = `px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  isActive
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
            <hr className="border-blue-100 my-2" />
            <div className="flex items-center justify-between px-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-[#4B5E76] font-medium text-sm hover:text-brand-500"
              >
                Log In
              </Link>
              <button className="bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm rounded-full px-6 py-2">
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
