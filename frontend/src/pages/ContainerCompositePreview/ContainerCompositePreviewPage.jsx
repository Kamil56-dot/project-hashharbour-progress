import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import redContainerImg from '../../assets/containers/red container.png';
import oilTankImg from '../../assets/containers/oil-tank-container.png';
import reeferImg from '../../assets/containers/reefer container.png';
import { ChevronLeft, ChevronRight, ArrowRight, Globe, ShieldCheck, Sun, Moon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ContainerCompositePreviewPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen lg:h-screen lg:max-h-screen w-full transition-colors duration-300 pt-[82px] lg:pt-[90px] pb-2 px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col justify-between overflow-x-hidden ${
        isDark ? 'bg-[#060B14] text-white' : 'bg-[#EBF3FC] text-[#0F172A]'
      }`}
    >
      {/* ─── TOP SECTION: TOOLBAR & HERO HEADINGS ─── */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center shrink-0">
        
        {/* Compact Navigation & Experiment Info */}
        <div className="w-full flex items-center justify-between gap-2 mb-1 pb-1 border-b border-black/[0.05] dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Link
              to="/container-section"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Container Section</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 dark:bg-cyan-400/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-400/20">
              /container-composite-preview
            </span>
          </div>

          <button
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white dark:bg-white/10 shadow-xs border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/15 transition-all text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {isDark ? (
              <>
                <Sun className="w-3 h-3 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3 h-3 text-blue-600" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>

        {/* Reference Hero Title Block */}
        <div className="text-center my-0.5">
          <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-cyan-400 mb-0.5">
            Global Logistics Solutions
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-extrabold tracking-tight text-[#0F172A] dark:text-white leading-tight mb-0.5">
            Intermodal Cargo Container Platform
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-normal line-clamp-1">
            Reliable containers. Global reach. Flexible solutions for your import and export needs.
          </p>
        </div>
      </div>

      {/* ─── CENTER STAGE: 3-CONTAINER SPACIOUS COMPOSITE ─── */}
      {/* Sitting directly on page background with no boxes, cards, or borders */}
      <div className="relative w-full max-w-[1440px] mx-auto flex items-center justify-center my-auto shrink-0 px-2 sm:px-6 lg:px-12">
        
        {/* Left Floating Circular Navigation Arrow (at outer edge, completely clear of containers) */}
        <div className="hidden sm:flex absolute left-0 lg:left-2 xl:left-4 top-1/2 -translate-y-1/2 z-30">
          <div
            className={`w-10 h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center transition-all ${
              isDark
                ? 'bg-white/5 border border-white/10 text-cyan-400 shadow-lg shadow-black/40'
                : 'bg-blue-500/10 border border-blue-200/70 text-blue-600 shadow-sm'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </div>
        </div>

        {/* Right Floating Circular Navigation Arrow (at outer edge, completely clear of containers) */}
        <div className="hidden sm:flex absolute right-0 lg:right-2 xl:right-4 top-1/2 -translate-y-1/2 z-30">
          <div
            className={`w-10 h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center transition-all ${
              isDark
                ? 'bg-white/5 border border-white/10 text-cyan-400 shadow-lg shadow-black/40'
                : 'bg-blue-500/10 border border-blue-200/70 text-blue-600 shadow-sm'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>

        {/* ── Container Stage (Exact Height & Baseline Ground Plane) ── */}
        <div className="relative w-full h-[260px] sm:h-[290px] md:h-[320px] lg:h-[350px] xl:h-[385px] flex items-end justify-center select-none">
          
          {/* Subtle Studio Floor Atmosphere */}
          <div
            className="absolute inset-x-0 bottom-0 h-[200px] pointer-events-none -z-10"
            style={{
              background: isDark
                ? 'radial-gradient(ellipse 75% 55% at 50% 90%, rgba(14, 27, 49, 0.42) 0%, rgba(6, 11, 20, 0) 80%)'
                : 'radial-gradient(ellipse 75% 55% at 50% 90%, rgba(215, 233, 252, 0.65) 0%, rgba(235, 243, 252, 0) 80%)',
            }}
          />

          {/* ══════════════════════════════════════════════════════════
              1. LEFT CONTAINER: Oil / Tank (orange)
              - ~56-58% height proportion of red container
              - Proper deliberate gap from center red container (no overlap)
              - Bottom rails sit flush on the EXACT SAME ground line
              - Clean native alpha transparency (no white background, no flash)
              - Z-index: 10
             ══════════════════════════════════════════════════════════ */}
          <div className="absolute right-[calc(50%+145px)] sm:right-[calc(50%+180px)] md:right-[calc(50%+215px)] lg:right-[calc(50%+245px)] xl:right-[calc(50%+270px)] bottom-[17px] sm:bottom-[21px] md:bottom-[25px] lg:bottom-[29px] xl:bottom-[32px] z-10 w-[180px] sm:w-[230px] md:w-[280px] lg:w-[325px] xl:w-[355px] pointer-events-none">
            {/* Ground Contact Shadow beneath skid base */}
            <div
              className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-[86%] h-[10px] sm:h-[14px] lg:h-[18px] rounded-[100%] pointer-events-none"
              style={{
                background: isDark
                  ? 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.5) 55%, transparent 75%)'
                  : 'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.18) 55%, transparent 75%)',
                filter: isDark ? 'blur(5px)' : 'blur(4px)',
              }}
            />
            {/* Diffuse Floor Shadow */}
            <div
              className="absolute -bottom-[2%] left-1/2 -translate-x-1/2 w-[98%] h-[16px] sm:h-[22px] lg:h-[26px] rounded-[100%] pointer-events-none"
              style={{
                background: isDark
                  ? 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.55) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.16) 0%, transparent 70%)',
                filter: 'blur(12px)',
              }}
            />
            {/* Tank Container Image — Direct Render, No Hack */}
            <img
              src={oilTankImg}
              alt="Oil and Tank Container"
              className="w-full h-auto object-contain block relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
              loading="eager"
            />
          </div>

          {/* ══════════════════════════════════════════════════════════
              2. CENTER CONTAINER: Standard Dry (red)
              - Prominent, foreground anchor
              - Bottom sits on ground baseline
              - Clean native alpha transparency (no white background, no flash)
              - Z-index: 20
             ══════════════════════════════════════════════════════════ */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-20 w-[280px] sm:w-[350px] md:w-[420px] lg:w-[480px] xl:w-[530px] pointer-events-none">
            {/* Ground Contact Shadow beneath base rails */}
            <div
              className="absolute bottom-[9%] left-1/2 -translate-x-1/2 w-[88%] h-[14px] sm:h-[18px] lg:h-[24px] rounded-[100%] pointer-events-none"
              style={{
                background: isDark
                  ? 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 0.55) 60%, transparent 80%)'
                  : 'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.52) 0%, rgba(15, 23, 42, 0.22) 55%, transparent 75%)',
                filter: isDark ? 'blur(7px)' : 'blur(6px)',
              }}
            />
            {/* Diffuse Floor Shadow */}
            <div
              className="absolute bottom-[1%] left-1/2 -translate-x-1/2 w-[104%] h-[24px] sm:h-[32px] lg:h-[40px] rounded-[100%] pointer-events-none"
              style={{
                background: isDark
                  ? 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.65) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.2) 0%, transparent 70%)',
                filter: 'blur(16px)',
              }}
            />
            {/* Red Container Image — Direct Render, No Hack */}
            <img
              src={redContainerImg}
              alt="Standard Dry Shipping Container"
              className="w-full h-auto object-contain block relative z-10 drop-shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
              loading="eager"
            />
          </div>

          {/* ══════════════════════════════════════════════════════════
              3. RIGHT CONTAINER: Reefer (white)
              - ~56-58% height proportion of red container
              - Proper deliberate gap from center red container (no overlap)
              - Bottom rails sit flush on the EXACT SAME ground line
              - Clean native alpha transparency (no white background, no flash)
              - Z-index: 10
             ══════════════════════════════════════════════════════════ */}
          <div className="absolute left-[calc(50%+150px)] sm:left-[calc(50%+185px)] md:left-[calc(50%+220px)] lg:left-[calc(50%+250px)] xl:left-[calc(50%+275px)] bottom-[10px] sm:bottom-[12px] md:bottom-[15px] lg:bottom-[17px] xl:bottom-[19px] z-10 w-[165px] sm:w-[210px] md:w-[255px] lg:w-[295px] xl:w-[325px] pointer-events-none">
            {/* Ground Contact Shadow beneath white base rails */}
            <div
              className="absolute bottom-[9%] left-1/2 -translate-x-1/2 w-[86%] h-[10px] sm:h-[14px] lg:h-[18px] rounded-[100%] pointer-events-none"
              style={{
                background: isDark
                  ? 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.5) 55%, transparent 75%)'
                  : 'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.18) 55%, transparent 75%)',
                filter: isDark ? 'blur(5px)' : 'blur(4px)',
              }}
            />
            {/* Diffuse Floor Shadow */}
            <div
              className="absolute bottom-[1%] left-1/2 -translate-x-1/2 w-[100%] h-[16px] sm:h-[22px] lg:h-[28px] rounded-[100%] pointer-events-none"
              style={{
                background: isDark
                  ? 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.55) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.16) 0%, transparent 70%)',
                filter: 'blur(14px)',
              }}
            />
            {/* Reefer Container Image — Direct Render, No Hack */}
            <img
              src={reeferImg}
              alt="Reefer Temperature-Controlled Container"
              className="w-full h-auto object-contain block relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
              loading="eager"
            />
          </div>

        </div>
      </div>

      {/* ─── BOTTOM SECTION: INDICATORS, CTAS & PILLARS (COMPACT) ─── */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center shrink-0">
        
        {/* Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-2 my-0.5" aria-label="Reference indicators">
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/20 transition-colors" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#0088FF] shadow-[0_0_10px_rgba(0,136,255,0.7)] ring-2 ring-[#0088FF]/30 transition-all" />
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/20 transition-colors" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/20 transition-colors" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/20 transition-colors" />
        </div>

        {/* Reference Subtitle & CTA */}
        <div className="text-center mt-0.5">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600 dark:text-cyan-400 mb-0.5">
            Intermodal Cargo Container
          </div>
          <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold tracking-tight text-[#0F172A] dark:text-white mb-0.5 leading-tight">
            Flexible. Durable. Global.
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mb-2 font-normal">
            Standard, Tank and Reefer containers available at competitive rates.
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#0088FF] hover:bg-[#0077EE] text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-colors cursor-pointer">
            <span>Explore Containers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Reference Bottom Feature Pillars */}
        <div className="w-full grid grid-cols-2 gap-4 mt-1.5 pt-1.5 border-t border-black/[0.05] dark:border-white/[0.06]">
          <div className="flex items-center justify-start gap-2 text-left">
            <div className="w-6 h-6 rounded-full bg-blue-500/10 dark:bg-cyan-400/10 flex items-center justify-center text-blue-600 dark:text-cyan-400 shrink-0">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Global Shipping</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Worldwide Coverage</div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 text-right">
            <div className="order-2 w-6 h-6 rounded-full bg-blue-500/10 dark:bg-cyan-400/10 flex items-center justify-center text-blue-600 dark:text-cyan-400 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="order-1">
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Safe & Secure</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Your Cargo, Our Priority</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default ContainerCompositePreviewPage;
