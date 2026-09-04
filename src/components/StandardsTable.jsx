import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, ChevronDown, GitFork, Filter, Copy, Check, FileText, Plus, CheckCircle2, Clock, Layers, Package } from 'lucide-react';
import { STANDARD_SECTOR_PROFILES, isRecommendedStandard } from '../context/ProcurementContext';

const DIVISION_OPTIONS = [
  { id: 'ALL', label: 'All Divisions', count: '22.4k' },
  { id: 'ETD', label: 'Electrotechnical (ETD)', count: '4.8k' },
  { id: 'CED', label: 'Civil Engineering (CED)', count: '5.2k' },
  { id: 'MTD', label: 'Mechanical / Met (MTD)', count: '3.9k' },
  { id: 'LITD', label: 'Electronics & IT (LITD)', count: '4.1k' },
  { id: 'CHD', label: 'Chemical (CHD)', count: '4.4k' },
];

function getRevisionInfo(std) {
  if (!std) return { revYear: '2020', amendYear: '2022', badgeType: 'rev', badgeLabel: 'REV. 2020' };

  if (std.id === 'IS_14543' || std.code?.includes('14543')) {
    return { revYear: '2016', amendYear: '2022', badgeType: 'amended', badgeLabel: 'AMENDED 2022' };
  }
  if (std.id === 'IS_7098_P2' || std.code?.includes('7098')) {
    return { revYear: '2011', amendYear: '2021', badgeType: 'amended', badgeLabel: 'AMENDED 2021' };
  }
  if (std.id === 'IS_694' || std.code?.includes('694')) {
    return { revYear: '2010', amendYear: '2020', badgeType: 'rev', badgeLabel: 'REV. 2010' };
  }
  if (std.id === 'IS_1786' || std.code?.includes('1786')) {
    return { revYear: '2008', amendYear: '2023', badgeType: 'amended', badgeLabel: 'AMENDED 2023' };
  }
  if (std.id === 'IS_269' || std.code?.includes('269')) {
    return { revYear: '2015', amendYear: '2021', supersedes: 'Supersedes 2 standards', badgeType: 'consolidated', badgeLabel: 'CONSOLIDATED' };
  }
  if (std.id === 'IS_1239_P1' || std.code?.includes('1239')) {
    return { revYear: '2004', amendYear: '2018', badgeType: 'rev', badgeLabel: 'REV. 2004' };
  }
  if (std.id === 'IS_4984' || std.code?.includes('4984')) {
    return { revYear: '1995', amendYear: '2016', badgeType: 'amended', badgeLabel: 'AMENDED 2016' };
  }
  if (std.id === 'IS_10322' || std.code?.includes('10322')) {
    return { revYear: '2012', amendYear: '2016', badgeType: 'amended', badgeLabel: 'AMENDED 2016' };
  }
  if (std.id === 'IS_456' || std.code?.includes('456')) {
    return { revYear: '2000', amendYear: '2019', badgeType: 'amended', badgeLabel: 'AMENDED 2019' };
  }
  if (std.id === 'IS_2062' || std.code?.includes('2062')) {
    return { revYear: '2011', amendYear: '2020', badgeType: 'amended', badgeLabel: 'AMENDED 2020' };
  }
  if (std.id === 'IS_732' || std.code?.includes('732')) {
    return { revYear: '2019', amendYear: '2022', badgeType: 'rev', badgeLabel: 'REV. 2019' };
  }
  if (std.id === 'IS_10500' || std.code?.includes('10500')) {
    return { revYear: '2012', amendYear: '2021', badgeType: 'amended', badgeLabel: 'AMENDED 2021' };
  }
  if (std.id === 'IS_16102_P1' || std.code?.includes('16102')) {
    return { revYear: '2012', amendYear: '2019', badgeType: 'rev', badgeLabel: 'REV. 2012' };
  }

  // General fallback
  const codeYearMatch = std.code?.match(/:\s*(\d{4})/);
  const revYear = codeYearMatch ? codeYearMatch[1] : (std.reaffirmationDate?.match(/\d{4}/)?.[0] || '2018');
  const amendYearMatch = std.latestAmendment?.match(/\b(20\d{2})\b/);
  const amendYear = amendYearMatch ? amendYearMatch[1] : revYear;

  const hasAmendment = Boolean(std.latestAmendment && !std.latestAmendment.toLowerCase().includes('none'));
  if (hasAmendment) {
    return { revYear, amendYear, badgeType: 'amended', badgeLabel: `AMENDED ${amendYear}` };
  }
  return { revYear, amendYear, badgeType: 'rev', badgeLabel: `REV. ${revYear}` };
}

export function StandardsTable({
  standards = [],
  selectedStandardIds = [],
  onToggleStandard,
  onExploreNormative,
  telemetryFilter = 'ALL',
  onResetTelemetryFilter,
  t
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('ALL');
  const [qcoOnlyFilter, setQcoOnlyFilter] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [activeTabByStandard, setActiveTabByStandard] = useState({});
  const [copiedClauseId, setCopiedClauseId] = useState(null);

  // Sync external telemetry filter
  useEffect(() => {
    if (telemetryFilter === 'QCO') {
      setQcoOnlyFilter(true);
    } else if (telemetryFilter === 'ALL') {
      setQcoOnlyFilter(false);
    }
  }, [telemetryFilter]);

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

  const handleCopyClause = (std) => {
    if (std?.modelNitClause) {
      navigator.clipboard.writeText(std.modelNitClause);
      setCopiedClauseId(std.id);
      setTimeout(() => setCopiedClauseId(null), 2000);
    }
  };

  const handleAddClick = (std) => {
    // Seamless instant inline addition & removal with zero modal popup interruptions
    onToggleStandard && onToggleStandard(std.id);
  };

  const setTabFor = (stdId, tab) => {
    setActiveTabByStandard(prev => ({ ...prev, [stdId]: tab }));
  };

  const filteredStandards = (standards || []).filter((std) => {
    if (divisionFilter !== 'ALL' && std.division !== divisionFilter) return false;
    if (qcoOnlyFilter && !std.qcoMandatory) return false;
    if (telemetryFilter === 'TENDERS' && !selectedStandardIds.includes(std.id)) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchCode = std.code?.toLowerCase().includes(q);
      const matchTitle = std.title?.toLowerCase().includes(q);
      const matchScope = std.scope?.toLowerCase().includes(q);
      const matchCategory = std.category?.toLowerCase().includes(q);
      return matchCode || matchTitle || matchScope || matchCategory;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-[#0E1322]/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          <div className="flex items-center gap-2.5 shrink-0">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight shrink-0">
              Standard Database
            </h2>
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 leading-none">
              {filteredStandards.length} Standards
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto justify-start lg:justify-end">
            <div className="relative flex-1 sm:flex-initial sm:w-72 md:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by IS Code, Title, Keyword, or T..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50/90 dark:bg-black/20 border border-slate-200/80 dark:border-white/10 rounded-full text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div className="relative shrink-0">
              <Filter className="w-3 h-3 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={divisionFilter}
                onChange={(e) => setDivisionFilter(e.target.value)}
                className="pl-8 pr-6 py-1.5 bg-white dark:bg-black/30 border border-slate-200/80 dark:border-white/10 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer shadow-2xs appearance-none"
              >
                <option value="ALL" className="dark:bg-[#090D16]">All Divisions</option>
                <option value="ETD" className="dark:bg-[#090D16]">ETD (Electrotechnical)</option>
                <option value="CED" className="dark:bg-[#090D16]">CED (Civil)</option>
                <option value="MTD" className="dark:bg-[#090D16]">MTD (Mechanical)</option>
                <option value="LITD" className="dark:bg-[#090D16]">LITD (IT/Electronics)</option>
                <option value="CHD" className="dark:bg-[#090D16]">CHD (Chemical)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setQcoOnlyFilter(!qcoOnlyFilter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0 ${
                qcoOnlyFilter
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                  : 'bg-white dark:bg-black/30 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>QCO Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Standards Database Terminal Table */}
      <div className="bg-white/95 dark:bg-[#0E1322]/90 backdrop-blur-2xl rounded-3xl shadow-sm overflow-hidden border border-slate-200/80 dark:border-white/[0.08] flex flex-col flex-1 min-h-[480px]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-white/[0.06]">
            <thead className="bg-slate-50/40 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/[0.06]">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] uppercase text-slate-400 dark:text-slate-500 font-bold tracking-wider">
                  STANDARD CODE
                </th>
                <th className="px-6 py-4 text-left text-[11px] uppercase text-slate-400 dark:text-slate-500 font-bold tracking-wider">
                  PRODUCT SCOPE & TITLE
                </th>
                <th className="px-6 py-4 text-left text-[11px] uppercase text-slate-400 dark:text-slate-500 font-bold tracking-wider">
                  REVISION STATUS
                </th>
                <th className="px-6 py-4 text-left text-[11px] uppercase text-slate-400 dark:text-slate-500 font-bold tracking-wider">
                  COMPLIANCE STATUS
                </th>
                <th className="px-6 py-4 text-right text-[11px] uppercase text-slate-400 dark:text-slate-500 font-bold tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06] bg-transparent">
              {filteredStandards.map((std) => {
                const isSelected = selectedStandardIds.includes(std.id);
                const isExpanded = expandedRows.has(std.id);
                const currentTab = activeTabByStandard[std.id] || 'scope';
                const revInfo = getRevisionInfo(std);

                return (
                  <React.Fragment key={std.id}>
                    <tr className="hover:bg-slate-50/40 dark:hover:bg-white/[0.02] transition-colors group">
                      {/* Column 1: Standard Code & Revision Badge */}
                      <td className="px-6 py-5 whitespace-nowrap align-top">
                        <div className="flex flex-col items-start gap-1.5">
                          <span className="text-[13px] font-bold tracking-tight text-[#1D4ED8] dark:text-[#60A5FA]">
                            {std.code}
                          </span>
                          {revInfo.badgeType === 'amended' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                              <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                              <span>{revInfo.badgeLabel}</span>
                            </span>
                          )}
                          {revInfo.badgeType === 'rev' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                              <Clock className="w-3 h-3 stroke-[2.2]" />
                              <span>{revInfo.badgeLabel}</span>
                            </span>
                          )}
                          {revInfo.badgeType === 'consolidated' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50/70 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                              <Layers className="w-3 h-3 stroke-[2.2]" />
                              <span>{revInfo.badgeLabel}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 2: Product Scope & Title */}
                      <td className="px-6 py-5 align-top max-w-sm sm:max-w-md">
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-snug">
                          {std.title}
                        </p>
                        {isRecommendedStandard(std) && (
                          <div className="mt-1.5 flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 shadow-2xs">
                                ⚡ Beneficial Recommendation
                              </span>
                              {std.alliedWith && (
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                  Allied with {std.alliedWith}
                                </span>
                              )}
                            </div>
                            {STANDARD_SECTOR_PROFILES[std.id]?.strengthensText && (
                              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium leading-tight">
                                Focus: {STANDARD_SECTOR_PROFILES[std.id].strengthensText}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Column 3: Revision Status */}
                      <td className="px-6 py-5 align-top whitespace-nowrap">
                        <div className="flex flex-col gap-0.5 items-start text-xs">
                          <span className="font-semibold text-slate-600 dark:text-slate-300 text-[11px]">
                            Rev. {revInfo.revYear}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            Amended {revInfo.amendYear}
                          </span>
                          {revInfo.supersedes && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-0.5">
                              <Package className="w-3 h-3" />
                              <span>{revInfo.supersedes}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 4: Compliance Status */}
                      <td className="px-6 py-5 align-top whitespace-nowrap">
                        <div className="flex flex-col gap-1.5 items-start">
                          {std.qcoMandatory && (
                            <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                              Mandatory QCO
                            </span>
                          )}
                          <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                            {std.certificationScheme?.includes('CRS') ? 'BIS CRS Registered' : 'ISI Mark'}
                          </span>
                        </div>
                      </td>

                      {/* Column 5: Action Buttons */}
                      <td className="px-6 py-5 text-right align-top whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => handleAddClick(std)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-50/90 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/60'
                                : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Add</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => toggleRow(std.id)}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                            title="Toggle technical details"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-blue-600' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Interactive Multi-Tab Dossier */}
                    {isExpanded && (
                      <tr className="bg-slate-50/80 dark:bg-black/40 border-b border-slate-200/80 dark:border-white/[0.06] animate-in fade-in duration-200">
                        <td colSpan={5} className="p-6">
                          <div className="bg-white dark:bg-[#070B14]/90 p-6 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex flex-col space-y-4">
                            
                            {/* Inner Tab Switcher */}
                            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/[0.06] pb-3">
                              <button
                                onClick={() => setTabFor(std.id, 'scope')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                  currentTab === 'scope'
                                    ? 'bg-[#0B1E36] text-white dark:bg-white dark:text-[#07080A]'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                }`}
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Technical Scope & Gazette Mandate</span>
                              </button>

                              <button
                                onClick={() => setTabFor(std.id, 'clause')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                  currentTab === 'clause'
                                    ? 'bg-[#0B1E36] text-white dark:bg-white dark:text-[#07080A]'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                }`}
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Model NIT Clause</span>
                              </button>
                            </div>

                            {/* Tab 1: Scope & Gazette Details */}
                            {currentTab === 'scope' && (
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
                                <div className="lg:col-span-8 space-y-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-md">
                                      Division: {std.divisionName}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-md">
                                      Min Local Content: {std.makeInIndiaLocalContentMin || '60% Class-I'}
                                    </span>
                                  </div>

                                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                                    {std.scope}
                                  </p>

                                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Statutory Enforcement: <strong className="text-slate-900 dark:text-white font-bold">{std.ministryEnforcing}</strong> (Gazette Order: <strong className="text-slate-900 dark:text-white font-bold">{std.qcoGazetteOrder || 'S.O. 1290(E)'}</strong>)
                                  </p>
                                </div>

                                <div className="lg:col-span-4 flex flex-col justify-between items-start lg:items-end gap-3 border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-white/[0.08] lg:pl-6 pt-3 lg:pt-0">
                                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs w-full">
                                    <span className="font-bold block text-[10px] uppercase text-amber-600 dark:text-amber-400">Gazette Revision:</span>
                                    <span className="mt-0.5 block font-semibold">{std.latestAmendment}</span>
                                  </div>

                                  <button
                                    onClick={() => onExploreNormative && onExploreNormative(std)}
                                    className="px-4 py-2 rounded-xl bg-[#0B1E36] dark:bg-white text-white dark:text-[#07080A] text-xs font-bold hover:bg-[#132845] transition flex items-center gap-1.5 cursor-pointer shadow-sm w-full justify-center"
                                  >
                                    <GitFork className="w-3.5 h-3.5 text-amber-400 dark:text-[#0B1E36]" />
                                    <span>Traverse Normative Tree</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Tab 2: Model NIT Clause Viewer */}
                            {currentTab === 'clause' && (
                              <div className="space-y-3 animate-in fade-in">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                                  {std.modelNitClause || `All goods and equipment supplied under this schedule must strictly comply with ${std.code} (${std.title}), bearing a valid BIS Standard Mark (ISI) with Mandatory Gazette Order compliance.`}
                                </div>

                                <div className="flex justify-end">
                                  <button
                                    onClick={() => handleCopyClause(std)}
                                    className="px-4 py-2 rounded-xl bg-[#1D4ED8] text-white text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                                  >
                                    {copiedClauseId === std.id ? (
                                      <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Copied to Clipboard!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Official NIT Clause</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
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
            <div className="p-16 text-center text-slate-400 text-xs">
              No Indian Standards found matching your search filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StandardsTable;
