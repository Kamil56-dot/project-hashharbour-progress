import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';
import { AccountPageHeader } from '../../components/account/AccountPageHeader';
import { ACCOUNT_NAV_ITEMS } from './accountNavConfig';
import { useNotifications } from '../../context/NotificationsContext';
import { authFetch } from '../../lib/authFetch';

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const parsed = new Date(dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T'));
  if (isNaN(parsed.getTime())) return dateStr;
  const now = new Date();
  const diffMs = now.getTime() - parsed.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} d ago`;
  return parsed.toLocaleDateString();
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const { unreadCount, setUnreadCount } = useNotifications();

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const navConfig = ACCOUNT_NAV_ITEMS.find((item) => item.id === 'notifications') || {
    title: 'Notifications',
    subtitle: 'Stay up to date with your shipments and bookings.',
  };

  const loadNotifications = useCallback(async () => {
    try {
      setError(null);
      const res = await authFetch('/api/notifications/');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `Failed to load notifications (${res.status})`);
      }
      setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
      if (typeof data?.unread_count === 'number') {
        setUnreadCount(data.unread_count);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError(err.message || 'Unable to load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, [setUnreadCount]);

  useEffect(() => {
    loadNotifications();

    const intervalId = setInterval(() => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        loadNotifications();
      }
    }, 30000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadNotifications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [loadNotifications]);

  const handleItemClick = async (item) => {
    if (item.is_read === 0) {
      try {
        const res = await authFetch(`/api/notifications/${item.id}/read`, {
          method: 'PATCH',
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, is_read: 1 } : n))
          );
          if (typeof data?.unread_count === 'number') {
            setUnreadCount(data.unread_count);
          } else {
            setUnreadCount((c) => Math.max(0, c - 1));
          }
        }
      } catch (err) {
        console.error('Failed to mark notification read:', err);
      }
    }

    if (item.booking_id) {
      navigate(`/account/bookings?booking=${item.booking_id}`);
    }
  };

  const handleMarkAllRead = async () => {
    if (isMarkingAll) return;
    setIsMarkingAll(true);
    try {
      const res = await authFetch('/api/notifications/mark-all-read', {
        method: 'POST',
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
        <div className="flex-1 min-w-0">
          <AccountPageHeader title={navConfig.title} subtitle={navConfig.subtitle} />
        </div>
        {unreadCount > 0 && (
          <div className="sm:mt-8 shrink-0">
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={isMarkingAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-white/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{isMarkingAll ? 'Marking...' : 'Mark all as read'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/10 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-slate-200 dark:bg-white/10 rounded" />
                <div className="h-3 w-3/4 bg-slate-200 dark:bg-white/10 rounded" />
                <div className="h-2.5 w-24 bg-slate-200 dark:bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/10 p-8 text-center">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <p className="text-sm text-rose-700 dark:text-rose-300 font-medium mb-3">
            {error}
          </p>
          <button
            type="button"
            onClick={loadNotifications}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && notifications.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] p-8 sm:p-14 text-center transition-colors">
          <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-blue-50 dark:bg-white/[0.05] text-[#1E88E5] dark:text-[#38BDF8] flex items-center justify-center shadow-xs">
            <Bell className="w-7 h-7 stroke-[1.9]" aria-hidden="true" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            No notifications yet.
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            You will receive updates here when bookings are created or their statuses change.
          </p>
        </div>
      )}

      {/* Notifications List */}
      {!isLoading && !error && notifications.length > 0 && (
        <div className="space-y-2.5">
          {notifications.map((item) => {
            const isUnread = item.is_read === 0;
            const hasBooking = Boolean(item.booking_id);

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isUnread
                    ? 'bg-blue-50/50 dark:bg-blue-500/[0.08] border-blue-200/90 dark:border-blue-500/25 shadow-xs'
                    : 'bg-white/70 dark:bg-white/[0.02] border-slate-200/70 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isUnread
                        ? 'bg-blue-100/80 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap sm:flex-nowrap">
                      <div className="flex items-center gap-2 min-w-0">
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                        )}
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h2>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
                        {formatRelativeTime(item.created_at)}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed break-words">
                      {item.message}
                    </p>

                    {hasBooking && (
                      <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                        <span>View booking details</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
