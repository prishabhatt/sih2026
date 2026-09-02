import React, { useState } from 'react';
import { Award, Zap, Sparkles, HelpCircle, CheckCircle2, ChevronRight, Info } from 'lucide-react';
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

  const [activeTooltip, setActiveTooltip] = useState(null);

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const metricDetails = {
    primary: {
      title: 'Primary Standard Precision',
      score: primaryAccuracy,
      color: 'bg-[#1D4ED8]',
      desc: 'Matches IS 7098, IS 1786 and IS 694 with zero outdated revisions.'
    },
    raw: {
      title: 'Raw Material Test Coverage',
      score: rawTestCoverage,
      color: 'bg-emerald-500',
      desc: 'Associated tests verified against Section IV normative test protocols.'
    },
    qco: {
      title: 'Statutory QCO Mandates Met',
      score: qcoStatutoryRate,
      color: 'bg-indigo-500',
      desc: '100% adherence to Ministry Gazette Orders issued under BIS Act 2016.'
    },
    mii: {
      title: 'Make In India Local Content',
      score: makeInIndiaRate,
      color: 'bg-amber-500',
      desc: 'Meets DPIIT Order 2017 Class-I minimum local value addition threshold (60%).'
    }
  };

  return (
    <div className="bg-white/90 dark:bg-[#0E1322]/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/80 dark:border-white/[0.08] flex flex-col space-y-5 transition-all hover:shadow-2xl group relative">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider font-mono">
            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{t?.dashboard?.complianceMeterTitle || 'COMPLIANCE COMPLETENESS INDEX'}</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
            Real-time GFR 2017 & QCO Legal Index
          </p>
        </div>

        <div className="relative group/pill">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shrink-0 flex items-center gap-1 cursor-default shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {overallScore}%
          </span>
        </div>
      </div>

      {/* Radial Gauge with Interactive Hover */}
      <div className="flex items-center justify-center py-1">
        <div className="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-105 duration-300">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-slate-100 dark:stroke-white/10"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-[#00D2A0] transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(0,210,160,0.4)]"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white block">
              {overallScore}%
            </span>
            <span className="text-[8px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mt-0.5">
              LEGAL INDEX
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Status Pill */}
      <div className="w-full py-2 px-3.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-center flex items-center justify-center gap-1.5 shadow-xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-tight">{statusText}</p>
      </div>

      {/* Metric Breakdown Bars with Interactive Hovers */}
      <div className="space-y-3 text-xs pt-1 border-t border-slate-200/80 dark:border-white/[0.08]">
        {Object.entries(metricDetails).map(([key, item]) => (
          <div 
            key={key} 
            className="group/bar cursor-pointer p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors"
            onMouseEnter={() => setActiveTooltip(key)}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <div className="flex items-center justify-between mb-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1">
                {item.title}
                <Info className="w-3 h-3 text-slate-400 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
              </span>
              <span className="font-mono text-slate-900 dark:text-white font-bold">{item.score}%</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className={`${item.color} h-full rounded-full transition-all duration-700 group-hover/bar:brightness-125 shadow-xs`}
                style={{ width: `${item.score}%` }}
              />
            </div>

            {activeTooltip === key && (
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 animate-in fade-in duration-150 leading-tight">
                {item.desc}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Advice Note */}
      <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2.5 shadow-2xs">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Include all normative raw material test codes to ensure bid specifications have zero legal loopholes.
        </p>
      </div>
    </div>
  );
}

export default ComplianceMeter;

