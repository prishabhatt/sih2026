import React, { useState } from 'react';
import { ChevronDown, GitFork } from 'lucide-react';

export function StandardCard({ std, isSelected, onToggle, onExploreNormative }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glass-card rounded-3xl p-5 shadow-lg border border-white/70 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-black font-mono text-[#292524] dark:text-[#A8A29E] shrink-0">
              {std.code}
            </span>
            {std.qcoMandatory && (
              <span className="bg-[#059669]/10 text-emerald-700 dark:text-[#059669] border border-[#059669]/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0">
                Mandatory QCO
              </span>
            )}
            <span className="bg-[#292524]/10 text-[#292524] dark:text-[#A8A29E] border border-[#292524]/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0">
              ISI Mark
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate max-w-full" title={std.title}>
            {std.title}
          </h4>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onToggle(std.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
              isSelected
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                : 'glass-btn-primary shimmer-sweep text-white'
            }`}
          >
            {isSelected ? 'Added' : '+ Add'}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white glass-pill-container rounded-full transition-all cursor-pointer"
          >
            <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200 pt-4 mt-4 border-t border-slate-200/80 dark:border-white/10 space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {std.scope}
          </p>
          <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 inline-block">
            {std.latestAmendment}
          </div>
          <div className="flex items-end justify-between pt-2">
            <p className="text-[11px] text-slate-400 font-mono">
              Enforcing: <strong className="text-slate-700 dark:text-slate-300">{std.ministryEnforcing}</strong>
            </p>
            <button
              onClick={() => onExploreNormative(std)}
              className="glass-btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-full text-slate-800 dark:text-slate-200 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <GitFork className="w-3.5 h-3.5 text-[#292524] dark:text-[#A8A29E]" />
              <span>Explore Normative Tree</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StandardCard;
