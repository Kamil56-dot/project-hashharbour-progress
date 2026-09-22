import React from 'react';
import { Ship } from 'lucide-react';

export default function BadgePill() {
  return (
    <div className="inline-flex items-center gap-2 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-full px-[18px] py-[7px] mb-6 backdrop-blur-md hover:border-[#00E5FF]/60 hover:bg-[#00E5FF]/15 transition-all duration-300">
      <Ship className="w-4 h-4 text-[#00E5FF]" />
      <span className="text-[13px] font-medium text-[#00E5FF] tracking-wide">
        Next Generation Global Trade
      </span>
    </div>
  );
}
