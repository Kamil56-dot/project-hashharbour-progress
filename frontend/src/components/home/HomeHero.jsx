import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Globe, Compass, Shield } from 'lucide-react';
import heroImage from '../../assets/images/ChatGPT Image Aug 31, 2026, 06_35_14 PM.png';
import heroVideo from '../../assets/Videos/hero_bg_compressed.mp4';
import { useDesktopVideoMedia } from '../../hooks/useMediaQuery';
import { useTheme } from '../../context/ThemeContext';
import { HomeStatsBar } from './HomeStatsBar';

/**
 * Home page hero section — dual-theme.
 *
 * Light: Original design — white glass panels, navy text, brand-blue CTA.
 * Dark: Dark glass panels, white/cyan text, cyan CTA.
 *
 * 3-Column skeleton + video container:
 * - Left panel: Brand heading, badge, description, CTA button.
 * - Center panel: 16:9 video container (fallback 3:2 image below 1024px).
 * - Right panel: Trust & Reliability glass card with 3 feature rows.
 * - Stats pill: Centered directly below the video row.
 */
export function HomeHero() {
  const isDesktopVideo = useDesktopVideoMedia();
  const { isDark } = useTheme();

  return (
    <section
      className="relative pt-[74px] transition-colors duration-200"
      style={{ marginBottom: 'clamp(20px, 2.2vw, 32px)' }}
    >
      {/* Outer padding — keeps the page background visible around the card */}
      <div
        className="relative max-w-[1920px] mx-auto"
        style={{
          padding: 'clamp(10px, 1.5vw, 24px) clamp(12px, 2vw, 32px) 0px',
        }}
      >
        {/* ─── 3-COLUMN HERO GRID ─── */}
        <div className="hero-card-desktop w-full">
          {/* ── Left panel ── */}
          <div
            className={`order-2 lg:order-1 col-span-1 min-w-0 rounded-hh-card border border-hh-card-border shadow-hh-card max-md:!p-2.5 flex flex-col justify-between transition-colors duration-200 motion-reduce:transition-none ${
              isDark
                ? 'bg-[var(--glass-bg)] backdrop-blur-md'
                : 'bg-white/80 backdrop-blur-md'
            }`}
            style={{
              padding: 'clamp(12px, 1.3vw, 32px)',
            }}
          >
            <div>
              {/* Badge pill */}
              <div
                className={`inline-flex items-center uppercase font-bold tracking-wider rounded-full border whitespace-nowrap ${
                  isDark
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : 'bg-brand-500/10 text-brand-700 border-brand-200/60'
                }`}
                style={{
                  fontSize: 'clamp(9px, 0.65vw, 12px)',
                  padding: 'clamp(3px, 0.4vh, 6px) clamp(8px, 0.8vw, 14px)',
                  marginBottom: 'clamp(4px, 0.6vh, 12px)',
                  gap: 'clamp(4px, 0.4vw, 7px)',
                }}
              >
                <ShieldCheck
                  style={{
                    width: 'clamp(12px, 0.8vw, 15px)',
                    height: 'clamp(12px, 0.8vw, 15px)',
                  }}
                />
                #1 Trusted Shipping Partner
              </div>

              {/* Main heading */}
              <h1
                className={`font-extrabold uppercase leading-none tracking-tight ${
                  isDark ? 'text-white' : 'text-heading-navy'
                }`}
                style={{
                  fontSize: 'clamp(1.05rem, 2.2vw - 0.2rem, 2.75rem)',
                  marginBottom: 'clamp(4px, 0.6vh, 12px)',
                  lineHeight: '1.14',
                }}
              >
                Moving Goods.
                <br />
                Connecting Worlds.
              </h1>

              {/* Description paragraph */}
              <p
                className={`font-normal leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
                style={{
                  fontSize: 'clamp(11px, 0.65vw + 0.1vh, 15px)',
                  maxWidth: '460px',
                  marginBottom: 'clamp(8px, 1vh, 18px)',
                  lineHeight: '1.45',
                }}
              >
                Seamless container booking, shipment tracking, document
                management, and global trade support — all in one platform.
                Modern logistics for a smarter, faster tomorrow.
              </p>
            </div>

            {/* CTA button */}
            <div className="mt-auto pt-1 sm:pt-2">
              <Link
                to="/containers"
                className={`inline-flex items-center justify-center font-semibold rounded-full hover:shadow-lg transition-all duration-200 motion-reduce:transition-none motion-reduce:hover:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 group whitespace-nowrap ${
                  isDark
                    ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 focus-visible:ring-cyan-400 focus-visible:ring-offset-surface-950'
                    : 'bg-brand-500 text-white hover:bg-brand-600 focus-visible:ring-brand-500 focus-visible:ring-offset-white'
                }`}
                style={{
                  fontSize: 'clamp(11px, 0.8vw + 0.12vh, 16px)',
                  padding: 'clamp(8px, 1.1vh, 14px) clamp(16px, 1.6vw, 30px)',
                  gap: 'clamp(6px, 0.6vw, 12px)',
                  boxShadow: isDark
                    ? '0 4px 14px rgba(0, 212, 255, 0.35)'
                    : '0 4px 14px rgba(30, 136, 229, 0.35)',
                }}
              >
                Explore in 3D
                <ArrowRight
                  className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
                  style={{
                    width: 'clamp(14px, 0.9vw, 18px)',
                    height: 'clamp(14px, 0.9vw, 18px)',
                  }}
                />
              </Link>
            </div>
          </div>

          {/* ── Center video container ── */}
          <div
            className={`order-1 lg:order-2 col-span-2 lg:col-span-1 min-w-0 relative w-full aspect-[3/2] lg:aspect-[16/9] rounded-hh-card border border-hh-card-border shadow-hh-card overflow-hidden transition-colors duration-200 motion-reduce:transition-none ${
              isDark ? 'bg-surface-950' : 'bg-white'
            }`}
          >
            {isDesktopVideo ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={heroImage}
                className="w-full h-full object-contain block m-0 p-0"
              >
                <source src={heroVideo} type="video/mp4" />
              </video>
            ) : (
              <img
                src={heroImage}
                alt="Container ship at sea — HashHarbour logistics"
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-contain block m-0 p-0"
              />
            )}
          </div>

          {/* ── Right panel ── */}
          <div
            className={`order-3 lg:order-3 col-span-1 min-w-0 rounded-hh-card border border-hh-card-border shadow-hh-card hidden md:flex flex-col justify-between transition-colors duration-200 motion-reduce:transition-none ${
              isDark
                ? 'bg-[var(--glass-bg)] backdrop-blur-md'
                : 'bg-white/80 backdrop-blur-md'
            }`}
            style={{
              padding: 'clamp(12px, 1.3vw, 32px)',
            }}
          >
            <div>
              {/* Eyebrow */}
              <div
                className={`inline-flex items-center uppercase font-bold tracking-wider rounded-full border whitespace-nowrap ${
                  isDark
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : 'bg-brand-500/10 text-brand-700 border-brand-200/60'
                }`}
                style={{
                  fontSize: 'clamp(9px, 0.65vw, 12px)',
                  padding: 'clamp(3px, 0.4vh, 6px) clamp(8px, 0.8vw, 14px)',
                  marginBottom: 'clamp(4px, 0.6vh, 12px)',
                }}
              >
                TRUST & RELIABILITY
              </div>

              {/* Heading */}
              <h2
                className={`font-extrabold uppercase leading-none tracking-tight ${
                  isDark ? 'text-white' : 'text-heading-navy'
                }`}
                style={{
                  fontSize: 'clamp(1.05rem, 2.2vw - 0.2rem, 2.75rem)',
                  marginBottom: 'clamp(4px, 0.6vh, 12px)',
                  lineHeight: '1.14',
                }}
              >
                Your Cargo,
                <br />
                <span className={isDark ? 'text-cyan-400' : 'text-brand-600'}>
                  Our Priority.
                </span>
              </h2>

              {/* Tagline */}
              <p
                className={`font-normal leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
                style={{
                  fontSize: 'clamp(11px, 0.65vw + 0.1vh, 15px)',
                  lineHeight: '1.45',
                  marginBottom: 'clamp(8px, 1vh, 18px)',
                }}
              >
                Safe. Secure. On Time.
                <br />
                Because your business never stops.
              </p>
            </div>

            {/* 3 feature rows */}
            <div className="flex flex-col gap-2 xl:gap-3 mt-auto pt-1 sm:pt-2">
              {[
                { icon: Globe, label: 'Global Network' },
                { icon: Compass, label: 'Real-Time Tracking' },
                { icon: Shield, label: 'Secure Logistics' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div
                      className={`shrink-0 flex items-center justify-center rounded-lg border ${
                        isDark
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          : 'bg-brand-500/10 text-brand-700 border-brand-200/60'
                      }`}
                      style={{
                        width: 'clamp(24px, 1.6vw, 32px)',
                        height: 'clamp(24px, 1.6vw, 32px)',
                      }}
                    >
                      <Icon
                        style={{
                          width: 'clamp(12px, 0.8vw, 16px)',
                          height: 'clamp(12px, 0.8vw, 16px)',
                        }}
                      />
                    </div>
                    <span
                      className={`text-xs lg:text-[13px] font-semibold tracking-wide ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── STATS PILL UNDER HERO ─── */}
        <div className="mt-2.5 md:mt-5 lg:mt-6 w-full flex justify-center">
          <HomeStatsBar />
        </div>
      </div>
    </section>
  );
}