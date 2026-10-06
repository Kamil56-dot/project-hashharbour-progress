import React, { useState } from 'react';
import { User, Pencil, Contact, AlertCircle } from 'lucide-react';

export function BillingAddressCard({
  billingAddress,
  onSaveBillingAddress,
  isDark,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: billingAddress.fullName || '',
    address: billingAddress.address || '',
    city: billingAddress.city || '',
    state: billingAddress.state || '',
    country: billingAddress.country || '',
    postalCode: billingAddress.postalCode || '',
  });
  const [errors, setErrors] = useState({});

  const handleStartEdit = () => {
    setFormData({
      fullName: billingAddress.fullName || '',
      address: billingAddress.address || '',
      city: billingAddress.city || '',
      state: billingAddress.state || '',
      country: billingAddress.country || '',
      postalCode: billingAddress.postalCode || '',
    });
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      fullName: billingAddress.fullName || '',
      address: billingAddress.address || '',
      city: billingAddress.city || '',
      state: billingAddress.state || '',
      country: billingAddress.country || '',
      postalCode: billingAddress.postalCode || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSaveBillingAddress({
      fullName: formData.fullName.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      postalCode: formData.postalCode.trim(),
    });
    setIsEditing(false);
  };

  // Formatted address line string for display
  const formattedAddress = [
    billingAddress.address,
    billingAddress.city && billingAddress.city.toLowerCase() !== billingAddress.address.toLowerCase()
      ? billingAddress.city
      : null,
    billingAddress.state,
    billingAddress.country ? `${billingAddress.country} - ${billingAddress.postalCode}` : billingAddress.postalCode,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="w-full mt-6 sm:mt-7 lg:mt-8">
      {/* Bordered Card */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 transition-colors duration-200 ${
          isDark
            ? 'bg-white/[0.02] border-white/10'
            : 'bg-white border-blue-100/70 shadow-xs'
        }`}
      >
        {/* Section Header: Icon + Billing Address */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
              isDark
                ? 'bg-white/[0.06] text-[#38BDF8]'
                : 'bg-[#EBF3FB] text-[#1E88E5]'
            }`}
          >
            <Contact className="w-3.5 h-3.5" />
          </div>
          <h3
            className={`text-[15px] sm:text-[16px] font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-[#0F172A]'
            }`}
          >
            Billing Address
          </h3>
        </div>

        {/* Thin Divider Line */}
        <div
          className={`border-t my-3 sm:my-3.5 transition-colors ${
            isDark ? 'border-white/10' : 'border-slate-100'
          }`}
        />

        {/* View Mode vs Edit Mode */}
        {!isEditing ? (
          <div className="flex items-start sm:items-center justify-between gap-3">
            {/* User Icon + Info */}
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition-colors ${
                  isDark
                    ? 'bg-white/[0.06] text-[#38BDF8]'
                    : 'bg-[#EBF3FB] text-[#1E88E5]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span
                  id="billing-display-name"
                  className={`block text-[13px] sm:text-[14px] font-semibold leading-tight truncate ${
                    isDark ? 'text-white' : 'text-[#0F172A]'
                  }`}
                >
                  {billingAddress.fullName}
                </span>
                <span
                  id="billing-display-address"
                  className={`block text-[12px] sm:text-[13px] font-normal leading-normal mt-0.5 ${
                    isDark ? 'text-slate-400' : 'text-[#8FA0B5]'
                  }`}
                >
                  {formattedAddress}
                </span>
              </div>
            </div>

            {/* Right: Edit Button */}
            <button
              type="button"
              id="billing-edit-btn"
              onClick={handleStartEdit}
              className="inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] font-semibold text-[#1E88E5] hover:text-[#1565C0] dark:text-[#38BDF8] dark:hover:text-[#7DD3FC] py-1 px-2.5 rounded-lg transition-colors cursor-pointer select-none shrink-0 hover:bg-blue-50 dark:hover:bg-white/5 active:scale-95"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        ) : (
          /* Inline Edit Form */
          <form
            id="billing-edit-form"
            onSubmit={handleSubmit}
            className="pt-1 space-y-3.5 animate-in fade-in duration-150"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="billing-form-fullname"
                  className={`block text-[11px] sm:text-[12px] font-semibold mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="billing-form-fullname"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="e.g. John Wilson"
                  className={`w-full rounded-full px-4 py-2.5 text-xs sm:text-sm transition-all outline-none ${
                    errors.fullName
                      ? 'border border-red-400 bg-red-50/30 text-red-900 dark:text-red-200'
                      : isDark
                        ? 'bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:border-[#38BDF8] focus:ring-3 focus:ring-[#38BDF8]/15'
                        : 'bg-[#F8FAFC] border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#1E88E5] focus:bg-white focus:ring-3 focus:ring-[#1E88E5]/10'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="billing-form-address"
                  className={`block text-[11px] sm:text-[12px] font-semibold mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="billing-form-address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="e.g. Una"
                  className={`w-full rounded-full px-4 py-2.5 text-xs sm:text-sm transition-all outline-none ${
                    errors.address
                      ? 'border border-red-400 bg-red-50/30 text-red-900 dark:text-red-200'
                      : isDark
                        ? 'bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:border-[#38BDF8] focus:ring-3 focus:ring-[#38BDF8]/15'
                        : 'bg-[#F8FAFC] border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#1E88E5] focus:bg-white focus:ring-3 focus:ring-[#1E88E5]/10'
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="billing-form-city"
                  className={`block text-[11px] sm:text-[12px] font-semibold mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="billing-form-city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g. Una"
                  className={`w-full rounded-full px-4 py-2.5 text-xs sm:text-sm transition-all outline-none ${
                    errors.city
                      ? 'border border-red-400 bg-red-50/30 text-red-900 dark:text-red-200'
                      : isDark
                        ? 'bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:border-[#38BDF8] focus:ring-3 focus:ring-[#38BDF8]/15'
                        : 'bg-[#F8FAFC] border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#1E88E5] focus:bg-white focus:ring-3 focus:ring-[#1E88E5]/10'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.city}</span>
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="billing-form-state"
                  className={`block text-[11px] sm:text-[12px] font-semibold mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  id="billing-form-state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="e.g. Gujarat"
                  className={`w-full rounded-full px-4 py-2.5 text-xs sm:text-sm transition-all outline-none ${
                    errors.state
                      ? 'border border-red-400 bg-red-50/30 text-red-900 dark:text-red-200'
                      : isDark
                        ? 'bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:border-[#38BDF8] focus:ring-3 focus:ring-[#38BDF8]/15'
                        : 'bg-[#F8FAFC] border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#1E88E5] focus:bg-white focus:ring-3 focus:ring-[#1E88E5]/10'
                  }`}
                />
                {errors.state && (
                  <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.state}</span>
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="billing-form-country"
                  className={`block text-[11px] sm:text-[12px] font-semibold mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  id="billing-form-country"
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  placeholder="e.g. India"
                  className={`w-full rounded-full px-4 py-2.5 text-xs sm:text-sm transition-all outline-none ${
                    errors.country
                      ? 'border border-red-400 bg-red-50/30 text-red-900 dark:text-red-200'
                      : isDark
                        ? 'bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:border-[#38BDF8] focus:ring-3 focus:ring-[#38BDF8]/15'
                        : 'bg-[#F8FAFC] border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#1E88E5] focus:bg-white focus:ring-3 focus:ring-[#1E88E5]/10'
                  }`}
                />
                {errors.country && (
                  <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.country}</span>
                  </p>
                )}
              </div>

              {/* Postal Code */}
              <div>
                <label
                  htmlFor="billing-form-postalcode"
                  className={`block text-[11px] sm:text-[12px] font-semibold mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="billing-form-postalcode"
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  placeholder="e.g. 362560"
                  className={`w-full rounded-full px-4 py-2.5 text-xs sm:text-sm transition-all outline-none ${
                    errors.postalCode
                      ? 'border border-red-400 bg-red-50/30 text-red-900 dark:text-red-200'
                      : isDark
                        ? 'bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:border-[#38BDF8] focus:ring-3 focus:ring-[#38BDF8]/15'
                        : 'bg-[#F8FAFC] border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#1E88E5] focus:bg-white focus:ring-3 focus:ring-[#1E88E5]/10'
                  }`}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.postalCode}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons: 44px pill buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                id="billing-save-btn"
                className="h-[44px] px-6 rounded-full bg-[#1E88E5] hover:bg-[#1976D2] text-white font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(30,136,229,0.3)] cursor-pointer active:scale-[0.99] flex items-center justify-center"
              >
                Save Address
              </button>
              <button
                type="button"
                id="billing-cancel-btn"
                onClick={handleCancel}
                className={`h-[44px] px-6 rounded-full border text-sm font-semibold transition-all cursor-pointer active:scale-[0.99] flex items-center justify-center ${
                  isDark
                    ? 'border-white/20 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default BillingAddressCard;
