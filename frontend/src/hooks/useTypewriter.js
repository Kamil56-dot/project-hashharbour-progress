import { useState, useEffect, useRef } from 'react';
import { isReducedMotionPreferred } from '../utils/accessibility';

/**
 * Robust Multiline Typewriter Hook.
 * Source of Truth: User Specification — 3-Line Tagline Loop
 *
 * Sequence:
 * 1. Line 1 types character-by-character. Stays on screen.
 * 2. Line 2 types below Line 1 while Line 1 remains visible.
 * 3. Line 3 types below Line 2 while Lines 1 and 2 remain visible.
 * 4. Hold all 3 lines on screen for ~2000ms.
 * 5. Smooth fade out, short pause, and restart loop continuously.
 *
 * @param {string[]} phrases - Array of 3 tagline phrases
 * @returns {{ linesText: string[], activeLine: number, isHolding: boolean, isFading: boolean }}
 */
export function useTypewriter(phrases) {
  const [linesText, setLinesText] = useState(['', '', '']);
  const [activeLine, setActiveLine] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isFading, setIsFading] = useState(false);

  // State refs to guarantee fresh values inside recursive timeout callbacks
  const stateRef = useRef({
    linesText: ['', '', ''],
    activeLine: 0,
    phase: 'TYPING', // 'TYPING' | 'LINE_PAUSE' | 'HOLD' | 'FADE' | 'RESET_PAUSE'
  });

  const timerRef = useRef(null);

  useEffect(() => {
    // Accessibility fallback: static full display for reduced motion
    if (isReducedMotionPreferred()) {
      setLinesText(phrases);
      setActiveLine(2);
      setIsHolding(true);
      return;
    }

    let cancelled = false;

    // Reset internal state ref on initial mount
    stateRef.current = {
      linesText: ['', '', ''],
      activeLine: 0,
      phase: 'TYPING',
    };
    setLinesText(['', '', '']);
    setActiveLine(0);
    setIsHolding(false);
    setIsFading(false);

    function runLoop() {
      if (cancelled) return;

      const { phase, activeLine: currentLineIndex } = stateRef.current;
      const targetPhrase = phrases[currentLineIndex] || '';
      const currentTyped = stateRef.current.linesText[currentLineIndex] || '';

      if (phase === 'TYPING') {
        if (currentTyped.length < targetPhrase.length) {
          const nextText = targetPhrase.slice(0, currentTyped.length + 1);
          stateRef.current.linesText[currentLineIndex] = nextText;
          setLinesText([...stateRef.current.linesText]);

          timerRef.current = setTimeout(runLoop, 45); // ~45ms per character
        } else {
          // Line typing complete
          if (currentLineIndex < phrases.length - 1) {
            // Short pause (400ms) before starting next line
            stateRef.current.phase = 'LINE_PAUSE';
            timerRef.current = setTimeout(() => {
              if (cancelled) return;
              stateRef.current.activeLine = currentLineIndex + 1;
              setActiveLine(currentLineIndex + 1);
              stateRef.current.phase = 'TYPING';
              runLoop();
            }, 400); // 400ms pause after each line completes
          } else {
            // All 3 lines complete -> HOLD phase
            stateRef.current.phase = 'HOLD';
            setIsHolding(true);
            timerRef.current = setTimeout(() => {
              if (cancelled) return;
              // Fade out phase
              stateRef.current.phase = 'FADE';
              setIsFading(true);
              timerRef.current = setTimeout(() => {
                if (cancelled) return;
                // Reset state for loop restart
                stateRef.current.linesText = ['', '', ''];
                stateRef.current.activeLine = 0;
                stateRef.current.phase = 'RESET_PAUSE';
                setLinesText(['', '', '']);
                setActiveLine(0);
                setIsHolding(false);
                setIsFading(false);
                timerRef.current = setTimeout(() => {
                  if (cancelled) return;
                  stateRef.current.phase = 'TYPING';
                  runLoop();
                }, 500); // 500ms pause before restarting
              }, 300); // 300ms fade out duration
            }, 2000); // 2000ms hold duration
          }
        }
      }
    }

    // Start typewriter loop
    runLoop();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phrases]);

  return { linesText, activeLine, isHolding, isFading };
}
