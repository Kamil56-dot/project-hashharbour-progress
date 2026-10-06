import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, ShoppingCart, X, UserPlus, LogIn, ArrowRight, User, LogOut, ChevronDown } from 'lucide-react';

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
export const SiteNavbar = React.forwardRef(function SiteNavbar(props, ref) {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const userMenuRef = useRef(null);

  // While isLoading, show logged-out state to prevent UI flicker
  const isLoggedIn = !isLoading && isAuthenticated;

  const userName = user?.first_name
    ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`.trim()
    : (user?.name || user?.email?.split('@')[0] || 'Account');

  const userInitial = (user?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase();

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    try {
      await logout();
    } catch (err) {
      console.warn('Logout error:', err);
    }
    navigate('/');
  };

  // Derive active pill item dynamically from current route
  const getActiveItem = (pathname) => {
    if (pathname === '/about') return 'about';
    if (pathname === '/services' || pathname.startsWith('/container')) return 'services';
    if (pathname === '/routes' || pathname.includes('routes')) return 'routes';
    if (pathname === '/login') return 'login';
    if (pathname === '/account') return 'account';
    return '';
  };

  const activeItem = getActiveItem(location.pathname);

  const baseNavItems = [
    { id: 'about', label: 'About', href: '/about' },
    { id: 'services', label: 'Services', href: '/services' },
    { id: 'routes', label: 'Routes', href: '#routes' },
  ];

  const navItems = isLoggedIn
    ? baseNavItems
    : [...baseNavItems, { id: 'login', label: 'Login', href: '/login' }];

  // Close dropdowns on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Close dropdowns on outside click
  useEffect(() => {
    if (!isMenuOpen && !isUserMenuOpen) return;

    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen, isUserMenuOpen]);

  // Close dropdowns on Esc key press
  useEffect(() => {
    if (!isMenuOpen && !isUserMenuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, isUserMenuOpen]);

  // Close dropdown on window resize past mobile breakpoint (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <header
        ref={ref}
        id="preview-header"
        className="fixed top-0 left-0 right-0 w-full h-[74px] z-30 bg-transparent transition-colors duration-200 max-lg:bg-white/80 max-lg:dark:bg-[#080E1A]/85 max-lg:backdrop-blur-md max-lg:border-b max-lg:border-slate-200/50 max-lg:dark:border-white/10"
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
            className="hidden lg:flex items-center justify-center"
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

              {/* Logged-in User Pill + Dropdown on Desktop */}
              {isLoggedIn && (
                <div className="relative" ref={userMenuRef}>
                  <button
                    id="nav-user-menu-btn"
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    aria-label="User account menu"
                    className={`relative text-[14px] font-medium py-1.5 pl-2 pr-3.5 rounded-full transition-all duration-200 flex items-center gap-2 select-none focus-visible:outline-2 focus-visible:outline-blue-500 cursor-pointer ${
                      isUserMenuOpen || location.pathname === '/account'
                        ? isDark
                          ? 'bg-[#0284C7]/30 text-[#38BDF8] font-semibold shadow-xs'
                          : 'bg-white text-[#1E88E5] font-semibold shadow-xs'
                        : isDark
                          ? 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                          : 'text-[#334155] hover:text-[#0F172A] hover:bg-slate-200/50'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-xs ${
                        isDark
                          ? 'bg-gradient-to-tr from-[#0284C7] to-[#38BDF8]'
                          : 'bg-gradient-to-tr from-[#1E88E5] to-[#42A5F5]'
                      }`}
                    >
                      {userInitial}
                    </span>
                    <span className="max-w-[110px] truncate">{userName}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isUserMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Desktop Dropdown Panel */}
                  {isUserMenuOpen && (
                    <div
                      id="nav-user-dropdown"
                      role="menu"
                      aria-label="User account menu"
                      className={`absolute top-[calc(100%+8px)] right-0 w-48 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl border transition-all duration-150 z-50 animate-in fade-in slide-in-from-top-2 ${
                        isDark
                          ? 'bg-[#080E1A]/95 border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.7)]'
                          : 'bg-white/95 border-slate-200 text-slate-800 shadow-[0_20px_50px_rgba(15,23,42,0.15)]'
                      }`}
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10 mb-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Signed in as
                        </p>
                        <p className="text-[13px] font-semibold text-slate-800 dark:text-white truncate">
                          {user?.email || userName}
                        </p>
                      </div>

                      <Link
                        id="nav-user-account-link"
                        to="/account"
                        role="menuitem"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`w-full text-[14px] font-medium py-2 px-3 rounded-xl transition-colors flex items-center gap-2.5 ${
                          location.pathname === '/account'
                            ? isDark
                              ? 'bg-[#0284C7]/25 text-[#38BDF8] font-semibold'
                              : 'bg-[#D6E6FB] text-[#1E88E5] font-semibold'
                            : isDark
                              ? 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span>Account</span>
                      </Link>

                      <button
                        id="nav-user-logout-btn"
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="w-full text-[14px] font-medium py-2 px-3 rounded-xl transition-colors flex items-center gap-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
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

            {/* Hamburger Icon Button (Opens Dropdown Panel on Mobile Only) */}
            <button
              ref={buttonRef}
              id="nav-hamburger-btn"
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              aria-controls="nav-dropdown-panel"
              className={`lg:hidden p-1.5 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 ${
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

            {/* ─── DROPDOWN PANEL (Mobile Only) ─── */}
            {isMenuOpen && (
              <div
                ref={menuRef}
                id="nav-dropdown-panel"
                role="menu"
                aria-label="Extended navigation menu"
                className={`lg:hidden absolute top-[52px] right-0 w-64 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl border transition-all duration-200 z-50 animate-in fade-in slide-in-from-top-2 ${
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

                  {/* Divider line before Register / User Actions */}
                  <div
                    className={`my-1.5 border-t ${
                      isDark ? 'border-white/10' : 'border-slate-100'
                    }`}
                  />

                  {isLoggedIn ? (
                    <>
                      {/* User Profile Header in Mobile Menu */}
                      <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100/70 dark:bg-white/[0.05]">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-white shadow-xs shrink-0 ${
                            isDark
                              ? 'bg-gradient-to-tr from-[#0284C7] to-[#38BDF8]'
                              : 'bg-gradient-to-tr from-[#1E88E5] to-[#42A5F5]'
                          }`}
                        >
                          {userInitial}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-semibold text-slate-800 dark:text-white truncate">
                            {userName}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {user?.email}
                          </span>
                        </div>
                      </div>

                      {/* Account Link */}
                      <Link
                        id="nav-mobile-account-link"
                        to="/account"
                        role="menuitem"
                        onClick={() => setIsMenuOpen(false)}
                        className={`text-[14px] font-medium py-2 px-3.5 rounded-xl transition-colors flex items-center gap-2.5 ${
                          location.pathname === '/account'
                            ? isDark
                              ? 'bg-[#0284C7]/25 text-[#38BDF8] font-semibold'
                              : 'bg-[#D6E6FB] text-[#1E88E5] font-semibold'
                            : isDark
                              ? 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span>Account</span>
                      </Link>

                      {/* Logout Button */}
                      <button
                        id="nav-mobile-logout-btn"
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="text-[14px] font-medium py-2 px-3.5 rounded-xl transition-colors flex items-center gap-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer text-left w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    /* Register action: prominently reachable */
                    <a
                      href="#register"
                      role="menuitem"
                      onClick={() => setIsMenuOpen(false)}
                      className="mt-0.5 text-[14px] font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-[#1E88E5] to-[#1565C0] hover:from-[#1976D2] hover:to-[#0D47A1] text-white shadow-sm hover:shadow active:scale-[0.99]"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Register</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
});

export default SiteNavbar;
