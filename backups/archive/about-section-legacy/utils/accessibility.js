/**
 * ACCESSIBILITY HELPER UTILITIES
 * Source of Truth: architecture_blueprint.md Step 7 & 11
 */

/**
 * Handles keyboard activation (Enter or Space) for non-button interactive elements.
 * @param {Function} handler - Callback to execute on activation
 * @returns {Function} Keyboard event handler
 */
export function handleKeyboardActivation(handler) {
  return (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handler(event);
    }
  };
}

/**
 * Generates standard ARIA attributes for expanding menus (e.g. mobile menu).
 * @param {boolean} isOpen - Menu expansion state
 * @param {string} controlsId - ID of the element controlled by the trigger
 * @returns {Object} ARIA attributes object
 */
export function getExpandableAria(isOpen, controlsId) {
  return {
    'aria-expanded': isOpen,
    'aria-controls': controlsId,
  };
}

/**
 * Detects system reduced motion preference.
 * @returns {boolean} True if user prefers reduced motion
 */
export function isReducedMotionPreferred() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
