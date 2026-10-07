import React from 'react';

export function AccountPlaceholder() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-24 px-4">
      <div
        id="account-coming-soon"
        className="max-w-md w-full rounded-2xl p-8 text-center bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-lg"
      >
        <h2 className="text-xl font-bold mb-2">Account</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Account — coming soon.</p>
      </div>
    </div>
  );
}

export default AccountPlaceholder;
