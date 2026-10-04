import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../constants/navigation';

/**
 * Desktop Navigation Links Component — Layered "Signal Trace" Hover Interaction.
 *
 * Features:
 * - Character-staggered color shift (15-25ms sequential delay per letter)
 * - Comet-tail underline sweep (bright head + gradient trail settling into a subtle baseline)
 * - Micro directional chevron tick (› accent moving along the comet head)
 * - Restrained text-shadow glow & 1px upward lift
 * - Zero layout shift or letter reflow
 */
export const NavLinks = React.memo(function NavLinks({ className = '' }) {
  return (
    <nav aria-label="Main navigation" className={className}>
      <ul className="flex items-center space-x-8 md:space-x-10 list-none m-0 p-0">
        {NAV_LINKS.map((link) => {
          const isRoute = link.href.startsWith('/');
          const LinkComponent = isRoute ? Link : 'a';
          const linkProps = isRoute ? { to: link.href } : { href: link.href };

          return (
            <li key={link.id}>
              <LinkComponent
                {...linkProps}
                className="nav-signal-link relative inline-flex items-center h-10 text-[15px] font-medium whitespace-nowrap rounded-sm focus-visible:outline-2 focus-visible:outline-accent-500 focus-visible:outline-offset-2"
              >
                {/* Character-Staggered Text Spans */}
                <span className="inline-flex">
                  {link.label.split('').map((char, index) => (
                    <span
                      key={index}
                      className="char-signal"
                      style={{ transitionDelay: `${index * 20}ms` }}
                    >
                      {char}
                    </span>
                  ))}
                </span>

                {/* Signal Track: Base Underline, Comet Tail, and Directional Chevron Tick */}
                <span className="signal-track" aria-hidden="true">
                  <span className="signal-base" />
                  <span className="comet-tail" />
                  <span className="chevron-tick">
                    <svg width="4" height="6" viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L3 3L1 5" stroke="#00D4FF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
              </LinkComponent>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

export default NavLinks;
