import React from 'react';
import { ArrowRight, Package, Box } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Hero Action Buttons Component.
 * Source of Truth: forensic_audit.md §2 & §7, architecture_blueprint.md Step 2
 */
export const HeroActions = React.forwardRef(function HeroActions(
  { ctaPrimaryRef, ctaSecondaryRef, className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-[12px] ${className}`}
      {...props}
    >
      {/* Primary CTA: "Get Started" */}
      <Button
        ref={ctaPrimaryRef}
        variant="primary"
        href="#get-started"
        icon={ArrowRight}
        iconPosition="right"
        className="w-full sm:w-auto px-5 h-[48px] text-[15px] font-semibold"
      >
        Get Started
      </Button>

      {/* Secondary CTA: "Track Your Shipment" */}
      <Button
        ref={ctaSecondaryRef}
        variant="ghost"
        href="#track"
        icon={Package}
        iconPosition="left"
        className="w-full sm:w-auto px-5 h-[48px] text-[15px] font-medium border-white/20 text-white hover:border-accent-500/40 hover:bg-accent-500/5"
      >
        Track Your Shipment
      </Button>

      {/* New Integrated Container Section CTA: "View Container Tracking" */}
      <Button
        variant="ghost"
        href="/container-section"
        icon={Box}
        iconPosition="left"
        className="w-full sm:w-auto px-5 h-[48px] text-[15px] font-medium border-accent-500/40 text-accent-400 bg-accent-500/10 hover:border-accent-500 hover:bg-accent-500/20 shadow-[0_0_15px_rgba(0,212,255,0.2)]"
      >
        View Container Tracking
      </Button>
    </div>
  );
});
