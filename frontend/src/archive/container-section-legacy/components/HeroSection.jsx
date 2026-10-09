import React, { useState } from 'react';
import { ArrowRight, Package } from 'lucide-react';
import BadgePill from './BadgePill';
import TypewriterTagline from './TypewriterTagline';
import FeatureCards from './FeatureCards';
import StatsBar from './StatsBar';
import ScrollIndicator from './ScrollIndicator';

export default function HeroSection({ onOpenTracking, statsData, featuresData }) {
  const [useVideo, setUseVideo] = useState(true);

  return (
    <section className="relative min-h-screen w-full pt-[90px] pb-12 overflow-hidden flex flex-col justify-between">
      
      {/* Background Media Container (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {useVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            onError={() => setUseVideo(false)}
            className="w-full h-full object-cover scale-105 filter brightness-[0.85] contrast-[1.1]"
          >
            <source src="/Port.mp4" type="video/mp4" />
          </video>
        ) : null}
        
        {/* Fallback Background Image */}
        {(!useVideo) && (
          <img
            src="/Background.png"
            alt="Container Ship at Port"
            className="w-full h-full object-cover scale-105 filter brightness-[0.85] contrast-[1.1]"
          />
        )}

        {/* Cinematic Linear Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050A14]/75 via-[#050A14]/60 to-[#060B14] z-1" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#060B14]/40 to-[#060B14]/90 z-1" />
      </div>

      {/* Hero Main Content Area (z-10) */}
      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-6 md:px-12 flex-1 flex flex-col justify-center">
        
        <div className="max-w-[720px] pt-4">
          
          {/* Badge Pill */}
          <div className="animate-fade-in-down">
            <BadgePill />
          </div>

          {/* Brand Title: #HASHHARBOUR */}
          <h1
            className="font-brand text-[54px] sm:text-[68px] md:text-[76px] text-white italic tracking-wider leading-[1.02] mb-3 drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)] select-none animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            #HASHHARBOUR
          </h1>

          {/* Subtitle */}
          <div
            className="text-[24px] sm:text-[28px] md:text-[32px] font-bold leading-tight tracking-tight mb-4 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            <span className="text-white block sm:inline">Next-Gen EXIM Trade &amp; </span>
            <span className="text-[#00E5FF] block sm:inline">Logistics Platform</span>
          </div>

          {/* Typewriter Tagline Block */}
          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <TypewriterTagline />
          </div>

          {/* Description Paragraph */}
          <p
            className="text-[14px] sm:text-[15px] font-normal text-white/65 leading-[1.7] max-w-[460px] mb-8 animate-fade-in"
            style={{ animationDelay: '400ms' }}
          >
            Streamline container booking, shipment tracking, document management, and global trade operations through one modern logistics platform.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-wrap items-center gap-4 mb-10 animate-fade-in-up"
            style={{ animationDelay: '500ms' }}
          >
            <button
              onClick={onOpenTracking}
              className="bg-[#00E5FF] text-[#060B14] hover:bg-[#00B8D4] font-semibold text-[15px] px-7 py-3.5 rounded-[10px] cyan-glow hover:cyan-glow-lg transition-all duration-300 flex items-center gap-2.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={onOpenTracking}
              className="bg-transparent text-white hover:text-[#00E5FF] border border-white/30 hover:border-[#00E5FF]/60 font-medium text-[15px] px-6 py-3.5 rounded-[10px] backdrop-blur-sm transition-all duration-300 flex items-center gap-2.5 cursor-pointer hover:-translate-y-0.5"
            >
              <Package className="w-[18px] h-[18px] text-[#00E5FF]" />
              <span>Track Your Shipment</span>
            </button>
          </motion.div>

        </div>

        {/* Feature Cards Grid */}
        <FeatureCards features={featuresData} onCardClick={onOpenTracking} />

        {/* Real-time Stats Bar */}
        <StatsBar stats={statsData} />

      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10">
        <ScrollIndicator />
      </div>

    </section>
  );
}
