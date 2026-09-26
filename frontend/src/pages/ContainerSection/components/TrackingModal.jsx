import React, { useState } from 'react';
import { X, Search, Package, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export default function TrackingModal({ isOpen, onClose }) {
  const { isDark } = useTheme();
  const [trackingNo, setTrackingNo] = useState('HH-100293');
  const [loading, setLoading] = useState(false);
  const [shipmentData, setShipmentData] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!trackingNo.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost/hashharbour-api';
      const res = await fetch(`${apiUrl}/api/shipments/track/?tracking_no=${encodeURIComponent(trackingNo.trim())}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setShipmentData(data);
    } catch (err) {
      // Fallback demo response if Django API server is offline or item not found
      if (trackingNo.toUpperCase().startsWith('HH')) {
        setShipmentData({
          tracking_number: trackingNo.toUpperCase(),
          status: 'In Transit',
          origin: 'Shanghai Port, CN',
          destination: 'Rotterdam Gateway, NL',
          vessel: 'HH Horizon V-402',
          eta: '2026-08-04',
          progress_percent: 68,
          last_update: 'Passed Singapore Strait (12:40 UTC)'
        });
      } else {
        setError('Shipment tracking number not found. Try HH-100293 or HH-849201');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200 ${
        isDark ? 'bg-black/80' : 'bg-slate-900/40'
      }`}
    >
      <div
        className={`w-full max-w-[540px] rounded-2xl p-7 relative border transition-all duration-200 ${
          isDark
            ? 'glass-panel bg-[#0A1628]/95 border-[#00E5FF]/30 text-white shadow-[0_0_50px_rgba(0,229,255,0.15)]'
            : 'bg-white border border-blue-200 text-[#0F172A] shadow-2xl'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className={`absolute top-5 right-5 transition-colors p-1 cursor-pointer rounded-lg ${
            isDark ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
              isDark
                ? 'bg-[#00E5FF]/15 border-[#00E5FF]/40 text-[#00E5FF]'
                : 'bg-brand-500/10 border-brand-200 text-brand-600'
            }`}
          >
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-xl font-bold transition-colors ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              Track Your Shipment
            </h3>
            <p className={`text-xs transition-colors ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              Enter container or bill of lading number
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-6">
          <input
            type="text"
            value={trackingNo}
            onChange={(e) => setTrackingNo(e.target.value)}
            placeholder="e.g. HH-100293"
            className={`flex-1 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none border ${
              isDark
                ? 'bg-white/5 border-white/20 focus:border-[#00E5FF] text-white placeholder:text-white/30'
                : 'bg-slate-50 border-slate-300 focus:border-brand-500 text-[#0F172A] placeholder:text-slate-400'
            }`}
          />
          <button
            type="submit"
            disabled={loading}
            className={`font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
              isDark
                ? 'bg-[#00E5FF] text-[#060B14] hover:bg-[#00B8D4]'
                : 'bg-gradient-to-r from-[#1E88E5] to-[#1976D2] text-white hover:opacity-95 shadow-sm'
            }`}
          >
            <Search className="w-4 h-4" />
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3.5 rounded-xl text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Container */}
        {shipmentData && (
          <div
            className={`rounded-xl p-5 space-y-4 border transition-colors duration-200 ${
              isDark
                ? 'bg-[#060B14]/80 border-[#00E5FF]/20 text-white'
                : 'bg-slate-50/90 border-blue-200/80 text-[#0F172A]'
            }`}
          >
            <div
              className={`flex justify-between items-center border-b pb-3 ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}
            >
              <div>
                <span className={`text-[11px] uppercase tracking-wider block ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                  Status
                </span>
                <span
                  className={`text-sm font-bold flex items-center gap-1.5 mt-0.5 ${
                    isDark ? 'text-[#00E5FF]' : 'text-brand-600'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full animate-ping ${
                      isDark ? 'bg-[#00E5FF]' : 'bg-brand-500'
                    }`}
                  />
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

            {/* Route visual */}
            <div className="space-y-2">
              <div className={`flex justify-between text-xs font-medium ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                <span className="flex items-center gap-1">
                  <MapPin className={`w-3.5 h-3.5 ${isDark ? 'text-[#00E5FF]' : 'text-brand-600'}`} /> {shipmentData.origin}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className={`w-3.5 h-3.5 ${isDark ? 'text-[#00E5FF]' : 'text-brand-600'}`} /> {shipmentData.destination}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isDark
                      ? 'bg-gradient-to-r from-[#00E5FF]/60 to-[#00E5FF]'
                      : 'bg-gradient-to-r from-brand-500 to-brand-600'
                  }`}
                  style={{ width: `${shipmentData.progress_percent}%` }}
                />
              </div>
            </div>

            <div className={`pt-2 text-xs flex items-center justify-between ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              <span>Vessel: <strong className={isDark ? 'text-white' : 'text-[#0F172A]'}>{shipmentData.vessel}</strong></span>
              <span className="flex items-center gap-1">
                <Clock className={`w-3 h-3 ${isDark ? 'text-[#00E5FF]' : 'text-brand-600'}`} /> {shipmentData.last_update}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
