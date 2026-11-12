'use client';

import { useState } from 'react';
import { Search, Clock, ArrowRight, PenTool } from 'lucide-react';

export default function WritingSkillsPage() {
  const [subFilter, setSubFilter] = useState('Task 1');
  const [statusTab, setStatusTab] = useState<'uncompleted' | 'completed'>('uncompleted');

  // Sample writing tasks matching your platform design
  const writingTasks = [
    {
      id: 1,
      category: 'Process',
      badgeColor: 'bg-green-100 text-green-800 border-green-200',
      title: 'Rain-shadow Desert Formation',
      date: '24/02/2024',
      description: 'The diagram below shows how one type of desert, known as a rain-shadow desert, is formed. Summarise the information by selecting and reporting...',
    },
    {
      id: 2,
      category: 'Line Graph',
      badgeColor: 'bg-red-100 text-red-800 border-red-200',
      title: 'Going to the cinema',
      date: '24/02/2024',
      description: 'The graph shows the percentage of people visiting the cinema once a month or more between 1984 to 2003 (4 age groups). Summarise the information...',
    },
    {
      id: 3,
      category: 'Map',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      title: 'Coal mine redevelopment into a leisure...',
      date: '23/02/2024',
      description: 'The maps below show a coal mine site before and after redevelopment. Summarise the information by selecting and reporting the main features...',
    },
    {
      id: 4,
      category: 'Pie Chart',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
      title: 'US Music Album Sales by Genre 2006-2010',
      date: '22/02/2024',
      description: 'The pie charts below show the percentage of US music album sales by genre in 2008, 2009, and 2010. Summarize the information and reporting...',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-50 text-red-600 p-3 rounded-2xl">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">IELTS Writing Practice Hub</h2>
            <p className="text-xs text-gray-500">Master Task 1 and Task 2 with real curated exam prompts</p>
          </div>
        </div>

        {/* Sub-filter Pills (Task 1 / Task 2 / Bài lẻ) */}
        <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/65">
          {['Bài lẻ', 'Task 1', 'Task 2'].map((item) => (
            <button
              key={item}
              onClick={() => setSubFilter(item)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                subFilter === item
                  ? 'bg-white text-red-600 shadow-sm border border-red-100'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Status Tab Bar */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/60 w-full sm:w-auto">
          <button
            onClick={() => setStatusTab('uncompleted')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusTab === 'uncompleted'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Bài chưa làm
          </button>
          <button
            onClick={() => setStatusTab('completed')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusTab === 'completed'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Bài đã làm
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên bài tập..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {writingTasks.map((task, idx) => (
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

              <h4 className="font-black text-gray-900 text-base tracking-tight hover:text-red-600 cursor-pointer">
                {task.title}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Cambridge IELTS Writing</span>
              <button className="flex items-center gap-1 text-xs font-extrabold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all">
                Practice Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}