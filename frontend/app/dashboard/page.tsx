// frontend/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

import { useAuthStore } from '../store/useAuthStore';
import DashboardBanner from './components/DashboardBanner';
import TargetScores from './components/TargetScores';
import ExamSchedule from './components/ExamSchedule';
import StudyStatsTable, { SubmissionItem } from './components/StudyStatsTable';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  target_overall: number | null;
  target_reading: number | null;
  target_listening: number | null;
  target_writing: number | null;
  target_speaking: number | null;
  exam_date: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Live Backend Data States
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // Load both endpoints concurrently using JWT Bearer authentication
  const loadDashboardData = useCallback(async (authToken: string) => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      };

      const [profileRes, submissionsRes] = await Promise.all([
        fetch(`${apiUrl}/api/auth/me`, { headers }),
        fetch(`${apiUrl}/api/submissions/me?skip=0&limit=50`, { headers }),
      ]);

      if (profileRes.status === 401 || submissionsRes.status === 401) {
        logout();
        router.push('/login');
        return;
      }

      if (!profileRes.ok) {
        throw new Error('Failed to retrieve user profile.');
      }
      if (!submissionsRes.ok) {
        throw new Error('Failed to retrieve test submissions.');
      }

      const profileData: UserProfile = await profileRes.json();
      const submissionsData: SubmissionItem[] = await submissionsRes.json();

      setProfile(profileData);
      setSubmissions(submissionsData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred loading dashboard data.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, logout, router]);

  useEffect(() => {
    setMounted(true);

    if (!token) {
      router.push('/login');
    } else {
      loadDashboardData(token);
    }
  }, [token, router, loadDashboardData]);

  // Synchronize target scores updated from TargetScores modal
  const handleScoresUpdated = (newScores: {
    target_overall: number;
    target_reading: number;
    target_listening: number;
    target_writing: number;
    target_speaking: number;
  }) => {
    setProfile((prev) => (prev ? { ...prev, ...newScores } : null));
  };

  // Synchronize exam date updated from ExamSchedule modal
  const handleDateUpdated = (newDate: string) => {
    setProfile((prev) => (prev ? { ...prev, exam_date: newDate } : null));
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading your IELTS progress dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white border border-red-100 rounded-3xl shadow-sm text-center space-y-4">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-900">Dashboard Unavailable</h3>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
        <button
          onClick={() => token && loadDashboardData(token)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Motivational Banner */}
        <DashboardBanner
          fullName={profile?.full_name ?? null}
          targetOverall={profile?.target_overall ?? null}
        />

        {/* 2. Interactive Modals & Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-7">
            <TargetScores
              targetOverall={profile?.target_overall ?? null}
              targetReading={profile?.target_reading ?? null}
              targetListening={profile?.target_listening ?? null}
              targetWriting={profile?.target_writing ?? null}
              targetSpeaking={profile?.target_speaking ?? null}
              onScoresUpdated={handleScoresUpdated}
            />
          </div>

          <div className="lg:col-span-5">
            <ExamSchedule
              examDate={profile?.exam_date ?? null}
              onDateUpdated={handleDateUpdated}
            />
          </div>
        </div>

        {/* 3. Live Graded Test Submissions Table */}
        <StudyStatsTable submissions={submissions} />

      </div>
    </div>
  );
}