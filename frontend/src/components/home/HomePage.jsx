import React, { Suspense, lazy } from 'react';
import { HomeNavbar } from './HomeNavbar';
import { HomeHero } from './HomeHero';
import { HomeStatsBar } from './HomeStatsBar';
import { useTheme } from '../../context/ThemeContext';

/* Lazy-load the heavy 3D container section (Three.js) into its own chunk */
const HomeContainerSection = lazy(() =>
  import('./HomeContainerSection').then(m => ({ default: m.HomeContainerSection }))
);

function SectionLoadingFallback() {
  const { isDark } = useTheme();

  return (
    <div
      className={`w-full flex items-center justify-center ${
        isDark ? 'bg-surface-900' : 'bg-white'
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
 * Home Page — Main entry page mounted at route "/".
 * Supports dark (default) and light themes via ThemeContext.
 * Layout: navbar + hero card (21:9 aspect-ratio on desktop, 100dvh on mobile),
 * then additional sections scroll naturally below.
 */
export function HomePage() {
  const { isDark } = useTheme();

  return (
    <div
      className={`flex flex-col overflow-x-hidden transition-colors duration-200 ${
        isDark ? 'bg-surface-900' : 'bg-white'
      }`}
      style={{ minHeight: '100dvh' }}
    >
      {/* Hero viewport — on mobile fills 100dvh; on desktop the hero card sizes itself via aspect-ratio */}
      <div className="flex flex-col shrink-0">
        <HomeNavbar />
        <HomeHero />
      </div>

      {/* New content below hero — scrollable */}
      <div className={`relative ${isDark ? 'bg-surface-900' : 'bg-white'} transition-colors duration-200`}>
        <Suspense fallback={<SectionLoadingFallback />}>
          <HomeContainerSection />
        </Suspense>
        <HomeStatsBar />
      </div>
    </div>
  );
}
