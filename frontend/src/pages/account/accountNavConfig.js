import { Package, User, Bell, BarChart3 } from 'lucide-react';

export const ACCOUNT_NAV_ITEMS = [
  {
    id: 'bookings',
    label: 'My Bookings',
    href: '/account/bookings',
    path: 'bookings',
    title: 'My Bookings',
    subtitle: 'View and manage your booked containers, track shipments, and access all related documents.',
    icon: Package,
  },
  {
    id: 'booking-totals',
    label: 'Booking Totals',
    href: '/account/booking-totals',
    path: 'booking-totals',
    title: 'Booking Totals',
    subtitle: 'Aggregated volume and total booking value by reservation status.',
    icon: BarChart3,
    staffOnly: true,
  },
  {
    id: 'profile',
    label: 'Profile Settings',
    href: '/account/profile',
    path: 'profile',
    title: 'Profile Settings',
    subtitle: 'Manage your account details and preferences.',
    icon: User,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/account/notifications',
    path: 'notifications',
    title: 'Notifications',
    subtitle: 'Stay up to date with your shipments and bookings.',
    icon: Bell,
  },
];
