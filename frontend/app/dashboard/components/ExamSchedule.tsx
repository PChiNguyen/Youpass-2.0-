// frontend/app/dashboard/components/ExamSchedule.tsx
'use client';

import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, Edit3, X, Loader2, Check } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface ExamScheduleProps {
  examDate: string | null;
  onDateUpdated: (newDate: string) => void;
}

export default function ExamSchedule({ examDate, onDateUpdated }: ExamScheduleProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(examDate ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  const token = useAuthStore((state) => state.token);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // Format YYYY-MM-DD into "May 20, 2027"
  const formatExamDate = (dateStr: string): string => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const parsedDate = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(parsedDate);
    } catch {
      return dateStr;
    }
  };

  // Calculate day difference without timezone drift
  const calculateDaysRemaining = (dateStr: string): number => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const target = new Date(year, month - 1, day).getTime();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const diffInMilliseconds = target - today;
    return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = examDate ? calculateDaysRemaining(examDate) : null;
  const todayFormatted = new Date().toISOString().split('T')[0];

  const handleOpenModal = () => {
    setSelectedDate(examDate ?? '');
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedDate) return;

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ exam_date: selectedDate }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'Failed to update exam date.');
      }

      onDateUpdated(selectedDate);
      setIsModalOpen(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error updating exam date.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> Exam date updated successfully!
        </div>
      )}

      {/* Main Widget Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between space-y-6 hover:border-blue-200 transition-all">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Exam Schedule
          </h3>
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Date
          </button>
        </div>

        {examDate ? (
          <div
            onClick={handleOpenModal}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 cursor-pointer"
          >
            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4 space-y-1 hover:border-blue-200 transition-all">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Test Date</span>
              <p className="text-lg sm:text-xl font-black text-gray-900">
                {formatExamDate(examDate)}
              </p>
            </div>

            <div className="bg-blue-50/60 border border-blue-100/70 rounded-2xl p-4 space-y-1 hover:border-blue-300 transition-all">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Days Remaining</span>
              <p className="text-lg sm:text-xl font-black text-blue-700">
                {daysRemaining !== null && daysRemaining > 0 ? (
                  `${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`
                ) : daysRemaining === 0 ? (
                  'Exam is Today!'
                ) : (
                  'Exam Date Passed'
                )}
              </p>
            </div>
          </div>
        ) : (
          <div
            onClick={handleOpenModal}
            className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex items-center justify-between text-amber-800 cursor-pointer hover:bg-amber-100/80 transition-all"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">No exam date scheduled yet</p>
                <p className="text-amber-700">Click here to schedule your official IELTS date.</p>
              </div>
            </div>
            <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
          </div>
        )}
      </div>

      {/* ================= INTERACTIVE DATE PICKER MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Set Official Exam Date</h3>
                  <p className="text-xs text-gray-500">Track your daily study countdown</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSaveDate} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Select Exam Date
                </label>
                <input
                  type="date"
                  required
                  min={todayFormatted}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !selectedDate}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Date'
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}