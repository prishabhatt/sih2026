import React, { useState } from 'react';
import { ChevronDown, GitFork } from 'lucide-react';

export function StandardCard({ std, isSelected, onToggle, onExploreNormative }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col">
      {/* Top Row (Always Visible) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Info on Left */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-black text-slate-900 dark:text-white shrink-0">
              {std.code}
            </span>
            {std.qcoMandatory && (
              <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
                Mandatory QCO
              </span>
            )}
            <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
              ISI Mark
            </span>
          </div>
          <h4 className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate max-w-full" title={std.title}>
            {std.title}
          </h4>
        </div>
        
        {/* Actions on Right */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onToggle(std.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              isSelected
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200'
            }`}
          >
            {isSelected ? '✓ Added' : '+ Add'}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 dark:bg-zinc-800 rounded-md transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded State */}
      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="border-t border-slate-100 dark:border-zinc-800 my-3"></div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
            {std.scope}
          </p>
          <div className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-2 rounded-md border border-amber-100 dark:border-amber-500/20 inline-block">
            {std.latestAmendment}
          </div>
          <div className="flex items-end justify-between mt-2">
            <p className="text-[11px] text-slate-400 font-mono">
              Enforcing: {std.ministryEnforcing}
            </p>
            <button
              onClick={() => onExploreNormative(std)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-zinc-700 transition"
            >
              <GitFork className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Explore Normative Tree</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
