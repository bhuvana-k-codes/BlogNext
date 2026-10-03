import React from 'react';
import { BookOpen, X } from 'lucide-react';

export default function ReadingModeHeader({ onExit }) {
  return (
    <div className="sticky top-0 z-50 bg-slate-900 text-white shadow-md transition-all">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>Reading Mode Active</span>
          <span className="hidden sm:inline text-xs text-slate-400 border-l border-slate-700 pl-2">
            Distraction-free reading view
          </span>
        </div>

        <button
          onClick={onExit}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Reading Mode</span>
        </button>
      </div>
    </div>
  );
}
