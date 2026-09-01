import React from 'react';
import { Award, Zap } from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';

export function ComplianceMeter() {
  const { complianceStats, t } = useProcurement();
  const { overallScore, primaryAccuracy, rawTestCoverage, qcoStatutoryRate, makeInIndiaRate, statusText, statusColor } = complianceStats;

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const colorVariants = {
    emerald: {
      text: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      border: 'border-emerald-200 dark:border-emerald-500/20',
      stroke: 'stroke-emerald-600 dark:stroke-emerald-500',
      pill: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30'
    },
    amber: {
      text: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      border: 'border-amber-200 dark:border-amber-500/20',
      stroke: 'stroke-amber-600 dark:stroke-amber-500',
      pill: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30'
    },
    rose: {
      text: 'text-rose-700 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      border: 'border-rose-200 dark:border-rose-500/20',
      stroke: 'stroke-rose-600 dark:stroke-rose-500',
      pill: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30'
    },
    slate: {
      text: 'text-slate-700 dark:text-slate-400',
      bg: 'bg-slate-100 dark:bg-slate-800/60',
      border: 'border-slate-200 dark:border-slate-700/80',
      stroke: 'stroke-slate-500 dark:stroke-slate-600',
      pill: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
    }
  };

  const theme = colorVariants[statusColor] || colorVariants.emerald;

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-xs text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            {t.dashboard.complianceMeterTitle}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time GFR 2017 & QCO Legal Index
          </p>
        </div>
        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${theme.pill}`}>
          {overallScore}%
        </span>
      </div>

      {/* Radial Gauge */}
      <div className="flex items-center justify-center py-2">
        <div className="relative flex items-center justify-center">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r={radius}
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="56"
              cy="56"
              r={radius}
              className={`${theme.stroke} transition-all duration-700 ease-out`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute text-center">
            <span className={`text-2xl font-bold font-mono tracking-tight ${theme.text}`}>
              {overallScore}%
            </span>
            <span className="block text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Legal Index
            </span>
          </div>
        </div>
      </div>

      <div className={`p-2.5 rounded-lg border ${theme.bg} ${theme.border} text-center`}>
        <p className={`text-xs font-semibold ${theme.text}`}>{statusText}</p>
      </div>

      {/* Metric Breakdown Bars */}
      <div className="space-y-3 text-xs pt-1">
        <div>
          <div className="flex items-center justify-between mb-1 text-slate-700 dark:text-slate-300 text-[11px]">
            <span>Primary Standard Precision</span>
            <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">{primaryAccuracy}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${primaryAccuracy}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 text-slate-700 dark:text-slate-300 text-[11px]">
            <span>Raw Material Test Coverage</span>
            <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">{rawTestCoverage}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 dark:bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${rawTestCoverage}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 text-slate-700 dark:text-slate-300 text-[11px]">
            <span>Statutory QCO Mandates Met</span>
            <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">{qcoStatutoryRate}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${qcoStatutoryRate}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 text-slate-700 dark:text-slate-300 text-[11px]">
            <span>Make In India Local Content</span>
            <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">{makeInIndiaRate}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-600 dark:bg-amber-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${makeInIndiaRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-[#131C2E] rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
        <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-snug">
          Include all normative raw material test codes to ensure bid specifications have zero legal loopholes.
        </p>
      </div>
    </div>
  );
}
