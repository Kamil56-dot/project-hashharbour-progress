import React from 'react';
import { ServicesHero } from './ServicesHero';
import { ServicesGrid } from './ServicesGrid';
import { ServicesWorkflow } from './ServicesWorkflow';
import { ServicesCTA } from './ServicesCTA';
import { useTheme } from '../../context/ThemeContext';

/**
 * HashHarbour Homepage — Services Section Master Component
 * Supports Dark Theme (default) and Light Theme matching LoginPage's wavy aesthetic.
 * Expanded max-w-[1650px] container wrapper for near-full-viewport width visual presence.
 */
export function ServicesSection() {
  const { isDark } = useTheme();

  return (
    <section
      id="services"
      aria-label="HashHarbour Services Infrastructure"
      className={`relative w-full min-h-screen pt-[88px] lg:pt-[96px] pb-10 sm:pb-12 lg:pb-14 px-4 sm:px-8 lg:px-12 overflow-hidden flex flex-col items-center justify-start border-t transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-[#061426]/90 via-[#061426] to-surface-900 text-white border-white/5'
          : 'bg-[#EBF3FC] text-[#0F172A] border-blue-100/60'
      }`}
    >
      {/* Background Decorative Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {isDark ? (
          <>
            {/* Dark Mode: Radial Cyan Atmosphere Glow */}
            <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[160px]" />
            <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-[#00C8F5]/5 rounded-full blur-[140px]" />

            {/* Dark Mode: Faint Square Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #00C8F5 1px, transparent 1px), linear-gradient(to bottom, #00C8F5 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
          </>
        ) : (
          <>
            {/* Light Mode: Soft Ambient Mesh Glows (from LoginPage) */}
            <div
              className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(195, 225, 255, 0.75) 0%, rgba(235, 243, 252, 0) 70%)',
              }}
            />
            <div
              className="absolute top-[30%] -right-[15%] w-[55vw] h-[55vw] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(180, 218, 255, 0.65) 0%, rgba(235, 243, 252, 0) 70%)',
              }}
            />
            <div
              className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(200, 230, 255, 0.6) 0%, rgba(235, 243, 252, 0) 70%)',
              }}
            />

            {/* Light Mode: Organic SVG Wave Layer 1 */}
            <svg
              className="absolute inset-0 w-full h-full object-cover opacity-65"
              viewBox="0 0 1440 900"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-50 480 C 250 350, 480 620, 850 450 C 1200 290, 1380 430, 1500 380 L 1500 950 L -50 950 Z"
                fill="url(#services-wave-grad-1)"
              />
              <defs>
                <linearGradient
                  id="services-wave-grad-1"
                  x1="0"
                  y1="300"
                  x2="1440"
                  y2="900"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#D9ECFB" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#C9E3FA" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Light Mode: Organic SVG Wave Layer 2 */}
            <svg
              className="absolute inset-0 w-full h-full object-cover opacity-75"
              viewBox="0 0 1440 900"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-50 620 C 320 540, 520 720, 940 580 C 1250 480, 1420 590, 1500 550 L 1500 950 L -50 950 Z"
                fill="url(#services-wave-grad-2)"
              />
              <defs>
                <linearGradient
                  id="services-wave-grad-2"
                  x1="0"
                  y1="500"
                  x2="1440"
                  y2="900"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#E2F0FD" stopOpacity="0.95" />
                  <stop offset="1" stopColor="#D2E8FB" stopOpacity="0.75" />
                </linearGradient>
              </defs>
            </svg>

            {/* Light Mode: Organic SVG Wave Layer 3 */}
            <svg
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              viewBox="0 0 1440 900"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-50 750 C 380 660, 680 820, 1050 710 C 1320 630, 1440 700, 1500 680 L 1500 950 L -50 950 Z"
                fill="url(#services-wave-grad-3)"
              />
              <defs>
                <linearGradient
                  id="services-wave-grad-3"
                  x1="0"
                  y1="650"
                  x2="1440"
                  y2="900"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#F0F7FE" stopOpacity="0.9" />
                  <stop offset="1" stopColor="#E0EFFD" stopOpacity="0.85" />
                </linearGradient>
              </defs>
            </svg>
          </>
        )}
      </div>

      {/* Main Structural Container (Expanded to near-full-viewport width) */}
      <div className="w-full max-w-[1650px] mx-auto z-10 flex flex-col items-center">
        <ServicesHero />
        <ServicesGrid />
        <ServicesWorkflow />
        <ServicesCTA />
      </div>
    </section>
  );
}

export default ServicesSection;
