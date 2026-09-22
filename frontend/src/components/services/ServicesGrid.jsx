import React from 'react';
import { Container, MapPin, FileText, Route, ShieldCheck } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

/**
 * Services Data List matching target specifications & assigned 3D container colors
 */
const SERVICES_DATA = [
  {
    id: 'container-booking',
    number: '01',
    title: 'Container Booking',
    description:
      'Search availability, compare options and book containers instantly with the best rates.',
    icon: Container,
    colorTheme: 'deep-navy', // 01: Marine Blue #1D3F6E
  },
  {
    id: 'shipment-tracking',
    number: '02',
    title: 'Shipment Tracking',
    description:
      'Track your shipments in real-time across sea, air and land with complete visibility.',
    icon: MapPin,
    colorTheme: 'ocean-blue', // 02: Container Red #8B2500
  },
  {
    id: 'trade-documentation',
    number: '03',
    title: 'Trade Documentation',
    description:
      'Automate documentation, ensure compliance and reduce paperwork across every shipment.',
    icon: FileText,
    colorTheme: 'dark-gray', // 03: Slate Grey #5A5F65
  },
  {
    id: 'route-management',
    number: '04',
    title: 'Route Management',
    description:
      'Optimize routes with smart planning to reduce transit time, costs and operational delays.',
    icon: Route,
    colorTheme: 'navy-blue', // 04: Evergreen Green #2E5939
  },
  {
    id: 'customs-compliance',
    number: '05',
    title: 'Customs & Compliance',
    description:
      'Streamline customs clearance with expert support and up-to-date regulatory compliance.',
    icon: ShieldCheck,
    colorTheme: 'cyan-teal', // 05: Dark Charcoal #2A2A2A
  },
];

/**
 * ServicesGrid Component — Tight Stacked Pyramid Cargo Container Layout
 * Row 1 (2 containers centered): 01 CONTAINER BOOKING | 02 SHIPMENT TRACKING
 * Row 2 (3 containers across):   03 TRADE DOCUMENTATION | 04 ROUTE MANAGEMENT | 05 CUSTOMS & COMPLIANCE
 * Zero vertical gap between rows for authentic stacked shipping container presentation.
 */
export function ServicesGrid() {
  const row1Services = SERVICES_DATA.slice(0, 2);
  const row2Services = SERVICES_DATA.slice(2, 5);

  return (
    <div className="w-full flex flex-col items-center -mt-3 sm:-mt-4 md:-mt-5 lg:-mt-7 xl:-mt-8 mb-4 sm:mb-5 lg:mb-6">
      {/* Row 1 (Top of Pyramid): 2 Containers Centered Tightly Over Bottom Row */}
      <div className="w-full flex flex-col md:flex-row justify-center items-center gap-1.5 sm:gap-2 relative z-20">
        {row1Services.map((service) => (
          <div key={service.id} className="w-full md:w-[calc((100%-1rem)/3)]">
            <ServiceCard
              number={service.number}
              title={service.title}
              description={service.description}
              icon={service.icon}
              colorTheme={service.colorTheme}
            />
          </div>
        ))}
      </div>

      {/* Row 2 (Base of Pyramid): 3 Containers Across Continuous Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-2 w-full relative z-10 -mt-12 sm:-mt-16 md:-mt-18 lg:-mt-20 xl:-mt-22">
        {row2Services.map((service) => (
          <ServiceCard
            key={service.id}
            number={service.number}
            title={service.title}
            description={service.description}
            icon={service.icon}
            colorTheme={service.colorTheme}
          />
        ))}
      </div>
    </div>
  );
}

export default ServicesGrid;
