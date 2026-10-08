import { CONFIG } from '../config';

const ACCESS_TOKEN_KEY = 'hh_access_token';
const REFRESH_TOKEN_KEY = 'hh_refresh_token';
const USER_KEY = 'hh_user';

let onAuthFailureCallback = null;

export function setOnAuthFailure(callback) {
  onAuthFailureCallback = callback;
}

export function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Single in-flight refresh promise for deduplicating concurrent refresh attempts
let inFlightRefreshPromise = null;

export async function refreshTokens() {
  if (inFlightRefreshPromise) {
    return inFlightRefreshPromise;
  }

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    clearAuthStorage();
    if (onAuthFailureCallback) onAuthFailureCallback();
    throw new Error('No refresh token available');
  }

  inFlightRefreshPromise = (async () => {
    try {
      const baseUrl = CONFIG.apiUrl.endsWith('/') ? CONFIG.apiUrl.slice(0, -1) : CONFIG.apiUrl;
      const response = await fetch(`${baseUrl}/api/auth/refresh.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        clearAuthStorage();
        if (onAuthFailureCallback) onAuthFailureCallback();
        throw new Error(data.error || 'Session expired. Please log in again.');
      }

      if (data.access) {
        localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
      }
      if (data.refresh) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
      }

      return data.access;
    } catch (err) {
      clearAuthStorage();
      if (onAuthFailureCallback) onAuthFailureCallback();
      throw err;
    } finally {
      inFlightRefreshPromise = null;
    }
  })();

  return inFlightRefreshPromise;
}

/**
 * Authenticated fetch helper with automatic 401 token refresh retry.
 *
 * @param {string} endpoint - Relative path (e.g. '/api/auth/me.php') or absolute URL
 * @param {RequestInit} [options={}] - Standard Fetch options
 * @returns {Promise<Response>}
 */
export async function authFetch(endpoint, options = {}) {
  const baseUrl = CONFIG.apiUrl.endsWith('/') ? CONFIG.apiUrl.slice(0, -1) : CONFIG.apiUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${baseUrl}${cleanEndpoint}`;

  const headers = new Headers(options.headers || {});

  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  let response = await fetch(url, fetchOptions);

  // If 401 Unauthorized, attempt ONE refresh and retry
  if (response.status === 401 && !url.includes('/api/auth/refresh.php') && !url.includes('/api/auth/login.php')) {
    try {
      const newAccessToken = await refreshTokens();
      if (newAccessToken) {
        const retryHeaders = new Headers(options.headers || {});
        retryHeaders.set('Authorization', `Bearer ${newAccessToken}`);
        response = await fetch(url, {
          ...options,
          headers: retryHeaders,
        });
      }
    } catch {
      // Refresh failed, return original or propagate 401 response
      return response;
    }
  }

  return response;
}
