import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Navbar } from './components/layout/Navbar';
import { useReducedMotion } from './hooks/useReducedMotion';
import { HomePage } from './components/home/HomePage';
import { useTheme } from './context/ThemeContext';

const AboutSection = lazy(() => import('./components/about/AboutSection').then(m => ({ default: m.AboutSection })));
const ServicesSection = lazy(() => import('./components/services').then(m => ({ default: m.ServicesSection })));
const ArchivedHero = lazy(() => import('./components/archived-hero/ArchivedHero').then(m => ({ default: m.ArchivedHero })));
const ContainerPage = lazy(() => import('./pages/ContainerSection/ContainerPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

function PageLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#060B14] flex items-center justify-center text-[#00E5FF]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#00E5FF]/20 border-t-[#00E5FF] animate-spin" />
        <span className="text-[13px] font-medium tracking-wide text-white/70">Loading Section...</span>
      </div>
    </div>
  );
}

/**
 * ScrollToTop helper component ensuring page scroll resets on navigation
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * HASHHARBOUR — APPLICATION ROOT WITH ROUTING ARCHITECTURE
 */
export function App() {
  const navbarRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { pathname } = useLocation();

  const { isLight } = useTheme();

  // Light-theme pages: Home page (HomePage has HomeNavbar) and standalone Login page.
  // All other pages use the shared dark-theme Navbar.
  const isLightPage = pathname === '/' || pathname === '/login';
  const isServicesLight = isLight && pathname === '/services';

  useEffect(() => {
    if (!navbarRef.current) return;

    if (prefersReducedMotion) {
      gsap.set(navbarRef.current, { opacity: 1, y: 0 });
      return;
    }

    // Navbar Entrance Animation
    gsap.fromTo(
      navbarRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [prefersReducedMotion]);

  return (
    <div
      className={
        isLightPage
          ? 'min-h-screen bg-white antialiased'
          : isServicesLight
          ? 'min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text-primary)] antialiased transition-colors duration-200'
          : 'min-h-screen bg-surface-900 text-text-primary antialiased selection:bg-accent-500/25 selection:text-text-primary transition-colors duration-200'
      }
    >
      <ScrollToTop />

      {/* Skip to Main Content Link — Accessibility Infrastructure */}
      <a href="#main-content" className="sr-only-focusable">
        Skip to main content
      </a>

      {/* Shared dark-theme Navbar — hidden on light pages (Home and Login) */}
      {!isLightPage && <Navbar ref={navbarRef} />}

      {/* Main Content Routes */}
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<AboutSection />} />
            <Route path="/services" element={<ServicesSection />} />
            <Route path="/container-section" element={<ContainerPage />} />
            <Route path="/home-preview" element={<ArchivedHero navbarRef={navbarRef} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
