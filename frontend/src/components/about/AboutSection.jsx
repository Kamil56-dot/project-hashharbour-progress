import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { AboutHero } from './AboutHero';
import { AboutNetwork } from './AboutNetwork';
import { TradePillars } from './TradePillars';
import { TrustLayer } from './TrustLayer';
import { BrandStatement } from './BrandStatement';
import { useTheme } from '../../context/ThemeContext';

/**
 * HashHarbour Homepage — Restructured About Section Master Component.
 * Supports dual-theme (Dark / Light) matching the HashHarbour global design system.
 */
export function AboutSection() {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const bodyRef = useRef(null);
  const rowsRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo(
              [badgeRef.current, headingRef.current, bodyRef.current],
              { opacity: 0, y: 35 },
              { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }
            )
              .fromTo(
                rowsRef.current ? rowsRef.current.children : [],
                { opacity: 0, y: 25 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
                '-=0.4'
              )
              .fromTo(
                visualRef.current,
                { opacity: 0, scale: 0.92 },
                { opacity: 1, scale: 1, duration: 0.8 },
                '-=0.6'
              );

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About HashHarbour Infrastructure"
      className={`relative w-full min-h-screen pt-[96px] lg:pt-[104px] pb-16 sm:pb-20 lg:pb-24 px-6 sm:px-10 lg:px-[42px] overflow-hidden flex flex-col items-center justify-center border-t transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-[#061426]/90 via-[#061426] to-surface-900 text-white border-white/5'
          : 'bg-[#EBF3FC] text-[#0F172A] border-blue-100/60'
      }`}
    >
      {/* Background Decorative Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {isDark ? (
          <>
            {/* Dark Mode: Radial Cyan Atmosphere Glow behind 3D Globe */}
            <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[160px]" />
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#00C8F5]/5 rounded-full blur-[140px]" />

            {/* Dark Mode: Faint Cyan Grid Lines */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #00C8F5 1px, transparent 1px), linear-gradient(to bottom, #00C8F5 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
          </>
        ) : (
          <>
            {/* Light Mode: Soft Ambient Mesh Glows */}
            <div
              className="absolute top-1/4 right-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px]"
              style={{
                background: 'radial-gradient(circle, rgba(195, 225, 255, 0.75) 0%, rgba(235, 243, 252, 0) 70%)',
              }}
            />
            <div
              className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px]"
              style={{
                background: 'radial-gradient(circle, rgba(180, 218, 255, 0.65) 0%, rgba(235, 243, 252, 0) 70%)',
              }}
            />

            {/* Light Mode: Faint Blue Grid Lines */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #1E88E5 1px, transparent 1px), linear-gradient(to bottom, #1E88E5 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
          </>
        )}
      </div>

      {/* Streamlined Homepage-First Information Architecture */}
      <div className="w-full max-w-[1380px] mx-auto z-10 flex flex-col">
        {/* Module 1: About Hero Intro */}
        <AboutHero />

        {/* Module 2: 3D Globe Network & Core Operating Principles */}
        <AboutNetwork
          visualRef={visualRef}
          elementsRef={{
            badge: badgeRef,
            heading: headingRef,
            body: bodyRef,
            rows: rowsRef,
          }}
        />

        {/* Module 3: Three Pillars of Modern Trade Operations */}
        <TradePillars />

        {/* Module 4: Security & Compliance Trust Layer */}
        <TrustLayer />

        {/* Module 5: Brand Manifesto & Seamless Transition to Services */}
        <BrandStatement />
      </div>
    </section>
  );
}

