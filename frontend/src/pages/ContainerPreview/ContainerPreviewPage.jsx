import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import standardDryImg from '../../assets/containers/file_0000000078608211a9fcda6d20986d14.png';
import reeferImg from '../../assets/containers/file_00000000a5dc82088f262e7a321ebf5c.png';
import oilTankImg from '../../assets/containers/oil-tank.png';
import { Box, Snowflake, Droplets } from 'lucide-react';

const RAW_CONTAINER_DATA = [
  {
    id: 'standard-dry',
    name: 'Standard Dry',
    category: 'General Cargo',
    badge: 'ISO 20ft / 40ft',
    image: standardDryImg,
    needsTransparency: true,
    icon: Box,
    accentClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  },
  {
    id: 'reefer',
    name: 'Reefer',
    category: 'Temperature-Controlled',
    badge: 'Cold Chain ISO',
    image: reeferImg,
    needsTransparency: true,
    icon: Snowflake,
    accentClass: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  },
  {
    id: 'oil-tank',
    name: 'Oil / Tank',
    category: 'Liquid Bulk & Chemical',
    badge: 'ISO Tank Unit',
    image: oilTankImg,
    needsTransparency: false,
    icon: Droplets,
    accentClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
];

/**
 * Remove pure white studio background from high-resolution container render
 * using corner-seeded flood fill so white container panels remain intact.
 */
function processStudioImage(src, callback) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const w = canvas.width;
      const h = canvas.height;

      // Seed 4 corners and outer edges
      const visited = new Uint8Array(w * h);
      const queue = [];

      // Edge samples
      for (let x = 0; x < w; x += 4) {
        queue.push(x);
        queue.push((h - 1) * w + x);
      }
      for (let y = 0; y < h; y += 4) {
        queue.push(y * w);
        queue.push(y * w + (w - 1));
      }

      for (let i = 0; i < queue.length; i++) {
        visited[queue[i]] = 1;
      }

      let head = 0;
      while (head < queue.length) {
        const idx = queue[head++];
        const px = idx * 4;
        data[px + 3] = 0; // alpha = 0 (transparent)

        const x = idx % w;
        const y = Math.floor(idx / w);

        if (x > 0 && !visited[idx - 1]) {
          const n = idx - 1, npx = n * 4;
          if (data[npx] > 238 && data[npx + 1] > 238 && data[npx + 2] > 238) {
            visited[n] = 1;
            queue.push(n);
          }
        }
        if (x < w - 1 && !visited[idx + 1]) {
          const n = idx + 1, npx = n * 4;
          if (data[npx] > 238 && data[npx + 1] > 238 && data[npx + 2] > 238) {
            visited[n] = 1;
            queue.push(n);
          }
        }
        if (y > 0 && !visited[idx - w]) {
          const n = idx - w, npx = n * 4;
          if (data[npx] > 238 && data[npx + 1] > 238 && data[npx + 2] > 238) {
            visited[n] = 1;
            queue.push(n);
          }
        }
        if (y < h - 1 && !visited[idx + w]) {
          const n = idx + w, npx = n * 4;
          if (data[npx] > 238 && data[npx + 1] > 238 && data[npx + 2] > 238) {
            visited[n] = 1;
            queue.push(n);
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      callback(canvas.toDataURL('image/png'));
    } catch {
      callback(src);
    }
  };
  img.onerror = () => callback(src);
}

export function ContainerPreviewPage() {
  const { isDark } = useTheme();
  const [containers, setContainers] = useState(RAW_CONTAINER_DATA);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const cardRefs = useRef([]);

  // Process images with white studio backgrounds once on client mount
  useEffect(() => {
    RAW_CONTAINER_DATA.forEach((item, idx) => {
      if (item.needsTransparency) {
        processStudioImage(item.image, (cleanUrl) => {
          setContainers((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], image: cleanUrl };
            return next;
          });
        });
      }
    });
  }, []);

  // Update active pagination dot based on carousel scroll position
  const handleScroll = () => {
    const container = carouselRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  // Scroll smoothly to chosen card
  const scrollToCard = (index) => {
    const card = cardRefs.current[index];
    if (card) {
      card.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
      setActiveIndex(index);
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 pt-[78px] lg:pt-[82px] pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start ${
        isDark ? 'bg-transparent text-white' : 'bg-transparent text-[#0F172A]'
      }`}
    >
      {/* Isolated Preview Section Header */}
      <div className="w-full max-w-5xl mx-auto text-center mb-8 sm:mb-12">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 backdrop-blur-md border transition-colors duration-200 ${
            isDark
              ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]'
              : 'bg-brand-500/10 border-brand-200 text-brand-600'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isDark ? 'bg-[#00E5FF] animate-pulse' : 'bg-brand-500'
            }`}
          />
          <span>Isolated Preview • /container-preview</span>
        </div>

        <h1
          className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3 transition-colors duration-200 ${
            isDark ? 'text-white' : 'text-[#0F172A]'
          }`}
        >
          Bookable Container Types
        </h1>
        <p
          className={`text-sm sm:text-base max-w-xl mx-auto transition-colors duration-200 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Select from our primary shipping container specifications engineered for global intermodal transport.
        </p>
      </div>

      {/* Main Container Cards Layout: Desktop 3-Column Grid, Mobile Scroll-Snap Carousel */}
      <div className="w-full max-w-5xl mx-auto">
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-3 gap-5 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth px-6 md:px-0 py-3 -mx-4 sm:-mx-6 md:mx-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {containers.map((container, idx) => {
            const Icon = container.icon;
            return (
              <div
                key={container.id}
                ref={(el) => (cardRefs.current[idx] = el)}
                className={`snap-center shrink-0 w-[80vw] max-w-[325px] md:w-auto md:max-w-none rounded-2xl md:rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 md:hover:-translate-y-1.5 ${
                  isDark
                    ? 'bg-[#0D1525] border border-white/[0.08] shadow-[0_16px_36px_rgba(0,0,0,0.5)] md:hover:border-white/20'
                    : 'bg-[#F2F6FB] border border-[#D5E2F0] shadow-[0_12px_30px_rgba(15,23,42,0.06)] md:hover:border-brand-300'
                }`}
              >
                {/* Card Top Label & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide border ${
                      isDark
                        ? 'bg-white/5 text-slate-300 border-white/10'
                        : 'bg-white/90 text-slate-700 border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 opacity-70" />
                    <span>{container.badge}</span>
                  </div>

                  <span
                    className={`text-xs font-mono font-medium ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                </div>

                {/* Container Image Display (Centered with Generous Padding) */}
                <div className="w-full aspect-[4/3] flex items-center justify-center p-2 sm:p-3 my-auto relative">
                  <img
                    src={container.image}
                    alt={container.name}
                    className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-300 drop-shadow-md"
                    loading="eager"
                  />
                </div>

                {/* Card Label / Title Below */}
                <div
                  className="mt-5 pt-3.5 border-t flex flex-col items-center sm:items-start text-center sm:text-left transition-colors duration-200"
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                  }}
                >
                  <h3
                    className={`text-lg sm:text-xl font-bold tracking-tight transition-colors duration-200 ${
                      isDark ? 'text-white' : 'text-[#0F172A]'
                    }`}
                  >
                    {container.name}
                  </h3>
                  <p
                    className={`text-xs font-medium mt-0.5 transition-colors duration-200 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {container.category}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile-Only Pagination Dots */}
        <div
          className="flex md:hidden items-center justify-center gap-2 mt-6"
          aria-label="Container cards pagination"
        >
          {containers.map((container, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={container.id}
                type="button"
                onClick={() => scrollToCard(idx)}
                aria-label={`Show ${container.name}`}
                className={`transition-all duration-300 rounded-full h-2 ${
                  isActive
                    ? isDark
                      ? 'w-6 bg-[#00E5FF]'
                      : 'w-6 bg-brand-600'
                    : isDark
                      ? 'w-2 bg-white/20 hover:bg-white/40'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ContainerPreviewPage;
