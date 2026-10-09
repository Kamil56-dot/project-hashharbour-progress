import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HelpCircle, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ACCOUNT_NAV_ITEMS } from '../../pages/account/accountNavConfig';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import { isStaff } from '../../lib/roles';

export function AccountSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const userIsStaff = isStaff(user);

  // Desktop (>=1024px): always expanded (260px)
  // Tablet (768px - 1023px): collapsed rail (78px) by default
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const desktopMql = window.matchMedia('(min-width: 1024px)');
    const tabletMql = window.matchMedia('(min-width: 768px) and (max-width: 1023.98px)');

    const handleDesktopChange = (e) => {
      if (e.matches) {
        // Crossed into desktop: always expanded
        setIsCollapsed(false);
      }
    };

    const handleTabletChange = (e) => {
      if (e.matches) {
        // Crossed into tablet: default collapsed rail
        setIsCollapsed(true);
      }
    };

    if (desktopMql.addEventListener) {
      desktopMql.addEventListener('change', handleDesktopChange);
      tabletMql.addEventListener('change', handleTabletChange);
    } else {
      desktopMql.addListener(handleDesktopChange);
      tabletMql.addListener(handleTabletChange);
    }

    return () => {
      if (desktopMql.removeEventListener) {
        desktopMql.removeEventListener('change', handleDesktopChange);
        tabletMql.removeEventListener('change', handleTabletChange);
      } else {
        desktopMql.removeListener(handleDesktopChange);
        tabletMql.removeListener(handleTabletChange);
      }
    };
  }, []);

  return (
    <aside
      aria-label="Account sidebar"
      className={`hidden md:flex flex-col justify-between shrink-0 transition-all duration-300 sticky top-[calc(var(--navbar-height,74px)+1.25rem)] h-[calc(100vh-120px)] min-h-[580px] bg-white/90 dark:bg-[#0F172A]/85 backdrop-blur-md rounded-3xl p-3.5 sm:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-slate-200/70 dark:border-white/10 ${
        isCollapsed ? 'w-[78px]' : 'w-[260px]'
      }`}
    >
      <div className="flex flex-col gap-1">
        {/* Tablet collapse toggle button (visible on md to lg) */}
        <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100 dark:border-white/5 lg:hidden">
          {!isCollapsed && (
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 pl-2">
              Menu
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 mx-auto rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav aria-label="Account navigation" className="flex flex-col gap-1">
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isHome = Boolean(item.isHome);
            const isActive = !isHome && (
              location.pathname === item.href ||
              (item.path && location.pathname.startsWith(`/account/${item.path}`))
            );
            const label = item.id === 'bookings' && userIsStaff ? 'All Bookings' : item.label;

            return (
              <Link
                key={item.id}
                to={item.href}
                title={isCollapsed ? label : undefined}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-3 py-2.5 px-3.5 rounded-2xl text-[14px] font-medium transition-all duration-200 select-none focus-visible:outline-2 focus-visible:outline-blue-500 ${
                  isActive
                    ? 'bg-[#E3F2FD] dark:bg-[#0284C7]/20 text-[#1E88E5] dark:text-[#38BDF8] font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.05]'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <div className="relative shrink-0 flex items-center justify-center">
                  <Icon
                    className={`w-[18px] h-[18px] transition-colors ${
                      isActive ? 'text-[#1E88E5] dark:text-[#38BDF8]' : 'text-slate-500 dark:text-slate-400'
                    }`}
                    aria-hidden="true"
                  />
                  {item.id === 'notifications' && unreadCount > 0 && isCollapsed && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1E88E5] dark:bg-[#38BDF8]" />
                  )}
                </div>
                {!isCollapsed && (
                  <>
                    <span className="truncate">{label}</span>
                    {item.id === 'notifications' && unreadCount > 0 && (
                      <span className="ml-auto px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-[#1E88E5] text-white dark:bg-[#38BDF8] dark:text-[#0F172A] leading-none">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Need Help Card at Bottom */}
      <div className="mt-auto pt-4">
        {isCollapsed ? (
          <div
            title="Need Help? Contact support"
            className="w-10 h-10 mx-auto rounded-2xl bg-blue-50 dark:bg-white/[0.05] text-[#1E88E5] dark:text-[#38BDF8] flex items-center justify-center cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" />
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-[#F0F7FF] dark:bg-white/[0.04] border border-blue-100/80 dark:border-white/5 transition-colors">
            <div className="flex items-start gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#E3F2FD] dark:bg-[#0284C7]/20 flex items-center justify-center text-[#1E88E5] dark:text-[#38BDF8] shrink-0 shadow-xs">
                <HelpCircle className="w-4 h-4 stroke-[2]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  Need Help?
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Our support team is here for you 24/7.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                // Placeholder non-functional support button
              }}
              className="text-[#1E88E5] dark:text-[#38BDF8] text-[12px] font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 rounded"
              aria-label="Contact Support (placeholder)"
            >
              <span>Contact Support</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default AccountSidebar;
