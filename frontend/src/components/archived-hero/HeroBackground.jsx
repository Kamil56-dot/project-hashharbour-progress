import React from 'react';
import backgroundImage from '../../assets/images/background-image.png';
/**
 * Hero Background Component.
 * Uses exact uploaded reference image: background image.png
 * Overlays are adjusted so background matches exact reference image brightness.
 */
export function HeroBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* Primary Background Image */}
      <img
        src={backgroundImage}
        alt="Container ship in twilight harbor with cranes"
        loading="eager"
        fetchPriority="high"
        className="w-full h-full object-cover object-[70%_35%] lg:object-[65%_35%] brightness-[0.92] contrast-[1.02]"
      />
      {/* Dark left vignette layer for high text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#060B14]/85 via-[#060B14]/45 to-transparent w-full lg:w-[58%]" />
      {/* Navbar top shadow gradient */}
      <div className="absolute top-0 left-0 right-0 h-[110px] bg-gradient-to-b from-[#060B14]/80 to-transparent" />
      {/* Bottom shadow gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-t from-[#060B14]/90 to-transparent" />
    </div>
  );
}

