import React, { Suspense, lazy } from 'react';
import { useTheme } from '../../context/ThemeContext';

/* Lazy-load the heavy 3D container section (Three.js) into its own chunk */
const HomeContainerSection = lazy(() =>
  import('../../components/home/HomeContainerSection').then(m => ({ default: m.HomeContainerSection }))
);

function SectionLoadingFallback() {
  const { isDark } = useTheme();

  return (
    <div
      className={`w-full flex items-center justify-center ${
        isDark ? 'bg-transparent' : 'bg-transparent'
      }`}
      style={{ minHeight: 'clamp(320px, 50vh, 600px)' }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full border-2 animate-spin ${
            isDark
              ? 'border-cyan-500/20 border-t-cyan-400'
              : 'border-gray-300 border-t-gray-900'
          }`}
        />
        <span
          className={`text-sm font-medium tracking-wide ${
            isDark ? 'text-slate-400' : 'text-gray-400'
          }`}
        >
          Loading Container Showcase...
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

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden pt-[78px] lg:pt-[82px] transition-colors duration-300 ${
        isDark ? 'bg-transparent text-white' : 'bg-transparent text-[#0F172A]'
      }`}
    >
      <Suspense fallback={<SectionLoadingFallback />}>
        <HomeContainerSection />
      </Suspense>
    </div>
  );
}

export default ContainersPage;
