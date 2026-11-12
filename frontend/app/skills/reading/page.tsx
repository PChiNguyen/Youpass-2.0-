'use client';

import { useState } from 'react';
import { Search, History, ArrowRight, BookOpen } from 'lucide-react';

export default function ReadingHubPage() {
  const [statusTab, setStatusTab] = useState<'uncompleted' | 'completed'>('uncompleted');
  const [selectedPassage, setSelectedPassage] = useState<'all' | '1' | '2' | '3'>('all');

  // Sample reading passages matching your screenshot
  const readingTasks = [
    {
      id: 1,
      passage: 'Passage 1',
      badgeColor: 'bg-orange-500 text-white',
      submissions: '4225 lượt làm bài',
      title: '[Simulation Q4] Instant Noodles',
      tags: ['• Gap Filling', '• True · False · Not Given'],
      imageBg: 'from-amber-600 to-orange-700',
    },
    {
      id: 2,
      passage: 'Passage 2',
      badgeColor: 'bg-blue-600 text-white',
      submissions: '1146 lượt làm bài',
      title: '[Simulation Q4] Helping ourselves: the story of the...',
      tags: ['• Gap Filling', '• Matching Information', '• Multiple Choice (Many Answers)'],
      imageBg: 'from-blue-600 to-indigo-700',
    },
    {
      id: 3,
      passage: 'Passage 3',
      badgeColor: 'bg-purple-600 text-white',
      submissions: '658 lượt làm bài',
      title: '[Simulation Q4] In Search of the Visual Learner',
      tags: ['• Gap Filling', '• Multiple Choice (One Answer)', '• Yes · No · Not Given'],
      imageBg: 'from-purple-600 to-pink-700',
    },
    {
      id: 4,
      passage: 'Passage 1',
      badgeColor: 'bg-orange-500 text-white',
      submissions: '6631 lượt làm bài',
      title: '[Simulation Q4] The rise of the ballpoint pen',
      tags: ['• Gap Filling', '• True · False · Not Given'],
      imageBg: 'from-emerald-600 to-teal-700',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Search & Status Tab Bar */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/60 w-full sm:w-auto">
          <button
            onClick={() => setStatusTab('uncompleted')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusTab === 'uncompleted'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Bài chưa làm
          </button>
          <button
            onClick={() => setStatusTab('completed')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusTab === 'completed'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Bài đã làm
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên bài tập..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

      </div>

      {/* Submission History Link Bar */}
      <div className="flex items-center gap-2 text-blue-600 font-bold text-sm px-2 cursor-pointer hover:underline">
        <History className="w-4 h-4" /> Xem lịch sử làm bài
      </div>

      {/* Exercise Cards Grid (Mixed Passages) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {readingTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            {/* Top Image / Banner Header with Submission Count */}
            <div className={`h-36 bg-gradient-to-r ${task.imageBg} p-5 flex flex-col justify-between relative overflow-hidden`}>
              {/* Submission Pill */}
              <div className="self-start bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {task.submissions}
              </div>

              {/* Passage Badge */}
              <div className="self-end">
                <span className={`text-xs font-black px-3 py-1 rounded-xl shadow-md ${task.badgeColor}`}>
                  {task.passage}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="font-black text-gray-900 text-base tracking-tight group-hover:text-blue-600 transition-colors cursor-pointer">
                  {task.title}
                </h4>

                {/* Question Types Bullets */}
                <div className="space-y-1">
                  {task.tags.map((tag, idx) => (
                    <p key={idx} className="text-xs font-semibold text-gray-500">
                      {tag}
                    </p>
                  ))}
                </div>
              </div>

              {/* Practice Action Footer */}
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">Cambridge Reading Simulation</span>
                <button className="flex items-center gap-1 text-xs font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all">
                  Practice Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}