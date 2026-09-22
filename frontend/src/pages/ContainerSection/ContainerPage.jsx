import React, { useState } from 'react';
import ContainerShowcase from './components/ContainerShowcase';
import TrackingModal from './components/TrackingModal';

/**
 * ContainerPage — Dedicated 3D Interactive Shipping Container Preview Page
 */
export function ContainerPage() {
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060B14] text-white w-full overflow-x-hidden pt-[72px] lg:pt-[80px]">
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
