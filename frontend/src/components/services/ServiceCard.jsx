import React from 'react';
import { cn } from '../../utils/cn';
import StaticServiceContainer from './StaticServiceContainer';

/**
 * ServiceCard Component — Pure 3D Corten Steel Container Render
 * Expanded visual footprint for near-full-viewport width presentation.
 * All text (ISO badge, service number, service name, description) is stencil-printed
 * directly onto the 3D container mesh surface.
 */
export function ServiceCard({
  number,
  title,
  description,
  colorTheme = 'deep-navy',
  href = '#',
  className = '',
}) {
  // Hex color mapping matching HomeContainerViewer COLOR_PRESETS
  const COLOR_MAP = {
    'deep-navy': '#1D3F6E',    // 01 Container Booking: Marine Blue
    'ocean-blue': '#8B2500',   // 02 Shipment Tracking: Container Red
    'dark-gray': '#5A5F65',    // 03 Trade Documentation: Slate Grey
    'navy-blue': '#2E5939',    // 04 Route Management: Evergreen Green
    'cyan-teal': '#2A2A2A',    // 05 Customs & Compliance: Dark Charcoal
  };

  const containerColor = COLOR_MAP[colorTheme] || '#1D3F6E';

  return (
    <a
      href={href}
      className={cn(
        'relative group block w-full transition-all duration-300 hover:-translate-y-1 select-none flex items-center justify-center',
        className
      )}
    >
      {/* ── DIRECT LIVE 3D CONTAINER WEBGL CANVAS RENDER (TIGHT EXPANDED FOOTPRINT) ── */}
      <div className="w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-[320px] xl:h-[360px] relative flex items-center justify-center pointer-events-none z-10 overflow-hidden">
        <StaticServiceContainer
          color={containerColor}
          serviceNumber={number}
          serviceName={title}
          serviceDescription={description}
          className="w-full h-full"
        />
      </div>
    </a>
  );
}

export default ServiceCard;
