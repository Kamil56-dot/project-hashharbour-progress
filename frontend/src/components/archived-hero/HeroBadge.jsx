import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Hero Badge Pill Component.
 * Source of Truth: forensic_audit.md §2 & §10, architecture_blueprint.md Step 2
 *
 * Dimensions: 224px width, 32px height, 16px border-radius (pill)
 * Styling: Semi-transparent cyan fill, 1px border rgba(0,212,255,0.3), sparkle icon + "Next Generation Global Trade"
 */
export const HeroBadge = React.forwardRef(function HeroBadge(
  { className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`inline-flex items-center h-8 px-[12px] gap-[8px] rounded-[16px] bg-accent-500/10 border border-accent-500/30 backdrop-blur-md text-text-primary shadow-[0_0_16px_rgba(0,212,255,0.1)] ${className}`}
      style={{ width: 'fit-content' }}
      {...props}
    >
      {/* 16px Icon */}
      <Sparkles className="w-4 h-4 text-accent-500 shrink-0" />

      {/* 12px Medium Text */}
      <span className="text-[12px] font-medium leading-none tracking-tight text-text-primary whitespace-nowrap">
        Next Generation Global Trade
      </span>
    </div>
  );
});
