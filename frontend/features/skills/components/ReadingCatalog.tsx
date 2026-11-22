'use client';

import { Search, BookOpen, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useSkillCatalog } from '../hooks/useSkillCatalog';
import TestCard from './TestCard';

interface ReadingCatalogProps {
  title: string;
  subtitle: string;
  fixedCategory?: string;
}

export default function ReadingCatalog({
  title,
  subtitle,
  fixedCategory,
}: ReadingCatalogProps) {
  const {
    filteredTests,
    completedBands,
    loading,
    error,
    statusTab,
    setStatusTab,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    reload,
  } = useSkillCatalog({ skillType: 'reading', fixedCategory });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>

        {!fixedCategory && (
          <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/65 overflow-x-auto w-full sm:w-auto">
            {['all', 'Passage 1', 'Passage 2', 'Passage 3'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {cat === 'all' ? 'All Passages' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/60 w-full sm:w-auto">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'uncompleted', label: 'Uncompleted' },
              { key: 'completed', label: 'Completed' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusTab(tab.key)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tests by title..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-14 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold text-gray-500">
            Fetching reading tests from server...
          </p>
        </div>
      ) : error ? (
        <div className="bg-white border border-red-100 rounded-3xl p-10 text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">
              Could not load tests
            </h3>
            <p className="text-xs text-gray-500">{error}</p>
          </div>
          <button
            type="button"
            onClick={reload}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center space-y-2">
          <h3 className="text-sm font-bold text-gray-900">
            No reading tests found
          </h3>
          <p className="text-xs text-gray-500">
            Try clearing your search filter or make sure you ran{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">
              python seed_tests.py
            </code>{' '}
            in the backend.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              achievedBand={
                test.id in completedBands ? completedBands[test.id] : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}