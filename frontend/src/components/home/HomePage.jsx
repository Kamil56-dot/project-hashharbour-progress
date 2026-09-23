import React, { Suspense, lazy } from 'react';
import { HomeNavbar } from './HomeNavbar';
import { HomeHero } from './HomeHero';
import { HomeStatsBar } from './HomeStatsBar';

/* Lazy-load the heavy 3D container section (Three.js) into its own chunk */
const HomeContainerSection = lazy(() =>
  import('./HomeContainerSection').then(m => ({ default: m.HomeContainerSection }))
);

function SectionLoadingFallback() {
  return (
    <div
      className="w-full flex items-center justify-center bg-white"
      style={{ minHeight: 'clamp(320px, 50vh, 600px)' }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-gray-900 animate-spin" />
        <span className="text-sm font-medium text-gray-400 tracking-wide">
          Loading Container Showcase...
        </span>
      </div>
    </div>
  );
}

/**
 * Home Page — Main light-theme entry page mounted at route "/".
 * Layout: navbar + hero card (21:9 aspect-ratio on desktop, 100dvh on mobile),
 * then additional sections scroll naturally below.
 */
export function HomePage() {
  return (
    <div className="flex flex-col overflow-x-hidden bg-white" style={{ minHeight: '100dvh' }}>
      {/* Hero viewport — on mobile fills 100dvh; on desktop the hero card sizes itself via aspect-ratio */}
      <div
        className="flex flex-col shrink-0"
      >
        <HomeNavbar />
        <HomeHero />
      </div>

      {/* New content below hero — scrollable */}
      <div className="relative bg-white">
        <Suspense fallback={<SectionLoadingFallback />}>
          <HomeContainerSection />
        </Suspense>
        <HomeStatsBar />
      </div>
    </div>
  );
}
