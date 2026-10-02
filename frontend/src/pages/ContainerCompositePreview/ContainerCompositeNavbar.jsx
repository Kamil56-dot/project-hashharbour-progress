import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, ShoppingCart, X, UserPlus, LogIn, ArrowRight } from 'lucide-react';

/**
 * PREVIEW-ONLY NAVBAR COMPONENT
 * Specifically crafted for /container-composite-preview to match the aim reference image.
 *
 * Design Specifications:
 * - Height: 74px (within 72-80px range, trimmed vertical padding)
 * - Transparent background on page background with no bottom border line or solid bar
 * - Left: Authentic Anchor SVG (~40px) + "HashHarbour" bold dark navy wordmark
 * - Center: ONE fully rounded pill container with light blue tint (white 6% in dark mode)
 *   Inside: About, Services, Routes, Login (14px, medium weight, muted slate-blue)
 *   Active item has rounded pill with darker light-blue bg and #1E88E5 blue text (derived dynamically from route)
 * - Right: Theme toggle (borderless), shopping cart in blue (~28px), hamburger icon (3 lines)
 * - Desktop & Mobile Menu Dropdown:
 *   Opens panel on desktop and mobile with About, Services, Routes, Login, Register
 *   Closes on outside click, Esc key, and route changes
 *   Fully accessible with aria-label and aria-expanded
 */
export function ContainerCompositeNavbar() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Derive active pill item dynamically from current route
  const getActiveItem = (pathname) => {
    if (pathname === '/about') return 'about';
    if (pathname === '/services' || pathname.startsWith('/container')) return 'services';
    if (pathname === '/routes' || pathname.includes('routes')) return 'routes';
    if (pathname === '/login') return 'login';
    return '';
  };

  const activeItem = getActiveItem(location.pathname);

  const navItems = [
    { id: 'about', label: 'About', href: '/about' },
    { id: 'services', label: 'Services', href: '/services' },
    { id: 'routes', label: 'Routes', href: '#routes' },
    { id: 'login', label: 'Login', href: '/login' },
  ];

  // Close dropdown on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  // Close dropdown on Esc key press
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      <header
        id="preview-header"
        className="fixed top-0 left-0 right-0 w-full h-[74px] z-30 bg-transparent transition-colors duration-200"
      >
        <div className="w-full h-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          
          {/* ─── LEFT: ANCHOR LOGO + HASHHARBOUR WORDMARK ─── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-2 focus-visible:outline-blue-500 rounded-lg py-1"
            aria-label="HashHarbour — Return to homepage"
          >
            {/* Authentic Anchor Artwork (~38-40px) */}
            <svg
              width="36"
              height="40"
              viewBox="0 0 34 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`shrink-0 transition-colors duration-200 ${
                isDark ? 'text-[#38BDF8]' : 'text-[#1E88E5]'
              }`}
            >
              {/* Ring & Stock */}
              <circle cx="17" cy="4" r="2.5" stroke="currentColor" strokeWidth="2.4" fill="none" />
              <line x1="10.5" y1="9" x2="23.5" y2="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              {/* Shaft */}
              <line x1="17" y1="6.5" x2="17" y2="15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="17" y1="21" x2="17" y2="33.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              {/* Capital 'H' Motif */}
              <line x1="9.5" y1="13" x2="9.5" y2="23" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              <line x1="24.5" y1="13" x2="24.5" y2="23" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              <line x1="6.5" y1="18" x2="27.5" y2="18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              {/* Crescent Flukes */}
              <path
                d="M 5.5 27 C 5.5 34.5, 10.5 36.5, 17 36.5 C 23.5 36.5, 28.5 34.5, 28.5 27"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 3 27.5 L 5.5 23.5 L 8.5 27.5"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M 25.5 27.5 L 28.5 23.5 L 31 27.5"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>

            {/* Wordmark */}
            <span
              className={`font-sans font-bold text-[22px] sm:text-[23.5px] leading-none tracking-tight whitespace-nowrap transition-colors duration-200 ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}
            >
              HashHarbour
            </span>
          </Link>

          {/* ─── CENTER: ONE FULLY ROUNDED PILL CONTAINER ─── */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center justify-center"
          >
            <div
              className={`flex items-center rounded-full p-1 transition-colors duration-200 ${
                isDark
                  ? 'bg-white/[0.06] backdrop-blur-xs'
                  : 'bg-[#E5E9F0] border border-[#CBD5E1] shadow-sm'
              }`}
            >
              {navItems.map((item) => {
                const isActive = activeItem === item.id;
                const isInternal = item.href.startsWith('/');
                const LinkTag = isInternal ? Link : 'a';
                const linkProps = isInternal ? { to: item.href } : { href: item.href };

                return (
                  <LinkTag
                    key={item.id}
                    {...linkProps}
                    className={`relative text-[14px] font-medium py-2 px-[18px] rounded-full transition-all duration-200 whitespace-nowrap select-none focus-visible:outline-2 focus-visible:outline-blue-500 ${
                      isActive
                        ? isDark
                          ? 'bg-[#0284C7]/30 text-[#38BDF8] font-semibold shadow-xs'
                          : 'bg-white text-[#1E88E5] font-semibold shadow-xs'
                        : isDark
                          ? 'text-slate-400 hover:text-slate-200'
                          : 'text-[#334155] hover:text-[#0F172A]'
                    }`}
                  >
                    {item.label}
                  </LinkTag>
                );
              })}
            </div>
          </nav>

          {/* ─── RIGHT: THEME TOGGLE + CART (~28px) + HAMBURGER (3 LINES) ─── */}
          <div className="flex items-center gap-3 sm:gap-4 relative">
            
            {/* Small Borderless Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-blue-500 ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDark ? (
                <Sun className="w-[18px] h-[18px] text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-[18px] h-[18px] text-slate-600 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Shopping Cart Icon in Blue (~28px) */}
            <Link
              to="/container-section"
              className={`p-1 rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-blue-500 ${
                isDark ? 'text-[#38BDF8]' : 'text-[#1E88E5]'
              }`}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-[28px] h-[28px] stroke-[2.2]" />
            </Link>

            {/* Hamburger Icon Button (Opens Dropdown Panel on Desktop & Mobile) */}
            <button
              ref={buttonRef}
              id="nav-hamburger-btn"
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              aria-controls="nav-dropdown-panel"
              className={`p-1.5 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 ${
                isDark
                  ? 'text-slate-200 hover:bg-white/[0.08]'
                  : 'text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  className="transition-colors"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
            </button>

            {/* ─── DROPDOWN PANEL (Desktop & Mobile) ─── */}
            {isMenuOpen && (
              <div
                ref={menuRef}
                id="nav-dropdown-panel"
                role="menu"
                aria-label="Extended navigation menu"
                className={`absolute top-[52px] right-0 w-64 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl border transition-all duration-200 z-50 animate-in fade-in slide-in-from-top-2 ${
                  isDark
                    ? 'bg-[#080E1A]/95 border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.7)]'
                    : 'bg-white/95 border-slate-200 text-slate-800 shadow-[0_20px_50px_rgba(15,23,42,0.15)]'
                }`}
              >
                <div className="flex flex-col gap-1">
                  {/* Nav Links: About, Services, Routes, Login */}
                  {navItems.map((item) => {
                    const isActive = activeItem === item.id;
                    const isInternal = item.href.startsWith('/');
                    const LinkTag = isInternal ? Link : 'a';
                    const linkProps = isInternal ? { to: item.href } : { href: item.href };

                    return (
                      <LinkTag
                        key={item.id}
                        {...linkProps}
                        role="menuitem"
                        onClick={() => setIsMenuOpen(false)}
                        className={`text-[14px] font-medium py-2 px-3.5 rounded-xl transition-colors flex items-center justify-between group ${
                          isActive
                            ? isDark
                              ? 'bg-[#0284C7]/25 text-[#38BDF8] font-semibold'
                              : 'bg-[#D6E6FB] text-[#1E88E5] font-semibold'
                            : isDark
                              ? 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isDark ? 'bg-[#38BDF8]' : 'bg-[#1E88E5]'
                            }`}
                          />
                        )}
                      </LinkTag>
                    );
                  })}

                  {/* Divider line before Register */}
                  <div
                    className={`my-1.5 border-t ${
                      isDark ? 'border-white/10' : 'border-slate-100'
                    }`}
                  />

                  {/* Register action: prominently reachable */}
                  <a
                    href="#register"
                    role="menuitem"
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-0.5 text-[14px] font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-[#1E88E5] to-[#1565C0] hover:from-[#1976D2] hover:to-[#0D47A1] text-white shadow-sm hover:shadow active:scale-[0.99]"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default ContainerCompositeNavbar;
