import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroImage from '../../assets/images/ChatGPT Image Aug 31, 2026, 06_35_14 PM.png';
import heroVideo from '../../assets/Videos/hero_bg_compressed.mp4';
import { useDesktopVideoMedia } from '../../hooks/useMediaQuery';

/**
 * Isolated light-theme hero section for the Home Preview test page.
 * Full-bleed background image with left-side light overlay for text legibility.
 * Does NOT import or affect any existing hero components.
 */
export function HomeHero() {
  const isDesktopVideo = useDesktopVideoMedia();

  return (
    <section className="relative flex-1">
      {/* Background media — image on mobile/reduced-motion, video on desktop */}
      <div className="absolute inset-0 overflow-hidden">
        {isDesktopVideo ? (
          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={heroImage}
            className="absolute inset-0 w-full h-[115%] object-cover"
            style={{ objectPosition: '15% 14%' }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        ) : (
          <img
            src={heroImage}
            alt="Background Image"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-[115%] object-cover"
            style={{ objectPosition: '15% 14%' }}
          />
        )}
      </div>


      {/* Light overlay — white-to-transparent gradient on the left for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.62) 20%, rgba(255,255,255,0.55) 40%, rgba(255,255,255,0.1) 60%, transparent 78%)',
        }}
      />
      {/* Mobile: stronger full-width overlay for legibility when text sits over the image */}
      <div
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.80) 60%, rgba(255,255,255,0.50) 100%)',
        }}
      />

      {/* Hero content — left-aligned, vertically centered */}
      <div
        className="relative z-10 h-full flex flex-col justify-center"
        style={{
          paddingLeft: 'clamp(20px, 5vw, 80px)',
          paddingRight: 'clamp(20px, 5vw, 80px)',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          {/* Badge pill */}
          <div
            className="inline-flex items-center bg-gray-100 border border-gray-300 text-gray-600 uppercase font-semibold tracking-wider"
            style={{
              fontSize: 'clamp(9px, 0.7vw, 12px)',
              padding: 'clamp(4px, 0.5vh, 7px) clamp(10px, 1vw, 16px)',
              borderRadius: 'clamp(4px, 0.4vw, 6px)',
              marginBottom: 'clamp(16px, 2.5vh, 28px)',
            }}
          >
            #1 Trusted Shipping Partner
          </div>

          {/* Main heading */}
          <h1
            className="font-extrabold text-gray-900 uppercase leading-none tracking-tight"
            style={{
              fontSize: 'clamp(30px, 4.2vw + 0.5vh, 54px)',
              marginBottom: 'clamp(12px, 2vh, 24px)',
              lineHeight: '1.05',
            }}
          >
            Moving Goods.
            <br />
            Connecting Worlds.
          </h1>

          {/* Description paragraph */}
          <p
            className="text-gray-600 font-normal leading-relaxed"
            style={{
              fontSize: 'clamp(13px, 1vw + 0.3vh, 18px)',
              maxWidth: '520px',
              marginBottom: 'clamp(20px, 3vh, 36px)',
              lineHeight: '1.65',
            }}
          >
            Streamline container booking, shipment tracking, document management,
            and global trade operations through one modern logistics platform.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center" style={{ gap: 'clamp(10px, 1.2vw, 20px)' }}>
            {/* Primary: Book My Container */}
            <Link
              to="/container-section"
              className="inline-flex items-center justify-center bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors duration-150"
              style={{
                fontSize: 'clamp(12px, 0.9vw + 0.2vh, 16px)',
                padding: 'clamp(10px, 1.3vh, 16px) clamp(18px, 1.8vw, 32px)',
                borderRadius: 'clamp(8px, 0.6vw, 12px)',
                gap: 'clamp(6px, 0.6vw, 10px)',
              }}
            >
              Book My Container
              <ArrowRight style={{ width: 'clamp(14px, 1vw, 18px)', height: 'clamp(14px, 1vw, 18px)' }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
