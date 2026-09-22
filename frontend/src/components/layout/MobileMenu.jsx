import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../constants/navigation';
import { Button } from '../ui/Button';

/**
 * Mobile Drawer Navigation Overlay Component.
 * Source of Truth: architecture_blueprint.md Step 6, forensic_audit.md §15
 */
export function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-navigation-drawer"
      className="fixed inset-0 z-[40] bg-surface-950/95 backdrop-blur-xl lg:hidden flex flex-col pt-[88px] px-6 pb-8 transition-opacity duration-200"
    >
      <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full">
        {/* Nav Links Stack */}
        <nav aria-label="Mobile Navigation">
          <ul className="flex flex-col space-y-4 list-none p-0 m-0">
            {NAV_LINKS.map((link) => {
              const isRoute = link.href.startsWith('/');
              return (
                <li key={link.id}>
                  {isRoute ? (
                    <Link
                      to={link.href}
                      onClick={onClose}
                      className="block py-3 text-[18px] font-semibold text-text-primary hover:text-accent-500 border-b border-border-subtle transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={onClose}
                      className="block py-3 text-[18px] font-semibold text-text-primary hover:text-accent-500 border-b border-border-subtle transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Auth CTAs */}
        <div className="flex flex-col space-y-3 pt-6">
          <Button
            variant="ghost"
            label="Login"
            href="#login"
            onClick={onClose}
            className="w-full h-12 text-body-md"
          />
          <Button
            variant="primary"
            label="Register"
            href="#register"
            onClick={onClose}
            className="w-full h-12 text-body-md"
          />
        </div>
      </div>
    </div>
  );
}
