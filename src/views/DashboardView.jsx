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
  Sparkles,
  BarChart2,
  LineChart,
  Download,
  Trash2,
  XCircle,
  Filter,
  ArrowRight,
  ExternalLink
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

const allAssociatedTests = [
  { id: 'IS_7098_P2', test: 'IS 8130 : 2013', label: 'Conductor DC Resistance Test' },
  { id: 'IS_7098_P2', test: 'IS 10810 (Part 58) : 1998', label: 'Oxygen Index Test (>= 29%)' },
  { id: 'IS_1786', test: 'IS 1608 (Part 1) : 2018', label: 'Tensile & Proof Stress (>= 500 MPa)' },
  { id: 'IS_1786', test: 'IS 1599 : 2019', label: '180° Cold Bend Mandrel Test' },
  { id: 'IS_269', test: 'IS 4031 (Part 6) : 1988', label: 'Cement 28-Day Strength Test' },
  { id: 'IS_1239_P1', test: 'IS 4736 : 1986', label: 'Galvanized Zinc Mass Test' },
  { id: 'IS_16102_P1', test: 'IS 10322 (Part 5/Sec 3) : 2012', label: 'IP66 Jet Water Ingress Test' }
];

export function DashboardView() {
  const navigate = useNavigate();
  const { 
    t, 
    recommendedStandards = [], 
    selectedStandardIds = [], 
    toggleStandardSelection,
    openNormativeModalFor,
    setIsModelClauseModalOpen,
    selectedNormativeTests = {},
    toggleNormativeTest,
    orgProfile = {}
  } = useProcurement();

  const [showQrCard, setShowQrCard] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [timeframe, setTimeframe] = useState('6M');
  const [chartMode, setChartMode] = useState('bars'); // 'bars' | 'trend'
  const [activeTelemetryFilter, setActiveTelemetryFilter] = useState('ALL'); // 'ALL' | 'QCO' | 'TENDERS'

  // Count total active tests
  let totalSelectedTestsCount = 0;
  Object.values(selectedNormativeTests).forEach(tests => {
    totalSelectedTestsCount += (tests || []).length;
  });

  const testPercentage = Math.round((totalSelectedTestsCount / allAssociatedTests.length) * 100);

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

      <div className="max-w-[1520px] mx-auto space-y-8 relative z-10">
        
        {/* ================================================================ */}
        {/* 1. TOP HEADER & TELEMETRY CONTROLS                               */}
        {/* ================================================================ */}
        <div className="space-y-4 pb-2 border-b border-slate-200/80 dark:border-white/[0.08]">
          {/* Top Pill & Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold shadow-xs backdrop-blur-xl w-fit">
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
                onClick={() => navigate('/reports')}
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
          
          {/* ==================== LEFT COLUMN (3.5 / 12) ==================== */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* 1. Compliance Completeness Index Card */}
            <ComplianceMeter />

            {/* 2. YOUR TENDER DRAFT Card */}
            <div className="bg-white/90 dark:bg-[#0E1322]/90 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-slate-200/80 dark:border-white/[0.08] flex flex-col space-y-5 transition-all hover:shadow-2xl">
              
              {/* Header with Test Completion Ring */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/[0.08]">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider font-mono">
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                  <span>YOUR TENDER DRAFT</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                    {testPercentage}% Tests Verified
                  </span>
                </div>
              </div>

              {/* Primary Standards Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    PRIMARY STANDARDS ({selectedStandardIds.length})
                  </h4>
                  {selectedStandardIds.length > 0 && (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                      All Mandatory QCOs Active
                    </span>
                  )}
                </div>

                {selectedStandardIds.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 text-center">
                    <p className="text-xs text-slate-400 italic">No standards selected yet.</p>
                    <p className="text-[10px] text-slate-500 mt-1">Click "+ Add" on any standard in the table to enrol it.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {selectedStandardIds.map((id) => {
                      const s = recommendedStandards.find((x) => x.id === id);
                      if (!s) return null;
                      return (
                        <div key={id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 hover:border-blue-300 transition-all group/item">
                          <div className="min-w-0 flex-1 pr-2">
                            <span className="font-bold text-slate-900 dark:text-white block font-mono text-[11px]">
                              {s.code}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight truncate">
                              {s.title}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => toggleStandardSelection && toggleStandardSelection(id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors opacity-60 group-hover/item:opacity-100 cursor-pointer"
                            title="Remove from draft"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mandatory Associated Tests Section with Select All */}
              <div className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    MANDATORY ASSOCIATED TESTS ({totalSelectedTestsCount}/{allAssociatedTests.length})
                  </h4>
                  <button
                    onClick={handleToggleAllTests}
                    className="text-[10px] font-mono font-bold text-[#1D4ED8] dark:text-[#60A5FA] hover:underline cursor-pointer"
                  >
                    Toggle All
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {allAssociatedTests.map((item, idx) => {
                    const currentSelected = selectedNormativeTests[item.id] || [];
                    const isChecked = currentSelected.includes(item.test);

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleNormativeTest && toggleNormativeTest(item.id, item.test)}
                        className="flex items-start gap-2.5 cursor-pointer text-xs p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group"
                      >
                        <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                          isChecked 
                            ? 'bg-[#1D4ED8] text-white shadow-xs' 
                            : 'border border-slate-300 dark:border-white/20 bg-white dark:bg-black/20 group-hover:border-[#1D4ED8]'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono font-bold text-slate-900 dark:text-white block text-[11px]">
                            {item.test}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight truncate">
                            {item.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: Preview NIT & Download Dossier */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-white/[0.08] space-y-2">
                <button
                  onClick={() => setIsModelClauseModalOpen(true)}
                  className="w-full py-3 rounded-full bg-[#0B1E36] dark:bg-white text-white dark:text-[#07080A] hover:bg-[#152e50] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400 dark:text-[#0B1E36]" />
                  <span>Preview Model NIT Clause</span>
                </button>

                <button
                  onClick={handleDownloadDossier}
                  className="w-full py-2.5 rounded-full bg-slate-100/90 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200/80 dark:border-white/10"
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
                      <TrendingUp className="w-3.5 h-3.5 text-[#00D2D3]" />
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
                          chartMode === 'bars' ? 'bg-[#00D2D3] text-black font-bold' : 'text-slate-300 hover:text-white'
                        }`}
                        title="Bar Chart Mode"
                      >
                        <BarChart2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setChartMode('trend')}
                        className={`p-1 rounded-md transition-all cursor-pointer ${
                          chartMode === 'trend' ? 'bg-[#00D2D3] text-black font-bold' : 'text-slate-300 hover:text-white'
                        }`}
                        title="Wave Curve Trend Mode"
                      >
                        <LineChart className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-full text-[10px] font-mono">
                      {['3M', '6M', '1Y'].map(tf => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                            timeframe === tf ? 'bg-[#00D2D3] text-black font-bold' : 'text-slate-300 hover:text-white'
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
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-950/95 text-white text-[10px] font-mono px-3.5 py-1.5 rounded-xl border border-white/20 shadow-2xl z-20 whitespace-nowrap animate-in fade-in duration-150">
                    <span className="text-[#00D2D3] font-bold">{hoveredMonth.month}</span>: {hoveredMonth.passedCount} Passed ({hoveredMonth.adherence}) / <span className="text-[#A259FF] font-bold">{hoveredMonth.flaggedCount} Flagged</span>
                  </div>
                )}

                {/* Chart Area */}
                {chartMode === 'bars' ? (
                  /* Dual Bar View */
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
                          <div className="w-full flex items-end justify-center gap-1.5 h-24 bg-white/[0.03] rounded-xl p-1 transition-colors group-hover:bg-white/[0.08]">
                            <div 
                              style={{ height: `${d.cyan}%` }}
                              className={`w-3 bg-[#00D2D3] rounded-t-sm transition-all duration-300 ${
                                isHovered ? 'brightness-125 shadow-[0_0_10px_#00D2D3]' : ''
                              }`}
                            />
                            <div 
                              style={{ height: `${d.purple}%` }}
                              className={`w-3 bg-[#A259FF] rounded-t-sm transition-all duration-300 ${
                                isHovered ? 'brightness-125 shadow-[0_0_10px_#A259FF]' : ''
                              }`}
                            />
                          </div>
                          <span className={`text-[10px] font-mono transition-colors ${isHovered ? 'text-[#00D2D3] font-bold' : 'text-slate-400'}`}>
                            {d.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* SVG Wave Curve Trend View */
                  <div className="pt-6 relative z-10 h-32 flex flex-col justify-end">
                    <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00D2D3" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#00D2D3" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 60 Q 50 20, 100 45 T 200 15 T 300 25 L 300 100 L 0 100 Z"
                        fill="url(#trendGrad)"
                      />
                      <path
                        d="M 0 60 Q 50 20, 100 45 T 200 15 T 300 25"
                        fill="none"
                        stroke="#00D2D3"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1 px-1">
                      {currentChartData.map(d => (
                        <span key={d.month}>{d.month}</span>
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
                    <p className="text-2xl sm:text-3xl font-black font-mono text-[#1D4ED8] dark:text-blue-400 tracking-tight">1.2k</p>
                    <p className="text-[9px] font-bold text-blue-600/80 dark:text-blue-400 uppercase tracking-wider font-mono mt-0.5">
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
                    <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">850</p>
                    <p className="text-[9px] font-bold text-emerald-600/80 dark:text-emerald-400 uppercase tracking-wider font-mono mt-0.5">
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
                    <p className="text-2xl sm:text-3xl font-black font-mono text-slate-800 dark:text-slate-200 tracking-tight">2.8k</p>
                    <p className="text-[9px] font-bold text-slate-600/80 dark:text-slate-400 uppercase tracking-wider font-mono mt-0.5">
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
