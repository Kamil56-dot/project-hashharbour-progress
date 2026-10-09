import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Google SVG Icon
 */
function GoogleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

/**
 * HashHarbour Anchor SVG Icon
 */
function AnchorIcon({ className = 'w-12 h-[54px] text-brand-500' }) {
  return (
    <svg
      viewBox="0 0 34 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="17" cy="4" r="2.5" stroke="currentColor" strokeWidth="2.4" fill="none" />
      <line x1="10.5" y1="9" x2="23.5" y2="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="17" y1="6.5" x2="17" y2="15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="17" y1="21" x2="17" y2="33.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="9.5" y1="13" x2="9.5" y2="23" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <line x1="24.5" y1="13" x2="24.5" y2="23" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <line x1="6.5" y1="18" x2="27.5" y2="18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path
        d="M 5.5 27 C 5.5 34.5, 10.5 36.5, 17 36.5 C 23.5 36.5, 28.5 34.5, 28.5 27"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 3 27.5 L 5.5 23.5 L 8.5 27.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 25.5 27.5 L 28.5 23.5 L 31 27.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Register Page Component
 * Route: /register
 * Matches the reference design with centered white card on soft wavy gradient background.
 */
export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { register, isAuthenticated } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const returnUrl = searchParams.get('returnUrl');
  const isSafeReturn =
    returnUrl &&
    returnUrl.startsWith('/') &&
    !returnUrl.startsWith('//') &&
    !returnUrl.includes('://');

  const targetDestination = isSafeReturn ? returnUrl : '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(targetDestination, { replace: true });
    }
  }, [isAuthenticated, navigate, targetDestination]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg('');
    setSuccessMsg('');

    const trimmedEmail = email.trim();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (!trimmedEmail || !password) {
      setErrorMsg('Email address and password are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await register({
        email: trimmedEmail,
        password,
        first_name: trimmedFirst,
        last_name: trimmedLast,
      });

      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate(targetDestination, { replace: true });
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Unable to register. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setErrorMsg('Google Sign-In integration is currently in preview mode.');
  };

  const loginUrl = returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login';

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-transparent">
      {/* ── Centered White Card ── */}
      <div className="relative z-10 w-full max-w-[460px] bg-white rounded-[28px] sm:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(15,40,80,0.1),0_0_1px_1px_rgba(0,0,0,0.03)] px-7 py-9 sm:px-10 sm:py-10 border border-blue-50/80 transition-all">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Link
            to="/"
            className="flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1"
            title="HashHarbour Homepage"
          >
            <AnchorIcon className="w-12 h-[54px] sm:w-[50px] sm:h-[56px] text-brand-500 transition-transform duration-200 group-hover:scale-105" />
            <span className="font-sans font-bold text-[26px] sm:text-[28px] tracking-tight text-[#0F172A] leading-tight mt-3">
              HashHarbour
            </span>
          </Link>

          <p className="text-[#64748B] text-[15px] font-normal mt-1.5">
            Create your account
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mt-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span className="flex-1 leading-snug">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span className="flex-1 leading-snug">{successMsg}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
          {/* First Name & Last Name (Side by side on >= sm) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="register-firstname"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full bg-[#F8FAFC] border border-gray-200 hover:border-gray-300 focus:border-brand-500 focus:bg-white text-gray-800 placeholder-gray-400 rounded-full pl-11 pr-4 py-3 text-sm transition-all duration-150 outline-none focus:ring-4 focus:ring-brand-500/10"
                autoComplete="given-name"
              />
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="register-lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full bg-[#F8FAFC] border border-gray-200 hover:border-gray-300 focus:border-brand-500 focus:bg-white text-gray-800 placeholder-gray-400 rounded-full pl-11 pr-4 py-3 text-sm transition-all duration-150 outline-none focus:ring-4 focus:ring-brand-500/10"
                autoComplete="family-name"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="relative flex items-center">
            <div className="absolute left-4 sm:left-5 pointer-events-none text-gray-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="register-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-[#F8FAFC] border border-gray-200 hover:border-gray-300 focus:border-brand-500 focus:bg-white text-gray-800 placeholder-gray-400 rounded-full pl-12 sm:pl-13 pr-5 py-3 sm:py-3.5 text-sm sm:text-[15px] transition-all duration-150 outline-none focus:ring-4 focus:ring-brand-500/10"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="relative flex items-center">
            <div className="absolute left-4 sm:left-5 pointer-events-none text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              className="w-full bg-[#F8FAFC] border border-gray-200 hover:border-gray-300 focus:border-brand-500 focus:bg-white text-gray-800 placeholder-gray-400 rounded-full pl-12 sm:pl-13 pr-12 py-3 sm:py-3.5 text-sm sm:text-[15px] transition-all duration-150 outline-none focus:ring-4 focus:ring-brand-500/10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 sm:right-5 text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative flex items-center">
            <div className="absolute left-4 sm:left-5 pointer-events-none text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="register-confirm-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full bg-[#F8FAFC] border border-gray-200 hover:border-gray-300 focus:border-brand-500 focus:bg-white text-gray-800 placeholder-gray-400 rounded-full pl-12 sm:pl-13 pr-5 py-3 sm:py-3.5 text-sm sm:text-[15px] transition-all duration-150 outline-none focus:ring-4 focus:ring-brand-500/10"
              autoComplete="new-password"
            />
          </div>

          {/* Submit Register Button */}
          <div className="pt-2">
            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="group w-full rounded-full py-3.5 px-6 bg-gradient-to-r from-[#1E88E5] via-[#1976D2] to-[#1565C0] hover:from-[#1976D2] hover:to-[#0D47A1] text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(30,136,229,0.35)] hover:shadow-[0_6px_20px_rgba(30,136,229,0.45)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Link to Login */}
        <div className="mt-5 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to={loginUrl}
              className="font-semibold text-brand-600 hover:text-brand-700 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* "OR" Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-200/90" />
          <span className="px-4 text-xs font-semibold text-gray-400 tracking-wider">
            OR
          </span>
          <div className="flex-1 border-t border-gray-200/90" />
        </div>

        {/* "Continue with Google" Button */}
        <button
          id="register-google-btn"
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-3 sm:py-3.5 px-5 rounded-full border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/90 active:bg-gray-100 flex items-center justify-center gap-3 text-sm sm:text-[15px] font-medium text-gray-700 shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
        >
          <GoogleIcon className="w-5 h-5 shrink-0" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
