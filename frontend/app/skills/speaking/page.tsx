'use client';

import { useState } from 'react';
import { Search, Clock, ArrowRight, Mic } from 'lucide-react';

export default function SpeakingSkillsPage() {
  const [subFilter, setSubFilter] = useState('Bài lẻ');
  const [statusTab, setStatusTab] = useState<'uncompleted' | 'completed'>('uncompleted');

  const speakingTasks = [
    {
      id: 1,
      category: 'Part 1',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      title: 'Topic: Hometown & Daily Routines',
      date: '02/11/2026',
      description: 'Practice answering common Part 1 examiner questions with real-time audio recording and AI feedback...',
    },
    {
      id: 2,
      category: 'Part 2 & 3',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      title: 'Describe a memorable journey you took',
      date: '01/11/2026',
      description: 'You have 1 minute to prepare and 2 minutes to speak on cue card prompts, followed by deep discussion questions...',
    },
    {
      id: 3,
      category: 'Shadowing',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      title: 'Shadowing Practice - Band 8.5 Speech Delivery',
      date: '29/10/2026',
      description: 'Improve pronunciation, intonation, and fluency by shadowing native speaker models sentence by sentence...',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">IELTS Speaking Practice Hub</h2>
            <p className="text-xs text-gray-500">Master Part 1, Part 2, Part 3, and shadowing techniques</p>
          </div>
        </div>

        {/* Sub-filter Pills */}
        <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/65">
          {['Bài lẻ', 'Full đề', 'Shadowing'].map((item) => (
            <button
              key={item}
              onClick={() => setSubFilter(item)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                subFilter === item
                  ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Status Bar */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/60 w-full sm:w-auto">
          <button
            onClick={() => setStatusTab('uncompleted')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusTab === 'uncompleted'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Bài chưa làm
          </button>
          <button
            onClick={() => setStatusTab('completed')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusTab === 'completed'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Bài đã làm
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên bài tập..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {speakingTasks.map((task, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${task.badgeColor}`}>
                  {task.category}
                </span>
                <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {task.date}
                </span>
              </div>

              <h4 className="font-black text-gray-900 text-base tracking-tight hover:text-emerald-600 cursor-pointer">
                {task.title}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Cambridge IELTS Speaking</span>
              <button className="flex items-center gap-1 text-xs font-extrabold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all">
                Practice Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}