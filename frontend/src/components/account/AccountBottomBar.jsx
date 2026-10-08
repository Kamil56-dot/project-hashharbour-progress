import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Compass, MoreHorizontal, X, FileText, CreditCard, User, Bell } from 'lucide-react';

export function AccountBottomBar() {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const sheetRef = useRef(null);

  // Close sheet on route change
  useEffect(() => {
    setIsMoreOpen(false);
  }, [location.pathname]);

  // Close sheet on Escape key
  useEffect(() => {
    if (!isMoreOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMoreOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMoreOpen]);

  // More sheet items
  const moreItems = [
    { id: 'documents', label: 'Documents', href: '/account/documents', icon: FileText },
    { id: 'billing', label: 'Billing & Payments', href: '/account/billing', icon: CreditCard },
    { id: 'profile', label: 'Profile Settings', href: '/account/profile', icon: User },
    { id: 'notifications', label: 'Notifications', href: '/account/notifications', icon: Bell },
  ];

  const isMoreActive = moreItems.some((item) => location.pathname.startsWith(item.href));
  const isBookingsActive = location.pathname.startsWith('/account/bookings');
  const isTrackActive = location.pathname.startsWith('/account/track');

  return (
    <>
      {/* ─── FIXED BOTTOM TAB BAR ─── */}
      <nav
        aria-label="Mobile account navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#080E1A]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10 px-2 pt-1.5 pb-[calc(6px+env(safe-area-inset-bottom))] shadow-[0_-4px_25px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Tab 1: Home */}
          <Link
            to="/"
            id="tab-home"
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            <span className="text-[11px] font-medium leading-none">Home</span>
          </Link>

          {/* Tab 2: Bookings */}
          <Link
            to="/account/bookings"
            id="tab-bookings"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              isBookingsActive
                ? 'text-[#1E88E5] dark:text-[#38BDF8] font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Package className="w-5 h-5" aria-hidden="true" />
            <span className="text-[11px] font-medium leading-none">Bookings</span>
          </Link>

          {/* Tab 3: Tracking */}
          <Link
            to="/account/track"
            id="tab-tracking"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              isTrackActive
                ? 'text-[#1E88E5] dark:text-[#38BDF8] font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Compass className="w-5 h-5" aria-hidden="true" />
            <span className="text-[11px] font-medium leading-none">Tracking</span>
          </Link>

          {/* Tab 4: More */}
          <button
            type="button"
            id="tab-more-btn"
            onClick={() => setIsMoreOpen(true)}
            aria-expanded={isMoreOpen}
            aria-haspopup="dialog"
            aria-controls="account-more-sheet"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              isMoreActive || isMoreOpen
                ? 'text-[#1E88E5] dark:text-[#38BDF8] font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
            <span className="text-[11px] font-medium leading-none">More</span>
          </button>
        </div>
      </nav>

      {/* ─── "MORE" BOTTOM SHEET ─── */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            id="more-sheet-backdrop"
            onClick={() => setIsMoreOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Sheet panel */}
          <div
            ref={sheetRef}
            id="account-more-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="More navigation options"
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#0F172A] rounded-t-3xl p-5 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-2xl border-t border-slate-200 dark:border-white/10 animate-in slide-in-from-bottom duration-200"
          >
            {/* Grab handle */}
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-white/5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                More Options
              </h2>
              <button
                type="button"
                id="more-sheet-close-btn"
                onClick={() => setIsMoreOpen(false)}
                aria-label="Close menu"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item list */}
            <div className="flex flex-col gap-1">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    id={`sheet-${item.id}-link`}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl text-[14px] font-medium transition-colors ${
                      isActive
                        ? 'bg-[#E3F2FD] dark:bg-[#0284C7]/20 text-[#1E88E5] dark:text-[#38BDF8] font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#1E88E5] dark:bg-[#38BDF8]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AccountBottomBar;
