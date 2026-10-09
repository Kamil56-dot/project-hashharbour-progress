import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Anchor } from 'lucide-react';

export default function Navbar({ onOpenLogin, onOpenRegister }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav h-[70px] flex items-center transition-all duration-300">
      <div className="max-w-[1280px] w-full mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Logo Section */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
            <Anchor className="w-5 h-5" />
          </div>
          <span className="text-[20px] font-bold text-white tracking-tight group-hover:text-[#00E5FF] transition-colors">
            HashHarbour
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-9">
          {['About', 'Services', 'Routes'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[15px] font-normal text-white/80 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#00E5FF] hover:after:w-full after:transition-all after:duration-300"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Right Section Actions */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            aria-label="Cart"
            className="text-white/70 hover:text-[#00E5FF] transition-colors p-1.5 rounded-md hover:bg-white/5"
          >
            <ShoppingBag className="w-[22px] h-[22px]" />
          </button>
          
          <button 
            aria-label="Menu"
            className="text-white/70 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/5"
          >
            <Menu className="w-[24px] h-[24px]" />
          </button>

          <div className="flex items-center gap-3 ml-2">
            <button
              onClick={onOpenLogin}
              className="w-[100px] h-[40px] rounded-lg border border-white/30 text-[14px] font-medium text-white hover:border-[#00E5FF] hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-all cursor-pointer flex items-center justify-center"
            >
              Log In
            </button>
            
            <button
              onClick={onOpenRegister}
              className="w-[110px] h-[40px] rounded-lg bg-[#00E5FF] text-[14px] font-semibold text-[#060B14] hover:bg-[#00B8D4] cyan-glow hover:cyan-glow-lg transition-all cursor-pointer flex items-center justify-center"
            >
              Register
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button 
            aria-label="Cart"
            className="text-white/80 p-1.5"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white/90 p-1.5 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[70px] left-0 w-full glass-panel border-t-0 border-x-0 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3">
            {['About', 'Services', 'Routes'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[16px] font-medium text-white/90 hover:text-[#00E5FF] py-2 border-b border-white/5"
              >
                {link}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenLogin?.(); }}
              className="flex-1 h-[42px] rounded-lg border border-white/30 text-white font-medium text-[14px]"
            >
              Log In
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenRegister?.(); }}
              className="flex-1 h-[42px] rounded-lg bg-[#00E5FF] text-[#060B14] font-semibold text-[14px]"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
