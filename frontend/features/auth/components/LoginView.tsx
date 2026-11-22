'use client';

import Link from 'next/link';
import Script from 'next/script';
import { AlertCircle } from 'lucide-react';
import { useLoginAuth } from '../hooks/useLoginAuth';
import LoginBanner from './LoginBanner';
import LoginForm from './LoginForm';
import SocialLogins from './SocialLogins';

export default function LoginView() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    loading,
    error,
    setError,
    setGsiLoaded,
    googleBtnContainerRef,
    googleClientId,
    handleLogin,
  } = useLoginAuth();

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setGsiLoaded(true)}
      />

      <div className="min-h-screen w-full bg-[#1e1c2b] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans antialiased text-gray-200">
        <div className="w-full max-w-5xl bg-[#272538] border border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          <LoginBanner />

          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-[#242235]">
            <div className="max-w-md w-full mx-auto space-y-7">
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Sign in to your account
                </h1>
                <p className="text-sm text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register"
                    className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors"
                  >
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

              <LoginForm
                email={email}
                onEmailChange={setEmail}
                password={password}
                onPasswordChange={setPassword}
                rememberMe={rememberMe}
                onRememberMeChange={setRememberMe}
                loading={loading}
                onSubmit={handleLogin}
              />

              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-700/70 w-full" />
                <span className="bg-[#242235] px-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 shrink-0">
                  Or continue with
                </span>
                <div className="border-t border-gray-700/70 w-full" />
              </div>

              <SocialLogins
                googleClientId={googleClientId}
                googleBtnContainerRef={googleBtnContainerRef}
                onError={setError}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}