/**
 * PERFORMANCE HELPER UTILITIES
 * Source of Truth: architecture_blueprint.md Step 8 & 12
 */

/**
 * Creates a debounced function that delays execution until after `wait` ms.
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function using requestAnimationFrame for smooth 60fps handlers (e.g. scroll).
 * @param {Function} callback - Callback function to run on animation frame
 * @returns {Function} Throttled function
 */
export function throttleRAF(callback) {
  let tick = false;
  return function throttled(...args) {
    if (!tick) {
      requestAnimationFrame(() => {
        callback(...args);
        tick = false;
      });
      tick = true;
    }
  };
}
