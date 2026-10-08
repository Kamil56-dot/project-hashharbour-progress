import { Package, CreditCard, User, Bell } from 'lucide-react';

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
    id: 'billing',
    label: 'Billing & Payments',
    href: '/account/billing',
    path: 'billing',
    title: 'Billing & Payments',
    subtitle: 'View invoices and payment history.',
    icon: CreditCard,
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
