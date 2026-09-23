/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
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
        /* Light-theme vivid-blue brand scale for homepage hero & nav */
        brand: {
          50:  '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#1E88E5',
          600: '#1976D2',
          700: '#1565C0',
          800: '#0D47A1',
          900: '#0A2F6B',
        },
        'hero-bg': '#F5F9FF',
        'heading-navy': '#0F172A',
        'text-primary':   '#ffffff',
        'text-secondary': '#e0e6ed',
        'text-tertiary':  '#b0b8c4',
        'text-body':      '#a0aab4',
        'text-muted':     '#8899a6',
        'text-disabled':  '#667788',
        'text-inverse':   '#0a1020',
        'text-accent':    '#00d4ff',
      },

      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Anton', 'Impact', 'sans-serif'],
        strokes: ['Strokes', 'sans-serif'],
        brush:   ['Strokes', '"Knewave"', '"East Sea Dokdo"', '"Dokdo"', '"Road Rage"', 'cursive', 'sans-serif'],
      },

      fontSize: {
        'display-xl': ['64px', { lineHeight: '1.05', letterSpacing: '0.04em', fontWeight: '900' }],
        'heading-lg': ['32px', { lineHeight: '1.2', fontWeight: '800' }],
        'heading-md': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-sm': ['17px', { lineHeight: '1.3', fontWeight: '700' }],
        'body-lg':    ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md':    ['15px', { lineHeight: '1.65', fontWeight: '400' }],
        'body-sm':    ['13px', { lineHeight: '1.55', fontWeight: '400' }],
        'caption':    ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },

      spacing: {
        'hero-badge-gap':   '16px',
        'hero-heading-gap': '12px',
        'hero-sub-gap':     '24px',
        'hero-tag-gap':     '24px',
        'hero-para-gap':    '32px',
        'hero-cta-gap':     '40px',
        'section-gap':      '32px',
        'card-gap':         '22px',
        'card-padding':     '24px',
        'card-padding-x':   '20px',
        'stat-padding-x':   '32px',
        'stat-padding-y':   '20px',
        'nav-padding-x':    '56px',
        'nav-padding-y':    '16px',
        'button-gap':       '16px',
      },

      borderRadius: {
        'button': '8px',
        'card':   '14px',
        'panel':  '16px',
        'badge':  '16px',
      },

      boxShadow: {
        'card':            '0 4px 24px rgba(0, 0, 0, 0.12)',
        'card-hover':      '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 24px rgba(0, 212, 255, 0.08)',
        'glow-cyan':       '0 4px 24px rgba(0, 212, 255, 0.25)',
        'glow-cyan-hover': '0 8px 32px rgba(0, 212, 255, 0.40)',
        'glow-soft':       '0 0 40px rgba(0, 212, 255, 0.15)',
        'panel':           '0 8px 32px rgba(0, 0, 0, 0.2)',
        'nav-glow':        '0 0 16px rgba(0, 212, 255, 0.3)',
      },

      maxWidth: {
        'container': '1200px',
        'hero-text': '520px',
        'paragraph': '440px',
        'tagline':   '320px',
      },

      transitionDuration: {
        'fast':    '150ms',
        'default': '200ms',
        'slow':    '350ms',
        'slower':  '500ms',
      },

      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
