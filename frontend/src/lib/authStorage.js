/**
 * Tab-isolated session storage helper for authentication
 *
 * Uses window.sessionStorage so that different browser tabs can hold
 * independent user sessions (e.g. admin in tab 1, customer in tab 2)
 * without cross-tab interference.
 */

export const ACCESS_TOKEN_KEY = 'hh_access_token';
export const REFRESH_TOKEN_KEY = 'hh_refresh_token';
export const USER_KEY = 'hh_user';

// One-time legacy purge of auth keys from localStorage at module load
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }
} catch {
  // Ignore localStorage access failures
}

export function getAccessToken() {
  try {
    return window.sessionStorage ? window.sessionStorage.getItem(ACCESS_TOKEN_KEY) : null;
  } catch {
    return null;
  }
}

export function getRefreshToken() {
  try {
    return window.sessionStorage ? window.sessionStorage.getItem(REFRESH_TOKEN_KEY) : null;
  } catch {
    return null;
  }
}

export function getStoredUser() {
  try {
    if (!window.sessionStorage) return null;
    const raw = window.sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAccessToken(value) {
  try {
    if (window.sessionStorage) {
      if (value != null) {
        window.sessionStorage.setItem(ACCESS_TOKEN_KEY, String(value));
      } else {
        window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    }
  } catch {
    // Ignore storage quota or access failures
  }
}

export function setRefreshToken(value) {
  try {
    if (window.sessionStorage) {
      if (value != null) {
        window.sessionStorage.setItem(REFRESH_TOKEN_KEY, String(value));
      } else {
        window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
  } catch {
    // Ignore storage quota or access failures
  }
}

export function setStoredUser(userObj) {
  try {
    if (window.sessionStorage) {
      if (userObj != null) {
        window.sessionStorage.setItem(USER_KEY, typeof userObj === 'string' ? userObj : JSON.stringify(userObj));
      } else {
        window.sessionStorage.removeItem(USER_KEY);
      }
    }
  } catch {
    // Ignore storage quota or access failures
  }
}

export function removeAccessToken() {
  try {
    if (window.sessionStorage) {
      window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch {
    // Ignore storage failures
  }
}

export function clearAuth() {
  try {
    if (window.sessionStorage) {
      window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      window.sessionStorage.removeItem(USER_KEY);
    }
  } catch {
    // Ignore storage failures
  }
}
