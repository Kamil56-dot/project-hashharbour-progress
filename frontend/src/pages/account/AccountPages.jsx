import React from 'react';
import { AccountPageHeader } from '../../components/account/AccountPageHeader';
import { ACCOUNT_NAV_ITEMS } from './accountNavConfig';

function createPlaceholderPage(itemKey) {
  const config = ACCOUNT_NAV_ITEMS.find((item) => item.id === itemKey) || {
    title: 'Account',
    subtitle: 'Manage your account',
  };
  const Icon = config.icon;

  const PageComponent = () => {
    return (
      <div>
        <AccountPageHeader title={config.title} subtitle={config.subtitle} />

        {/* Empty Placeholder Card Body */}
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] p-8 sm:p-14 text-center transition-colors">
          <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-blue-50 dark:bg-white/[0.05] text-[#1E88E5] dark:text-[#38BDF8] flex items-center justify-center shadow-xs">
            {Icon && <Icon className="w-7 h-7 stroke-[1.9]" aria-hidden="true" />}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            {config.title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {config.title} — coming soon.
          </p>
        </div>
      </div>
    );
  };

  PageComponent.displayName = `${config.id}Page`;
  return PageComponent;
}

export const MyBookingsPage = createPlaceholderPage('bookings');
export const TrackShipmentPage = createPlaceholderPage('track');
export const DocumentsPage = createPlaceholderPage('documents');
export const BillingPage = createPlaceholderPage('billing');
export const ProfilePage = createPlaceholderPage('profile');
export const NotificationsPage = createPlaceholderPage('notifications');
