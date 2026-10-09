import React from 'react';
import { AboutContent } from './AboutContent';
import { AboutGlobeCanvas } from './AboutGlobeCanvas';
import { AboutFloatingCards } from './AboutFloatingCards';

/**
 * AboutNetwork Component — Phase 2 Implementation
 * Houses the 3D Digital Globe Canvas, Floating Cards, and Core Principles (01 Connect, 02 Simplify, 03 Deliver).
 */
export function AboutNetwork({ visualRef, elementsRef }) {
  return (
    <div className="w-full max-w-[1380px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-24 lg:mb-32">
      {/* Left Column: ~55% Width Content */}
      <div className="lg:col-span-7 flex flex-col justify-center">
        <AboutContent elementsRef={elementsRef} />
      </div>

      {/* Right Column: ~45% Width 3D Centerpiece Visual */}
      <div
        ref={visualRef}
        className="lg:col-span-5 relative flex items-center justify-center w-full min-h-[440px] sm:min-h-[500px]"
      >
        {/* 3D Dark Glass Globe Canvas */}
        <AboutGlobeCanvas />

        {/* 3 Independently Floating Glass Status Cards */}
        <AboutFloatingCards />
      </div>
    </div>
  );
}
