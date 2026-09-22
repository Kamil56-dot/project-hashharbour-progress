import React, { useState } from 'react';
import { Logo } from './Logo';
import { NavLinks } from './NavLinks';
import { NavActions } from './NavActions';
import { MobileMenu } from './MobileMenu';
import { useScrollPosition } from '../../hooks/useScrollPosition';

/**
 * HASHHARBOUR — PIXEL-PRECISION NAVBAR COMPONENT (FULL VIEWPORT CORRECTION)
 * Source of Truth: Reference Image & User Refinement Specifications
 *
 * Layout Architecture:
 * - Outer: 100% width full viewport, height 72px, fixed top-0 left-0 right-0 z-30
 * - 3-Region Grid: grid-template-columns: 1fr auto 1fr
 * - Left (justify-self: start): Logo anchored near left edge (pl-[40px])
 * - Center (justify-self: center): Navigation links mathematically centered in viewport
 * - Right (justify-self: end): Utility actions anchored near right edge (pr-[36px])
 * - Full-width bottom divider: 100% width, 1px height, rgba(255,255,255,0.06)
 */
export const Navbar = React.forwardRef(function Navbar({ className = '' }, ref) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollY = useScrollPosition();

  const isScrolled = scrollY > 20;

  const handleMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header
        ref={ref}
        id="main-header"
        className={`fixed top-0 left-0 right-0 w-full h-[84px] lg:h-[96px] z-[30] transition-all duration-300 ease-smooth backdrop-blur-md ${isScrolled
          ? 'bg-black/30'
          : 'bg-black/20'
          } ${className}`}
      >
        {/* 3-Region Grid spanning 100% viewport width with 42px desktop padding */}
        <div className="w-full h-full px-6 sm:px-10 lg:px-[42px] grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center">
          {/* Left Region: Logo (justify-self: start) */}
          <div className="justify-self-start">
            <Logo />
          </div>

          {/* Center Region: Nav Links (justify-self: center, mathematically centered in viewport) */}
          <div className="justify-self-center hidden lg:block">
            <NavLinks />
          </div>

          {/* Right Region: Utility & Auth Actions (justify-self: end) */}
          <div className="justify-self-end">
            <NavActions
              onMenuToggle={handleMenuToggle}
              isMenuOpen={isMobileMenuOpen}
            />
          </div>
        </div>

        {/* Inset Bottom Divider Line — aligned with content padding, clear edges */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-6 sm:left-10 lg:left-[42px] right-6 sm:right-10 lg:right-[42px] h-[1px] bg-white/60 pointer-events-none"
        />
      </header>

      {/* Mobile Drawer Overlay for < 1024px */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
});

export default Navbar;
