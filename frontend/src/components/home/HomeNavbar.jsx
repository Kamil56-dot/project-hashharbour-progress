import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../layout/Logo';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Routes', href: '#routes' },
];

/**
 * Light-theme navbar for the Home page.
 * Does NOT modify or import the shared Navbar.jsx used by other pages.
 */
export function HomeNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      style={{
        height: 'clamp(56px, 8vh, 80px)',
        minHeight: '56px',
      }}
      className="w-full bg-transparent flex items-center shrink-0 relative z-30 border-b border-gray-200"
    >
      {/* Inner container with horizontal padding */}
      <div className="w-full flex items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* Left: Logo + Wordmark */}
        <div className="shrink-0">
          <Logo className="text-gray-900" />
        </div>

        {/* Center: Nav Links (hidden below lg) */}
        <div className="hidden lg:flex items-center" style={{ gap: 'clamp(20px, 2.5vw, 40px)' }}>
          {NAV_LINKS.map((link) => {
            const isRoute = link.href.startsWith('/');
            if (isRoute) {
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-gray-700 font-medium hover:text-gray-900 transition-colors duration-150"
                  style={{ fontSize: 'clamp(13px, 0.9vw, 15px)' }}
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-700 font-medium hover:text-gray-900 transition-colors duration-150"
                style={{ fontSize: 'clamp(13px, 0.9vw, 15px)' }}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right: Auth buttons (hidden below lg) + Mobile hamburger */}
        <div className="flex items-center gap-3">
          {/* Desktop auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              className="text-gray-700 font-medium hover:text-gray-900 transition-colors duration-150"
              style={{ fontSize: 'clamp(13px, 0.9vw, 15px)' }}
            >
              Log In
            </button>
            <button
              className="bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-150"
              style={{
                fontSize: 'clamp(12px, 0.85vw, 14px)',
                padding: 'clamp(6px, 0.8vh, 10px) clamp(14px, 1.2vw, 22px)',
              }}
            >
              Register
            </button>
          </div>

          {/* Mobile hamburger toggle (visible below lg) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-gray-700 hover:text-gray-900 p-1"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-md z-40">
          <div className="flex flex-col px-5 py-4 gap-3">
            {NAV_LINKS.map((link) => {
              const isRoute = link.href.startsWith('/');
              if (isRoute) {
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-gray-700 font-medium text-sm hover:text-gray-900 py-1"
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
                  className="text-gray-700 font-medium text-sm hover:text-gray-900 py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
            <hr className="border-gray-100 my-1" />
            <div className="flex items-center gap-3 pt-1">
              <button className="text-gray-700 font-medium text-sm">Log In</button>
              <button className="bg-gray-900 text-white font-semibold text-sm rounded-lg px-4 py-2">
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

