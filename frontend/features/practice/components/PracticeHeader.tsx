'use client';

import Link from 'next/link';
import { X, Clock, StickyNote, Type } from 'lucide-react';
import { formatDuration } from '@/lib/utils/format';

interface PracticeHeaderProps {
  title: string;
  elapsedSeconds: number;
  fontSize: 'sm' | 'base' | 'lg';
  onCycleFontSize: () => void;
  showNotes: boolean;
  onToggleNotes: () => void;
}

export default function PracticeHeader({
  title,
  elapsedSeconds,
  fontSize,
  onCycleFontSize,
  showNotes,
  onToggleNotes,
}: PracticeHeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/skills/reading"
          title="Exit back to Reading Hub"
          className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </Link>
        <span className="hidden md:inline-block text-xs font-bold text-gray-500 truncate max-w-xs">
          {title}
        </span>
      </div>

      <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-1.5 rounded-full font-mono text-sm font-bold shadow-sm">
        <Clock className="w-4 h-4" />
        <span>{formatDuration(elapsedSeconds)}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleNotes}
          title="Toggle Scratchpad Notes"
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
            showNotes
              ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <StickyNote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onCycleFontSize}
          title={`Reading text size: ${fontSize.toUpperCase()}`}
          className="h-9 px-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer"
        >
          <Type className="w-4 h-4" />
          <span className="uppercase">{fontSize}</span>
        </button>
      </div>
    </header>
  );
}