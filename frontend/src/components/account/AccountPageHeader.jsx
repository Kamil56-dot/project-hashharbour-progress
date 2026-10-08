import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function AccountPageHeader({ title, subtitle }) {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Breadcrumb: Home > <Page> */}
      <nav aria-label="Breadcrumb" className="flex items-center text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-3 sm:mb-4">
        <Link
          to="/"
          className="hover:text-[#1E88E5] dark:hover:text-[#38BDF8] transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 rounded"
        >
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 dark:text-slate-500 shrink-0" aria-hidden="true" />
        <span className="text-[#1E88E5] dark:text-[#38BDF8] font-semibold" aria-current="page">
          {title}
        </span>
      </nav>

      {/* Main Page Title & Subtitle */}
      <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p id="account-page-subtitle" className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl mt-1.5 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default AccountPageHeader;
