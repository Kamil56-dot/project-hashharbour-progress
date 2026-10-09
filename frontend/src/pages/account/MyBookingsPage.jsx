import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Package,
  Ship,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  MapPin,
  ArrowRight,
  MoreVertical,
  X,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  Info,
} from 'lucide-react';
import { authFetch } from '../../lib/authFetch';
import { useAuth } from '../../context/AuthContext';
import { isStaff as isStaffRole } from '../../lib/roles';
import { REFUND_NOTICE_TEXT } from './bookingTexts';

// Container images from assets
import redStandardDryImg from '../../assets/containers/red-standard-dry.png';
import reeferImg from '../../assets/containers/reefer container.png';
import oilTankImg from '../../assets/containers/oil-tank.png';
import blueStandardDryImg from '../../assets/containers/file_0000000078608211a9fcda6d20986d14.png';

/**
 * Image mapping helper:
 * - 20ft Standard Dry -> red-standard-dry.png
 * - Reefer -> reefer container.png
 * - Tank -> oil-tank.png
 * - 40ft Standard Dry -> file_0000000078608211a9fcda6d20986d14.png
 * - Fallback -> red-standard-dry.png
 */
function getContainerImage(booking) {
  const type = (booking.container_type || '').toLowerCase();
  const size = Number(booking.container_size);

  if (type.includes('reefer')) {
    return reeferImg;
  }
  if (type.includes('tank') || type.includes('oil')) {
    return oilTankImg;
  }
  if (type.includes('standard') || type.includes('dry')) {
    if (size === 40) {
      return blueStandardDryImg;
    }
    return redStandardDryImg;
  }
  return redStandardDryImg;
}

/**
 * UI Status Badge Config
 * Mapping:
 * - pending -> Pending (Amber)
 * - confirmed -> Confirmed (Indigo)
 * - in_transit -> In Transit (Blue)
 * - completed -> Delivered (Green)
 * - cancelled -> Cancelled (Rose)
 */
const STATUS_CONFIG = {
  in_transit: {
    label: 'In Transit',
    badgeClass: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20',
    dotClass: 'bg-blue-500 dark:bg-blue-400',
  },
  completed: {
    label: 'Delivered',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
    dotClass: 'bg-emerald-500 dark:bg-emerald-400',
  },
  pending: {
    label: 'Pending',
    badgeClass: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20',
    dotClass: 'bg-amber-500 dark:bg-amber-400',
  },
  confirmed: {
    label: 'Confirmed',
    badgeClass: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20',
    dotClass: 'bg-indigo-500 dark:bg-indigo-400',
  },
  cancelled: {
    label: 'Cancelled',
    badgeClass: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20',
    dotClass: 'bg-rose-500 dark:bg-rose-400',
  },
};

/**
 * Helper to determine next valid status transition for staff:
 * pending -> confirmed ("Confirm Booking")
 * confirmed -> in_transit ("Mark In Transit")
 * in_transit -> completed ("Mark Completed")
 */
function getNextStaffStatusAction(status) {
  switch (status) {
    case 'pending':
      return {
        nextStatus: 'confirmed',
        label: 'Confirm Booking',
      };
    case 'confirmed':
      return {
        nextStatus: 'in_transit',
        label: 'Mark In Transit',
      };
    case 'in_transit':
      return {
        nextStatus: 'completed',
        label: 'Mark Completed',
      };
    default:
      return null;
  }
}

export function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  // Active menu and modals
  const [menuState, setMenuState] = useState(null);
  const [detailModalBooking, setDetailModalBooking] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Staff status transition state & error toast
  const [updatingBookingId, setUpdatingBookingId] = useState(null);
  const [statusErrorToast, setStatusErrorToast] = useState(null);

  const isStaff = useMemo(() => isStaffRole(user), [user]);

  // Fetch bookings list
  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authFetch('/api/bookings/');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Failed to fetch bookings (${response.status})`);
      }

      const list = Array.isArray(data) ? data : [];
      setBookings(list);

      // Keep detail modal synced with updated booking data if modal is open
      if (detailModalBooking) {
        const fresh = list.find((b) => b.id === detailModalBooking.id);
        if (fresh) {
          setDetailModalBooking((prev) => (prev ? { ...prev, ...fresh } : null));
        }
      }
    } catch (err) {
      console.error('Fetch bookings error:', err);
      setError(err.message || 'Unable to load bookings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Deep link: open detail modal when ?booking=ID is provided
  const [searchParams, setSearchParams] = useSearchParams();
  const deepLinkHandledRef = useRef(false);

  useEffect(() => {
    const bookingParam = searchParams.get('booking');
    if (!bookingParam || isLoading || deepLinkHandledRef.current) return;

    deepLinkHandledRef.current = true;
    const targetId = parseInt(bookingParam, 10);

    const clearBookingParam = () => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('booking');
          return next;
        },
        { replace: true }
      );
    };

    if (isNaN(targetId) || targetId <= 0) {
      clearBookingParam();
      return;
    }

    const found = bookings.find((b) => Number(b.id) === targetId);
    if (found) {
      setDetailModalBooking(found);
      clearBookingParam();
      return;
    }

    (async () => {
      try {
        const res = await authFetch(`/api/bookings/${targetId}`);
        if (res.ok) {
          const item = await res.json();
          if (item && typeof item === 'object' && item.id && item.status) {
            setDetailModalBooking(item);
          }
        }
      } catch {
        // ignore silently
      } finally {
        clearBookingParam();
      }
    })();
  }, [searchParams, isLoading, bookings, setSearchParams]);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target)) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close modals on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setDetailModalBooking(null);
        setCancelModalBooking(null);
        setIsFilterDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Close three-dot menu on outside click, Escape, page scroll, or window resize
  useEffect(() => {
    if (!menuState) return;

    const handleClose = () => setMenuState(null);
    const handleKey = (e) => {
      if (e.key === 'Escape') setMenuState(null);
    };

    document.addEventListener('click', handleClose);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleClose, true);
    window.addEventListener('resize', handleClose);

    return () => {
      document.removeEventListener('click', handleClose);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleClose, true);
      window.removeEventListener('resize', handleClose);
    };
  }, [menuState]);

  // Open three-dot menu with portal positioning & auto-flip
  const handleOpenMenu = (e, booking) => {
    e.stopPropagation();
    if (menuState?.booking?.id === booking.id) {
      setMenuState(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const estimatedMenuHeight = 140;
    const margin = 8;
    const right = Math.max(margin, window.innerWidth - rect.right);

    // Auto-flip upward if not enough space below the button
    const spaceBelow = window.innerHeight - rect.bottom;
    const isUpward = spaceBelow < estimatedMenuHeight + margin && rect.top > estimatedMenuHeight + margin;

    setMenuState({
      booking,
      style: {
        position: 'fixed',
        right: `${right}px`,
        ...(isUpward
          ? { bottom: `${window.innerHeight - rect.top + 6}px` }
          : { top: `${rect.bottom + 6}px` }),
        zIndex: 110,
      },
    });
  };

  // Lock body scroll while either modal is open and restore on close/unmount
  useEffect(() => {
    if (detailModalBooking || cancelModalBooking) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [detailModalBooking, cancelModalBooking]);

  // Cancel booking handler
  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    setIsCancelling(true);
    setActionError(null);
    try {
      const response = await authFetch(`/api/bookings/${cancelModalBooking.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason.trim() || null }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Failed to cancel booking (${response.status})`);
      }

      // Close modal and refresh list
      setCancelModalBooking(null);
      setCancelReason('');
      await fetchBookings();
    } catch (err) {
      setActionError(err.message || 'Error occurred while cancelling booking.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Auto-dismiss status error toast after 6 seconds
  useEffect(() => {
    if (statusErrorToast) {
      const timer = setTimeout(() => {
        setStatusErrorToast(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [statusErrorToast]);

  // Advance booking status handler (Staff only)
  const handleAdvanceStatus = async (booking, targetStatus) => {
    if (!booking || !targetStatus || updatingBookingId !== null) return;
    setUpdatingBookingId(booking.id);
    setStatusErrorToast(null);

    try {
      const response = await authFetch(`/api/bookings/${booking.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || `Failed to update booking status (${response.status})`);
      }

      // Close menu on success
      setMenuState(null);

      // If details modal is open for this booking, update it immediately with returned booking data
      if (detailModalBooking?.id === booking.id && data) {
        setDetailModalBooking(data);
      }

      // Refresh list to update status badges and stats strip
      await fetchBookings();
    } catch (err) {
      console.error('Status transition error:', err);
      setStatusErrorToast(err.message || 'Unable to update status.');
    } finally {
      setUpdatingBookingId(null);
    }
  };

  // Determine if a booking can be cancelled by current user (staff only)
  const canCancelBooking = (booking) => {
    if (!booking || !isStaff) return false;
    return booking.status !== 'completed' && booking.status !== 'cancelled';
  };

  // Computed stats from real data
  const stats = useMemo(() => {
    const total = bookings.length;
    let inTransit = 0;
    let delivered = 0;
    let pending = 0;

    bookings.forEach((b) => {
      if (b.status === 'in_transit') inTransit += 1;
      else if (b.status === 'completed') delivered += 1;
      else if (b.status === 'pending') pending += 1;
    });

    return { total, inTransit, delivered, pending };
  }, [bookings]);

  // Filtered and searched list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Status filter
      if (statusFilter !== 'all' && b.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const ref = (b.booking_reference || '').toLowerCase();
        const idStr = String(b.id);
        const code = (b.container_code || '').toLowerCase();
        const origin = (b.origin_port || '').toLowerCase();
        const dest = (b.destination_port || '').toLowerCase();
        const type = (b.container_type || '').toLowerCase();

        const match =
          ref.includes(q) ||
          idStr.includes(q) ||
          code.includes(q) ||
          origin.includes(q) ||
          dest.includes(q) ||
          type.includes(q);

        if (!match) return false;
      }
      return true;
    });
  }, [bookings, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* ─── BREADCRUMB & HEADER ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <span className="text-slate-400 dark:text-slate-600">›</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{isStaff ? 'All Bookings' : 'My Bookings'}</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isStaff ? 'All Bookings' : 'My Bookings'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            View and manage your booked containers, track shipments, and access all related documents.
          </p>
        </div>

        {/* ─── SEARCH & FILTER CONTROLS ─── */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Search Input Pill */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by container no, booking id or route..."
              className="w-full pl-9 pr-8 py-2.5 rounded-full text-xs sm:text-sm bg-white/90 dark:bg-[#0F172A]/90 border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Button & Dropdown */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
              aria-expanded={isFilterDropdownOpen}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all border shadow-xs select-none ${
                statusFilter !== 'all'
                  ? 'bg-blue-50 dark:bg-blue-500/20 text-[#1E88E5] dark:text-[#38BDF8] border-blue-200 dark:border-blue-500/30'
                  : 'bg-white/90 dark:bg-[#0F172A]/90 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.05]'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter{statusFilter !== 'all' ? `: ${STATUS_CONFIG[statusFilter]?.label || statusFilter}` : ''}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] w-48 rounded-2xl p-1.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-xl z-20 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('all');
                    setIsFilterDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  All Statuses
                </button>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setStatusFilter(key);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-between ${
                      statusFilter === key
                        ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <span>{cfg.label}</span>
                    <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── STATS STRIP ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Bookings */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-[#0F172A]/85 backdrop-blur-md border border-slate-200/70 dark:border-white/10 shadow-xs flex items-center gap-3.5 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-[#1E88E5] dark:text-[#38BDF8] flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {stats.total}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Bookings
            </div>
          </div>
        </div>

        {/* In Transit */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-[#0F172A]/85 backdrop-blur-md border border-slate-200/70 dark:border-white/10 shadow-xs flex items-center gap-3.5 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Ship className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {stats.inTransit}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              In Transit
            </div>
          </div>
        </div>

        {/* Delivered */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-[#0F172A]/85 backdrop-blur-md border border-slate-200/70 dark:border-white/10 shadow-xs flex items-center gap-3.5 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {stats.delivered}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Delivered
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-[#0F172A]/85 backdrop-blur-md border border-slate-200/70 dark:border-white/10 shadow-xs flex items-center gap-3.5 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {stats.pending}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pending
            </div>
          </div>
        </div>
      </div>

      {/* ─── ERROR STATE ─── */}
      {error && (
        <div className="rounded-2xl p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">
            <p className="font-semibold">Failed to load bookings</p>
            <p className="text-xs mt-0.5 opacity-90">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchBookings}
            className="text-xs font-bold underline hover:no-underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* ─── LOADING SKELETON ─── */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-5 rounded-3xl bg-white/70 dark:bg-[#0F172A]/70 border border-slate-200/60 dark:border-white/5 animate-pulse flex flex-col md:flex-row items-center gap-5"
            >
              <div className="w-full md:w-56 h-36 bg-slate-200 dark:bg-white/[0.05] rounded-2xl shrink-0" />
              <div className="flex-1 space-y-3 w-full">
                <div className="w-28 h-5 bg-slate-200 dark:bg-white/[0.05] rounded-full" />
                <div className="w-56 h-6 bg-slate-200 dark:bg-white/[0.05] rounded-md" />
                <div className="w-72 h-4 bg-slate-200 dark:bg-white/[0.05] rounded-md" />
              </div>
              <div className="w-full md:w-36 h-10 bg-slate-200 dark:bg-white/[0.05] rounded-full shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* ─── EMPTY STATE ─── */}
      {!isLoading && !error && filteredBookings.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white/70 dark:bg-[#0F172A]/70 border border-dashed border-slate-200 dark:border-white/10 backdrop-blur-md">
          <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-[#1E88E5] dark:text-[#38BDF8] flex items-center justify-center">
            <Package className="w-7 h-7" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            {searchQuery || statusFilter !== 'all' ? 'No matching bookings found' : 'No bookings yet'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search criteria or resetting the filter.'
              : 'You have not booked any containers yet. Explore our catalog to place your first booking.'}
          </p>
          {searchQuery || statusFilter !== 'all' ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          ) : (
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-[#1E88E5] text-white hover:bg-blue-600 transition-colors shadow-xs"
            >
              Explore Containers
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}

      {/* ─── BOOKINGS CARDS LIST ─── */}
      {!isLoading && !error && filteredBookings.length > 0 && (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const containerImg = getContainerImage(booking);
            const statusInfo = STATUS_CONFIG[booking.status] || {
              label: booking.status,
              badgeClass: 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10',
              dotClass: 'bg-slate-400',
            };

            const containerTitle = `${booking.container_size ? `${booking.container_size}ft ` : ''}${
              booking.container_type || 'Standard'
            } Container`;

            const bookingRef = booking.booking_reference || `#${booking.id}`;
            const origin = booking.origin_port || '-';
            const destination = booking.destination_port || '-';
            const containerCode = booking.container_code || '-';
            const quantityText = `${booking.quantity || 1} container${(booking.quantity || 1) > 1 ? 's' : ''}`;
            const canCancel = canCancelBooking(booking);

            return (
              <div
                key={booking.id}
                className="relative p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#0F172A]/85 backdrop-blur-md border border-slate-200/70 dark:border-white/10 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-stretch md:items-center gap-4 sm:gap-6"
              >
                {/* ── 1. Container Image Thumbnail ── */}
                <div className="w-full md:w-52 h-36 sm:h-40 md:h-36 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-white/[0.03] dark:to-white/[0.01] p-3 flex items-center justify-center shrink-0 border border-slate-100 dark:border-white/5 overflow-hidden">
                  <img
                    src={containerImg}
                    alt={containerTitle}
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* ── 2. Booking Info & Route ── */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Booking ID Chip */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#1E88E5] dark:text-[#38BDF8] bg-[#E3F2FD] dark:bg-[#0284C7]/20 border border-blue-200/50 dark:border-blue-500/20">
                    <span>Booking ID:</span>
                    <span className="font-bold">{bookingRef}</span>
                  </div>

                  {/* Container Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                    {containerTitle}
                  </h3>

                  {/* Route */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex-wrap">
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200 truncate max-w-[140px] sm:max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      {origin}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200 truncate max-w-[140px] sm:max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      {destination}
                    </span>
                  </div>
                </div>

                {/* ── 3. Container Code & Quantity ── */}
                <div className="flex flex-row md:flex-col justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/5 pt-3 md:pt-0 md:pl-6 shrink-0 gap-1.5 sm:gap-2">
                  <div>
                    <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Container Code
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {containerCode}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Quantity
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {quantityText}
                    </div>
                  </div>
                </div>

                {/* ── 4. Status Badge & Actions ── */}
                <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 gap-3">
                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold select-none ${statusInfo.badgeClass}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
                    <span>{statusInfo.label}</span>
                  </div>

                  {/* Buttons Row */}
                  <div className="flex items-center gap-2 relative">
                    <button
                      type="button"
                      onClick={() => setDetailModalBooking(booking)}
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-white/[0.05] border border-slate-200/90 dark:border-white/15 text-[#1E88E5] dark:text-[#38BDF8] hover:bg-slate-50 dark:hover:bg-white/[0.1] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer select-none"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Three-Dot Menu Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenMenu(e, booking)}
                      aria-label="Booking options"
                      aria-expanded={menuState?.booking?.id === booking.id}
                      className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer select-none"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── VIEW DETAILS MODAL (PORTAL) ─── */}
      {detailModalBooking &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setDetailModalBooking(null)}
              aria-hidden="true"
            />

            {/* Modal Dialog Card */}
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-booking-title"
              className="relative w-full max-w-2xl bg-white dark:bg-[#0F172A] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-200 dark:border-white/10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-[#1E88E5] dark:text-[#38BDF8] flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <h2 id="modal-booking-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      Booking Details
                    </h2>
                    <span className="text-[11px] font-semibold text-[#1E88E5] dark:text-[#38BDF8] bg-[#E3F2FD] dark:bg-[#0284C7]/20 px-2 py-0.5 rounded-full">
                      {detailModalBooking.booking_reference || `#${detailModalBooking.id}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Status badge in header */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      STATUS_CONFIG[detailModalBooking.status]?.badgeClass || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        STATUS_CONFIG[detailModalBooking.status]?.dotClass || 'bg-slate-400'
                      }`}
                    />
                    <span>{STATUS_CONFIG[detailModalBooking.status]?.label || detailModalBooking.status}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setDetailModalBooking(null)}
                    aria-label="Close modal"
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Compact 3-column Grid (2-col on mobile) */}
              <div className="py-3.5 space-y-3">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                  {/* 1. Container Type & Size */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                      Container Type & Size
                    </span>
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white block mt-0.5 truncate">
                      {detailModalBooking.container_size ? `${detailModalBooking.container_size}ft ` : ''}
                      {detailModalBooking.container_type || '-'}
                    </span>
                  </div>

                  {/* 2. Container Code */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                      Container Code
                    </span>
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white block mt-0.5 truncate">
                      {detailModalBooking.container_code || '-'}
                    </span>
                  </div>

                  {/* 3. Origin Port */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                      Origin Port
                    </span>
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white block mt-0.5 truncate">
                      {detailModalBooking.origin_port || '-'}
                    </span>
                  </div>

                  {/* 4. Destination Port */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                      Destination Port
                    </span>
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white block mt-0.5 truncate">
                      {detailModalBooking.destination_port || '-'}
                    </span>
                  </div>

                  {/* 5. Quantity */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                      Quantity
                    </span>
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white block mt-0.5 truncate">
                      {detailModalBooking.quantity || 1} container{(detailModalBooking.quantity || 1) > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* 6. Insurance Selected */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                      Insurance
                    </span>
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white block mt-0.5 truncate">
                      {detailModalBooking.insurance_selected ? 'Yes (Protected)' : 'No'}
                    </span>
                  </div>

                  {/* 7. Locked Unit Price */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                      Locked Unit Price
                    </span>
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white block mt-0.5 truncate">
                      {detailModalBooking.price_snapshot != null ? `$${detailModalBooking.price_snapshot.toFixed(2)}` : '-'}
                    </span>
                  </div>

                  {/* 8. Total Amount */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                      Total Amount
                    </span>
                    <span className="text-xs sm:text-[13px] font-bold text-blue-600 dark:text-blue-400 block mt-0.5 truncate">
                      {detailModalBooking.total_amount != null ? `$${detailModalBooking.total_amount.toFixed(2)}` : '-'}
                    </span>
                  </div>

                  {/* 9. Payment Method */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                      Payment Method
                    </span>
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white block mt-0.5 truncate uppercase">
                      {detailModalBooking.payment_method || '-'}
                    </span>
                  </div>

                  {/* 10. Refund Status */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                      Refund Status
                    </span>
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white block mt-0.5 truncate capitalize">
                      {detailModalBooking.refund_status || 'none'}
                    </span>
                  </div>

                  {/* 11. Created At */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                      Created At
                    </span>
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white block mt-0.5 truncate">
                      {detailModalBooking.created_at || '-'}
                    </span>
                  </div>

                  {/* 12. Last Updated */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                      Last Updated
                    </span>
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white block mt-0.5 truncate">
                      {detailModalBooking.updated_at || '-'}
                    </span>
                  </div>
                </div>

                {/* Optional Billing Info Row (only if present) */}
                {(detailModalBooking.billing_name || detailModalBooking.billing_address) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 pt-1">
                    {detailModalBooking.billing_name && (
                      <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                          Billing Contact
                        </span>
                        <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white block mt-0.5 truncate">
                          {detailModalBooking.billing_name}
                        </span>
                      </div>
                    )}
                    {detailModalBooking.billing_address && (
                      <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                          Billing Address
                        </span>
                        <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white block mt-0.5 truncate">
                          {detailModalBooking.billing_address}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Cancellation Info Banner + Refund Note for cancelled bookings */}
                {detailModalBooking.status === 'cancelled' && (
                  <div className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-xs text-rose-700 dark:text-rose-300">
                    <span className="font-semibold block text-[11px] uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      Cancellation Information
                    </span>
                    {detailModalBooking.cancelled_at && (
                      <p className="mt-0.5">
                        Cancelled on: <span className="font-semibold">{detailModalBooking.cancelled_at}</span>
                        {detailModalBooking.cancel_reason && (
                          <span> — Reason: <span className="italic">"{detailModalBooking.cancel_reason}"</span></span>
                        )}
                      </p>
                    )}
                    <p className="mt-1 font-medium text-rose-600 dark:text-rose-400">
                      {REFUND_NOTICE_TEXT}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2 flex-wrap">
                {isStaff && (
                  <div className="flex items-center gap-2">
                    {(() => {
                      const nextAction = getNextStaffStatusAction(detailModalBooking.status);
                      if (!nextAction) return null;
                      const isCurrentUpdating = updatingBookingId === detailModalBooking.id;

                      return (
                        <button
                          type="button"
                          disabled={updatingBookingId !== null}
                          onClick={() => handleAdvanceStatus(detailModalBooking, nextAction.nextStatus)}
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isCurrentUpdating ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          <span>{nextAction.label}</span>
                        </button>
                      );
                    })()}

                    {canCancelBooking(detailModalBooking) && (
                      <button
                        type="button"
                        onClick={() => {
                          const b = detailModalBooking;
                          setDetailModalBooking(null);
                          setCancelModalBooking(b);
                          setCancelReason('');
                          setActionError(null);
                        }}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200/60 dark:border-rose-500/20 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                )}

                <div className="ml-auto">
                  <button
                    type="button"
                    onClick={() => setDetailModalBooking(null)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.15] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ─── CANCEL BOOKING CONFIRMATION MODAL (PORTAL) ─── */}
      {cancelModalBooking &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => !isCancelling && setCancelModalBooking(null)}
              aria-hidden="true"
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cancel-booking-dialog-title"
              className="relative w-full max-w-md bg-white dark:bg-[#0F172A] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-150 z-10"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>

              <h3 id="cancel-booking-dialog-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                Cancel Booking?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to cancel booking{' '}
                <span className="font-bold text-slate-800 dark:text-white">
                  {cancelModalBooking.booking_reference || `#${cancelModalBooking.id}`}
                </span>
                ? This action cannot be reversed.
              </p>

              <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 rounded-xl p-2.5">
                {REFUND_NOTICE_TEXT}
              </p>

              {/* Optional Reason Input */}
              <div className="mt-3.5">
                <label htmlFor="cancel-reason-input" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Reason for cancellation (optional):
                </label>
                <textarea
                  id="cancel-reason-input"
                  rows={2}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please state why you wish to cancel this booking..."
                  maxLength={255}
                  disabled={isCancelling}
                  className="w-full p-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all resize-none"
                />
              </div>

              {/* Error Message */}
              {actionError && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-600 dark:text-rose-400">
                  {actionError}
                </div>
              )}

              {/* Dialog Action Buttons */}
              <div className="mt-5 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  disabled={isCancelling}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  Keep Booking
                </button>

                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}
                  className="px-4.5 py-2 rounded-full text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isCancelling ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <span>Confirm Cancel</span>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ─── THREE-DOT ACTION MENU (PORTAL) ─── */}
      {menuState &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            style={menuState.style}
            onClick={(e) => e.stopPropagation()}
            className="w-48 rounded-2xl p-1.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 select-none z-[110]"
          >
            {/* View Details */}
            <button
              type="button"
              onClick={() => {
                const booking = menuState.booking;
                setMenuState(null);
                setDetailModalBooking(booking);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.05] flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>View Details</span>
            </button>

            {/* Staff Status Advance Action */}
            {(() => {
              if (!isStaff) return null;
              const nextAction = getNextStaffStatusAction(menuState.booking.status);
              if (!nextAction) return null;
              const isCurrentUpdating = updatingBookingId === menuState.booking.id;

              return (
                <button
                  type="button"
                  disabled={updatingBookingId !== null}
                  onClick={() => handleAdvanceStatus(menuState.booking, nextAction.nextStatus)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCurrentUpdating ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  )}
                  <span className="truncate">{nextAction.label}</span>
                </button>
              );
            })()}

            {/* Cancel Booking */}
            {canCancelBooking(menuState.booking) && (
              <button
                type="button"
                onClick={() => {
                  const booking = menuState.booking;
                  setMenuState(null);
                  setCancelModalBooking(booking);
                  setCancelReason('');
                  setActionError(null);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel Booking</span>
              </button>
            )}
          </div>,
          document.body
        )}

      {/* ─── STATUS ACTION ERROR TOAST (PORTAL) ─── */}
      {statusErrorToast &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed top-20 right-4 sm:right-6 z-[120] max-w-sm sm:max-w-md animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 shadow-xl backdrop-blur-md text-xs sm:text-sm font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 pr-2 leading-relaxed">{statusErrorToast}</div>
              <button
                type="button"
                onClick={() => setStatusErrorToast(null)}
                className="p-1 rounded-lg text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                aria-label="Dismiss error"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default MyBookingsPage;
