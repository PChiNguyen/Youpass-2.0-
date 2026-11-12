'use client';

import { useState } from 'react';
import { PenTool, Search, ArrowRight, History } from 'lucide-react';
import Link from 'next/link';

export default function WritingTask2Page() {
  const [statusTab, setStatusTab] = useState<'uncompleted' | 'completed'>('uncompleted');
  const [essayFilter, setEssayFilter] = useState<'all' | 'Opinion' | 'Discussion' | 'Problem & Solution'>('all');

  const task2Cards = [
    {
      id: 1,
      category: 'Opinion',
      badgeColor: 'bg-purple-600 text-white',
      demoBand: 'AI Graded - Band 7.5',
      submissions: '6,120 attempts',
      title: 'Should universities focus on practical skills or theoretical knowledge?',
      description: 'Some people think that universities should provide graduates with the knowledge and skills needed in the workplace...',
      imageBg: 'from-purple-600 to-indigo-700',
    },
    {
      id: 2,
      category: 'Discussion',
      badgeColor: 'bg-red-600 text-white',
      demoBand: 'AI Graded - Band 7.0',
      submissions: '8,450 attempts',
      title: 'The rise of remote work and its impact on cities',
      description: 'Discuss both views and give your opinion on whether working from home benefits or harms urban economies...',
      imageBg: 'from-rose-600 to-red-700',
    },
  ];

  const filteredCards = essayFilter === 'all' 
    ? task2Cards 
    : task2Cards.filter(c => c.category === essayFilter);

  return (
    <div className="space-y-6">
      
      {/* Header & Essay Type Filters */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-50 text-red-600 p-3 rounded-2xl">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">Writing Task 2 - Essay Prompts</h2>
            <p className="text-xs text-gray-500">Master argumentative, discussion, and problem-solution essays</p>
          </div>
        </div>

        {/* Essay Filter Pills */}
        <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/65 overflow-x-auto w-full md:w-auto">
          {['all', 'Opinion', 'Discussion', 'Problem & Solution'].map((type) => (
            <button
              key={type}
              onClick={() => setEssayFilter(type as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                essayFilter === type
                  ? 'bg-white text-red-600 shadow-sm border border-red-100'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {type === 'all' ? 'All Essays' : type}
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
              statusTab === 'uncompleted' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Uncompleted
          </button>
          <button
            onClick={() => setStatusTab('completed')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusTab === 'completed' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Task 2 essay titles..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-red-600 font-bold text-sm px-2 cursor-pointer hover:underline">
        <History className="w-4 h-4" /> View submission history
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCards.map((card) => (
          <div key={card.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            
            <div className={`h-36 bg-gradient-to-r ${card.imageBg} p-5 flex flex-col justify-between relative overflow-hidden`}>
              <div className="flex items-center justify-between">
                <span className="bg-black/45 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {card.submissions}
                </span>
                <span className="bg-white/90 text-red-700 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                  {card.demoBand}
                </span>
              </div>

              <div className="self-end">
                <span className={`text-xs font-black px-3 py-1 rounded-xl shadow-md ${card.badgeColor}`}>
                  {card.category}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="font-black text-gray-900 text-base tracking-tight group-hover:text-red-600 transition-colors cursor-pointer">
                  {card.title}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">Writing Task 2 Essay Studio</span>
                <button className="flex items-center gap-1 text-xs font-extrabold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all">
                  Start Writing <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}