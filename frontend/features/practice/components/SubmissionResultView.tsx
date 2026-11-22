'use client';

import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import { formatDuration } from '@/lib/utils/format';
import { SubmissionItem } from '@/types/submission';
import { TestItem } from '@/types/test';

interface SubmissionResultViewProps {
  test: TestItem;
  submission: SubmissionItem;
  elapsedSeconds: number;
  isGuestResult: boolean;
  onRetake: () => void;
}

export default function SubmissionResultView({
  test,
  submission,
  elapsedSeconds,
  isGuestResult,
  onRetake,
}: SubmissionResultViewProps) {
  const questions = test.content?.questions ?? [];
  const totalQuestions = questions.length;
  const rawScore = submission.raw_score ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/skills/reading"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Reading Hub
          </Link>

          <button
            type="button"
            onClick={onRetake}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Retake Test
          </button>
        </div>

        {/* Summary Score Banner */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div className="space-y-1">
              <span
                className={`inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                  isGuestResult
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isGuestResult
                  ? 'Guest Preview (Not Saved)'
                  : 'Saved to Account'}
              </span>
              <h1 className="text-2xl font-black text-gray-900">
                {test.title}
              </h1>
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-200/70">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Time: {formatDuration(elapsedSeconds)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Raw Score
              </span>
              <p className="text-3xl font-black text-emerald-800">
                {rawScore} / {totalQuestions}
              </p>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5" /> Estimated Band
              </span>
              <p className="text-3xl font-black text-blue-800">
                {submission.achieved_band !== null
                  ? submission.achieved_band.toFixed(1)
                  : '--'}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-5 text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Accuracy
              </span>
              <p className="text-3xl font-black text-gray-900">
                {totalQuestions > 0
                  ? `${Math.round((rawScore / totalQuestions) * 100)}%`
                  : '0%'}
              </p>
            </div>
          </div>

          {!isGuestResult && totalQuestions < 40 && (
            <p className="text-xs text-gray-400">
              Note: Band conversion uses the full 40-question IELTS scale on the backend, so short single-passage drills default to the base band.
            </p>
          )}
        </div>

        {/* Question-by-Question Answer Review */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-4">
            Answer Key &amp; Review
          </h2>

          <div className="divide-y divide-gray-100">
            {questions.map((q) => {
              const userAns = (submission.user_answers[q.id] ?? '').trim();
              const correctAns = (q.correct_answer ?? '').trim();
              const isCorrect =
                userAns.length > 0 &&
                userAns.toLowerCase() === correctAns.toLowerCase();

              return (
                <div
                  key={q.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span
                      className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                        isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {q.number}
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-800">
                        {q.prompt}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="text-gray-500">
                          Your answer:{' '}
                          <strong
                            className={
                              isCorrect ? 'text-emerald-700' : 'text-red-600'
                            }
                          >
                            {userAns || '(No answer)'}
                          </strong>
                        </span>
                        {!isCorrect && correctAns && (
                          <span className="text-gray-500">
                            Correct answer:{' '}
                            <strong className="text-emerald-700">
                              {correctAns}
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pl-10 sm:pl-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}