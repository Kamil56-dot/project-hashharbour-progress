import React, { Suspense, lazy } from 'react';
import { HomeNavbar } from './HomeNavbar';
import { HomeHero } from './HomeHero';
import { HomeStatsBar } from './HomeStatsBar';
import { useTheme } from '../../context/ThemeContext';

/* Lazy-load the container composite carousel section */
const ContainerCompositeSection = lazy(() =>
  import('../containers/ContainerCompositeSection').then(m => ({ default: m.ContainerCompositeSection }))
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
        isDark ? 'bg-transparent' : 'bg-transparent'
      }`}
      style={{ minHeight: '100dvh' }}
    >
      {/* Hero viewport — on mobile fills 100dvh; on desktop the hero card sizes itself via aspect-ratio */}
      <div className="flex flex-col shrink-0">
        <HomeNavbar />
        <HomeHero />
      </div>

      {/* New content below hero — scrollable */}
      <div className={`relative bg-transparent transition-colors duration-200`}>
        <Suspense fallback={<SectionLoadingFallback />}>
          <ContainerCompositeSection
            className="py-10 lg:py-14 px-4 sm:px-6 lg:px-8 xl:px-12"
            exploreTo="/containers"
          />
        </Suspense>
        <HomeStatsBar />
      </div>
    </div>
  );
}
