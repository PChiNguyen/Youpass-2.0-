'use client';

import Link from 'next/link';
import {
  Loader2,
  AlertCircle,
  Highlighter,
  StickyNote,
  BookA,
  GripVertical,
  X,
  LogIn,
  CheckCircle2,
} from 'lucide-react';
import { QuestionGroup, TestQuestion } from '@/types/test';
import { useReadingPractice } from '../hooks/useReadingPractice';
import PracticeHeader from './PracticeHeader';
import QuestionItem from './QuestionItem';
import PracticeFooter from './PracticeFooter';
import SubmissionResultView from './SubmissionResultView';

interface ReadingPracticeViewProps {
  testId: string;
}

function getPassageTextSizeClass(fontSize: string): string {
  if (fontSize === 'sm') return 'text-sm leading-relaxed';
  if (fontSize === 'lg') return 'text-lg leading-loose';
  return 'text-[15px] leading-relaxed';
}

export default function ReadingPracticeView({ testId }: ReadingPracticeViewProps) {
  const {
    isAuthenticated,
    test,
    loading,
    error,
    answers,
    elapsedSeconds,
    fontSize,
    showNotes,
    notesText,
    setNotesText,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    submitting,
    submitError,
    submissionResult,
    isGuestResult,
    handleAnswerChange,
    jumpToQuestion,
    cycleFontSize,
    toggleNotes,
    openConfirmModal,
    handleConfirmSubmit,
    handleGuestCheck,
    handleRetake,
  } = useReadingPractice(testId);

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-9 h-9 text-emerald-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-500">
          Loading IELTS Reading test...
        </p>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-red-100 rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-black text-gray-900">
            Unable to Open Test
          </h2>
          <p className="text-xs text-gray-500">
            {error ?? 'Test data is unavailable.'}
          </p>
          <Link
            href="/skills/reading"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors"
          >
            Back to Reading Hub
          </Link>
        </div>
      </div>
    );
  }

  if (submissionResult) {
    return (
      <SubmissionResultView
        test={test}
        submission={submissionResult}
        elapsedSeconds={elapsedSeconds}
        isGuestResult={isGuestResult}
        onRetake={handleRetake}
      />
    );
  }

  const passage = test.content?.passage;
  const questions: TestQuestion[] = test.content?.questions ?? [];
  const rawGroups: QuestionGroup[] = test.content?.question_groups ?? [];

  const answeredCount = questions.filter(
    (q) => (answers[q.id] ?? '').trim().length > 0
  ).length;

  const questionMap = new Map<string, TestQuestion>();
  for (const q of questions) {
    questionMap.set(q.id, q);
  }

  const groups: QuestionGroup[] =
    rawGroups.length > 0
      ? rawGroups
      : [
          {
            id: 'default-group',
            title: `Questions 1 - ${questions.length}`,
            type: 'mixed',
            instructions: 'Answer the questions below based on the reading passage.',
            question_ids: questions.map((q) => q.id),
          },
        ];

  const passageTextSizeClass = getPassageTextSizeClass(fontSize);

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <PracticeHeader
        title={test.title}
        elapsedSeconds={elapsedSeconds}
        fontSize={fontSize}
        onCycleFontSize={cycleFontSize}
        showNotes={showNotes}
        onToggleNotes={toggleNotes}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <aside className="hidden sm:flex w-20 bg-white border-r border-gray-200 flex-col items-center py-5 px-2 gap-4 shrink-0">
          <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
            Tools
          </span>

          <button
            type="button"
            disabled
            title="Text highlighting is coming soon"
            className="w-full py-2.5 px-1 rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center gap-1 text-center opacity-55 cursor-not-allowed"
          >
            <Highlighter className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-500 leading-tight">
              Highlight
              <br />
              Soon
            </span>
          </button>

          <button
            type="button"
            onClick={toggleNotes}
            className={`w-full py-2.5 px-1 rounded-xl border flex flex-col items-center gap-1 text-center transition-colors cursor-pointer ${
              showNotes
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-emerald-500/70 bg-white hover:bg-emerald-50'
            }`}
          >
            <StickyNote className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold text-gray-700 leading-tight">
              Notes
              <br />
              Key (N)
            </span>
          </button>

          <button
            type="button"
            disabled
            title="Vocabulary lookup is coming soon"
            className="w-full py-2.5 px-1 rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center gap-1 text-center opacity-55 cursor-not-allowed"
          >
            <BookA className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-500 leading-tight">
              Dictionary
              <br />
              Soon
            </span>
          </button>
        </aside>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden relative">
          <section className="bg-white h-full overflow-y-auto px-6 sm:px-10 py-8 border-b lg:border-b-0 lg:border-r border-gray-200">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2 pb-2">
                {test.category && (
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    {test.category}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {passage?.title ?? test.title}
                </h1>
              </div>

              <div className={`space-y-4 text-gray-800 ${passageTextSizeClass}`}>
                {passage?.paragraphs && passage.paragraphs.length > 0 ? (
                  passage.paragraphs.map((para, idx) => <p key={idx}>{para}</p>)
                ) : (
                  <p className="text-gray-400 italic">
                    No reading passage text was provided for this test.
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="hidden lg:flex pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-5 h-10 rounded-full bg-white border border-gray-300 shadow-sm items-center justify-center text-gray-400">
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          <section className="bg-white h-full overflow-y-auto px-6 sm:px-10 py-8">
            <div className="max-w-2xl mx-auto space-y-10">
              {groups.map((group) => (
                <div key={group.id} className="space-y-4">
                  <div className="space-y-2 pb-2 border-b border-gray-200">
                    <h2 className="text-xl font-black text-gray-900">
                      {group.title}
                    </h2>
                    <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                      {group.instructions}
                    </p>
                  </div>

                  <div>
                    {group.question_ids.map((qId) => {
                      const q = questionMap.get(qId);
                      if (!q) return null;

                      return (
                        <QuestionItem
                          key={q.id}
                          question={q}
                          value={answers[q.id] ?? ''}
                          onChange={handleAnswerChange}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {showNotes && (
          <div className="absolute left-4 sm:left-24 bottom-4 z-30 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-emerald-600 text-white px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Scratchpad Notes
              </span>
              <button
                type="button"
                onClick={toggleNotes}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Jot down keywords, paragraph summaries, or clues..."
              rows={6}
              className="w-full p-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none"
            />
          </div>
        )}
      </div>

      <PracticeFooter
        questions={questions}
        answers={answers}
        onJumpToQuestion={jumpToQuestion}
        onFinishClick={openConfirmModal}
      />

      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900">
                Submit Your Answers?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                You have answered{' '}
                <strong>
                  {answeredCount} of {questions.length}
                </strong>{' '}
                questions.
              </p>
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                {submitError}
              </div>
            )}

            {!isAuthenticated && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs space-y-1">
                <p className="font-bold">You are not signed in</p>
                <p className="text-amber-800">
                  Sign in to save your score to the database, or check your answers locally as a guest.
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Keep Practicing
              </button>

              {isAuthenticated ? (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmSubmit}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Grading...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Submit &amp; Grade
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleGuestCheck}
                    className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold cursor-pointer"
                  >
                    Check Locally
                  </button>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
