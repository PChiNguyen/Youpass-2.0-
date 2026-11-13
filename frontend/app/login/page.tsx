'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { Eye, EyeOff, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (callback?: (notification: unknown) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>
          ) => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gsiLoaded, setGsiLoaded] = useState(false);

  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  // 1. Xử lý Google Token sau khi người dùng đăng nhập bằng Google thành công
  const handleGoogleCredentialResponse = useCallback(
    async (response: { credential?: string }) => {
      if (!response.credential) {
        setError('Google login failed: No credential received.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const res = await fetch(`${apiUrl}/api/auth/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: response.credential }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.detail || 'Failed to authenticate with Google.');
        }

        const data = await res.json();
        setToken(data.access_token);
        router.push('/dashboard');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Google authentication error';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, router, setToken]
  );

  // 2. Khởi tạo Google Identity Services khi SDK tải xong
  useEffect(() => {
    if (gsiLoaded && window.google?.accounts?.id && googleClientId) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
      });

      const buttonContainer = document.getElementById('google-btn-hidden');
      if (buttonContainer) {
        window.google.accounts.id.renderButton(buttonContainer, {
          theme: 'filled_black',
          size: 'large',
          width: 220,
        });
      }
    }
  }, [gsiLoaded, googleClientId, handleGoogleCredentialResponse]);

  // 3. Xử lý khi nhấn nút Google
  const handleGoogleClick = () => {
    if (!googleClientId) {
      setError(
        'Google Client ID chưa được cài đặt. Vui lòng thêm NEXT_PUBLIC_GOOGLE_CLIENT_ID vào frontend/.env.local'
      );
      return;
    }

    if (!window.google?.accounts?.id) {
      setError('Google Sign-In SDK is loading. Please wait a moment and try again.');
      return;
    }

    // Mở popup tài khoản Google One-Tap / Account Chooser
    window.google.accounts.id.prompt();
  };

  // 4. Đăng nhập Email + Password tiêu chuẩn
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || 'Invalid email or password.');
      }

      const data = await response.json();
      setToken(data.access_token);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during sign in.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tải thư viện Google Identity Services chính thức */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setGsiLoaded(true)}
      />

      <div className="min-h-screen w-full bg-[#1e1c2b] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans antialiased text-gray-200">
        <div className="w-full max-w-5xl bg-[#272538] border border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* ================= LEFT POSTER PANEL ================= */}
          <div className="lg:col-span-5 relative p-8 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#3b2d54] via-[#241e3a] to-[#161324] border-b lg:border-b-0 lg:border-r border-gray-700/40">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-900/40">
                  YP
                </div>
                <span className="font-extrabold text-white tracking-tight text-lg">YouPass 2.0</span>
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full transition-all backdrop-blur-md border border-white/10"
              >
                Back to website <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="relative z-10 my-auto py-12 text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" /> IELTS Adaptive Testing
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                Mastering Skills,<br />Achieving Bands.
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
                Experience authentic Cambridge exam simulations with automated scoring and AI diagnostic feedback.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-2 pt-4">
              <span className="w-7 h-1.5 rounded-full bg-purple-500 transition-all" />
              <span className="w-2 h-1.5 rounded-full bg-gray-600" />
              <span className="w-2 h-1.5 rounded-full bg-gray-600" />
            </div>
          </div>

          {/* ================= RIGHT FORM PANEL ================= */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-[#242235]">
            <div className="max-w-md w-full mx-auto space-y-7">
              
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Sign in to your account
                </h1>
                <p className="text-sm text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors">
                    Create one now
                  </Link>
                </p>
              </div>

              {error && (
                <div className="p-3.5 bg-red-950/50 border border-red-500/40 text-red-300 rounded-xl text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="flex-1 leading-relaxed">{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full bg-[#1b1928] border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>

                {/* Password Field with Fixed Eye Toggle */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Password
                    </label>
                    <Link href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-[#1b1928] border border-gray-700/80 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                    
                    <button
                      type="button"
                      tabIndex={-1}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer z-10"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#1b1928] border-gray-700 text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs font-medium text-gray-400 cursor-pointer select-none">
                    Keep me signed in on this device
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-950/50 hover:shadow-purple-900/80 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    'Sign in to account'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-700/70 w-full" />
                <span className="bg-[#242235] px-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 shrink-0">
                  Or continue with
                </span>
                <div className="border-t border-gray-700/70 w-full" />
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3.5">
                
                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleClick}
                  className="flex items-center justify-center gap-2.5 bg-[#1b1928] hover:bg-[#211e33] border border-gray-700/70 hover:border-purple-500/50 py-3 px-4 rounded-xl text-xs font-semibold text-gray-200 transition-all shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  Google
                </button>

                {/* Apple Sign In Button */}
                <button
                  type="button"
                  onClick={() => setError('Apple Sign-In is coming soon. Please use email or Google account.')}
                  className="flex items-center justify-center gap-2.5 bg-[#1b1928] hover:bg-[#211e33] border border-gray-700/70 hover:border-gray-600 py-3 px-4 rounded-xl text-xs font-semibold text-gray-200 transition-all shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2.02.6-2.66 1.35-.57.66-1.06 1.73-.93 2.76 1.02.08 2.06-.51 2.67-1.26" />
                  </svg>
                  Apple
                </button>

              </div>

              {/* Hidden container để GSI render fallback nếu cần */}
              <div id="google-btn-hidden" className="hidden" />

            </div>
          </div>

        </div>
      </div>
    </>
  );
}