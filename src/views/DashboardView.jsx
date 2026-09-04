import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  Award, 
  Layers, 
  QrCode, 
  Activity, 
  Check, 
  TrendingUp, 
  BarChart2, 
  LineChart, 
  Download, 
  Trash2, 
  XCircle, 
  Filter, 
  ArrowRight, 
  ExternalLink,
  Plus
} from 'lucide-react';

import { useProcurement } from '../context/ProcurementContext';
import { ComplianceMeter } from '../components/ComplianceMeter';
import { NormativeTreeModal } from '../components/NormativeTreeModal';
import { ModelClauseModal } from '../components/ModelClauseModal';
import { DigitalPassportQR } from '../components/DigitalPassportQR';
import { StandardsTable } from '../components/StandardsTable';
import { AppleStripeBackground } from '../components/AppleStripeBackground';

const TIMEFRAME_DATA = {
  '3M': [
    { month: 'Apr', cyan: 88, purple: 32, passedCount: 88, flaggedCount: 15, adherence: '95.1%', val: 88 },
    { month: 'May', cyan: 60, purple: 20, passedCount: 60, flaggedCount: 10, adherence: '96.8%', val: 60 },
    { month: 'Jun', cyan: 72, purple: 24, passedCount: 72, flaggedCount: 11, adherence: '98.0%', val: 72 },
  ],
  '6M': [
    { month: 'Jan', cyan: 48, purple: 18, passedCount: 48, flaggedCount: 8, adherence: '96.2%', val: 48 },
    { month: 'Feb', cyan: 65, purple: 22, passedCount: 65, flaggedCount: 12, adherence: '94.8%', val: 65 },
    { month: 'Mar', cyan: 42, purple: 14, passedCount: 42, flaggedCount: 6, adherence: '97.5%', val: 42 },
    { month: 'Apr', cyan: 88, purple: 32, passedCount: 88, flaggedCount: 15, adherence: '95.1%', val: 88 },
    { month: 'May', cyan: 60, purple: 20, passedCount: 60, flaggedCount: 10, adherence: '96.8%', val: 60 },
    { month: 'Jun', cyan: 72, purple: 24, passedCount: 72, flaggedCount: 11, adherence: '98.0%', val: 72 },
  ],
  '1Y': [
    { month: 'Q1', cyan: 55, purple: 20, passedCount: 155, flaggedCount: 26, adherence: '96.1%', val: 55 },
    { month: 'Q2', cyan: 75, purple: 28, passedCount: 220, flaggedCount: 34, adherence: '97.4%', val: 75 },
    { month: 'Q3', cyan: 62, purple: 18, passedCount: 180, flaggedCount: 22, adherence: '98.2%', val: 62 },
    { month: 'Q4', cyan: 89, purple: 30, passedCount: 260, flaggedCount: 38, adherence: '98.8%', val: 89 },
  ]
};

export function DashboardView() {
  const navigate = useNavigate();
  const { 
    t, 
    recommendedStandards = [], 
    selectedStandardIds = [], 
    setSelectedStandardIds,
    toggleStandardSelection,
    openNormativeModalFor,
    setIsModelClauseModalOpen,
    selectedNormativeTests = {},
    setSelectedNormativeTests,
    toggleNormativeTest,
    orgProfile = {},
    ragAnalysisState = {}
  } = useProcurement();

  const [showQrCard, setShowQrCard] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [timeframe, setTimeframe] = useState('6M');
  const [chartMode, setChartMode] = useState('bars'); // 'bars' | 'trend'
  const [activeTelemetryFilter, setActiveTelemetryFilter] = useState('ALL'); // 'ALL' | 'QCO' | 'TENDERS'

  // Dynamically extract all associated normative tests for selected standards
  const allAssociatedTests = React.useMemo(() => {
    const list = [];
    selectedStandardIds.forEach((id) => {
      const std = recommendedStandards.find((s) => s.id === id);
      if (std && std.normativeReferences?.rawMaterialTests) {
        std.normativeReferences.rawMaterialTests.forEach((test) => {
          list.push({
            id: std.id,
            stdCode: std.code,
            test: test.code,
            label: test.title || test.testMethod || test.code,
            testMethod: test.testMethod,
            mandatoryClause: test.mandatoryClause,
            isSuggested: test.checkedByDefault === false,
            importance: test.importance || 'Crucial'
          });
        });
      }
    });
    return list;
  }, [selectedStandardIds, recommendedStandards]);


  // Count total active tests
  let totalSelectedTestsCount = 0;
  allAssociatedTests.forEach((item) => {
    const current = selectedNormativeTests[item.id] || [];
    if (current.includes(item.test)) {
      totalSelectedTestsCount++;
    }
  });

  const testPercentage = allAssociatedTests.length > 0
    ? Math.round((totalSelectedTestsCount / allAssociatedTests.length) * 100)
    : 0;

  const handleToggleAllTests = () => {
    const isAllSelected = allAssociatedTests.every(item => {
      const current = selectedNormativeTests[item.id] || [];
      return current.includes(item.test);
    });

    allAssociatedTests.forEach(item => {
      const current = selectedNormativeTests[item.id] || [];
      const hasIt = current.includes(item.test);
      if (isAllSelected && hasIt) {
        toggleNormativeTest && toggleNormativeTest(item.id, item.test);
      } else if (!isAllSelected && !hasIt) {
        toggleNormativeTest && toggleNormativeTest(item.id, item.test);
      }
    });
  };

  const selectedStandardsList = React.useMemo(() => 
    recommendedStandards.filter(s => selectedStandardIds.includes(s.id)),
    [recommendedStandards, selectedStandardIds]
  );

  const handleDownloadDossier = () => {
    const selectedStandardsList = recommendedStandards.filter(s => selectedStandardIds.includes(s.id));
    const dossierData = {
      project: orgProfile?.businessName || 'National Metro Rail Corporation Ltd',
      date: new Date().toISOString(),
      standards: selectedStandardsList,
      testsEnrolled: selectedNormativeTests,
      status: 'VERIFIED_QCO_COMPLIANT'
    };
    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BIS_Tender_Compliance_Dossier_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentChartData = TIMEFRAME_DATA[timeframe] || TIMEFRAME_DATA['6M'];

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#06080F] text-slate-900 dark:text-slate-100 py-8 sm:py-10 px-4 sm:px-8 lg:px-12 transition-colors duration-500 relative font-sans selection:bg-[#1E3A5F] selection:text-white">
      
      {/* Living Subtle Industrial Constellation Background */}
      <AppleStripeBackground />

      <div className="max-w-[1520px] mx-auto space-y-8 relative z-10 pb-16">
        
        {/* ================================================================ */}
        {/* 1. TOP HEADER & TELEMETRY CONTROLS                               */}
        {/* ================================================================ */}
        <div className="space-y-4 pb-2 border-b border-slate-200/80 dark:border-white/[0.08]">
          {/* Top Pill & Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-xs backdrop-blur-xl w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span>AI Output Matrix & Recommendation Engine</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowQrCard(!showQrCard)}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white/90 dark:bg-white/[0.04] hover:bg-white dark:hover:bg-white/[0.08] border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-200 transition-all shadow-xs backdrop-blur-xl flex items-center gap-2 cursor-pointer hover:shadow-md"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{showQrCard ? 'Hide Passport' : 'Digital QR Passport'}</span>
              </button>

              <button
                onClick={() => setIsModelClauseModalOpen(true)}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white/90 dark:bg-white/[0.04] hover:bg-white dark:hover:bg-white/[0.08] border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-200 transition-all shadow-xs backdrop-blur-xl flex items-center gap-2 cursor-pointer hover:shadow-md"
              >
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Generate Model NIT Clause</span>
              </button>

              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate('/reports');
                }}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white/90 dark:bg-white/[0.04] hover:bg-white dark:hover:bg-white/[0.08] border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-200 transition-all shadow-xs backdrop-blur-xl flex items-center gap-2 cursor-pointer hover:shadow-md"
              >
                <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Compliance Audit Report</span>
              </button>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Procurement Standards Matrix & Recommendation Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Procuring Entity: <strong className="text-slate-800 dark:text-slate-200">{orgProfile?.businessName || 'National Metro Rail Corporation Ltd'}</strong> ({orgProfile?.orgType || 'Public Sector Undertaking (PSU)'})
            </p>

            {/* Badges below title */}
            <div className="flex flex-wrap items-center gap-3.5 mt-3.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                <Layers className="w-3.5 h-3.5 text-slate-500" /> {selectedStandardIds.length} Applicable Standards
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% QCO Verified
              </span>
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/30">
                <Award className="w-3.5 h-3.5 text-indigo-500" /> Min 60% Local Content
              </span>

              {/* RAG Live/Offline Badge */}
              {ragAnalysisState.isLive ? (
                <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-300 dark:border-cyan-700/40 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                  Graph-RAG Live — {ragAnalysisState.meta?.standardsFound || 0} Standards Retrieved
                </span>
              ) : ragAnalysisState.backendOnline === false ? (
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30">
                  <Activity className="w-3.5 h-3.5 text-amber-500" /> Reference Dataset (Backend Offline)
                </span>
              ) : ragAnalysisState.isLoading ? (
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/30">
                  <Activity className="w-3.5 h-3.5 text-blue-500 animate-spin" /> Graph-RAG Analyzing…
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Dynamic Digital QR Passport Showcase */}
        {showQrCard && (
          <div className="animate-in fade-in slide-in-from-top-3 duration-300">
            <DigitalPassportQR isDarkTheme={false} />
          </div>
        )}

        {/* ================================================================ */}
        {/* 2. MAIN 2-COLUMN WORKSPACE (Spacious & Structured)               */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ==================== LEFT COLUMN (4 / 12) ==================== */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-6">
            
            {/* 1. Compliance Completeness Index Card */}
            <ComplianceMeter />

            {/* 2. YOUR TENDER DRAFT Card */}
            <div className="bg-white/90 dark:bg-[#0E1322]/90 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-slate-200/80 dark:border-white/[0.08] flex flex-col space-y-4 transition-all hover:shadow-2xl">
              
              {/* Header with Test Completion Ring */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/[0.08]">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                  <span>YOUR TENDER DRAFT</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                    {testPercentage}% Tests Verified
                  </span>
                </div>
              </div>

              {/* Primary Standards Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>ENROLLED STANDARDS ({selectedStandardsList.length})</span>
                  </h4>
                  {selectedStandardsList.length > 0 && (
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Active In Draft
                    </span>
                  )}
                </div>

                {selectedStandardsList.length === 0 ? (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 text-center">
                    <p className="text-xs text-slate-400 italic">No standards selected in tender draft.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedStandardsList.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 hover:border-blue-300 transition-all group/item">
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="font-bold text-slate-900 dark:text-white block text-[11px] tracking-tight">
                            {s.code}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight truncate">
                            {s.title}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => toggleStandardSelection && toggleStandardSelection(s.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors opacity-60 group-hover/item:opacity-100 cursor-pointer"
                          title="Remove from draft"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mandatory Associated Tests */}
              <div className="space-y-2 pt-3 border-t border-slate-200/80 dark:border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>MANDATORY NORMATIVE TESTS ({allAssociatedTests.length})</span>
                  </h4>
                  <button
                    onClick={handleToggleAllTests}
                    className="text-[10px] font-bold text-[#1D4ED8] dark:text-[#60A5FA] hover:underline cursor-pointer"
                  >
                    Toggle All
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {allAssociatedTests.map((item, idx) => {
                    const currentSelected = selectedNormativeTests[item.id] || [];
                    const isChecked = currentSelected.includes(item.test);

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleNormativeTest && toggleNormativeTest(item.id, item.test)}
                        className="flex items-start gap-2 cursor-pointer text-xs p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                      >
                        <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                          isChecked 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : 'border border-slate-300 dark:border-white/20 bg-white dark:bg-black/20 group-hover:border-blue-500'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-slate-900 dark:text-white block text-[11px] tracking-tight truncate">
                              {item.test}
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400 shrink-0">
                              {item.stdCode}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight truncate">
                            {item.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: Preview NIT, Audit Report & Download Dossier */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-white/[0.08] space-y-2">
                <button
                  onClick={() => setIsModelClauseModalOpen(true)}
                  className="w-full py-2.5 rounded-full bg-[#0B1E36] dark:bg-white text-white dark:text-[#07080A] hover:bg-[#152e50] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400 dark:text-[#0B1E36]" />
                  <span>Preview Model NIT Clause</span>
                </button>

                <button
                  onClick={() => {
                    window.scrollTo(0, 0);
                    navigate('/reports');
                  }}
                  className="w-full py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-sm"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Compliance Audit Report →</span>
                </button>

                <button
                  onClick={handleDownloadDossier}
                  className="w-full py-2 rounded-full bg-slate-100/90 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200/80 dark:border-white/10"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Download Tender Schedule (.json)</span>
                </button>
              </div>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN (8.5 / 12) ==================== */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Top Row: Graph Card (Left) + 3 Stat Cards (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              
              {/* Compliance Status Graph Card (Dark Navy with Mode Switcher) */}
              <div className="md:col-span-6 bg-[#0B132B] dark:bg-[#080D1A] text-white rounded-3xl p-6 shadow-xl border border-white/[0.08] flex flex-col justify-between min-h-[200px] relative overflow-hidden transition-all hover:shadow-2xl">
                
                <div className="flex justify-between items-start text-xs relative z-10">
                  <div>
                    <h3 className="font-bold text-white text-xs tracking-tight flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                      Compliance Status
                    </h3>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                      Audited specs passing BIS & QCO statutory checks
                    </p>
                  </div>

                  {/* Mode & Timeframe selector */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white/10 p-0.5 rounded-lg text-[10px]">
                      <button
                        onClick={() => setChartMode('bars')}
                        className={`p-1 rounded-md transition-all cursor-pointer ${
                          chartMode === 'bars' ? 'bg-sky-400 text-slate-950 font-extrabold shadow-xs' : 'text-slate-300 hover:text-white'
                        }`}
                        title="Bar Chart Mode"
                      >
                        <BarChart2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setChartMode('trend')}
                        className={`p-1 rounded-md transition-all cursor-pointer ${
                          chartMode === 'trend' ? 'bg-sky-400 text-slate-950 font-extrabold shadow-xs' : 'text-slate-300 hover:text-white'
                        }`}
                        title="Wave Curve Trend Mode"
                      >
                        <LineChart className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-full text-[10px]">
                      {['3M', '6M', '1Y'].map(tf => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                            timeframe === tf ? 'bg-sky-400 text-slate-950 font-extrabold shadow-xs' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Interactive Tooltip */}
                {hoveredMonth && (
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-950/95 text-white text-[10px] px-3.5 py-1.5 rounded-xl border border-white/20 shadow-xl z-20 whitespace-nowrap animate-in fade-in duration-150">
                    <span className="text-sky-400 font-bold">{hoveredMonth.month}</span>: {hoveredMonth.passedCount} Passed ({hoveredMonth.adherence}) / <span className="text-purple-400 font-bold">{hoveredMonth.flaggedCount} Flagged</span>
                  </div>
                )}

                {/* Chart Area */}
                {chartMode === 'bars' ? (
                  /* Dual Bar View with Diminished, Soft Glow */
                  <div className="flex items-end justify-between gap-3 pt-6 px-2 relative z-10">
                    {currentChartData.map((d) => {
                      const isHovered = hoveredMonth?.month === d.month;
                      return (
                        <div 
                          key={d.month} 
                          className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group"
                          onMouseEnter={() => setHoveredMonth(d)}
                          onMouseLeave={() => setHoveredMonth(null)}
                        >
                          <div className="w-full flex items-end justify-center gap-1.5 h-24 bg-white/[0.03] rounded-xl p-1 transition-colors group-hover:bg-white/[0.06]">
                            <div 
                              style={{ height: `${d.cyan}%` }}
                              className={`w-3 bg-sky-400 rounded-t-sm transition-all duration-300 ${
                                isHovered ? 'brightness-110 shadow-[0_2px_8px_rgba(56,189,248,0.3)]' : ''
                              }`}
                            />
                            <div 
                              style={{ height: `${d.purple}%` }}
                              className={`w-3 bg-purple-400 rounded-t-sm transition-all duration-300 ${
                                isHovered ? 'brightness-110 shadow-[0_2px_8px_rgba(192,132,252,0.3)]' : ''
                              }`}
                            />
                          </div>
                          <span className={`text-[10px] transition-colors ${isHovered ? 'text-sky-400 font-bold' : 'text-slate-400'}`}>
                            {d.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* SVG Sharp Zig-Zag Angular Trend View */
                  <div className="pt-6 relative z-10 h-32 flex flex-col justify-end">
                    <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Background Grid Lines */}
                      <line x1="10" y1="20" x2="290" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                      <line x1="10" y1="50" x2="290" y2="50" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                      <line x1="10" y1="80" x2="290" y2="80" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />

                      {/* Area Fill Polygon Under Zig-Zag Line */}
                      <polygon
                        points={`10,95 ${currentChartData.map((d, i) => {
                          const x = (i / (currentChartData.length - 1)) * 280 + 10;
                          const y = 85 - (d.cyan / 100) * 65;
                          return `${x},${y}`;
                        }).join(' ')} 290,95`}
                        fill="url(#trendGrad)"
                      />

                      {/* Sharp Zig-Zag Polyline */}
                      <polyline
                        points={currentChartData.map((d, i) => {
                          const x = (i / (currentChartData.length - 1)) * 280 + 10;
                          const y = 85 - (d.cyan / 100) * 65;
                          return `${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="2.5"
                        strokeLinejoin="miter"
                        strokeLinecap="square"
                      />

                      {/* Interactive Vertex Dots */}
                      {currentChartData.map((d, i) => {
                        const x = (i / (currentChartData.length - 1)) * 280 + 10;
                        const y = 85 - (d.cyan / 100) * 65;
                        const isHovered = hoveredMonth?.month === d.month;
                        return (
                          <g 
                            key={d.month} 
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredMonth(d)}
                            onMouseLeave={() => setHoveredMonth(null)}
                          >
                            <circle
                              cx={x}
                              cy={y}
                              r={isHovered ? "5.5" : "3.5"}
                              fill="#38BDF8"
                              stroke="#0E1322"
                              strokeWidth="2"
                              className="transition-all duration-200"
                            />
                            {isHovered && (
                              <circle
                                cx={x}
                                cy={y}
                                r="8"
                                fill="none"
                                stroke="#38BDF8"
                                strokeWidth="1.5"
                                strokeDasharray="2 2"
                              />
                            )}
                          </g>
                        );
                      })}
                    </svg>

                    <div className="flex justify-between text-[10px] text-slate-400 pt-1 px-1 font-mono">
                      {currentChartData.map(d => (
                        <span 
                          key={d.month}
                          onMouseEnter={() => setHoveredMonth(d)}
                          onMouseLeave={() => setHoveredMonth(null)}
                          className={`cursor-pointer transition-colors ${hoveredMonth?.month === d.month ? 'text-sky-400 font-bold' : ''}`}
                        >
                          {d.month}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3 Interactive Metric Cards (Click to filter table!) */}
              <div className="md:col-span-6 grid grid-cols-3 gap-3.5">
                
                {/* 1.2k Active Tenders */}
                <div 
                  onClick={() => setActiveTelemetryFilter(activeTelemetryFilter === 'TENDERS' ? 'ALL' : 'TENDERS')}
                  className={`bg-[#F0F7FF] dark:bg-blue-950/20 border rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                    activeTelemetryFilter === 'TENDERS'
                      ? 'border-[#1D4ED8] ring-2 ring-[#1D4ED8]/30 shadow-md'
                      : 'border-blue-100 dark:border-blue-900/30'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-[#1D4ED8] dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl sm:text-3xl font-black text-[#1D4ED8] dark:text-blue-400 tracking-tight">1.2k</p>
                    <p className="text-[9px] font-bold text-blue-600/80 dark:text-blue-400 uppercase tracking-wider mt-0.5">
                      ACTIVE TENDERS
                    </p>
                  </div>
                </div>

                {/* 850 Mandatory QCOs */}
                <div 
                  onClick={() => setActiveTelemetryFilter(activeTelemetryFilter === 'QCO' ? 'ALL' : 'QCO')}
                  className={`bg-[#F0FDF4] dark:bg-emerald-950/20 border rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                    activeTelemetryFilter === 'QCO'
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                      : 'border-emerald-100 dark:border-emerald-900/30'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">850</p>
                    <p className="text-[9px] font-bold text-emerald-600/80 dark:text-emerald-400 uppercase tracking-wider mt-0.5">
                      MANDATORY QCOS
                    </p>
                  </div>
                </div>

                {/* 2.8k Total Standards */}
                <div 
                  onClick={() => setActiveTelemetryFilter('ALL')}
                  className={`bg-[#F8FAFC] dark:bg-white/5 border rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                    activeTelemetryFilter === 'ALL'
                      ? 'border-slate-400 dark:border-white/30'
                      : 'border-slate-200/80 dark:border-white/10'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-200 tracking-tight">2.8k</p>
                    <p className="text-[9px] font-bold text-slate-600/80 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                      TOTAL STANDARDS
                    </p>
                  </div>
                </div>
              </div>
            </div>


            {/* Bottom: Standards Table Component with Active Telemetry Filter */}
            <StandardsTable 
              standards={recommendedStandards}
              selectedStandardIds={selectedStandardIds}
              onToggleStandard={toggleStandardSelection}
              onExploreNormative={openNormativeModalFor}
              telemetryFilter={activeTelemetryFilter}
              onResetTelemetryFilter={() => setActiveTelemetryFilter('ALL')}
              t={t}
            />
          </div>
        </div>

        <NormativeTreeModal />
        <ModelClauseModal />
      </div>
    </div>
  );
}

export default DashboardView;
