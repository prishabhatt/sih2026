import React, { useState } from 'react';
import { Search, ShieldCheck, ChevronDown, GitFork, Check } from 'lucide-react';

export function StandardsTable({ 
  standards, 
  selectedStandardIds, 
  onToggleStandard, 
  onExploreNormative,
  t 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('ALL');
  const [qcoOnlyFilter, setQcoOnlyFilter] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (id) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredStandards = standards.filter((std) => {
    if (divisionFilter !== 'ALL' && std.division !== divisionFilter) return false;
    if (qcoOnlyFilter && !std.qcoMandatory) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchCode = std.code.toLowerCase().includes(q);
      const matchTitle = std.title.toLowerCase().includes(q);
      const matchScope = std.scope.toLowerCase().includes(q);
      const matchCategory = std.category.toLowerCase().includes(q);
      return matchCode || matchTitle || matchScope || matchCategory;
    }
    return true;
  });

  return (
    <div className="glass-card rounded-3xl border border-white/70 dark:border-white/10 shadow-xl overflow-hidden h-full flex flex-col">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3.5 items-center justify-between p-5 border-b border-slate-200/80 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t?.dashboard?.searchPlaceholder || "Search standards by keyword, code, scope..."}
            className="w-full pl-10 pr-4 py-2.5 glass-pill-container rounded-2xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-inner"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="px-3.5 py-2.5 glass-pill-container rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
          >
            <option value="ALL" className="dark:bg-[#0B0F19]">All Divisions</option>
            <option value="ETD" className="dark:bg-[#0B0F19]">Electrotechnical (ETD)</option>
            <option value="CED" className="dark:bg-[#0B0F19]">Civil (CED)</option>
            <option value="MTD" className="dark:bg-[#0B0F19]">Mechanical/Met (MTD)</option>
            <option value="LITD" className="dark:bg-[#0B0F19]">Electronics/IT (LITD)</option>
            <option value="CHD" className="dark:bg-[#0B0F19]">Chemical (CHD)</option>
          </select>

          <button
            type="button"
            onClick={() => setQcoOnlyFilter(!qcoOnlyFilter)}
            className={`px-4 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
              qcoOnlyFilter
                ? 'bg-emerald-600 text-white shadow-md'
                : 'glass-btn-secondary text-slate-700 dark:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>QCO Only</span>
          </button>
        </div>
      </div>

      {/* Expandable Data Table */}
      <div className="relative flex-1 overflow-x-auto rounded-b-3xl">
        <table className="min-w-full divide-y divide-slate-200/80 dark:divide-white/10 border-collapse">
          <thead className="bg-slate-50/70 dark:bg-white/[0.02]">
            <tr>
              <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Standard Code</th>
              <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product Scope</th>
              <th className="px-6 py-3.5 text-left text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Compliance Status</th>
              <th className="px-6 py-3.5 text-right text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-white/[0.05]">
            {filteredStandards.map((std) => {
              const isSelected = selectedStandardIds.includes(std.id);
              const isExpanded = expandedRows.has(std.id);

              return (
                <React.Fragment key={std.id}>
                  {/* Collapsed State Row */}
                  <tr className="hover:bg-white/60 dark:hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4 text-xs font-bold font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap align-middle">
                      {std.code}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-normal line-clamp-2 leading-relaxed min-w-[250px] align-middle" title={std.title}>
                      {std.title}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-wrap gap-2">
                        {std.qcoMandatory && (
                          <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            Mandatory QCO
                          </span>
                        )}
                        <span className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          ISI Mark
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onToggleStandard(std.id)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
                            isSelected
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                              : 'glass-btn-primary shimmer-sweep text-white'
                          }`}
                        >
                          {isSelected ? '✓ Added' : '+ Add'}
                        </button>
                        <button
                          onClick={() => toggleRow(std.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white glass-pill-container rounded-full transition-all cursor-pointer"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Sub-Row */}
                  {isExpanded && (
                    <tr className="bg-slate-100/60 dark:bg-black/30 shadow-inner">
                      <td colSpan={4}>
                        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Side: Details */}
                          <div className="flex flex-col gap-2.5">
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                              {std.scope}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-auto">
                              Enforcing: <strong className="text-slate-800 dark:text-slate-200">{std.ministryEnforcing}</strong>
                            </p>
                          </div>
                          
                          {/* Right Side: Amendments & Actions */}
                          <div className="flex flex-col items-start md:items-end gap-3.5 justify-between">
                            <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                              {std.latestAmendment}
                            </div>
                            <button
                              onClick={() => onExploreNormative(std)}
                              className="glass-btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-full text-slate-800 dark:text-slate-200 text-xs font-bold transition shadow-xs cursor-pointer"
                            >
                              <GitFork className="w-3.5 h-3.5 text-blue-500" />
                              <span>Explore Normative Tree</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        
        {filteredStandards.length === 0 && (
          <div className="p-10 text-center text-slate-400 text-xs font-medium">
            No standards found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default StandardsTable;
