import React from 'react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Bottom-center Scroll Prompt Mouse Icon Component.
 * Source of Truth: forensic_audit.md §2 & §12, architecture_blueprint.md Step 2
 *
 * Dimensions: 24px x 32px mouse capsule outline with animated 4px x 8px inner dot
 * Fades out smoothly when user scrolls > 100px.
 */
export const ScrollIndicator = React.forwardRef(function ScrollIndicator(
  { className = '', ...props },
  ref
) {
  const scrollY = useScrollPosition();
  const prefersReducedMotion = useReducedMotion();

  // Fades out after user scrolls past 100px
  const isVisible = scrollY < 100;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      {...props}
    >
      {/* Outer Mouse Capsule (24px x 32px) */}
      <div className="w-[24px] h-[32px] rounded-[12px] border-[1.5px] border-white/40 flex justify-center pt-2 bg-surface-950/20 backdrop-blur-xs shadow-sm">
        {/* Animated Inner Dot (4px x 8px) */}
        <div
          className={`w-[4px] h-[8px] rounded-full bg-white/60 ${
            prefersReducedMotion ? '' : 'animate-scroll-dot'
          }`}
        />
      </div>
    </div>
  );
});
