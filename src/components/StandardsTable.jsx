import React, { useState } from 'react';
import { Search, ShieldCheck, ChevronDown, GitFork } from 'lucide-react';

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
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t?.dashboard?.searchPlaceholder || "Search standards..."}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 outline-none transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
          >
            <option value="ALL">All Divisions</option>
            <option value="ETD">Electrotechnical (ETD)</option>
            <option value="CED">Civil (CED)</option>
            <option value="MTD">Mechanical/Met (MTD)</option>
            <option value="LITD">Electronics/IT (LITD)</option>
            <option value="CHD">Chemical (CHD)</option>
          </select>

          <button
            type="button"
            onClick={() => setQcoOnlyFilter(!qcoOnlyFilter)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition flex items-center gap-1.5 ${qcoOnlyFilter
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-50 dark:bg-zinc-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>QCO Only</span>
          </button>
        </div>
      </div>

      {/* Expandable Data Table */}
      <div className="relative flex-1 overflow-x-auto rounded-b-xl">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-zinc-800 border-collapse">
          <thead className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-200 dark:border-zinc-800">
            <tr>
              <th className="border-r border-slate-200 dark:border-zinc-800 last:border-r-0 bg-slate-100/80 dark:bg-zinc-900 px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Standard Code</th>
              <th className="border-r border-slate-200 dark:border-zinc-800 last:border-r-0 bg-slate-100/80 dark:bg-zinc-900 px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Product Scope</th>
              <th className="border-r border-slate-200 dark:border-zinc-800 last:border-r-0 bg-slate-100/80 dark:bg-zinc-900 px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Compliance</th>
              <th className="border-r border-slate-200 dark:border-zinc-800 last:border-r-0 bg-slate-100/80 dark:bg-zinc-900 px-6 py-4 text-right text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 bg-white dark:bg-zinc-900">
            {filteredStandards.map((std) => {
              const isSelected = selectedStandardIds.includes(std.id);
              const isExpanded = expandedRows.has(std.id);

              return (
                <React.Fragment key={std.id}>
                  {/* Collapsed State Row */}
                  <tr className="border-b border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap border-r border-slate-100 dark:border-zinc-800/50 last:border-r-0 align-middle">
                      {std.code}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-normal line-clamp-2 leading-relaxed min-w-[250px] border-r border-slate-100 dark:border-zinc-800/50 last:border-r-0 align-middle" title={std.title}>
                      {std.title}
                    </td>
                    <td className="px-6 py-4 border-r border-slate-100 dark:border-zinc-800/50 last:border-r-0 align-middle">
                      <div className="flex flex-wrap gap-2">
                        {std.qcoMandatory && (
                          <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            Mandatory QCO
                          </span>
                        )}
                        <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold">
                          ISI Mark
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right border-r border-slate-100 dark:border-zinc-800/50 last:border-r-0 align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onToggleStandard(std.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isSelected
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200'
                            }`}
                        >
                          {isSelected ? '✓ Added' : '+ Add'}
                        </button>
                        <button
                          onClick={() => toggleRow(std.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 dark:bg-zinc-800/80 rounded-md transition-colors"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Sub-Row */}
                  {isExpanded && (
                    <tr className="bg-slate-50 dark:bg-zinc-950/50 shadow-inner">
                      <td colSpan={4}>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Left Side: Details */}
                          <div className="flex flex-col gap-3">
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {std.scope}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono mt-auto">
                              Enforcing: {std.ministryEnforcing}
                            </p>
                          </div>

                          {/* Right Side: Amendments & Actions */}
                          <div className="flex flex-col items-start md:items-end gap-4 justify-between">
                            <div className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-2.5 rounded-md border border-amber-100 dark:border-amber-500/20">
                              {std.latestAmendment}
                            </div>
                            <button
                              onClick={() => onExploreNormative(std)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-zinc-700 transition shadow-sm"
                            >
                              <GitFork className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
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
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            No standards found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
