'use client';

import { useState } from 'react';
import { Headphones, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ListeningSection1Page() {
  const [statusTab, setStatusTab] = useState<'uncompleted' | 'completed'>('uncompleted');

  const tasks = [
    {
      id: 1,
      title: 'Booking a Hotel Room & Facilities',
      submissions: '5,120 attempts',
      tags: ['• Form Completion', '• Note Completion'],
      imageBg: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">Listening - Section 1</h2>
            <p className="text-xs text-gray-500">Conversation between two speakers in an everyday social context</p>
          </div>
        </div>
        <Link href="/skills/listening" className="text-xs font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-xl hover:bg-amber-100 transition-colors">
          ← Back to Listening Hub
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/60 w-full sm:w-auto">
          <button onClick={() => setStatusTab('uncompleted')} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusTab === 'uncompleted' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
            Uncompleted
          </button>
          <button onClick={() => setStatusTab('completed')} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusTab === 'completed' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
            Completed
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search Section 1 exercises..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:border-amber-500 transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className={`h-36 bg-gradient-to-r ${task.imageBg} p-5 flex flex-col justify-between relative overflow-hidden`}>
              <div className="self-start bg-black/45 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {task.submissions}
              </div>
              <div className="self-end">
                <span className="text-xs font-black px-3 py-1 rounded-xl bg-amber-500 text-white shadow-md">Section 1</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="font-black text-gray-900 text-base tracking-tight group-hover:text-amber-600 transition-colors cursor-pointer">{task.title}</h4>
                <div className="space-y-1">
                  {task.tags.map((tag, idx) => (
                    <p key={idx} className="text-xs font-semibold text-gray-500">{tag}</p>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">Section 1 Audio</span>
                <button className="flex items-center gap-1 text-xs font-extrabold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl transition-all">
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