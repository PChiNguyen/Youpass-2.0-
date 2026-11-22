'use client';

import { CheckCircle2 } from 'lucide-react';
import { TestQuestion } from '@/types/test';

interface PracticeFooterProps {
  questions: TestQuestion[];
  answers: Record<string, string>;
  onJumpToQuestion: (questionId: string) => void;
  onFinishClick: () => void;
}

export default function PracticeFooter({
  questions,
  answers,
  onJumpToQuestion,
  onFinishClick,
}: PracticeFooterProps) {
  const answeredCount = questions.filter(
    (q) => (answers[q.id] ?? '').trim().length > 0
  ).length;

  return (
    <footer className="h-16 bg-white border-t border-gray-200 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-20">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500 bg-white overflow-x-auto max-w-full">
        {questions.map((q) => {
          const isAnswered = (answers[q.id] ?? '').trim().length > 0;

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onJumpToQuestion(q.id)}
              title={`Jump to Question ${q.number}`}
              className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                isAnswered
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {q.number}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="hidden sm:inline-block text-xs font-bold text-gray-500">
          {answeredCount} / {questions.length} answered
        </span>

        <button
          type="button"
          onClick={onFinishClick}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-extrabold transition-all cursor-pointer ${
            answeredCount > 0
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Finish
        </button>
      </div>
    </footer>
  );
}