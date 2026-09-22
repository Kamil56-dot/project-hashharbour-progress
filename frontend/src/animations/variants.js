/**
 * REUSABLE ANIMATION VARIANTS & PRESETS
 * Source of Truth: architecture_blueprint.md Step 5
 */

export const ANIMATION_EASINGS = Object.freeze({
  power1Out: 'power1.out',
  power2Out: 'power2.out',
  power3Out: 'power3.out',
  power4Out: 'power4.out',
  easeOutExpo: 'expo.out',
});

export const FADE_IN_UP_PRESET = Object.freeze({
  opacity: 0,
  y: 30,
  duration: 0.5,
  ease: ANIMATION_EASINGS.power3Out,
});

export const FADE_IN_DOWN_PRESET = Object.freeze({
  opacity: 0,
  y: -20,
  duration: 0.4,
  ease: ANIMATION_EASINGS.power2Out,
});

export const FADE_IN_RIGHT_PRESET = Object.freeze({
  opacity: 0,
  x: -20,
  duration: 0.4,
  ease: ANIMATION_EASINGS.power2Out,
});
