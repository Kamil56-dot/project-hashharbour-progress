/**
 * TYPEWRITER TAGLINE CONSTANTS
 * Source of Truth: forensic_audit.md §14, design_dna.md §2
 */

export const TAGLINE_PHRASES = Object.freeze([
  'Moving Trade. Powering Growth.',
  'Connecting Worlds. Delivering Trust.',
  'Smart Logistics. Seamless Tomorrow.',
]);

export const TYPEWRITER_TIMINGS = Object.freeze({
  typingSpeed: 50,    // ms per char (forensic_audit.md §14)
  erasingSpeed: 30,   // ms per char (forensic_audit.md §14)
  holdDuration: 2000, // ms hold on completed phrase (forensic_audit.md §14)
  pauseDuration: 500, // ms pause before typing next (forensic_audit.md §14)
});
