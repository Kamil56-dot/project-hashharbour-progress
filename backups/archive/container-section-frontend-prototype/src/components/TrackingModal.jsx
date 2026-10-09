import React, { useState } from 'react';
import { X, Search, Package, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function TrackingModal({ isOpen, onClose }) {
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
      // API call to Django REST backend
      const res = await axios.get(`http://localhost:8000/api/shipments/track/?tracking_no=${encodeURIComponent(trackingNo.trim())}`);
      setShipmentData(res.data);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-[540px] rounded-2xl p-7 relative border border-[#00E5FF]/30 shadow-[0_0_50px_rgba(0,229,255,0.15)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Track Your Shipment</h3>
            <p className="text-xs text-white/60">Enter container or bill of lading number</p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-6">
          <input
            type="text"
            value={trackingNo}
            onChange={(e) => setTrackingNo(e.target.value)}
            placeholder="e.g. HH-100293"
            className="flex-1 bg-white/5 border border-white/20 focus:border-[#00E5FF] focus:outline-none rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#00E5FF] text-[#060B14] hover:bg-[#00B8D4] font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Container */}
        {shipmentData && (
          <div className="bg-[#060B14]/80 border border-[#00E5FF]/20 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-white/50 block">Status</span>
                <span className="text-sm font-bold text-[#00E5FF] flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                  {shipmentData.status}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-white/50 block">ETA</span>
                <span className="text-sm font-semibold text-white mt-0.5">{shipmentData.eta}</span>
              </div>
            </div>

            {/* Route visual */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/80 font-medium">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#00E5FF]" /> {shipmentData.origin}</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-[#00E5FF]" /> {shipmentData.destination}</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00E5FF]/60 to-[#00E5FF] rounded-full transition-all duration-1000"
                  style={{ width: `${shipmentData.progress_percent}%` }}
                />
              </div>
            </div>

            <div className="pt-2 text-xs text-white/60 flex items-center justify-between">
              <span>Vessel: <strong className="text-white">{shipmentData.vessel}</strong></span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#00E5FF]" /> {shipmentData.last_update}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
