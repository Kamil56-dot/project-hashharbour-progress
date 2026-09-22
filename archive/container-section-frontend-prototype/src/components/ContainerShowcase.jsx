import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Box, RotateCcw, Smartphone, Download, ArrowRight } from 'lucide-react';
import ShippingContainer3D from './3d/ShippingContainer3D';

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

// Custom Easing Curve: easeOutCubic
const easeOutCubic = [0.215, 0.61, 0.355, 1.0];

export default function ContainerShowcase({ onBookContainer }) {
  const [containerColor, setContainerColor] = useState(COLOR_PRESETS[0].hex);
  const activePreset = COLOR_PRESETS.find(c => c.hex === containerColor) || COLOR_PRESETS[0];
  const shouldReduceMotion = useReducedMotion();

  // Animation variants (Fallback to immediate visible state when prefers-reduced-motion is true)
  const containerViewportVariant = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.12,
        ease: easeOutCubic,
      },
    },
  };

  const textItemVariant = (delay = 0) => ({
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: easeOutCubic,
      },
    },
  });

  return (
    <section
      id="container-showcase"
      className="relative w-full py-20 md:py-28 overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060B14] via-[#0A1628] to-[#060B14]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#00E5FF]/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-6 md:px-12">
        {/* Section Header (Staggered Reveal) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={textItemVariant(0)}
          className="text-center mb-14 md:mb-20"
        >
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-full px-5 py-[7px] mb-6 backdrop-blur-md">
            <Box className="w-4 h-4 text-[#00E5FF]" />
            <span className="text-[13px] font-medium text-[#00E5FF] tracking-wide">
              3D Container Preview
            </span>
          </div>

          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-white leading-tight tracking-tight mb-4">
            Our Shipping{' '}
            <span className="text-[#00E5FF]">Container</span>
          </h2>

          <p className="text-[15px] sm:text-[16px] text-white/55 leading-relaxed max-w-[560px] mx-auto">
            Explore the #HASHHARBOUR branded 20-foot ISO shipping container
            in full 3D. Rotate, zoom, and inspect every detail.
          </p>
        </motion.div>

        {/* Main Content — Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14 items-center">
          {/* Left — Info Panel (Staggered Sequence) */}
          <div className="flex flex-col gap-8">
            {/* Text Block */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={textItemVariant(0.08)}
            >
              <h3 className="text-[22px] sm:text-[26px] font-semibold text-white leading-snug mb-3">
                20-Foot ISO Standard
              </h3>
              <p className="text-[14px] text-white/50 leading-[1.75] max-w-[420px]">
                Built to international ISO 668 specifications with corrugated
                steel walls, reinforced corner castings, and double-door locking
                mechanism — exactly like the real thing, rendered in your browser.
              </p>
            </motion.div>

            {/* Feature Bullets (Staggered sequence: +60ms per item) */}
            <div className="flex flex-col gap-4">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                    variants={textItemVariant(0.16 + idx * 0.06)}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] shrink-0 group-hover:bg-[#00E5FF]/20 group-hover:border-[#00E5FF]/50 transition-all duration-300">
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div>
                      <span className="text-[15px] font-semibold text-white block leading-tight group-hover:text-[#00E5FF] transition-colors duration-300">
                        {feat.label}
                      </span>
                      <span className="text-[13px] text-white/45 leading-snug">
                        {feat.desc}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button (+360ms sequence delay) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={textItemVariant(0.36)}
              className="pt-4"
            >
              <button
                onClick={onBookContainer}
                aria-label="Book My Container"
                className="group w-full max-w-[240px] h-[56px] rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#060B14] font-extrabold text-[14px] tracking-wide shadow-[0_0_20px_rgba(0,229,255,0.35)] hover:shadow-[0_0_28px_rgba(0,229,255,0.6)] hover:scale-[1.02] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00E5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060B14] focus-visible:outline-none"
              >
                <span>Book My Container</span>
                <ArrowRight className="w-4 h-4 text-[#060B14] transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>

          {/* Right — 3D Container Showcase (Delayed 120ms after text starts) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={containerViewportVariant}
            className="relative select-none"
          >
            <div
              id="container-3d-viewport"
              role="region"
              aria-label="3D Interactive Shipping Container Model Viewer. Touch or drag to rotate 360 degrees."
              className="relative w-full aspect-[4/3] md:aspect-[16/11] min-h-[400px] rounded-2xl overflow-hidden glass-panel border border-[#00E5FF]/20 hover:border-[#00E5FF]/40 transition-all duration-500 select-none"
            >
              {/* Animated Grid Background */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(0,229,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Radial glow behind placeholder */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-[#00E5FF]/[0.06] blur-[80px] pointer-events-none" />

              {/* Real 3D Container Viewport */}
              <div className="absolute inset-0 z-10 select-none">
                <ShippingContainer3D containerColor={containerColor} autoRotate={true} />
              </div>

              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#00E5FF]/30 rounded-tl-sm pointer-events-none" />
              <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#00E5FF]/30 rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#00E5FF]/30 rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#00E5FF]/30 rounded-br-sm pointer-events-none" />
            </div>

            {/* Premium Compact Configurator Palette */}
            <div className="mt-4 px-4 py-2.5 rounded-full bg-[#0B1528]/90 backdrop-blur-xl border border-[#00E5FF]/20 shadow-xl flex items-center justify-between gap-3 max-w-md mx-auto select-none">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm transition-colors duration-300"
                  style={{ backgroundColor: activePreset.hex }}
                />
                <span className="text-[12px] font-bold text-white tracking-wide">
                  {activePreset.name}
                </span>
              </div>

              <div
                role="radiogroup"
                aria-label="Container exterior color finish options"
                className="flex items-center gap-1.5 p-1 rounded-full bg-[#060B14]/80 border border-white/10"
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
                      className={`relative w-5 h-5 rounded-full border transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00E5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060B14] focus-visible:outline-none ${
                        isActive
                          ? 'scale-110 border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.8)] ring-1 ring-[#00E5FF]/50'
                          : 'border-white/20 opacity-65 hover:opacity-100 hover:scale-110 hover:border-white/60'
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
                className="group w-full max-w-[240px] h-[56px] rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#060B14] font-extrabold text-[14px] tracking-wide shadow-[0_0_20px_rgba(0,229,255,0.35)] hover:shadow-[0_0_28px_rgba(0,229,255,0.6)] hover:scale-[1.02] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00E5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060B14] focus-visible:outline-none"
              >
                <span>Book My Container</span>
                <ArrowRight className="w-4 h-4 text-[#060B14] transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Bottom label */}
            <div className="flex items-center justify-center gap-3 mt-3 select-none">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF]/50 animate-pulse" />
              <span className="text-[12px] text-white/40 tracking-widest uppercase">
                #HASHHARBOUR Container — 20ft ISO
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
