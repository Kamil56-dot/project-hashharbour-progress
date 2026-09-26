import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ServiceCard Component — Astro Reference Style
 * Rounded navy/white card frame hanging from a top clip/pin icon,
 * with real thematic photo/image, bold title, and one-line description.
 * Vertical position and rotation follow the hanging rope curve via CSS variables.
 */
export function ServiceCard({
  title,
  description,
  image,
  className = '',
  onClick,
}) {
  const { isDark } = useTheme();

  return (
    <div
      onClick={onClick}
      className={`service-card-wrapper group relative w-full cursor-pointer select-none ${className}`}
      style={{
        transform: 'translate3d(0, var(--card-y, 0px), 0) rotate(var(--card-rot, 0deg))',
        transformOrigin: 'top center',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, filter 0.3s ease',
        willChange: 'transform, opacity, filter',
      }}
    >
      {/* ── Top Pin / Clip Tag (Anchored to the dashed rope) ── */}
      <div
        className="absolute -top-3.5 sm:-top-4 left-1/2 -translate-x-1/2 z-20 w-6 sm:w-7 h-8 sm:h-9 rounded-[5px] flex items-start justify-center pt-1.5 transition-transform duration-300 group-hover:scale-110"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #00E5FF 0%, #0284C7 100%)'
            : 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)',
          boxShadow: isDark
            ? '0 2px 12px rgba(0, 229, 255, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.6)'
            : '0 2px 8px rgba(2, 132, 199, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
        }}
        aria-hidden="true"
      >
        {/* Clip Eyelet Hole through which the rope passes */}
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            isDark ? 'bg-[#061426] border border-cyan-200/80 shadow-inner' : 'bg-white border border-sky-400'
          }`}
        />
      </div>

      {/* ── Rounded Card Frame ── */}
      <div
        className={`w-full rounded-[22px] sm:rounded-[26px] p-3 sm:p-3.5 border transition-all duration-300 flex flex-col items-center ${
          isDark
            ? 'bg-[#0B1E36]/95 backdrop-blur-md border-white/10 group-hover:border-[#00E5FF]/80 shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(0,229,255,0.04)] group-hover:shadow-[0_24px_55px_rgba(0,229,255,0.3)]'
            : 'bg-white border-blue-100/90 group-hover:border-brand-400 shadow-[0_16px_40px_rgba(15,40,80,0.07),0_0_1px_1px_rgba(0,0,0,0.03)] group-hover:shadow-[0_24px_50px_rgba(15,40,80,0.18)]'
        }`}
      >
        {/* ── Top Photo / Image Area (Reference 1 Style) ── */}
        <div
          className={`w-full h-[170px] sm:h-[190px] lg:h-[200px] rounded-[16px] sm:rounded-[18px] relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.02] ${
            isDark ? 'bg-[#061426] border border-cyan-500/20' : 'bg-slate-100 border border-blue-100'
          }`}
        >
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />

          {/* Subtle Bottom Vignette Gradient */}
          <div
            className={`absolute inset-0 pointer-events-none ${
              isDark
                ? 'bg-gradient-to-t from-[#0B1E36]/60 via-transparent to-transparent'
                : 'bg-gradient-to-t from-black/20 via-transparent to-transparent'
            }`}
          />
        </div>

        {/* ── Bottom Text Area: Title + One-Line Description ── */}
        <div className="w-full pt-3.5 pb-3 px-2 flex flex-col items-center text-center">
          <h3
            className={`font-sans font-bold text-base sm:text-[17px] tracking-tight leading-snug transition-colors duration-200 ${
              isDark ? 'text-white group-hover:text-cyan-300' : 'text-[#0F172A] group-hover:text-brand-600'
            }`}
          >
            {title}
          </h3>
          <p
            className={`font-sans text-xs sm:text-[13px] leading-relaxed mt-2 ${
              isDark ? 'text-slate-300/80' : 'text-[#64748B]'
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
