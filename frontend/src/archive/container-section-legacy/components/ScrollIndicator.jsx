import React from 'react';

export default function ScrollIndicator() {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth',
    });
  };

  return (
    <div 
      onClick={handleScroll}
      className="flex flex-col items-center gap-2 cursor-pointer group mt-6 mb-4 transition-all duration-300"
    >
      {/* Mouse Icon */}
      <div className="w-[22px] h-[36px] rounded-full border-2 border-white/40 group-hover:border-[#00E5FF] p-1 flex justify-center transition-colors">
        <div className="w-[3px] h-[8px] bg-[#00E5FF] rounded-full animate-scroll-dot" />
      </div>

      {/* Caption */}
      <span className="text-[11px] font-medium text-white/50 group-hover:text-[#00E5FF] tracking-[2px] uppercase transition-colors">
        SCROLL DOWN
      </span>
    </div>
  );
}
