import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { SiteNavbar } from './components/layout/SiteNavbar';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useReducedMotion } from './hooks/useReducedMotion';
import { HomePage } from './components/home/HomePage';
import { useTheme } from './context/ThemeContext';

const AboutSection = lazy(() => import('./components/about/AboutSection').then(m => ({ default: m.AboutSection })));
const ServicesSection = lazy(() => import('./components/services/ServicesSection').then(m => ({ default: m.ServicesSection })));
const ArchivedHero = lazy(() => import('./components/archived-hero/ArchivedHero').then(m => ({ default: m.ArchivedHero })));
const ContainerPreviewPage = lazy(() => import('./pages/ContainerPreview/ContainerPreviewPage'));
const ContainerCompositePreviewPage = lazy(() => import('./pages/ContainerCompositePreview/ContainerCompositePreviewPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ContainersPage = lazy(() => import('./pages/Containers/ContainersPage'));
const AccountLayout = lazy(() => import('./pages/account/AccountLayout'));
const MyBookingsPage = lazy(() => import('./pages/account/AccountPages').then(m => ({ default: m.MyBookingsPage })));
const TrackShipmentPage = lazy(() => import('./pages/account/AccountPages').then(m => ({ default: m.TrackShipmentPage })));
const DocumentsPage = lazy(() => import('./pages/account/AccountPages').then(m => ({ default: m.DocumentsPage })));
const ProfilePage = lazy(() => import('./pages/account/AccountPages').then(m => ({ default: m.ProfilePage })));
const NotificationsPage = lazy(() => import('./pages/account/AccountPages').then(m => ({ default: m.NotificationsPage })));
const CheckoutPage = lazy(() => import('./pages/Checkout/CheckoutPage'));

function PageLoadingFallback() {
  const { isLight } = useTheme();
  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        isLight ? 'bg-transparent text-brand-600' : 'bg-transparent text-[#00E5FF]'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full border-2 animate-spin ${
            isLight ? 'border-brand-500/20 border-t-brand-600' : 'border-[#00E5FF]/20 border-t-[#00E5FF]'
          }`}
        />
        <span
          className={`text-[13px] font-medium tracking-wide ${
            isLight ? 'text-slate-600' : 'text-white/70'
          }`}
        >
          Loading Section...
        </span>
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

  const { isLight, isDark } = useTheme();

  // Auth pages (/login, /register) are unconditionally light surfaces (no dark variant).
  // Home page participates in the theme system (dark default, light toggle).
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Force light global background on auth pages (no dark overlay)
  useEffect(() => {
    if (isAuthPage) {
      document.body.setAttribute('data-route', 'login');
    } else {
      document.body.removeAttribute('data-route');
    }
    return () => {
      document.body.removeAttribute('data-route');
    };
  }, [isAuthPage]);

  // SiteNavbar is shown on all routes except auth pages.
  const hideSharedNavbar = isAuthPage;

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

  /**
   * Universal wrapper class logic:
   * Driven strictly by the global ThemeContext:
   * - Auth pages: always clean bg (dedicated auth surface)
   * - Light theme: theme background (--theme-bg) & theme primary text
   * - Dark theme: dark surface background & primary text
   */
  const getWrapperClass = () => {
    if (isAuthPage) {
      return 'min-h-screen bg-transparent antialiased';
    }
    if (isLight) {
      return 'min-h-screen bg-transparent text-[var(--theme-text-primary)] antialiased transition-colors duration-200';
    }
    return 'min-h-screen bg-transparent text-text-primary antialiased selection:bg-accent-500/25 selection:text-text-primary transition-colors duration-200';
  };

  return (
    <div className={getWrapperClass()}>
      <ScrollToTop />

      {/* Skip to Main Content Link — Accessibility Infrastructure */}
      <a href="#main-content" className="sr-only-focusable">
        Skip to main content
      </a>

      {/* Unified SiteNavbar — shown on all routes except auth pages */}
      {!hideSharedNavbar && <SiteNavbar ref={navbarRef} />}

      {/* Main Content Routes */}
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutSection />} />
            <Route path="/services" element={<ServicesSection />} />
            <Route path="/container-section" element={<Navigate to="/containers" replace />} />
            <Route path="/container_section" element={<Navigate to="/containers" replace />} />
            <Route path="/container-preview" element={<ContainerPreviewPage />} />
            <Route path="/container-composite-preview" element={<ContainerCompositePreviewPage />} />
            <Route path="/home-preview" element={<ArchivedHero navbarRef={navbarRef} />} />
            <Route path="/containers" element={<ContainersPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="bookings" replace />} />
              <Route path="bookings" element={<MyBookingsPage />} />
              <Route path="track" element={<TrackShipmentPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="*" element={<Navigate to="bookings" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
