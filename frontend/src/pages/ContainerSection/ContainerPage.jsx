import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContainerShowcase from './components/ContainerShowcase';
import TrackingModal from './components/TrackingModal';
import { useTheme } from '../../context/ThemeContext';

/**
 * ContainerPage — Dedicated 3D Interactive Shipping Container Preview Page
 * Supports dual-theme (Dark / Light) matching the HashHarbour global design system.
 * Handles incoming query params:
 * - ?type=reefer|oil-tank|standard-dry (pre-selects container type specs)
 * - ?action=book (auto-triggers container booking modal)
 */
export function ContainerPage() {
  const { isDark } = useTheme();
  const [searchParams] = useSearchParams();
  const containerType = searchParams.get('type') || '';
  const action = searchParams.get('action') || '';

  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Auto-trigger booking modal when action=book is provided in query params
  useEffect(() => {
    if (action === 'book') {
      setIsTrackingOpen(true);
    }
  }, [action]);

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden pt-[72px] lg:pt-[80px] transition-colors duration-300 ${
        isDark ? 'bg-[#060B14] text-white' : 'bg-[#EBF3FC] text-[#0F172A]'
      }`}
    >
      {/* 3D Interactive Shipping Container Showcase */}
      <ContainerShowcase
        containerType={containerType}
        onBookContainer={() => setIsTrackingOpen(true)}
      />

      {/* Shipment / Container Booking Modal */}
      {isTrackingOpen && (
        <TrackingModal
          isOpen={isTrackingOpen}
          onClose={() => setIsTrackingOpen(false)}
          containerType={containerType}
          action={action}
        />
      )}
    </div>
  );
}

export default ContainerPage;
