import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import heroImage from '../../assets/images/ChatGPT Image Aug 31, 2026, 06_35_14 PM.png';
import heroVideo from '../../assets/Videos/hero_bg_compressed.mp4';
import { useDesktopVideoMedia } from '../../hooks/useMediaQuery';

/**
 * Light-theme hero section for the Home page.
 *
 * Desktop (lg+): hero card is bounded to one viewport height
 * (100dvh − navbar − outer padding). Video fills via object-fit:cover with
 * object-position:top so any cropping happens at the bottom only.
 * Mobile: card fills 100dvh minus navbar for the full-screen image layout.
 *
 * Video/image responsive switching logic (useDesktopVideoMedia) is preserved exactly.
 */
export function HomeHero() {
  const isDesktopVideo = useDesktopVideoMedia();

  return (
    <section
      className="relative bg-hero-bg"
      style={{ marginBottom: 'clamp(32px, 3vw, 48px)' }}
    >
      {/* Outer padding — keeps the light-blue page background visible around the card */}
      <div
        className="relative"
        style={{
          padding: 'clamp(10px, 1.5vw, 24px) clamp(12px, 2vw, 32px) clamp(14px, 2vw, 32px)',
        }}
      >
        {/* ─── THE SINGLE HERO CARD ─── */}
        <div
          className="relative w-full overflow-hidden hero-card-desktop"
          style={{
            /* Mobile: tall card fills viewport minus navbar.
               Desktop (lg+): bounded to viewport via CSS class so no scroll needed. */
            minHeight: 'calc(100dvh - 72px)',
            borderRadius: 'clamp(16px, 2vw, 28px)',
            isolation: 'isolate',
            WebkitMaskImage: '-webkit-radial-gradient(white, black)',
            transform: 'translateZ(0)',
          }}
        >
          {/* Background media — video on desktop, image on mobile/reduced-motion */}
          {isDesktopVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={heroImage}
              className="absolute inset-0 w-full h-full object-cover block m-0 p-0"
              style={{ objectPosition: 'top center' }}
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img
              src={heroImage}
              alt="Container ship at sea — HashHarbour logistics"
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover block m-0 p-0"
              style={{ objectPosition: '50% 40%', width: '100%', height: '100%' }}
            />
          )}

          {/* ── Desktop gradient overlay: strong left → transparent right ── */}
          <div
            className="absolute inset-0 pointer-events-none hidden lg:block"
            style={{
              background:
                'linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 18%, rgba(255,255,255,0.60) 38%, rgba(255,255,255,0.15) 58%, transparent 75%)',
            }}
          />

          {/* ── Mobile gradient overlay: strong top-to-bottom for full readability ── */}
          <div
            className="absolute inset-0 pointer-events-none lg:hidden"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.88) 40%, rgba(255,255,255,0.55) 75%, rgba(255,255,255,0.20) 100%)',
            }}
          />

          {/* ── Text content — layered on top, left-aligned, vertically centered ── */}
          <div
            className="relative z-10 h-full flex flex-col justify-center lg:absolute lg:inset-0"
            style={{
              paddingLeft: 'clamp(24px, 5vw, 80px)',
              paddingRight: 'clamp(24px, 5vw, 80px)',
              paddingTop: 'clamp(32px, 4vh, 56px)',
              paddingBottom: 'clamp(32px, 4vh, 56px)',
            }}
          >
            <div style={{ maxWidth: '580px' }}>
              {/* Badge pill */}
              <div
                className="inline-flex items-center bg-brand-500/10 text-brand-600 uppercase font-bold tracking-wider rounded-full border border-brand-200/60"
                style={{
                  fontSize: 'clamp(9px, 0.7vw, 12px)',
                  padding: 'clamp(5px, 0.6vh, 8px) clamp(12px, 1.1vw, 18px)',
                  marginBottom: 'clamp(18px, 3vh, 32px)',
                  gap: 'clamp(5px, 0.5vw, 8px)',
                }}
              >
                <ShieldCheck
                  style={{
                    width: 'clamp(13px, 0.9vw, 16px)',
                    height: 'clamp(13px, 0.9vw, 16px)',
                  }}
                />
                #1 Trusted Shipping Partner
              </div>

              {/* Main heading */}
              <h1
                className="font-extrabold text-heading-navy uppercase leading-none tracking-tight"
                style={{
                  fontSize: 'clamp(28px, 4vw + 0.5vh, 54px)',
                  marginBottom: 'clamp(14px, 2.5vh, 28px)',
                  lineHeight: '1.08',
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
                  fontSize: 'clamp(13px, 0.95vw + 0.2vh, 17px)',
                  maxWidth: '460px',
                  marginBottom: 'clamp(24px, 3.5vh, 40px)',
                  lineHeight: '1.7',
                }}
              >
                Seamless container booking, shipment tracking, document
                management, and global trade support — all in one platform.
                Modern logistics for a smarter, faster tomorrow.
              </p>

              {/* CTA button */}
              <Link
                to="/container-section"
                className="inline-flex items-center justify-center bg-brand-500 text-white font-semibold rounded-full hover:bg-brand-600 hover:shadow-lg transition-all duration-200 group"
                style={{
                  fontSize: 'clamp(13px, 0.9vw + 0.2vh, 16px)',
                  padding: 'clamp(12px, 1.4vh, 16px) clamp(24px, 2.2vw, 36px)',
                  gap: 'clamp(8px, 0.7vw, 12px)',
                  boxShadow: '0 4px 14px rgba(30, 136, 229, 0.35)',
                }}
              >
                Book My Container
                <ArrowRight
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  style={{
                    width: 'clamp(15px, 1vw, 18px)',
                    height: 'clamp(15px, 1vw, 18px)',
                  }}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
