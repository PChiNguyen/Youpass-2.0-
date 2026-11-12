'use client';

import { useState } from 'react';
import { LogIn, Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || 'Invalid email or password. Please check your credentials.');
      }

      const data = await response.json();
      setToken(data.access_token);
      
      // 🟢 FIXED: Redirects back to the homepage upon successful login!
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-4">
      
      {/* Back to Home Link */}
      <div className="max-w-md mx-auto w-full pt-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* Login Box */}
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100 my-auto">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to access your YouPass 2.0 account</p>
        </div>

        {/* Error Notification Box */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password Field with Eye Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 mt-2"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Verifying credentials...' : 'Sign In'}
          </button>
        </form>

      </div>

      <div className="py-4"></div>
    </div>
  );
}