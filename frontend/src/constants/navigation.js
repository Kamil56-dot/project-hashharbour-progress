/**
 * NAVIGATION CONSTANTS
 * Source of Truth: forensic_audit.md §1 & §15, reference image
 */

export const NAV_LINKS = Object.freeze([
  { id: 'about',     label: 'About',     href: '/about' },
  { id: 'services',  label: 'Services',  href: '/services' },
  { id: 'routes',    label: 'Routes',    href: '#routes' },
]);

export const NAV_ACTIONS = Object.freeze({
  login:    { label: 'Log In',   href: '#login',    variant: 'nav-ghost' },
  register: { label: 'Register', href: '#register', variant: 'nav-primary' },
});
