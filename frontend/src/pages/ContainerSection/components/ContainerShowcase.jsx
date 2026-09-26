import React, { useState } from 'react';
import { Box, RotateCcw, Smartphone, Download, ArrowRight } from 'lucide-react';
import ShippingContainer3D from './3d/ShippingContainer3D';
import { useTheme } from '../../../context/ThemeContext';

const features = [
  {
    icon: RotateCcw,
    label: '360° Interactive',
    desc: 'Drag to rotate in any direction',
  },
  {
    icon: Smartphone,
    label: 'Mobile Optimized',
    desc: 'Touch gestures fully supported',
  },
  {
    icon: Download,
    label: 'Export Ready',
    desc: 'Download as GLB/GLTF model',
  },
];

const COLOR_PRESETS = [
  { name: 'Marine Blue',       hex: '#1D3F6E' },
  { name: 'Container Red',     hex: '#8B2500' },
  { name: 'Evergreen Green',   hex: '#2E5939' },
  { name: 'Slate Grey',        hex: '#5A5F65' },
  { name: 'Industrial White',  hex: '#C8C5B8' },
  { name: 'Safety Yellow',     hex: '#C49B1A' },
  { name: 'Orange',            hex: '#B35C1E' },
  { name: 'Dark Charcoal',     hex: '#2A2A2A' },
];

export default function ContainerShowcase({ onBookContainer }) {
  const { isDark } = useTheme();
  const [containerColor, setContainerColor] = useState(COLOR_PRESETS[0].hex);
  const activePreset = COLOR_PRESETS.find(c => c.hex === containerColor) || COLOR_PRESETS[0];

  return (
    <section
      id="container-showcase"
      className="relative w-full pt-4 md:pt-6 pb-16 md:pb-24 overflow-hidden"
    >
      {/* Subtle background atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#060B14] via-[#0A1628] to-[#060B14]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#00E5FF]/[0.03] blur-[120px]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[#EBF3FC]" />
            <div
              className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(195, 225, 255, 0.75) 0%, rgba(235, 243, 252, 0) 70%)',
              }}
            />
            <div
              className="absolute top-[20%] -right-[15%] w-[55vw] h-[55vw] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(180, 218, 255, 0.65) 0%, rgba(235, 243, 252, 0) 70%)',
              }}
            />
          </>
        )}
      </div>

      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-20 animate-fade-in-up">
          {/* Top Badge */}
          <div
            className={`inline-flex items-center gap-2 rounded-full px-5 py-[7px] mb-6 backdrop-blur-md transition-colors duration-200 ${
              isDark
                ? 'bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]'
                : 'bg-brand-500/10 border border-brand-200/80 text-brand-600 shadow-xs'
            }`}
          >
            <Box className={`w-4 h-4 ${isDark ? 'text-[#00E5FF]' : 'text-brand-500'}`} />
            <span className="text-[13px] font-medium tracking-wide">
              3D Container Preview
            </span>
          </div>

          <h2
            className={`text-[32px] sm:text-[40px] md:text-[48px] font-bold leading-tight tracking-tight mb-4 transition-colors duration-200 ${
              isDark ? 'text-white' : 'text-[#0F172A]'
            }`}
          >
            Our Shipping{' '}
            <span className={isDark ? 'text-[#00E5FF]' : 'text-brand-600'}>
              Container
            </span>
          </h2>

          <p
            className={`text-[15px] sm:text-[16px] leading-relaxed max-w-[560px] mx-auto transition-colors duration-200 ${
              isDark ? 'text-white/55' : 'text-slate-600'
            }`}
          >
            Explore the #HASHHARBOUR branded 20-foot ISO shipping container
            in full 3D. Rotate, zoom, and inspect every detail.
          </p>
        </div>

        {/* Main Content — Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14 items-center">
          {/* Left — Info Panel */}
          <div className="flex flex-col gap-8">
            {/* Text Block */}
            <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
              <h3
                className={`text-[22px] sm:text-[26px] font-semibold leading-snug mb-3 transition-colors duration-200 ${
                  isDark ? 'text-white' : 'text-[#0F172A]'
                }`}
              >
                20-Foot ISO Standard
              </h3>
              <p
                className={`text-[14px] leading-[1.75] max-w-[420px] transition-colors duration-200 ${
                  isDark ? 'text-white/50' : 'text-slate-600'
                }`}
              >
                Built to international ISO 668 specifications with corrugated
                steel walls, reinforced corner castings, and double-door locking
                mechanism — exactly like the real thing, rendered in your browser.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="flex flex-col gap-4">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 group animate-fade-in-up"
                    style={{ animationDelay: `${160 + idx * 60}ms` }}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300 ${
                        isDark
                          ? 'bg-[#00E5FF]/10 border-[#00E5FF]/20 text-[#00E5FF] group-hover:bg-[#00E5FF]/20 group-hover:border-[#00E5FF]/50'
                          : 'bg-brand-500/10 border-brand-200 text-brand-600 group-hover:bg-brand-500/20 group-hover:border-brand-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div>
                      <span
                        className={`text-[15px] font-semibold block leading-tight transition-colors duration-300 ${
                          isDark
                            ? 'text-white group-hover:text-[#00E5FF]'
                            : 'text-[#0F172A] group-hover:text-brand-600'
                        }`}
                      >
                        {feat.label}
                      </span>
                      <span
                        className={`text-[13px] leading-snug transition-colors duration-200 ${
                          isDark ? 'text-white/45' : 'text-slate-500'
                        }`}
                      >
                        {feat.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="pt-4 animate-fade-in-up" style={{ animationDelay: '360ms' }}>
              <button
                onClick={onBookContainer}
                aria-label="Book My Container"
                className={`group w-full max-w-[240px] h-[56px] rounded-full font-extrabold text-[14px] tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline-none ${
                  isDark
                    ? 'bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#060B14] shadow-[0_0_20px_rgba(0,229,255,0.35)] hover:shadow-[0_0_28px_rgba(0,229,255,0.6)] hover:scale-[1.02] active:scale-[0.97]'
                    : 'bg-gradient-to-r from-[#1E88E5] to-[#1976D2] text-white shadow-[0_4px_20px_rgba(30,136,229,0.35)] hover:shadow-[0_6px_28px_rgba(30,136,229,0.5)] hover:scale-[1.02] active:scale-[0.97]'
                }`}
              >
                <span>Book My Container</span>
                <ArrowRight
                  className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${
                    isDark ? 'text-[#060B14]' : 'text-white'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right — 3D Container Showcase */}
          <div className="relative select-none animate-fade-in-up" style={{ animationDelay: '120ms' }}>
            <div
              id="container-3d-viewport"
              role="region"
              aria-label="3D Interactive Shipping Container Model Viewer. Touch or drag to rotate 360 degrees."
              className={`relative w-full aspect-[4/3] md:aspect-[16/11] min-h-[400px] rounded-2xl overflow-hidden border transition-all duration-500 select-none ${
                isDark
                  ? 'glass-panel border-[#00E5FF]/20 hover:border-[#00E5FF]/40 bg-[#060B14]/40'
                  : 'bg-white/80 backdrop-blur-md border-blue-200/90 hover:border-brand-400 shadow-[0_12px_40px_rgba(15,40,80,0.08)]'
              }`}
            >
              {/* Animated Grid Background */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: isDark
                    ? 'linear-gradient(rgba(0,229,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.4) 1px, transparent 1px)'
                    : 'linear-gradient(rgba(30,136,229,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,136,229,0.35) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Radial glow behind placeholder */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-[80px] pointer-events-none ${
                  isDark ? 'bg-[#00E5FF]/[0.06]' : 'bg-brand-500/[0.08]'
                }`}
              />

              {/* Real 3D Container Viewport */}
              <div className="absolute inset-0 z-10 select-none">
                <ShippingContainer3D containerColor={containerColor} autoRotate={true} />
              </div>

              {/* Corner accents */}
              <div
                className={`absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 rounded-tl-sm pointer-events-none ${
                  isDark ? 'border-[#00E5FF]/30' : 'border-brand-500/35'
                }`}
              />
              <div
                className={`absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 rounded-tr-sm pointer-events-none ${
                  isDark ? 'border-[#00E5FF]/30' : 'border-brand-500/35'
                }`}
              />
              <div
                className={`absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 rounded-bl-sm pointer-events-none ${
                  isDark ? 'border-[#00E5FF]/30' : 'border-brand-500/35'
                }`}
              />
              <div
                className={`absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 rounded-br-sm pointer-events-none ${
                  isDark ? 'border-[#00E5FF]/30' : 'border-brand-500/35'
                }`}
              />
            </div>

            {/* Premium Compact Configurator Palette */}
            <div
              className={`mt-4 px-4 py-2.5 rounded-full backdrop-blur-xl border shadow-xl flex items-center justify-between gap-3 max-w-md mx-auto select-none transition-colors duration-200 ${
                isDark
                  ? 'bg-[#0B1528]/90 border-[#00E5FF]/20 text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                  : 'bg-white/95 border-blue-200/90 text-[#0F172A] shadow-[0_8px_30px_rgba(15,40,80,0.08)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm transition-colors duration-300"
                  style={{ backgroundColor: activePreset.hex }}
                />
                <span
                  className={`text-[12px] font-bold tracking-wide transition-colors duration-200 ${
                    isDark ? 'text-white' : 'text-[#0F172A]'
                  }`}
                >
                  {activePreset.name}
                </span>
              </div>

              <div
                role="radiogroup"
                aria-label="Container exterior color finish options"
                className={`flex items-center gap-1.5 p-1 rounded-full border transition-colors duration-200 ${
                  isDark
                    ? 'bg-[#060B14]/80 border-white/10'
                    : 'bg-slate-100 border-slate-200'
                }`}
              >
                {COLOR_PRESETS.map((preset, idx) => {
                  const isActive = containerColor === preset.hex;
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      aria-label={`Select ${preset.name} container finish`}
                      title={preset.name}
                      onClick={() => setContainerColor(preset.hex)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowRight') {
                          const nextIdx = (idx + 1) % COLOR_PRESETS.length;
                          setContainerColor(COLOR_PRESETS[nextIdx].hex);
                        } else if (e.key === 'ArrowLeft') {
                          const prevIdx = (idx - 1 + COLOR_PRESETS.length) % COLOR_PRESETS.length;
                          setContainerColor(COLOR_PRESETS[prevIdx].hex);
                        }
                      }}
                      className={`relative w-5 h-5 rounded-full border transition-all duration-300 cursor-pointer focus-visible:outline-none ${
                        isActive
                          ? isDark
                            ? 'scale-110 border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.8)] ring-1 ring-[#00E5FF]/50'
                            : 'scale-110 border-brand-600 shadow-[0_0_10px_rgba(30,136,229,0.7)] ring-1 ring-brand-500/50'
                          : isDark
                            ? 'border-white/20 opacity-65 hover:opacity-100 hover:scale-110 hover:border-white/60'
                            : 'border-slate-300 opacity-75 hover:opacity-100 hover:scale-110 hover:border-slate-500'
                      }`}
                      style={{ backgroundColor: preset.hex }}
                    >
                      {isActive && (
                        <span className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Integrated Configurator Action CTA Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={onBookContainer}
                aria-label="Book My Container"
                className={`group w-full max-w-[240px] h-[56px] rounded-full font-extrabold text-[14px] tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline-none ${
                  isDark
                    ? 'bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#060B14] shadow-[0_0_20px_rgba(0,229,255,0.35)] hover:shadow-[0_0_28px_rgba(0,229,255,0.6)] hover:scale-[1.02] active:scale-[0.97]'
                    : 'bg-gradient-to-r from-[#1E88E5] to-[#1976D2] text-white shadow-[0_4px_20px_rgba(30,136,229,0.35)] hover:shadow-[0_6px_28px_rgba(30,136,229,0.5)] hover:scale-[1.02] active:scale-[0.97]'
                }`}
              >
                <span>Book My Container</span>
                <ArrowRight
                  className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${
                    isDark ? 'text-[#060B14]' : 'text-white'
                  }`}
                />
              </button>
            </div>

            {/* Bottom label */}
            <div className="flex items-center justify-center gap-3 mt-3 select-none">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isDark ? 'bg-[#00E5FF]/50' : 'bg-brand-500/70'
                }`}
              />
              <span
                className={`text-[12px] tracking-widest uppercase transition-colors duration-200 ${
                  isDark ? 'text-white/40' : 'text-slate-500'
                }`}
              >
                #HASHHARBOUR Container — 20ft ISO
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
