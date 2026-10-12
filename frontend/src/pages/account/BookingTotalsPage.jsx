import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  Package,
  Ship,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { authFetch } from '../../lib/authFetch';
import { useAuth } from '../../context/AuthContext';
import { isStaff } from '../../lib/roles';
import { AccountPageHeader } from '../../components/account/AccountPageHeader';

const STATUS_CARDS = [
  {
    key: 'pending',
    label: 'Pending',
    icon: Clock,
    cardBg:
      'bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-orange-500/15 dark:from-amber-500/25 dark:via-amber-500/10 dark:to-orange-500/20 border-amber-200/90 dark:border-amber-500/30',
    iconBg: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    icon: Package,
    cardBg:
      'bg-gradient-to-br from-blue-500/15 via-cyan-500/5 to-sky-500/15 dark:from-blue-500/25 dark:via-cyan-500/10 dark:to-sky-500/20 border-blue-200/90 dark:border-blue-500/30',
    iconBg: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
  },
  {
    key: 'in_transit',
    label: 'In Transit',
    icon: Ship,
    cardBg:
      'bg-gradient-to-br from-indigo-500/15 via-violet-500/5 to-purple-500/15 dark:from-indigo-500/25 dark:via-violet-500/10 dark:to-purple-500/20 border-indigo-200/90 dark:border-indigo-500/30',
    iconBg: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    cardBg:
      'bg-gradient-to-br from-emerald-500/15 via-green-500/5 to-teal-500/15 dark:from-emerald-500/25 dark:via-green-500/10 dark:to-teal-500/20 border-emerald-200/90 dark:border-emerald-500/30',
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  },
  {
    key: 'cancelled',
    label: 'Cancelled (not counted)',
    icon: AlertCircle,
    cardBg:
      'bg-gradient-to-br from-rose-500/15 via-red-500/5 to-pink-500/15 dark:from-rose-500/25 dark:via-red-500/10 dark:to-pink-500/20 border-rose-200/90 dark:border-rose-500/30',
    iconBg: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300',
    note: 'Not counted as active revenue',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function BookingTotalsPage() {
  const { user } = useAuth();
  const [totals, setTotals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userIsStaff = isStaff(user);

  const fetchTotals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authFetch('/api/bookings/totals/');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Failed to fetch booking totals (${response.status})`);
      }

      setTotals(data && typeof data === 'object' ? data : {});
    } catch (err) {
      console.error('Fetch booking totals error:', err);
      setError(err.message || 'Unable to load booking totals.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userIsStaff) {
      fetchTotals();
    }
  }, [userIsStaff, fetchTotals]);

  // If user is not staff, render nothing sensitive
  if (!userIsStaff) {
    return null;
  }

  return (
    <div className="space-y-6">
      <AccountPageHeader
        title="Booking Totals"
        subtitle="Aggregated volume and total booking value by reservation status."
      />

      {/* ─── ERROR STATE ─── */}
      {error && (
        <div className="rounded-2xl p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">
            <p className="font-semibold">Failed to load booking totals</p>
            <p className="text-xs mt-0.5 opacity-90">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchTotals}
            className="text-xs font-bold underline hover:no-underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* ─── LOADING SKELETON ─── */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="p-5 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-[#0F172A]/70 border border-slate-200/60 dark:border-white/5 animate-pulse flex flex-col justify-between h-40"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-white/[0.05]" />
                <div className="space-y-2 flex-1">
                  <div className="w-24 h-4 bg-slate-200 dark:bg-white/[0.05] rounded-md" />
                  <div className="w-16 h-3 bg-slate-200 dark:bg-white/[0.05] rounded-md" />
                </div>
              </div>
              <div className="w-32 h-8 bg-slate-200 dark:bg-white/[0.05] rounded-md mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* ─── TOTALS CARDS GRID ─── */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {STATUS_CARDS.map((card) => {
            const Icon = card.icon;
            const data = totals?.[card.key] || { count: 0, amount: 0 };
            const count = Number(data.count) || 0;
            const amount = Number(data.amount) || 0;
            const countLabel = `${count} ${count === 1 ? 'booking' : 'bookings'}`;

            return (
              <div
                key={card.key}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border shadow-xs backdrop-blur-md flex flex-col justify-between gap-4 transition-all ${card.cardBg}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
                      {card.label}
                    </div>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      {countLabel}
                    </div>
                  </div>
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${card.iconBg}`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                    {currencyFormatter.format(amount)}
                  </div>
                  {card.note && (
                    <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-1">
                      {card.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BookingTotalsPage;
