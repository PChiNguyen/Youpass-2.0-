'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Award, Calendar, Sparkles, Edit3, ArrowUpRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const token = useAuthStore((state) => state.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Banner Announcement */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-blue-600/10 border border-orange-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 text-white p-3.5 rounded-2xl shadow-md">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                Conquer all IELTS test formats with YouPass!
              </h2>
              <p className="text-sm text-gray-600">
                Set your baseline, target score, timeline, and get a customized Practice Plan for free!
              </p>
            </div>
          </div>
          <button
            onClick={() => alert('Practice Plan generator coming soon!')}
            className="whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2"
          >
            Create Practice Plan <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Top Grid: Score Cards & Exam Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Target Scores Section */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" /> Your Target Scores
              </h3>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl transition-colors">
                <Edit3 className="w-3.5 h-3.5" /> Edit Goals
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {/* Overall Score */}
              <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 flex flex-col justify-center text-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Overall</span>
                <span className="text-4xl font-black text-blue-700">8.5</span>
              </div>

              {/* Skill Scores */}
              {[
                { label: 'Reading', score: '8.0' },
                { label: 'Listening', score: '9.0' },
                { label: 'Writing', score: '8.5' },
                { label: 'Speaking', score: '8.5' },
              ].map((skill, idx) => (
                <div key={idx} className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4 flex flex-col justify-center text-center hover:border-blue-200 transition-all">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{skill.label}</span>
                  <span className="text-3xl font-extrabold text-gray-900">{skill.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Schedule Section */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Exam Schedule
              </h3>
              <button className="text-xs font-semibold text-gray-400 hover:text-gray-600">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Test Date</span>
                <p className="text-xl font-black text-gray-900">20/05/2027</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Days Remaining</span>
                <p className="text-xl font-black text-blue-600">194 days</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Grid: Study Heatmap & Weekly Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Study Heatmap Section */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">Your Study Consistency Chart</h3>
                <p className="text-xs text-gray-400 mt-0.5">Click on a day/week to view detailed test statistics</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Submitted
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {/* Week 4 */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 w-16">Week 4</span>
                <div className="flex gap-2 sm:gap-3">
                  {[19, 20, 21, 22, 23, 24, 25].map((day, idx) => {
                    const isActive = day === 21;
                    return (
                      <div
                        key={idx}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-green-600 text-white shadow-md shadow-green-200 scale-105'
                            : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Week 5 */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 w-16">Week 5</span>
                <div className="flex gap-2 sm:gap-3">
                  {[26, 27, 28, 29, 30, 31, 1].map((day, idx) => {
                    const isActive = day === 26 || day === 28 || day === 31;
                    return (
                      <div
                        key={idx}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-green-600 text-white shadow-md shadow-green-200 scale-105'
                            : 'bg-gray-50 text-gray-400 border border-gray-100'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Test Statistics Table */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-gray-900">Weekly Test Submissions</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold text-xs uppercase tracking-wider">
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-center">Reading</th>
                    <th className="pb-3 text-center">Listening</th>
                    <th className="pb-3 text-center">Writing</th>
                    <th className="pb-3 text-right">Study Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                  <tr>
                    <td className="py-3.5 text-gray-900 font-bold">02/11/2026</td>
                    <td className="py-3.5 text-center font-bold text-blue-600">1</td>
                    <td className="py-3.5 text-center text-gray-300">-</td>
                    <td className="py-3.5 text-center text-gray-300">-</td>
                    <td className="py-3.5 text-right font-semibold">1h39m</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 text-gray-900 font-bold">01/11/2026</td>
                    <td className="py-3.5 text-center text-gray-300">-</td>
                    <td className="py-3.5 text-center font-bold text-blue-600">1</td>
                    <td className="py-3.5 text-center text-gray-300">-</td>
                    <td className="py-3.5 text-right font-semibold">45m</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 text-gray-900 font-bold">31/10/2026</td>
                    <td className="py-3.5 text-center text-gray-300">-</td>
                    <td className="py-3.5 text-center text-gray-300">-</td>
                    <td className="py-3.5 text-center font-bold text-blue-600">1</td>
                    <td className="py-3.5 text-right font-semibold">1h15m</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Quick Jump to 4 Skills Practice */}
        <div className="bg-blue-600 text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-black tracking-tight">Ready to practice your skills?</h3>
            <p className="text-blue-100 text-sm max-w-xl">
              Explore our comprehensive 4 Skills Practice Hub with curated Cambridge IELTS tests for Reading, Listening, Writing, and Speaking.
            </p>
          </div>
          <Link
            href="/skills"
            className="whitespace-nowrap bg-white text-blue-600 hover:bg-blue-50 font-extrabold px-8 py-3.5 rounded-2xl shadow-lg transition-all text-sm flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Open 4 Skills Hub
          </Link>
        </div>

      </div>
    </div>
  );
}