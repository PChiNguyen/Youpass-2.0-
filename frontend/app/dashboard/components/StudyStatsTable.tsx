// frontend/app/dashboard/components/StudyStatsTable.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { History, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface SubmissionItem {
  id: string;
  test_id: string;
  user_id: string;
  raw_score: number | null;
  achieved_band: number | null;
  submitted_at: string;
  user_answers: Record<string, unknown>;
}

interface StudyStatsTableProps {
  submissions: SubmissionItem[];
}

export default function StudyStatsTable({ submissions }: StudyStatsTableProps) {
  // Format ISO timestamp into international readable date & time
  const formatSubmissionDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" /> Recent Test Submissions
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time test grading records from the YouPass assessment engine
          </p>
        </div>
        <span className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200/60 px-3 py-1 rounded-xl">
          {submissions.length} Total {submissions.length === 1 ? 'Test' : 'Tests'}
        </span>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto font-black text-lg">
            YP
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-gray-900">No test submissions yet</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              You haven&apos;t taken any tests yet. Head over to the skills hub to practice Reading or Listening.
            </p>
          </div>
          <Link
            href="/skills"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
          >
            Start Practice Test <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold text-xs uppercase tracking-wider">
                <th className="pb-3 px-3">Date & Time</th>
                <th className="pb-3 px-3 text-center">Questions Answered</th>
                <th className="pb-3 px-3 text-center">Raw Score</th>
                <th className="pb-3 px-3 text-center">Achieved Band</th>
                <th className="pb-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
              {submissions.map((item) => {
                const answerCount = item.user_answers
                  ? Object.keys(item.user_answers).length
                  : 0;

                return (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-3 text-gray-900 font-semibold text-xs sm:text-sm">
                      {formatSubmissionDate(item.submitted_at)}
                    </td>

                    <td className="py-4 px-3 text-center text-xs sm:text-sm text-gray-600">
                      {answerCount} {answerCount === 1 ? 'item' : 'items'}
                    </td>

                    <td className="py-4 px-3 text-center text-xs sm:text-sm font-bold text-gray-900">
                      {item.raw_score !== null ? item.raw_score : '--'}
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 font-black text-xs rounded-lg border border-blue-200">
                        {item.achieved_band !== null
                          ? `Band ${item.achieved_band.toFixed(1)}`
                          : 'Pending'}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Graded
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}