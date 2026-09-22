import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';
import { HeroFeatureCards } from './HeroFeatureCards';
import { HeroStatsBar } from './HeroStatsBar';
import { ScrollIndicator } from './ScrollIndicator';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ANIMATION_EASINGS } from '../../animations/variants';

/**
 * HASHHARBOUR — HERO SECTION COMPONENT
 * Source of Truth: target reference design (Image 1)
 */
export function ArchivedHero({ navbarRef }) {
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const actionsRef = useRef(null);
  const featureCardsRef = useRef(null);
  const statsBarRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      [badgeRef, headingRef, descriptionRef, actionsRef, featureCardsRef, statsBarRef, scrollIndicatorRef].forEach((ref) => {
        if (ref.current) {
          gsap.set(ref.current, { opacity: 1, y: 0, x: 0 });
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: ANIMATION_EASINGS.power2Out },
        onComplete: () => {
          [badgeRef, headingRef, descriptionRef, actionsRef, featureCardsRef, statsBarRef, scrollIndicatorRef].forEach((ref) => {
            if (ref.current) {
              gsap.set(ref.current, { opacity: 1, y: 0, x: 0 });
            }
          });
        },
      });

      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            onComplete: () => {
              if (badgeRef.current) gsap.set(badgeRef.current, { opacity: 1, x: 0 });
            },
          },
          0.05
        );
      }

      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: ANIMATION_EASINGS.power3Out,
            onComplete: () => {
              if (headingRef.current) gsap.set(headingRef.current, { opacity: 1, y: 0 });
            },
          },
          0.1
        );
      }

      if (descriptionRef.current) {
        tl.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            onComplete: () => {
              if (descriptionRef.current) gsap.set(descriptionRef.current, { opacity: 1, y: 0 });
            },
          },
          0.15
        );
      }

      if (actionsRef.current) {
        tl.fromTo(
          actionsRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            onComplete: () => {
              if (actionsRef.current) gsap.set(actionsRef.current, { opacity: 1, y: 0 });
            },
          },
          0.2
        );
      }

      if (featureCardsRef.current) {
        tl.fromTo(
          featureCardsRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            onComplete: () => {
              if (featureCardsRef.current) gsap.set(featureCardsRef.current, { opacity: 1, y: 0 });
            },
          },
          0.25
        );
      }

      if (statsBarRef.current) {
        tl.fromTo(
          statsBarRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            onComplete: () => {
              if (statsBarRef.current) gsap.set(statsBarRef.current, { opacity: 1, y: 0 });
            },
          },
          0.3
        );
      }

      if (scrollIndicatorRef.current) {
        tl.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.3,
            onComplete: () => {
              if (scrollIndicatorRef.current) gsap.set(scrollIndicatorRef.current, { opacity: 1 });
            },
          },
          0.35
        );
      }
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      aria-label="Hero"
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden pt-[96px] lg:pt-[104px] pb-[40px]"
    >
      {/* Layer 1 & 2: Background Image & Cinematic Gradient Overlays */}
      <HeroBackground />

      {/* Layer 3, 4 & 5: Broad Full-Width Composition (42px side padding) */}
      <div className="w-full px-6 sm:px-10 lg:px-[42px] z-10 flex flex-col gap-4 sm:gap-5 lg:gap-5.5 my-auto py-1">
        <HeroContent
          elementsRef={{
            badge: badgeRef,
            heading: headingRef,
            description: descriptionRef,
            actions: actionsRef,
          }}
        />

        {/* 3 Hero Feature Cards */}
        <HeroFeatureCards ref={featureCardsRef} />

        {/* Hero Statistics Bar */}
        <HeroStatsBar ref={statsBarRef} />
      </div>

      {/* Layer 6: Scroll Indicator */}
      <ScrollIndicator ref={scrollIndicatorRef} />
    </section>
  );
}

export default ArchivedHero;
