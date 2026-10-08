import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { hasRole } from '../../lib/roles';

/**
 * Neutral centered spinner fallback while session hydration completes
 */
function AuthLoadingFallback() {
  const { isLight } = useTheme();
  return (
    <div
      className={`min-h-[60vh] flex items-center justify-center transition-colors duration-200 ${
        isLight ? 'text-[#1E88E5]' : 'text-[#38BDF8]'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full border-2 animate-spin ${
            isLight
              ? 'border-[#1E88E5]/20 border-t-[#1E88E5]'
              : 'border-[#38BDF8]/20 border-t-[#38BDF8]'
          }`}
        />
        <span
          className={`text-[13px] font-medium tracking-wide ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          Verifying session...
        </span>
      </div>
    </div>
  );
}

/**
 * ProtectedRoute component
 * - Props:
 *   - children?: ReactNode
 *   - allowedRoles?: string[] (optional array of allowed roles)
 */
export function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!hasRole(user, allowedRoles)) {
      return <Navigate to="/" replace />;
    }
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
