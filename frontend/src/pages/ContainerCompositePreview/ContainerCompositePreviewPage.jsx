import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ContainerCompositeNavbar } from './ContainerCompositeNavbar';
import { ContainerCompositeSection } from '../../components/containers/ContainerCompositeSection';
import { ArrowLeft } from 'lucide-react';

export function ContainerCompositePreviewPage() {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen lg:h-screen lg:max-h-screen w-full transition-colors duration-300 pt-[78px] lg:pt-[82px] pb-2 px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col justify-between overflow-x-hidden ${
        isDark ? 'bg-transparent text-white' : 'bg-transparent text-[#0F172A]'
      }`}
    >
      {/* ─── DEDICATED PREVIEW NAVBAR ─── */}
      <ContainerCompositeNavbar />

      {/* ─── TOP SECTION: BACK BUTTON & HERO HEADINGS ─── */}
      <div className="w-full max-w-6xl mx-auto flex flex-col shrink-0">
        
        {/* Clean Back Button */}
        <div className="w-full flex items-center justify-start mb-2 lg:mb-2.5">
          <Link
            to="/container-section"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#475569] hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors py-1 px-2.5 -ml-2.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/[0.06]"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Back to Container Section</span>
          </Link>
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

      {/* ─── REUSABLE COMPOSITE CONTAINER SECTION ─── */}
      <ContainerCompositeSection className="flex-1 flex flex-col justify-between min-h-0" />
    </div>
  );
}

export default ContainerCompositePreviewPage;
