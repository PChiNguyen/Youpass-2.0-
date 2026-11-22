'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, ShieldCheck, Award, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function HomePage() {
  const token = useAuthStore((state) => state.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col justify-between">
      <main className="max-w-4xl mx-auto px-6 py-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4" /> Learn smarter, not harder
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
          Master IELTS with <span className="text-blue-600">Smart Practice</span> &amp; Real Analytics
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Access curated Reading, Listening, Writing, and Speaking practice tests tailored to your target score.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {mounted && token ? (
            <Link
              href="/skills/reading"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-base"
            >
              <BookOpen className="w-5 h-5" /> Start Practicing <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-base"
            >
              Sign In to Practice <ArrowRight className="w-5 h-5" />
            </Link>
          )}
          <Link
            href="/skills/reading"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-8 py-3.5 rounded-xl border border-gray-300 shadow-sm transition-all text-base"
          >
            Browse Reading Tests
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h3 className="font-bold text-gray-900">4 Skills Hub</h3>
            <p className="text-sm text-gray-500">
              Practice modules for Reading, Listening, Writing, and Speaking.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <h3 className="font-bold text-gray-900">Auto-Graded Tests</h3>
            <p className="text-sm text-gray-500">
              Instant raw scores and IELTS band conversions powered by FastAPI.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            <h3 className="font-bold text-gray-900">Progress Tracking</h3>
            <p className="text-sm text-gray-500">
              Track your target band scores and test history in one place.
            </p>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto w-full px-6 py-8 text-center text-xs text-gray-400 border-t border-gray-100">
        © 2026 YouPass 2.0. All rights reserved.
      </footer>
    </div>
  );
}