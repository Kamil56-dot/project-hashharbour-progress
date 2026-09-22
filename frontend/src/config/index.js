/**
 * CONFIG DIRECTORY
 * Purpose: Application runtime configuration, feature flags, and environment constants.
 */
export const CONFIG = Object.freeze({
  env: import.meta.env.MODE || 'development',
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
});
