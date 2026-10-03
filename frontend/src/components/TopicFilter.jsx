import React from 'react';
import { Filter } from 'lucide-react';

const TOPICS = ['All', 'Technology', 'Education', 'Career', 'Lifestyle', 'Ideas', 'Other'];

export default function TopicFilter({ selectedTopic, onSelectTopic }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider pr-2 border-r border-slate-200 shrink-0">
        <Filter className="w-3.5 h-3.5" />
        <span>Filter:</span>
      </div>

      <div className="flex items-center gap-2">
        {TOPICS.map((topic) => {
          const isSelected = selectedTopic === topic;
          return (
            <button
              key={topic}
              onClick={() => onSelectTopic(topic)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600 ring-offset-1'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {topic}
            </button>
          );
        })}
      </div>
    </div>
  );
}
