import React from 'react';
import { Feather } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-center text-slate-500 text-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            <Feather className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-800">BlogNest</span>
          <span>— A simple space to write, read and share.</span>
        </div>
        <div className="text-xs text-slate-400">
          Built for student learning & full-stack development.
        </div>
      </div>
    </footer>
  );
}
