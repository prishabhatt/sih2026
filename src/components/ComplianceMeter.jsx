import React, { useState, useEffect } from 'react';
import { Award, Sparkles, CheckCircle2, ChevronRight, Info, ShieldCheck, X, BookOpen } from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';

export function ComplianceMeter() {
  const { complianceStats = {}, t } = useProcurement();
  const { 
    overallScore = 88, 
    primaryAccuracy = 98, 
    rawTestCoverage = 67, 
    qcoStatutoryRate = 100, 
    makeInIndiaRate = 100, 
    statusText = 'Fully Compliant & QCO Sealed' 
  } = complianceStats;

  const [activeInfoKey, setActiveInfoKey] = useState(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);

  // Smooth entry animation on page load / score change
  useEffect(() => {
    setAnimatedProgress(0);
    setDisplayScore(0);

    let raf1, raf2;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setAnimatedProgress(overallScore);
      });
    });

    let start = 0;
    const end = overallScore;
    const duration = 1400; // ms
    const startTime = performance.now();

    const animateCount = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + (end - start) * ease);
      setDisplayScore(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setDisplayScore(end);
      }
    };

    const countReq = requestAnimationFrame(animateCount);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cancelAnimationFrame(countReq);
    };
  }, [overallScore]);

  // Full 360-Degree Circle Geometry
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, animatedProgress)) / 100) * circumference;

  const metricDetails = {
    primary: {
      title: 'Primary Standard Precision',
      score: primaryAccuracy,
      color: 'from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-100',
      shortDesc: 'Matches active IS codes with zero outdated revisions.',
      fullExplanation: 'Evaluates the exactness of the resolved primary Indian Standards against draft BOQ specifications. Verifies that all cited standard codes are active, reaffirmed, and free from obsolete amendment references.',
      statutoryRef: 'Section 16, BIS Act 2016 & National Standards Registry'
    },
    raw: {
      title: 'Raw Material Test Coverage',
      score: rawTestCoverage,
      color: 'from-[#1E3A5F] to-[#0A192F] dark:from-slate-400 dark:to-slate-200',
      shortDesc: 'Associated tests verified against Section IV normative test protocols.',
      fullExplanation: 'Calculates the proportion of mandatory raw material & routine test protocols enrolled in your tender draft (e.g., Conductor DC Resistance via IS 8130, Oxygen Index via IS 10810, Tensile Strength via IS 1608). Including these prevents bidder substitution of substandard raw materials.',
      statutoryRef: 'Section IV Normative Reference Protocols & BIS Scheme-I Manual'
    },
    qco: {
      title: 'Statutory QCO Mandates Met',
      score: qcoStatutoryRate,
      color: 'from-emerald-700 to-emerald-950 dark:from-emerald-400 dark:to-emerald-200',
      shortDesc: '100% adherence to Ministry Gazette Orders issued under BIS Act 2016.',
      fullExplanation: 'Verifies that every procurement item governed by a mandatory Quality Control Order (QCO) issued by Central Ministries requires mandatory ISI/CRS certification in the NIT technical clause.',
      statutoryRef: 'Gazette Quality Control Orders (QCOs) 2023-2024'
    },
    mii: {
      title: 'Make In India Local Content',
      score: makeInIndiaRate,
      color: 'from-slate-600 to-slate-800 dark:from-slate-400 dark:to-slate-200',
      shortDesc: 'Meets DPIIT Order 2017 Class-I minimum local value addition threshold (60%).',
      fullExplanation: 'Checks whether the tender incorporates mandatory Class-I local content minimums (50%–60%) and vendor self-certification mechanisms in compliance with the Public Procurement (Preference to Make in India) Order 2017.',
      statutoryRef: 'Public Procurement (Preference to Make in India) Order 2017'
    }
  };

  return (
    <div className="bg-white/80 dark:bg-[#0E1322]/80 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/90 dark:border-white/[0.08] flex flex-col space-y-5 transition-all hover:shadow-2xl group relative">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-black text-[11px] sm:text-xs uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{t?.dashboard?.complianceMeterTitle || 'COMPLIANCE COMPLETENESS INDEX'}</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
            Real-time GFR 2017 & QCO Legal Index
          </p>
        </div>

        {/* Live Badge */}
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>STATUTORY SEAL</span>
        </span>
      </div>

      {/* Circle Gauge Container with Central Readout */}
      <div className="flex flex-col items-center justify-center pt-1 pb-2">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full transform" viewBox="0 0 240 240">
            <defs>
              {/* Refined Sovereign Slate Arc Gradient */}
              <linearGradient id="scoreArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A5F" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              {/* Light Mode Inner Orb Radial */}
              <radialGradient id="orbGradLight" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#F8FAFC" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F1F5F9" stopOpacity="0.8" />
              </radialGradient>

              {/* Dark Mode Inner Orb Radial */}
              <radialGradient id="orbGradDark" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1E293B" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#0F172A" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#070D1D" stopOpacity="0.95" />
              </radialGradient>
            </defs>

            {/* Central Circular Dial Surface */}
            <g>
              <circle
                cx="120"
                cy="120"
                r="62"
                className="dark:hidden transition-all duration-500"
                fill="url(#orbGradLight)"
                filter="drop-shadow(0 2px 8px rgba(0,0,0,0.06))"
              />
              <circle
                cx="120"
                cy="120"
                r="62"
                className="hidden dark:block transition-all duration-500"
                fill="url(#orbGradDark)"
                filter="drop-shadow(0 4px 16px rgba(0,0,0,0.4))"
              />

              {/* Glass Highlight Rim */}
              <circle
                cx="120"
                cy="120"
                r="62"
                className="fill-transparent stroke-slate-200/80 dark:stroke-white/10"
                strokeWidth="1.5"
              />
            </g>

            {/* Background Circular Track */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              className="stroke-slate-200/80 dark:stroke-white/[0.08] transition-colors"
              strokeWidth="12"
              fill="transparent"
            />

            {/* Active Progress Stroke */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="url(#scoreArcGradient)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              transform="rotate(-90 120 120)"
              style={{
                transition: 'stroke-dashoffset 1.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
            />
          </svg>

          {/* Center Score Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {displayScore}%
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mt-1">
              LEGAL INDEX
            </span>
          </div>
        </div>

        {/* Contextual Status Message */}
        <div className="text-center mt-1 space-y-0.5">
          <p className="text-xs font-bold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>{statusText}</span>
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
            Aligned with BIS Act 2016 statutory mandates
          </p>
        </div>
      </div>

      {/* Metric Breakdown Bars with Sophisticated Slate Popovers */}
      <div className="space-y-3 text-xs pt-3 border-t border-slate-200/80 dark:border-white/[0.08]">
        {Object.entries(metricDetails).map(([key, item]) => {
          const isInfoOpen = activeInfoKey === key;
          return (
            <div 
              key={key} 
              className="p-2.5 rounded-2xl transition-all duration-200 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.05] hover:border-slate-300 dark:hover:border-white/20"
            >
              <div className="flex items-center justify-between mb-1.5 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <span>{item.title}</span>
                  
                  {/* Classy Neutral Info Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveInfoKey(isInfoOpen ? null : key);
                    }}
                    title="Click for statutory & technical explanation"
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono transition-all cursor-pointer ${
                      isInfoOpen
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold shadow-xs scale-105'
                        : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/10'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-slate-950 dark:text-white font-extrabold">{item.score}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200/80 dark:bg-white/10 h-2 rounded-full overflow-hidden p-0.5">
                <div
                  className={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all duration-700 shadow-2xs`}
                  style={{ width: `${item.score}%` }}
                />
              </div>

              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-tight">
                {item.shortDesc}
              </p>

              {/* Expandable Classy Neutral Explanation Card */}
              {isInfoOpen && (
                <div className="mt-2.5 p-3.5 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/15 shadow-xl text-slate-800 dark:text-slate-200 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      Statutory Audit Details
                    </span>
                    <button
                      onClick={() => setActiveInfoKey(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {item.fullExplanation}
                  </p>

                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-[9px] font-mono text-slate-700 dark:text-slate-300">
                    📜 {item.statutoryRef}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Advice Note */}
      <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-2.5 shadow-2xs">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          Include all normative raw material test codes to ensure bid specifications have zero legal loopholes.
        </p>
      </div>
    </div>
  );
}

export default ComplianceMeter;
