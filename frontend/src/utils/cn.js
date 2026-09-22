import { clsx } from 'clsx';

/**
 * Combines CSS classes using clsx.
 * @param {...(string|Object|Array)} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return clsx(inputs);
}
