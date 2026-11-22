'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Users } from 'lucide-react';
import { TestItem } from '@/types/test';

interface TestCardProps {
  test: TestItem;
  achievedBand?: number | null;
}

function getCategoryBadgeStyle(category: string | null): string {
  switch (category) {
    case 'Passage 1':
    case 'Section 1':
      return 'bg-orange-500 text-white';
    case 'Passage 2':
    case 'Section 2':
      return 'bg-blue-600 text-white';
    case 'Passage 3':
    case 'Section 3':
      return 'bg-purple-600 text-white';
    default:
      return 'bg-emerald-600 text-white';
  }
}

export default function TestCard({ test, achievedBand }: TestCardProps) {
  const meta = test.content?.meta;
  const attemptsCount = meta?.attempts_count ?? 0;
  const coverGradient = meta?.cover_gradient ?? 'from-blue-600 to-indigo-700';
  const questionTypes = meta?.question_types ?? [];
  const questionCount = test.content?.questions?.length ?? 0;
  const categoryLabel = test.category || 'Practice Test';

  const practiceHref = `/practice/${test.skill_type}/${test.id}`;

  return (
    <Link
      href={practiceHref}
      className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-200 transition-all flex flex-col justify-between group"
    >
      <div
        className={`h-40 bg-gradient-to-r ${coverGradient} p-4 flex flex-col justify-between relative overflow-hidden`}
      >
        <div className="self-start bg-black/55 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
          <Users className="w-3.5 h-3.5 text-gray-200" />
          <span>{attemptsCount.toLocaleString('en-US')} attempts</span>
        </div>

        <div className="self-start">
          <span
            className={`inline-block text-xs font-black px-3.5 py-1.5 rounded-xl shadow-md ${getCategoryBadgeStyle(
              test.category
            )}`}
          >
            {categoryLabel}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <h4 className="font-black text-gray-900 text-base tracking-tight group-hover:text-blue-600 transition-colors">
            {test.title}
          </h4>

          {questionTypes.length > 0 ? (
            <ul className="space-y-1">
              {questionTypes.map((tag, idx) => (
                <li
                  key={idx}
                  className="text-xs font-semibold text-gray-500 flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                  {tag}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs font-semibold text-gray-400">
              {questionCount} {questionCount === 1 ? 'question' : 'questions'}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
          {achievedBand !== undefined && achievedBand !== null ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" /> Band {achievedBand.toFixed(1)}
            </span>
          ) : (
            <span className="text-xs font-bold text-gray-400">
              {meta?.duration_minutes
                ? `${meta.duration_minutes} mins`
                : 'Cambridge Simulation'}
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 group-hover:text-blue-700 bg-blue-50 group-hover:bg-blue-100 px-4 py-2 rounded-xl transition-all">
            Practice Now{' '}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}