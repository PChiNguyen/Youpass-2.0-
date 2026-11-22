'use client';

import { useState, useEffect } from 'react';
import { ApiError } from '@/lib/api/client';
import { useAuthStore } from '@/store/useAuthStore';
import { SubmissionItem } from '@/types/submission';
import { TestItem } from '@/types/test';
import { getTestById, submitTestAnswers } from '../api';

export function useReadingPractice(testId: string | undefined) {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const [test, setTest] = useState<TestItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [showNotes, setShowNotes] = useState(false);
  const [notesText, setNotesText] = useState('');

  // Submission states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionItem | null>(null);
  const [isGuestResult, setIsGuestResult] = useState(false);

  // 1. Fetch test JSON from FastAPI by ID
  useEffect(() => {
    if (!testId) return;
    let isCancelled = false;

    async function loadTest() {
      try {
        const data = await getTestById(testId!);
        if (!isCancelled) {
          setTest(data);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setError(
            err instanceof Error ? err.message : 'Unable to connect to server.'
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadTest();
    return () => {
      isCancelled = true;
    };
  }, [testId]);

  // 2. Live elapsed timer (stops once submitted)
  useEffect(() => {
    if (loading || error || !test || submissionResult) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, error, test, submissionResult]);

  // 3. Keyboard shortcut: press 'N' outside inputs to toggle Notes
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (!isTyping && e.key.toLowerCase() === 'n') {
        setShowNotes((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const jumpToQuestion = (questionId: string) => {
    const el = document.getElementById(`question-${questionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const cycleFontSize = () => {
    setFontSize((prev) =>
      prev === 'sm' ? 'base' : prev === 'base' ? 'lg' : 'sm'
    );
  };

  const toggleNotes = () => {
    setShowNotes((prev) => !prev);
  };

  const openConfirmModal = () => {
    setSubmitError(null);
    setIsConfirmModalOpen(true);
  };

  // Submit to FastAPI backend (requires logged-in JWT token)
  const handleConfirmSubmit = async () => {
    if (!test || !token) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitTestAnswers(
        {
          test_id: test.id,
          user_answers: answers,
        },
        token
      );
      setIsGuestResult(false);
      setSubmissionResult(result);
      setIsConfirmModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        setSubmitError(
          'Your session has expired. Please sign in again to save your submission.'
        );
      } else {
        setSubmitError(
          err instanceof Error ? err.message : 'Failed to submit answers.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Local grading fallback if user is not signed in
  const handleGuestCheck = () => {
    if (!test) return;
    const questions = test.content?.questions ?? [];
    let correctCount = 0;

    for (const q of questions) {
      const correctAns = (q.correct_answer ?? '').trim().toLowerCase();
      const userAns = (answers[q.id] ?? '').trim().toLowerCase();
      if (userAns && userAns === correctAns) {
        correctCount += 1;
      }
    }

    setIsGuestResult(true);
    setSubmissionResult({
      id: 'guest-preview',
      test_id: test.id,
      user_id: 'guest',
      raw_score: correctCount,
      achieved_band: null,
      submitted_at: new Date().toISOString(),
      user_answers: answers,
    });
    setIsConfirmModalOpen(false);
  };

  const handleRetake = () => {
    setAnswers({});
    setElapsedSeconds(0);
    setSubmissionResult(null);
    setIsGuestResult(false);
    setSubmitError(null);
    setIsConfirmModalOpen(false);
  };

  return {
    isAuthenticated: Boolean(token),
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
  };
}