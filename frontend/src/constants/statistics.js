/**
 * STATISTICS PANEL DATA CONSTANTS
 * Source of Truth: forensic_audit.md §2 & §16, design_dna.md §2
 */

export const STATS_DATA = Object.freeze([
  {
    id: 'shipments-delivered',
    iconName: 'Ship',
    number: 1200,
    suffix: '+',
    primaryLabel: 'Shipments Delivered',
    secondaryLabel: 'Across the Globe',
  },
  {
    id: 'global-routes',
    iconName: 'Container',
    number: 850,
    suffix: '+',
    primaryLabel: 'Global Routes',
    secondaryLabel: 'Optimized & Reliable',
  },
  {
    id: 'trusted-clients',
    iconName: 'Users',
    number: 980,
    suffix: '+',
    primaryLabel: 'Trusted Clients',
    secondaryLabel: 'Businesses Worldwide',
  },
  {
    id: 'countries-connected',
    iconName: 'Globe',
    number: 95,
    suffix: '+',
    primaryLabel: 'Countries Connected',
    secondaryLabel: 'One Global Network',
  },
]);
