import { useState, useEffect } from 'react';

/**
 * Custom hook to evaluate a media query using window.matchMedia.
 * Safely defaults to false during initial render / SSR to prevent layout shifts or flashing.
 *
 * @param {string} query - CSS media query string (e.g. '(min-width: 1024px)')
 * @param {boolean} defaultMatches - Default value before hydration/mount (default: false)
 * @returns {boolean} Whether the media query matches
 */
export function useMediaQuery(query, defaultMatches = false) {
  const [matches, setMatches] = useState(defaultMatches);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event) => setMatches(event.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Hook to determine if hero background should play desktop video.
 * Returns true ONLY when:
 * 1. Screen is desktop (min-width: 1024px)
 * 2. User has NOT requested reduced motion (prefers-reduced-motion: reduce is false)
 * 
 * Defaults to false on first render, guaranteeing mobile and initial renders load the image.
 *
 * @returns {boolean} shouldPlayDesktopVideo
 */
export function useDesktopVideoMedia() {
  const isDesktop = useMediaQuery('(min-width: 1024px)', false);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', false);

  return isDesktop && !prefersReducedMotion;
}

export default useMediaQuery;
