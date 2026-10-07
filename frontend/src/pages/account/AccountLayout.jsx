import React from 'react';
import { Outlet } from 'react-router-dom';
import { AccountSidebar } from '../../components/account/AccountSidebar';
import { AccountBottomBar } from '../../components/account/AccountBottomBar';

// Real SiteNavbar rendered height is 74px (fixed header)
// Top offset provides a consistent 20-24px clear margin below navbar
const NAVBAR_HEIGHT_PX = 74;

export function AccountLayout() {
  return (
    <div
      style={{ '--navbar-height': `${NAVBAR_HEIGHT_PX}px` }}
      className="min-h-screen pt-[calc(var(--navbar-height)+1.25rem)] lg:pt-[calc(var(--navbar-height)+1.5rem)] pb-28 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-[1440px] mx-auto transition-colors duration-200"
    >
      <div className="flex gap-5 lg:gap-7 items-start">
        {/* Left Sidebar (Desktop & Tablet) */}
        <AccountSidebar />

        {/* Right Main Content Frame */}
        <section
          id="account-main-content"
          aria-label="Account page content"
          className="flex-1 min-w-0 bg-white/85 dark:bg-[#0F172A]/80 backdrop-blur-md rounded-3xl p-5 sm:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-slate-200/70 dark:border-white/10 transition-colors"
        >
          <Outlet />
        </section>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <AccountBottomBar />
    </div>
  );
}

export default AccountLayout;
