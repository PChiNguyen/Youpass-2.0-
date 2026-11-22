'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginFormProps {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function LoginForm({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  rememberMe,
  onRememberMeChange,
  loading,
  onSubmit,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Email Address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="student@example.com"
          className="w-full bg-[#1b1928] border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Password
          </label>
          <Link
            href="#"
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
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

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="remember"
          checked={rememberMe}
          onChange={(e) => onRememberMeChange(e.target.checked)}
          className="w-4 h-4 rounded bg-[#1b1928] border-gray-700 text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
        />
        <label
          htmlFor="remember"
          className="text-xs font-medium text-gray-400 cursor-pointer select-none"
        >
          Keep me signed in on this device
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-950/50 hover:shadow-purple-900/80 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer"
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
  );
}