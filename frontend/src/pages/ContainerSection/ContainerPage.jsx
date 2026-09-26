import React, { useState } from 'react';
import ContainerShowcase from './components/ContainerShowcase';
import TrackingModal from './components/TrackingModal';
import { useTheme } from '../../context/ThemeContext';

/**
 * ContainerPage — Dedicated 3D Interactive Shipping Container Preview Page
 * Supports dual-theme (Dark / Light) matching the HashHarbour global design system.
 */
export function ContainerPage() {
  const { isDark } = useTheme();
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden pt-[72px] lg:pt-[80px] transition-colors duration-300 ${
        isDark ? 'bg-[#060B14] text-white' : 'bg-[#EBF3FC] text-[#0F172A]'
      }`}
    >
      {/* 3D Interactive Shipping Container Showcase */}
      <ContainerShowcase onBookContainer={() => setIsTrackingOpen(true)} />

      {/* Shipment / Container Booking Modal */}
      {isTrackingOpen && (
        <TrackingModal isOpen={isTrackingOpen} onClose={() => setIsTrackingOpen(false)} />
      )}
    </div>
  );
}

export default ContainerPage;
