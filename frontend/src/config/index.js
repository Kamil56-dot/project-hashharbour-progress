/**
 * CONFIG DIRECTORY
 * Purpose: Application runtime configuration, feature flags, and environment constants.
 */
export const CONFIG = Object.freeze({
  env: import.meta.env.MODE || 'development',
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost/hashharbour-api',
});
