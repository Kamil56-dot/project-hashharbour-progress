import { useState, useEffect, useRef } from 'react';
import { throttleRAF } from '../utils/performance';

/**
 * Custom hook for tracking viewport scroll position efficiently.
 * Uses requestAnimationFrame throttling to avoid layout thrashing.
 * @returns {number} Current scroll Y position
 */
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = throttleRAF(() => {
      const currentY = window.scrollY;
      if (scrollRef.current !== currentY) {
        scrollRef.current = currentY;
        setScrollY(currentY);
      }
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial read

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollY;
}
