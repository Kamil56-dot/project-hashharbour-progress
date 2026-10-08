import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CONFIG } from '../config';
import { authFetch, clearAuthStorage, setOnAuthFailure } from '../lib/authFetch';

const ACCESS_TOKEN_KEY = 'hh_access_token';
const REFRESH_TOKEN_KEY = 'hh_refresh_token';
const USER_KEY = 'hh_user';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
  });

  const [isLoading, setIsLoading] = useState(true);

  // Logout handler: clears local storage and revokes refresh token on backend
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    clearAuthStorage();
    setUser(null);
    setIsAuthenticated(false);

    if (refreshToken) {
      try {
        const baseUrl = CONFIG.apiUrl.endsWith('/') ? CONFIG.apiUrl.slice(0, -1) : CONFIG.apiUrl;
        await fetch(`${baseUrl}/api/auth/logout.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (err) {
        // Backend revocation failure should not prevent local logout
        console.warn('Backend logout revocation error:', err);
      }
    }
  }, []);

  // Login handler: calls /api/auth/login.php and updates local state & storage
  const login = useCallback(async (email, password) => {
    let response;
    const baseUrl = CONFIG.apiUrl.endsWith('/') ? CONFIG.apiUrl.slice(0, -1) : CONFIG.apiUrl;
    try {
      response = await fetch(`${baseUrl}/api/auth/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: String(email).trim(),
          password: String(password),
        }),
      });
    } catch {
      throw new Error('Authentication server unreachable. Please check your network connection.');
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(data?.error || 'Invalid email address or password.');
      }
      throw new Error(data?.error || `Login failed with status ${response.status}.`);
    }

    if (!data?.access) {
      throw new Error('Authentication response did not contain an access token.');
    }

    // Save tokens and user info in localStorage
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
    if (data.refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
    }
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    setUser(data.user || null);
    setIsAuthenticated(true);

    return data.user;
  }, []);

  // Listen for background auth failure from authFetch (e.g. failed refresh during API call)
  useEffect(() => {
    setOnAuthFailure(() => {
      setUser(null);
      setIsAuthenticated(false);
    });
  }, []);

  // Restore and validate session on initial mount
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      // If no token exists at all, stay logged out
      if (!accessToken && !refreshToken) {
        clearAuthStorage();
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        return;
      }

      try {
        // authFetch will attach Bearer token and attempt automatic refresh on 401
        const response = await authFetch('/api/auth/me.php');
        if (!response.ok) {
          throw new Error('Failed to validate session');
        }

        const data = await response.json();
        if (isMounted) {
          if (data?.user) {
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            setUser(data.user);
          }
          setIsAuthenticated(true);
        }
      } catch {
        // Session invalid or token expired/unrefreshable
        clearAuthStorage();
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__auth = value;
    }
  }, [value]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
