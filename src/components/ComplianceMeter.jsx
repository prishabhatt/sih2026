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
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      stroke: 'stroke-emerald-500',
      pill: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
    },
    amber: {
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      stroke: 'stroke-amber-500',
      pill: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
    },
    rose: {
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      stroke: 'stroke-rose-500',
      pill: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
    },
    slate: {
      text: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-200/50 dark:bg-white/5',
      border: 'border-slate-300 dark:border-white/10',
      stroke: 'stroke-slate-400 dark:stroke-slate-500',
      pill: 'glass-pill-container text-slate-700 dark:text-slate-300'
    }
  };

  const theme = colorVariants[statusColor] || colorVariants.emerald;

  return (
    <div className="glass-card rounded-3xl p-6 shadow-xl space-y-5 transition-colors border border-white/70 dark:border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {t.dashboard.complianceMeterTitle}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
            Real-time GFR 2017 & QCO Legal Index
          </p>
        </div>
        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full shadow-xs ${theme.pill}`}>
          {overallScore}%
        </span>
      </div>

      {/* Radial Gauge */}
      <div className="flex items-center justify-center py-2">
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-slate-200/80 dark:stroke-white/10"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
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
            <span className={`text-3xl font-black font-mono tracking-tight ${theme.text}`}>
              {overallScore}%
            </span>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Legal Index
            </span>
          </div>
        </div>
      </div>

      <div className={`p-3 rounded-2xl border ${theme.bg} ${theme.border} text-center`}>
        <p className={`text-xs font-extrabold ${theme.text}`}>{statusText}</p>
      </div>

      {/* Metric Breakdown Bars */}
      <div className="space-y-3.5 text-xs pt-1">
        <div>
          <div className="flex items-center justify-between mb-1 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
            <span>Primary Standard Precision</span>
            <span className="font-mono text-slate-900 dark:text-white font-bold">{primaryAccuracy}%</span>
          </div>
          <div className="w-full bg-slate-200/70 dark:bg-white/10 h-2 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${primaryAccuracy}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
            <span>Raw Material Test Coverage</span>
            <span className="font-mono text-slate-900 dark:text-white font-bold">{rawTestCoverage}%</span>
          </div>
          <div className="w-full bg-slate-200/70 dark:bg-white/10 h-2 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${rawTestCoverage}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
            <span>Statutory QCO Mandates Met</span>
            <span className="font-mono text-slate-900 dark:text-white font-bold">{qcoStatutoryRate}%</span>
          </div>
          <div className="w-full bg-slate-200/70 dark:bg-white/10 h-2 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${qcoStatutoryRate}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
            <span>Make In India Local Content</span>
            <span className="font-mono text-slate-900 dark:text-white font-bold">{makeInIndiaRate}%</span>
          </div>
          <div className="w-full bg-slate-200/70 dark:bg-white/10 h-2 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-amber-600 dark:bg-amber-500 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${makeInIndiaRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-3.5 glass-pill-container rounded-2xl text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
        <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          Include all normative raw material test codes to ensure bid specifications have zero legal loopholes.
        </p>
      </div>
    </div>
  );
}

export default ComplianceMeter;
