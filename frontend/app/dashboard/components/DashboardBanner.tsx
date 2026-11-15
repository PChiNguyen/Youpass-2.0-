// frontend/app/dashboard/components/DashboardBanner.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

interface DashboardBannerProps {
  fullName: string | null;
  targetOverall: number | null;
}

export default function DashboardBanner({ fullName, targetOverall }: DashboardBannerProps) {
  const displayName = fullName || 'Student';

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="space-y-2 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-blue-100 border border-white/20">
          <Sparkles className="w-3.5 h-3.5" /> IELTS Academic & General
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
          Welcome back, {displayName}!
        </h2>
        <p className="text-sm text-blue-100/90 leading-relaxed">
          {targetOverall ? (
            <>
              You are aiming for an <span className="font-extrabold text-white">Overall Band {targetOverall.toFixed(1)}</span>. Every test brings you closer to your goal.
            </>
          ) : (
            'Set your target band scores and start practicing with Cambridge IELTS practice tests.'
          )}
        </p>
      </div>

      <Link
        href="/skills"
        className="whitespace-nowrap inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-extrabold px-6 py-3.5 rounded-2xl shadow-md hover:shadow-xl transition-all text-sm shrink-0"
      >
        <BookOpen className="w-4 h-4" /> Practice Skills Hub <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}