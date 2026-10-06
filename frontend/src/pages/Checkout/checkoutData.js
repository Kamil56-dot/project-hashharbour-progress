import standardDryImg from '../../assets/containers/file_0000000078608211a9fcda6d20986d14.png';
import oilTankImg from '../../assets/containers/oil-tank.png';
import reeferImg from '../../assets/containers/reefer container.png';

/**
 * HASHHARBOUR CHECKOUT DATA CONSTANTS
 * Catalog definitions matching TrackingModal CONTAINER_TYPE_MAP and DB catalog.
 */
export const CONTAINER_CATALOG = {
  'standard-dry': {
    id: 'standard-dry',
    title: '20ft Standard Container',
    pill: 'Dry Container',
    price: 1450,
    image: standardDryImg,
    alt: '20ft Standard Dry Container',
    length: '6.058 m',
    width: '2.438 m',
    height: '2.591 m',
    includesTitle: 'Standard 20ft Container',
  },
  'oil-tank': {
    id: 'oil-tank',
    title: '20ft Oil/Tank Container',
    pill: 'Liquid Container',
    price: 3100,
    image: oilTankImg,
    alt: '20ft Oil / Tank Container',
    length: '6.058 m',
    width: '2.438 m',
    height: '2.591 m',
    includesTitle: 'Oil/Tank 20ft Container',
  },
  'reefer': {
    id: 'reefer',
    title: '20ft Reefer Container',
    pill: 'Refrigerated Container',
    price: 3200,
    image: reeferImg,
    alt: '20ft Reefer Container',
    length: '6.058 m',
    width: '2.438 m',
    height: '2.591 m',
    includesTitle: 'Reefer 20ft Container',
  },
};

export const DEFAULT_CONTAINER_TYPE = 'standard-dry';

export const SHIPPING_DEMO = {
  from: 'Dubai, UAE',
  to: 'Shanghai, China',
  transitTime: '10 - 12 Days',
  includes: [
    'Port Handling Charges',
    'Documentation Support',
    'Real-time Tracking',
  ],
};

export const FEES_DEMO = {
  portHandling: 320,
  documentationFee: 80,
  insurance: 45,
};

export const DEFAULT_BILLING_ADDRESS = {
  fullName: 'John Wilson',
  address: 'Una',
  city: 'Una',
  state: 'Gujarat',
  country: 'India',
  postalCode: '362560',
};

/**
 * Format currency with thousands separator: e.g. $1,450
 */
export function formatCurrency(amount) {
  const num = typeof amount === 'number' ? amount : Number(amount) || 0;
  return `$${num.toLocaleString('en-US')}`;
}

/**
 * Retrieve catalog metadata for a container type.
 * Missing or invalid type falls back to standard-dry.
 */
export function getContainerData(type) {
  if (type && typeof type === 'string' && CONTAINER_CATALOG[type.toLowerCase()]) {
    return CONTAINER_CATALOG[type.toLowerCase()];
  }
  return CONTAINER_CATALOG[DEFAULT_CONTAINER_TYPE];
}
