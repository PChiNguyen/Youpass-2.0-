// frontend/app/dashboard/components/TargetScores.tsx
'use client';

import React, { useState } from 'react';
import { Award, Target, Edit3, X, Loader2, Check } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface TargetScoresProps {
  targetOverall: number | null;
  targetReading: number | null;
  targetListening: number | null;
  targetWriting: number | null;
  targetSpeaking: number | null;
  onScoresUpdated: (newScores: {
    target_overall: number;
    target_reading: number;
    target_listening: number;
    target_writing: number;
    target_speaking: number;
  }) => void;
}

// Possible IELTS band increments (from 4.0 to 9.0 in steps of 0.5)
const BAND_OPTIONS = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

export default function TargetScores({
  targetOverall,
  targetReading,
  targetListening,
  targetWriting,
  targetSpeaking,
  onScoresUpdated,
}: TargetScoresProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  // Form states initialized with existing values or reasonable defaults (6.5)
  const [reading, setReading] = useState<number>(targetReading ?? 6.5);
  const [listening, setListening] = useState<number>(targetListening ?? 6.5);
  const [writing, setWriting] = useState<number>(targetWriting ?? 6.5);
  const [speaking, setSpeaking] = useState<number>(targetSpeaking ?? 6.5);

  const token = useAuthStore((state) => state.token);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // Official IELTS overall band rounding:
  // (average * 2) rounded to nearest integer, then divided by 2
  const computedOverall = Math.round(((reading + listening + writing + speaking) / 4) * 2) / 2;

  const handleOpenModal = () => {
    setReading(targetReading ?? 6.5);
    setListening(targetListening ?? 6.5);
    setWriting(targetWriting ?? 6.5);
    setSpeaking(targetSpeaking ?? 6.5);
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveScores = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setError('');

    try {
      const payload = {
        target_reading: reading,
        target_listening: listening,
        target_writing: writing,
        target_speaking: speaking,
        target_overall: computedOverall,
      };

      const response = await fetch(`${apiUrl}/api/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'Failed to update target scores.');
      }

      // Propagate updated scores to the parent state so dashboard updates instantly
      onScoresUpdated(payload);

      setIsModalOpen(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error updating target scores.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const skillScores = [
    { label: 'Reading', score: targetReading },
    { label: 'Listening', score: targetListening },
    { label: 'Writing', score: targetWriting },
    { label: 'Speaking', score: targetSpeaking },
  ];

  return (
    <>
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> Target scores updated successfully!
        </div>
      )}

      {/* Main Widget Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6 transition-all hover:border-blue-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" /> Target Band Scores
          </h3>

          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Goals
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {/* Overall Score Highlight */}
          <div
            onClick={handleOpenModal}
            className="col-span-2 sm:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/80 rounded-2xl p-4 flex flex-col justify-center text-center cursor-pointer hover:shadow-sm transition-all"
          >
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Overall</span>
            <span className="text-3xl sm:text-4xl font-black text-blue-700">
              {targetOverall !== null && targetOverall !== undefined ? targetOverall.toFixed(1) : '--'}
            </span>
          </div>

          {/* 4 Skill Cards */}
          {skillScores.map((skill) => (
            <div
              key={skill.label}
              onClick={handleOpenModal}
              className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 flex flex-col justify-center text-center hover:border-blue-200 transition-all cursor-pointer"
            >
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                {skill.label}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {skill.score !== null && skill.score !== undefined ? skill.score.toFixed(1) : '--'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= INTERACTIVE EDIT MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Set Target Band Scores</h3>
                  <p className="text-xs text-gray-500">Configure your individual skill targets and overall goal</p>
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

            {/* Dynamic Overall Preview Box */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white flex items-center justify-between shadow-md">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Calculated IELTS Target
                </span>
                <h4 className="text-base font-extrabold">Overall Target Band</h4>
              </div>
              <div className="text-4xl font-black bg-white/20 px-4 py-1 rounded-xl backdrop-blur-md">
                {computedOverall.toFixed(1)}
              </div>
            </div>

            {/* Form Inputs for 4 Skills */}
            <form onSubmit={handleSaveScores} className="space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                
                {/* Reading */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                    Reading
                  </label>
                  <select
                    value={reading}
                    onChange={(e) => setReading(parseFloat(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {BAND_OPTIONS.map((val) => (
                      <option key={val} value={val}>Band {val.toFixed(1)}</option>
                    ))}
                  </select>
                </div>

                {/* Listening */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                    Listening
                  </label>
                  <select
                    value={listening}
                    onChange={(e) => setListening(parseFloat(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {BAND_OPTIONS.map((val) => (
                      <option key={val} value={val}>Band {val.toFixed(1)}</option>
                    ))}
                  </select>
                </div>

                {/* Writing */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                    Writing
                  </label>
                  <select
                    value={writing}
                    onChange={(e) => setWriting(parseFloat(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {BAND_OPTIONS.map((val) => (
                      <option key={val} value={val}>Band {val.toFixed(1)}</option>
                    ))}
                  </select>
                </div>

                {/* Speaking */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                    Speaking
                  </label>
                  <select
                    value={speaking}
                    onChange={(e) => setSpeaking(parseFloat(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {BAND_OPTIONS.map((val) => (
                      <option key={val} value={val}>Band {val.toFixed(1)}</option>
                    ))}
                  </select>
                </div>

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
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Goals'
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