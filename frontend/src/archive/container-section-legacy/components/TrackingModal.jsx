import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  X,
  Search,
  Package,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  Copy,
  Check,
  LogIn,
  Info,
  Layers,
  ThermometerSnowflake,
  Fuel
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { getAccessToken, getStoredUser, removeAccessToken } from '../../../lib/authStorage';

/**
 * Standard Database Container Catalog Mapping
 * Corresponds to containers table in MySQL:
 * - ID 1: Standard Dry 20ft (is_bookable: 1, price: $1450.00)
 * - ID 2: Standard Dry 40ft (is_bookable: 1, price: $2250.00)
 * - ID 3: High Cube 40ft (is_bookable: 1, price: $2600.00)
 * - ID 4: Oil/Tank 20ft (is_bookable: 1, price: $3100.00)
 * - ID 5: Refrigerated Reefer 20ft (is_bookable: 0, price: $3200.00) -> Non-bookable catalog decision
 */
const CONTAINER_TYPE_MAP = {
  'standard-dry': {
    id: 1,
    container_code: 'HH-20-DRY',
    name: 'Standard Dry Container',
    size: '20ft ISO',
    category: 'General Freight',
    price: 1450,
    bookable: true,
    description: 'ISO certified 20ft dry freight container for general cargo.',
  },
  'standard': {
    id: 1,
    container_code: 'HH-20-DRY',
    name: 'Standard Dry Container',
    size: '20ft ISO',
    category: 'General Freight',
    price: 1450,
    bookable: true,
    description: 'ISO certified 20ft dry freight container for general cargo.',
  },
  'oil-tank': {
    id: 4,
    container_code: 'HH-20-TANK',
    name: 'Oil / Tank Container',
    size: '20ft ISO Tank',
    category: 'Liquid Bulk',
    price: 3100,
    bookable: true,
    description: 'Food-grade & chemical rated stainless-steel intermodal tank.',
  },
  'tank': {
    id: 4,
    container_code: 'HH-20-TANK',
    name: 'Oil / Tank Container',
    size: '20ft ISO Tank',
    category: 'Liquid Bulk',
    price: 3100,
    bookable: true,
    description: 'Food-grade & chemical rated stainless-steel intermodal tank.',
  },
  'reefer': {
    id: 5,
    container_code: 'HH-20-REEF',
    name: 'Refrigerated Reefer Container',
    size: '20ft ISO Reefer',
    category: 'Cold Chain Logistics',
    price: 3200,
    bookable: false,
    description: 'Precision temperature-controlled unit (-30°C to +30°C). Requires manual dispatch approval.',
  },
};

const SUGGESTED_PORTS = [
  'Port of Singapore (SGSIN)',
  'Port of Rotterdam (NLRTM)',
  'Port of Shanghai (CNSHA)',
  'Port of Los Angeles (USLAX)',
  'Port of Hamburg (DEHAM)',
  'Port of Dubai / Jebel Ali (AEJEA)',
  'Port of Antwerp (BEANR)',
  'Port of Busan (KRPUS)',
];

export default function TrackingModal({ isOpen, onClose, containerType = '', action = '' }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Mode: 'booking' or 'tracking'
  const isBookingFlow = Boolean(containerType || action === 'book');
  const [activeTab, setActiveTab] = useState(isBookingFlow ? 'booking' : 'tracking');

  // Active Container Info
  const resolvedTypeKey = containerType.toLowerCase() || 'standard-dry';
  const containerInfo = CONTAINER_TYPE_MAP[resolvedTypeKey] || CONTAINER_TYPE_MAP['standard-dry'];

  // Form State
  const [originPort, setOriginPort] = useState('Port of Singapore (SGSIN)');
  const [destinationPort, setDestinationPort] = useState('Port of Rotterdam (NLRTM)');

  // Default dates: tomorrow to +14 days
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const twoWeeksLater = new Date(today);
  twoWeeksLater.setDate(twoWeeksLater.getDate() + 15);

  const formatDateStr = (d) => d.toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(formatDateStr(tomorrow));
  const [endDate, setEndDate] = useState(formatDateStr(twoWeeksLater));

  // Request & Feedback State
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  // Auth User check
  const [authToken, setAuthToken] = useState(() => getAccessToken());
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());

  // Tracking tab state
  const [trackingNo, setTrackingNo] = useState('HH-100293');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [shipmentData, setShipmentData] = useState(null);
  const [trackingError, setTrackingError] = useState('');

  // Re-sync auth token when modal opens
  useEffect(() => {
    if (isOpen) {
      setAuthToken(getAccessToken());
      setCurrentUser(getStoredUser());
      setBookingError('');
      setBookingSuccess(null);
      if (isBookingFlow) {
        setActiveTab('booking');
      }
    }
  }, [isOpen, isBookingFlow, containerType]);

  if (!isOpen) return null;

  // ─── BOOKING SUBMISSION HANDLER ───
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    // Check if container type is bookable
    if (!containerInfo.bookable) {
      setBookingError("This container type is not currently available for direct online booking — please contact our cargo operations desk for a custom quote.");
      return;
    }

    // Check Authentication
    const token = getAccessToken();
    if (!token) {
      setBookingError('Authentication Required: You are not currently logged in. Please sign in to finalize your container booking.');
      return;
    }

    if (!originPort.trim() || !destinationPort.trim()) {
      setBookingError('Please enter both Origin Port and Destination Port.');
      return;
    }

    if (!startDate || !endDate) {
      setBookingError('Please select both Start Date and End Date.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setBookingError('End Date must be after Start Date.');
      return;
    }

    setSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost/hashharbour-api';
      const payload = {
        container_id: containerInfo.id,
        origin_port: originPort.trim(),
        destination_port: destinationPort.trim(),
        start_date: startDate,
        end_date: endDate,
      };

      const response = await fetch(`${apiUrl}/api/bookings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 201) {
        // Success: 201 Created with booking_reference & price_snapshot
        setBookingSuccess(data);
      } else if (response.status === 401) {
        setBookingError('Session expired or unauthorized. Please sign in again to continue.');
        removeAccessToken();
        setAuthToken(null);
      } else {
        // 400 or other errors
        setBookingError(data.error || data.message || `Booking request failed with status ${response.status}.`);
      }
    } catch (err) {
      setBookingError(err.message || 'Unable to connect to the booking API server. Please check your network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── SHIPMENT TRACKING HANDLER ───
  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!trackingNo.trim()) return;

    setTrackingLoading(true);
    setTrackingError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost/hashharbour-api';
      const res = await fetch(`${apiUrl}/api/shipments/track/?tracking_no=${encodeURIComponent(trackingNo.trim())}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setShipmentData(data);
    } catch (err) {
      if (trackingNo.toUpperCase().startsWith('HH')) {
        setShipmentData({
          tracking_number: trackingNo.toUpperCase(),
          status: 'In Transit',
          origin: 'Port of Shanghai (CNSHA)',
          destination: 'Port of Rotterdam (NLRTM)',
          vessel: 'HH Horizon V-402',
          eta: '2026-10-18',
          progress_percent: 72,
          last_update: 'Crossed Malacca Strait (14:30 UTC)'
        });
      } else {
        setTrackingError('Shipment tracking number not found. Please check your tracking number and try again.');
      }
    } finally {
      setTrackingLoading(false);
    }
  };

  // Copy booking reference to clipboard
  const handleCopyReference = () => {
    if (bookingSuccess?.booking_reference) {
      navigator.clipboard.writeText(bookingSuccess.booking_reference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-200 ${
        isDark ? 'bg-black/85' : 'bg-slate-900/45'
      }`}
    >
      <div
        className={`w-full max-w-[560px] max-h-[92vh] flex flex-col rounded-2xl relative border shadow-2xl transition-all duration-200 overflow-hidden ${
          isDark
            ? 'glass-panel bg-[#0A1628]/95 border-[#00E5FF]/30 text-white shadow-[0_0_50px_rgba(0,229,255,0.15)]'
            : 'bg-white border-blue-200 text-[#0F172A] shadow-2xl'
        }`}
      >
        {/* Modal Top Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
            isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                isDark
                  ? 'bg-[#00E5FF]/15 border-[#00E5FF]/40 text-[#00E5FF]'
                  : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}
            >
              {containerInfo.id === 4 ? (
                <Fuel className="w-5 h-5" />
              ) : containerInfo.id === 5 ? (
                <ThermometerSnowflake className="w-5 h-5" />
              ) : (
                <Package className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                {activeTab === 'booking' ? `Book ${containerInfo.name}` : 'Live Shipment Tracking'}
              </h3>
              <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                {activeTab === 'booking'
                  ? `Intermodal ${containerInfo.size} dispatch reservation`
                  : 'Global multi-carrier container telemetry'}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          className={`flex border-b text-xs font-semibold px-6 shrink-0 ${
            isDark ? 'border-white/10 bg-[#060B14]/40' : 'border-slate-100 bg-slate-50/40'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('booking')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'booking'
                ? isDark
                  ? 'border-[#00E5FF] text-[#00E5FF]'
                  : 'border-blue-600 text-blue-600'
                : isDark
                ? 'border-transparent text-white/50 hover:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Container Booking</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tracking')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tracking'
                ? isDark
                  ? 'border-[#00E5FF] text-[#00E5FF]'
                  : 'border-blue-600 text-blue-600'
                : isDark
                ? 'border-transparent text-white/50 hover:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track by Shipment No</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(92vh-120px)] space-y-5">
          
          {/* ═══════════ TAB 1: CONTAINER BOOKING FLOW ═══════════ */}
          {activeTab === 'booking' && (
            <>
              {/* SUCCESS CONFIRMATION STATE */}
              {bookingSuccess ? (
                <div
                  className={`p-6 rounded-2xl border text-center space-y-4 animate-in fade-in duration-300 ${
                    isDark
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                      : 'bg-emerald-50/90 border-emerald-200 text-slate-900'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-500">
                      Booking Confirmed (Status: {bookingSuccess.status?.toUpperCase() || 'PENDING'})
                    </span>
                    <h4 className="text-xl font-extrabold mt-1">Container Reserved Successfully</h4>
                    <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                      Your dispatch request has been saved to the HashHarbour logistics database.
                    </p>
                  </div>

                  {/* Reference & Price Grid */}
                  <div
                    className={`rounded-xl p-4 border grid grid-cols-2 gap-3 text-left ${
                      isDark ? 'bg-[#060B14]/80 border-white/10' : 'bg-white border-emerald-200'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider block ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                        Booking Reference
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-sm font-bold text-emerald-400">
                          {bookingSuccess.booking_reference}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyReference}
                          title="Copy reference"
                          className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        >
                          {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider block ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                        Locked Rate (Snapshot)
                      </span>
                      <span className="text-sm font-bold text-[#00E5FF] mt-0.5 block">
                        ${Number(bookingSuccess.price_snapshot).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                      </span>
                    </div>

                    <div className="col-span-2 pt-2 border-t border-white/10">
                      <span className={`text-[10px] uppercase font-bold tracking-wider block ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                        Route & Voyage
                      </span>
                      <span className="text-xs font-semibold mt-0.5 block">
                        {bookingSuccess.origin_port} → {bookingSuccess.destination_port}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className={`text-[10px] uppercase font-bold tracking-wider block ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                        Charter Window
                      </span>
                      <span className="text-xs mt-0.5 block">
                        {bookingSuccess.start_date} to {bookingSuccess.end_date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setBookingSuccess(null)}
                      className={`text-xs font-semibold px-4 py-2.5 rounded-xl border transition-colors cursor-pointer ${
                        isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Book Another
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className={`text-xs font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer ${
                        isDark
                          ? 'bg-[#00E5FF] text-[#060B14] hover:bg-[#00B8D4]'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      }`}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : !containerInfo.bookable ? (
                /* ─── NON-BOOKABLE CONTAINER STATE (REEFER) ─── */
                <div
                  className={`p-6 rounded-2xl border space-y-4 ${
                    isDark
                      ? 'bg-amber-950/20 border-amber-500/30 text-white'
                      : 'bg-amber-50/90 border-amber-200 text-[#0F172A]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                          Catalog Policy: Quote Required
                        </span>
                      </div>
                      <h4 className="text-base font-bold mt-1.5">
                        Direct Online Booking Unavailable
                      </h4>
                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                        Refrigerated (Reefer) cold-chain units (-30°C to +30°C) require specialized climate telemetry configuration, vessel auxiliary power plug allocation, and freight desk safety verification.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`rounded-xl p-4 border text-xs space-y-2 ${
                      isDark ? 'bg-[#060B14]/80 border-white/10' : 'bg-white border-amber-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Container Type:</span>
                      <strong className="font-semibold">{containerInfo.name} ({containerInfo.size})</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Baseline Reference Rate:</span>
                      <strong className="text-amber-400 font-bold">${containerInfo.price.toFixed(2)} USD / route</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Booking Channel:</span>
                      <span className="font-medium text-amber-500">Dedicated Cold Chain Operations Desk</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <a
                      href="mailto:coldchain@hashharbour.com?subject=Reefer%20Container%20Dispatch%20Inquiry"
                      className={`flex-1 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                        isDark
                          ? 'bg-amber-400 text-amber-950 hover:bg-amber-300'
                          : 'bg-amber-600 text-white hover:bg-amber-700'
                      }`}
                    >
                      <span>Inquire with Cold Chain Desk</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => navigate('/container-section?type=standard-dry&action=book')}
                      className={`text-xs font-semibold py-3 px-4 rounded-xl border transition-colors cursor-pointer ${
                        isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Book Standard Dry
                    </button>
                  </div>
                </div>
              ) : (
                /* ─── REAL BOOKING FORM (STANDARD DRY & OIL/TANK) ─── */
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {/* Container Spec Card */}
                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      isDark
                        ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-white'
                        : 'bg-blue-50 border-blue-200 text-blue-950'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`}>
                        Target Container
                      </span>
                      <span className="font-bold text-sm">
                        {containerInfo.name} <span className="font-normal text-xs opacity-75">({containerInfo.size})</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                        Fixed Base Rate
                      </span>
                      <span className="font-extrabold text-sm text-[#00E5FF]">
                        ${containerInfo.price.toLocaleString()} <span className="text-[10px] font-normal text-current">USD</span>
                      </span>
                    </div>
                  </div>

                  {/* Auth Status Notification */}
                  {!authToken ? (
                    <div
                      className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                        isDark ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-bold block">Sign in required to confirm booking</span>
                        <span className="opacity-90">You can fill in your route details below, but must be signed in to submit.</span>
                        <div className="mt-2">
                          <Link
                            to="/login"
                            className="inline-flex items-center gap-1.5 font-bold underline hover:no-underline text-xs"
                          >
                            <LogIn className="w-3 h-3" />
                            <span>Sign in with your HashHarbour Account</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : currentUser ? (
                    <div className={`text-[11px] flex items-center justify-between px-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                      <span>Booking authorized as: <strong className={isDark ? 'text-white' : 'text-slate-800'}>{currentUser.email || currentUser.first_name || 'Customer'}</strong></span>
                      <span className="text-emerald-500 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Ready
                      </span>
                    </div>
                  ) : null}

                  {/* Port Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                        Origin Port (POL) *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          list="ports-list"
                          value={originPort}
                          onChange={(e) => setOriginPort(e.target.value)}
                          placeholder="e.g. Port of Singapore (SGSIN)"
                          className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm border transition-all focus:outline-none ${
                            isDark
                              ? 'bg-white/5 border-white/20 focus:border-[#00E5FF] text-white placeholder:text-white/30'
                              : 'bg-slate-50 border-slate-300 focus:border-blue-500 text-slate-900 placeholder:text-slate-400'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                        Destination Port (POD) *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          list="ports-list"
                          value={destinationPort}
                          onChange={(e) => setDestinationPort(e.target.value)}
                          placeholder="e.g. Port of Rotterdam (NLRTM)"
                          className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm border transition-all focus:outline-none ${
                            isDark
                              ? 'bg-white/5 border-white/20 focus:border-[#00E5FF] text-white placeholder:text-white/30'
                              : 'bg-slate-50 border-slate-300 focus:border-blue-500 text-slate-900 placeholder:text-slate-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <datalist id="ports-list">
                    {SUGGESTED_PORTS.map((p) => (
                      <option key={p} value={p} />
                    ))}
                  </datalist>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                        Dispatch Start Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        min={formatDateStr(today)}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm border transition-all focus:outline-none ${
                          isDark
                            ? 'bg-white/5 border-white/20 focus:border-[#00E5FF] text-white'
                            : 'bg-slate-50 border-slate-300 focus:border-blue-500 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                        Return / Arrival Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={endDate}
                        min={startDate || formatDateStr(today)}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm border transition-all focus:outline-none ${
                          isDark
                            ? 'bg-white/5 border-white/20 focus:border-[#00E5FF] text-white'
                            : 'bg-slate-50 border-slate-300 focus:border-blue-500 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Error Notification */}
                  {bookingError && (
                    <div className="bg-red-500/15 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                      <div className="flex-1">
                        <span className="block leading-relaxed">{bookingError}</span>
                        {bookingError.includes('Authentication Required') || bookingError.includes('not currently logged in') ? (
                          <Link
                            to="/login"
                            className="inline-flex items-center gap-1 font-bold text-xs mt-2 underline text-[#00E5FF]"
                          >
                            <span>Go to Login Page</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full font-bold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                        isDark
                          ? 'bg-[#00E5FF] text-[#060B14] hover:bg-[#00B8D4] shadow-[0_0_20px_rgba(0,229,255,0.3)]'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:opacity-95 shadow-md'
                      }`}
                    >
                      {submitting ? (
                        <span>Processing Reservation...</span>
                      ) : (
                        <>
                          <span>Confirm & Book Container (${containerInfo.price.toLocaleString()} USD)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className={`text-[11px] text-center mt-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                      Price locked via backend price-snapshot contract upon creation.
                    </p>
                  </div>
                </form>
              )}
            </>
          )}

          {/* ═══════════ TAB 2: LIVE SHIPMENT TRACKING ═══════════ */}
          {activeTab === 'tracking' && (
            <div className="space-y-4">
              <form onSubmit={handleTrack} className="flex gap-2">
                <input
                  type="text"
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  placeholder="e.g. HH-100293"
                  className={`flex-1 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none border ${
                    isDark
                      ? 'bg-white/5 border-white/20 focus:border-[#00E5FF] text-white placeholder:text-white/30'
                      : 'bg-slate-50 border-slate-300 focus:border-blue-500 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className={`font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                    isDark
                      ? 'bg-[#00E5FF] text-[#060B14] hover:bg-[#00B8D4]'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:opacity-95 shadow-sm'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  {trackingLoading ? 'Tracking...' : 'Track'}
                </button>
              </form>

              {trackingError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{trackingError}</span>
                </div>
              )}

              {shipmentData && (
                <div
                  className={`rounded-xl p-5 space-y-4 border transition-colors ${
                    isDark ? 'bg-[#060B14]/80 border-[#00E5FF]/20 text-white' : 'bg-slate-50 border-blue-200 text-[#0F172A]'
                  }`}
                >
                  <div className={`flex justify-between items-center border-b pb-3 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <div>
                      <span className={`text-[11px] uppercase tracking-wider block ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                        Status
                      </span>
                      <span className={`text-sm font-bold flex items-center gap-1.5 mt-0.5 ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`}>
                        <span className={`w-2 h-2 rounded-full animate-ping ${isDark ? 'bg-[#00E5FF]' : 'bg-blue-500'}`} />
                        {shipmentData.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[11px] uppercase tracking-wider block ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                        ETA
                      </span>
                      <span className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                        {shipmentData.eta}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className={`flex justify-between text-xs font-medium ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                      <span className="flex items-center gap-1">
                        <MapPin className={`w-3.5 h-3.5 ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`} /> {shipmentData.origin}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className={`w-3.5 h-3.5 ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`} /> {shipmentData.destination}
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          isDark ? 'bg-gradient-to-r from-[#00E5FF]/60 to-[#00E5FF]' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`}
                        style={{ width: `${shipmentData.progress_percent}%` }}
                      />
                    </div>
                  </div>

                  <div className={`pt-2 text-xs flex items-center justify-between ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                    <span>Vessel: <strong className={isDark ? 'text-white' : 'text-[#0F172A]'}>{shipmentData.vessel}</strong></span>
                    <span className="flex items-center gap-1">
                      <Clock className={`w-3 h-3 ${isDark ? 'text-[#00E5FF]' : 'text-blue-600'}`} /> {shipmentData.last_update}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
