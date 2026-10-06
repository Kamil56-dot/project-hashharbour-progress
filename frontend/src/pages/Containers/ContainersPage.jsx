import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

/* Lazy-load the heavy 3D container section (Three.js) into its own chunk, initiated on module load */
const containerSectionPromise = import('../../components/home/HomeContainerSection').then(m => ({
  default: m.HomeContainerSection,
}));

const HomeContainerSection = lazy(() => containerSectionPromise);

/**
 * Immediate structured loading skeleton for the container showcase.
 * Paints instantly upon route change using theme tokens and respects reduced motion.
 */
function SectionLoadingFallback() {
  const { isDark } = useTheme();

  return (
    <div
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center"
      style={{ minHeight: 'clamp(360px, 60vh, 700px)' }}
    >
      {/* Eyebrow badge placeholder */}
      <div
        className={`w-40 h-6 rounded-full mb-3 motion-safe:animate-pulse ${
          isDark ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-brand-500/10 border border-brand-200'
        }`}
      />

      {/* Main heading placeholder */}
      <div
        className={`w-64 sm:w-96 h-8 sm:h-10 rounded-lg mb-6 motion-safe:animate-pulse ${
          isDark ? 'bg-white/10' : 'bg-slate-200'
        }`}
      />

      {/* 3D viewer card skeleton frame with centered spinner */}
      <div
        className={`w-full max-w-[960px] aspect-[4/3] sm:aspect-[16/9] rounded-2xl border flex flex-col items-center justify-center gap-3 p-6 ${
          isDark
            ? 'bg-surface-800/40 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
            : 'bg-white/70 border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.06)]'
        }`}
      >
        <div
          className={`w-9 h-9 rounded-full border-2 animate-spin motion-reduce:animate-none ${
            isDark
              ? 'border-cyan-500/20 border-t-cyan-400'
              : 'border-brand-500/20 border-t-brand-600'
          }`}
        />
        <span
          className={`text-xs sm:text-sm font-medium tracking-wide ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Loading 3D Container Showcase...
        </span>
      </div>
    </div>
  );
}

/**
 * ContainersPage — Dedicated page for the 3D rotating container experience.
 * Uses the shared Navbar (not hidden in App.jsx hideSharedNavbar).
 * Same wrapper and navbar offset pattern as ContainerPage.jsx.
 */
export function ContainersPage() {
  const { isDark } = useTheme();
  const [readyToMount, setReadyToMount] = useState(false);

  useEffect(() => {
    // Allow the initial page frame and skeleton to paint first
    const raf = requestAnimationFrame(() => {
      setReadyToMount(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden pt-[78px] lg:pt-[82px] transition-colors duration-300 ${
        isDark ? 'bg-transparent text-white' : 'bg-transparent text-[#0F172A]'
      }`}
    >
      {readyToMount ? (
        <Suspense fallback={<SectionLoadingFallback />}>
          <HomeContainerSection />
        </Suspense>
      ) : (
        <SectionLoadingFallback />
      )}
    </div>
  );
}

export default ContainersPage;

