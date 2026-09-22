import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { AboutHero } from './AboutHero';
import { AboutNetwork } from './AboutNetwork';
import { TradePillars } from './TradePillars';
import { TrustLayer } from './TrustLayer';
import { BrandStatement } from './BrandStatement';

/**
 * HashHarbour Homepage — Restructured About Section Master Component.
 * Homepage-first Information Architecture:
 * 1. Digital Corridor Intro & 3D Globe Network (AboutHero + AboutNetwork)
 * 2. Three Pillars of Modern Trade (TradePillars)
 * 3. Security & Trust Infrastructure (TrustLayer)
 * 4. Brand Manifesto & Transition to Services (BrandStatement)
 */
export function AboutSection() {
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
      className="relative w-full min-h-screen bg-gradient-to-b from-[#061426]/90 via-[#061426] to-[#0A1B31] py-16 sm:py-20 lg:py-24 px-6 sm:px-10 lg:px-[42px] overflow-hidden flex flex-col items-center justify-center border-t border-white/5"
    >
      {/* Background Decorative Layer: Faint Grid & Radial Cyan Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Radial Cyan Atmosphere Glow behind 3D Globe */}
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#00C8F5]/5 rounded-full blur-[140px]" />

        {/* Faint Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #00C8F5 1px, transparent 1px), linear-gradient(to bottom, #00C8F5 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
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

