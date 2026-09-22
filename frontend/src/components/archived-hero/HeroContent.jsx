import React from 'react';
import { HeroBadge } from './HeroBadge';
import { HeroHeading } from './HeroHeading';
import { HeroDescription } from './HeroDescription';
import { HeroActions } from './HeroActions';

/**
 * Hero Left-Aligned Content Column Component.
 * Source of Truth: forensic_audit.md §1 & §2, architecture_blueprint.md Step 2 & Step 5
 *
 * Container: 520px max-width, left-aligned, strictly enforcing the 8px grid vertical rhythm:
 * Badge -> 16px -> Heading -> 12px -> Description (Subheading + Tagline + Paragraph) -> 32px -> Actions
 */
export function HeroContent({ elementsRef = {} }) {
  return (
    <div className="max-w-[780px] w-full z-10 flex flex-col items-start text-left">
      {/* 1. Badge Pill (12px bottom margin to heading) */}
      <HeroBadge ref={elementsRef.badge} className="mb-[12px]" />

      {/* 2. Main Heading #HASHHARBOUR (10px bottom margin to description) */}
      <HeroHeading ref={elementsRef.heading} className="mb-[10px]" />

      {/* 3. Subheading, Tagline, and Descriptive Paragraph (24px bottom margin to actions) */}
      <HeroDescription ref={elementsRef.description} className="max-w-[540px] mb-[24px]" />

      {/* 4. Action CTA Button Group */}
      <HeroActions
        ref={elementsRef.actions}
        ctaPrimaryRef={elementsRef.ctaPrimary}
        ctaSecondaryRef={elementsRef.ctaSecondary}
      />
    </div>
  );
}
