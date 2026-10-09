/**
 * HASHHARBOUR — CENTRALIZED DESIGN TOKEN SYSTEM
 * Source of Truth: analysis_results.md, forensic_audit.md, design_dna.md, architecture_blueprint.md
 * 
 * All design tokens are exported as frozen immutable objects.
 * No hardcoded inline theme values allowed in components.
 */

export const COLORS = Object.freeze({
  surface: {
    950: '#060a14',
    900: '#0a0f1e',
    850: '#0d1524',
    800: '#111b2b',
    750: '#152238',
    700: '#1a2a3f',
    600: '#233550',
    500: '#2d4060',
  },
  accent: {
    50:  '#e5fbff',
    100: '#b3f3ff',
    200: '#66e8ff',
    300: '#33ddff',
    400: '#1adbff',
    500: '#00d4ff',
    600: '#00bcd4',
    700: '#009ab0',
    800: '#007a8c',
    900: '#005a68',
  },
  text: {
    primary:   '#ffffff',
    secondary: '#e0e6ed',
    tertiary:  '#b0b8c4',
    body:      '#a0aab4',
    muted:     '#8899a6',
    disabled:  '#667788',
    inverse:   '#0a1020',
    accent:    '#00d4ff',
  },
  border: {
    subtle:        'rgba(255, 255, 255, 0.04)',
    muted:         'rgba(255, 255, 255, 0.06)',
    default:       'rgba(255, 255, 255, 0.08)',
    medium:        'rgba(255, 255, 255, 0.10)',
    strong:        'rgba(255, 255, 255, 0.14)',
    emphasis:      'rgba(255, 255, 255, 0.20)',
    bright:        'rgba(255, 255, 255, 0.30)',
    accent:        'rgba(0, 212, 255, 0.20)',
    accentStrong:  'rgba(0, 212, 255, 0.40)',
  },
  overlay: {
    heavy:  'rgba(10, 15, 30, 0.92)',
    strong: 'rgba(10, 15, 30, 0.75)',
    medium: 'rgba(10, 15, 30, 0.50)',
    light:  'rgba(10, 15, 30, 0.25)',
    subtle: 'rgba(10, 15, 30, 0.10)',
    none:   'rgba(10, 15, 30, 0.00)',
    bottom: 'rgba(10, 15, 30, 0.60)',
  },
  glow: {
    button:      'rgba(0, 212, 255, 0.25)',
    buttonHover: 'rgba(0, 212, 255, 0.40)',
    cardHover:   'rgba(0, 212, 255, 0.08)',
    badge:       'rgba(0, 212, 255, 0.10)',
  },
});

export const TYPOGRAPHY = Object.freeze({
  fonts: {
    sans:    'Inter, system-ui, -apple-system, sans-serif',
    display: 'Anton, Impact, sans-serif',
  },
  sizes: {
    displayXl: { size: '64px', lineHeight: '1.05', letterSpacing: '0.04em', weight: '900' },
    headingLg:  { size: '32px', lineHeight: '1.2',  letterSpacing: '0em',    weight: '800' },
    headingMd:  { size: '24px', lineHeight: '1.3',  letterSpacing: '0em',    weight: '700' },
    headingSm:  { size: '17px', lineHeight: '1.3',  letterSpacing: '0em',    weight: '700' },
    bodyLg:     { size: '16px', lineHeight: '1.6',  letterSpacing: '0em',    weight: '400' },
    bodyMd:     { size: '15px', lineHeight: '1.65', letterSpacing: '0em',    weight: '400' },
    bodySm:     { size: '13px', lineHeight: '1.55', letterSpacing: '0em',    weight: '400' },
    caption:    { size: '12px', lineHeight: '1.4',  letterSpacing: '0em',    weight: '400' },
  },
});

export const SPACING_GRID = Object.freeze({
  unit: 8,
  heroBadgeGap:   16, // Badge to heading (2x)
  heroHeadingGap: 12, // Heading to subheading (1.5x)
  heroSubGap:     24, // Subheading to tagline (3x)
  heroTagGap:     24, // Tagline to paragraph (3x)
  heroParaGap:    32, // Paragraph to CTA (4x)
  heroCtaGap:     40, // CTA to feature cards (5x)
  sectionGap:     32, // Cards to stats panel (4x)
  cardGap:        22, // Between feature cards
  cardPaddingY:   24, // Internal card padding vertical
  cardPaddingX:   20, // Internal card padding horizontal
  statPaddingX:   32, // Stats panel horizontal padding
  statPaddingY:   20, // Stats panel vertical padding
  navPaddingX:    56, // Navbar horizontal padding (7x)
  navPaddingY:    16, // Navbar vertical padding (2x)
  buttonGap:      16, // Between CTA buttons (2x)
});

export const RADII = Object.freeze({
  button: '8px',
  card:   '14px',
  panel:  '16px',
  badge:  '16px', // Pill shape
});

export const SHADOWS = Object.freeze({
  card:          '0 4px 24px rgba(0, 0, 0, 0.12)',
  cardHover:     '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 24px rgba(0, 212, 255, 0.08)',
  glowCyan:      '0 4px 24px rgba(0, 212, 255, 0.25)',
  glowCyanHover: '0 8px 32px rgba(0, 212, 255, 0.40)',
  glowSoft:      '0 0 40px rgba(0, 212, 255, 0.15)',
  panel:         '0 8px 32px rgba(0, 0, 0, 0.2)',
});

export const GLASS = Object.freeze({
  bg:          'rgba(13, 27, 42, 0.35)',
  bgHover:     'rgba(13, 27, 42, 0.40)',
  blur:        '16px',
  saturate:    '1.2',
  border:      'rgba(255, 255, 255, 0.08)',
  borderTop:   'rgba(255, 255, 255, 0.14)',
  borderHover: 'rgba(0, 212, 255, 0.30)',
});

export const BREAKPOINTS = Object.freeze({
  sm:  640,  // Mobile landscape
  md:  768,  // Tablet portrait
  lg:  1024, // Laptop
  xl:  1280, // Desktop
  '2xl': 1536, // Large desktop
});

export const Z_INDEX = Object.freeze({
  background: 0,
  overlay:    10,
  content:    20,
  navbar:     30,
  modal:      40,
  popover:    50,
});
