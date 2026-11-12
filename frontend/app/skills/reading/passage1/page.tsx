'use client';

import { useState } from 'react';
import { BookOpen, Search, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Passage1Page() {
  const [statusTab, setStatusTab] = useState<'uncompleted' | 'completed'>('uncompleted');

  const passage1Tasks = [
    {
      id: 1,
      title: '[Simulation Q4] Instant Noodles',
      submissions: '4,225 attempts',
      tags: ['• Gap Filling', '• True · False · Not Given'],
      imageBg: 'from-amber-600 to-orange-700',
    },
    {
      id: 2,
      title: '[Simulation Q4] The rise of the ballpoint pen',
      submissions: '6,631 attempts',
      tags: ['• Gap Filling', '• True · False · Not Given'],
      imageBg: 'from-emerald-600 to-teal-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 text-orange-600 p-3 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">Reading - Passage 1</h2>
            <p className="text-xs text-gray-500">Shorter factual texts focusing on descriptive & informative details</p>
          </div>
        </div>
        <Link href="/skills/reading" className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
          ← Back to All Passages
        </Link>
      </div>

      {/* Search & Status Bar */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/60 w-full sm:w-auto">
          <button
            onClick={() => setStatusTab('uncompleted')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusTab === 'uncompleted' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Uncompleted
          </button>
          <button
            onClick={() => setStatusTab('completed')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusTab === 'completed' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Passage 1 exercises..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {passage1Tasks.map((task) => (
          <div key={task.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className={`h-36 bg-gradient-to-r ${task.imageBg} p-5 flex flex-col justify-between relative overflow-hidden`}>
              <div className="self-start bg-black/45 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {task.submissions}
              </div>
              <div className="self-end">
                <span className="text-xs font-black px-3 py-1 rounded-xl bg-orange-500 text-white shadow-md">
                  Passage 1
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="font-black text-gray-900 text-base tracking-tight group-hover:text-blue-600 transition-colors cursor-pointer">
                  {task.title}
                </h4>
                <div className="space-y-1">
                  {task.tags.map((tag, idx) => (
                    <p key={idx} className="text-xs font-semibold text-gray-500">{tag}</p>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">Passage 1 Simulation</span>
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