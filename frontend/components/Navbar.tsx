'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, LayoutDashboard, Home, LogIn, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname.startsWith('/practice')) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-xl font-black text-xl shadow-md">
            YP
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">
            YouPass 2.0
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/60">
          <Link
            href="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive('/')
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Home className="w-4 h-4" /> Home
          </Link>

          <Link
            href="/skills/reading"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              pathname.startsWith('/skills')
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4" /> 4 Skills Practice
          </Link>

          <Link
            href="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive('/dashboard')
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {mounted && token ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-200">
                <User className="w-3.5 h-3.5" /> Student Active
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 px-4 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all"
              >
                <LogIn className="w-4 h-4" /> Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}