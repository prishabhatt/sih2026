import React, { useState, useEffect } from 'react';
import { Award, Zap, Sparkles, HelpCircle, CheckCircle2, ChevronRight, Info, ShieldCheck } from 'lucide-react';
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
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);

  // Smooth entry animation on page load / score change
  useEffect(() => {
    // Start at 0%
    setAnimatedProgress(0);
    setDisplayScore(0);

    // Double RAF ensures initial 0% is painted before transition begins
    let raf1, raf2;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setAnimatedProgress(overallScore);
      });
    });

    // Number counting animation
    let start = 0;
    const end = overallScore;
    const duration = 1400; // ms
    const startTime = performance.now();

    const animateCount = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Custom smooth ease-out (cubic-bezier approx)
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
  const circumference = 2 * Math.PI * radius; // ~502.65
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, animatedProgress)) / 100) * circumference;

  const metricDetails = {
    primary: {
      title: 'Primary Standard Precision',
      score: primaryAccuracy,
      color: 'from-blue-600 to-indigo-600',
      desc: 'Matches IS 7098, IS 1786 and IS 694 with zero outdated revisions.'
    },
    raw: {
      title: 'Raw Material Test Coverage',
      score: rawTestCoverage,
      color: 'from-purple-500 to-indigo-600',
      desc: 'Associated tests verified against Section IV normative test protocols.'
    },
    qco: {
      title: 'Statutory QCO Mandates Met',
      score: qcoStatutoryRate,
      color: 'from-sky-500 to-blue-600',
      desc: '100% adherence to Ministry Gazette Orders issued under BIS Act 2016.'
    },
    mii: {
      title: 'Make In India Local Content',
      score: makeInIndiaRate,
      color: 'from-indigo-500 to-purple-600',
      desc: 'Meets DPIIT Order 2017 Class-I minimum local value addition threshold (60%).'
    }
  };

  return (
    <div className="bg-white/70 dark:bg-[#0E1322]/80 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-white dark:border-white/20 flex flex-col space-y-5 transition-all hover:shadow-2xl group relative">
      
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

        <div className="relative group/pill">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-purple-500/15 via-blue-500/15 to-cyan-500/15 text-indigo-700 dark:text-sky-300 border border-indigo-300/40 dark:border-white/20 shrink-0 flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            {overallScore}%
          </span>
        </div>
      </div>

      {/* Full 360-Degree Blue & Purple Circular Gauge with Luminous Center Disc */}
      <div className="flex flex-col items-center justify-center py-2 relative">
        <div className="relative w-56 h-56 flex items-center justify-center">
          
          <svg className="w-full h-full" viewBox="0 0 240 240">
            <defs>
              {/* Vibrant Arc Gradient: Purple to Indigo to Sky Blue to Cyan */}
              <linearGradient id="scoreArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="25%" stopColor="#8B5CF6" />
                <stop offset="55%" stopColor="#3B82F6" />
                <stop offset="85%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>

              {/* Light Mode Spherical Glass Disc Gradient */}
              <radialGradient id="orbGradLight" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#DBEAFE" stopOpacity="0.85" />
                <stop offset="75%" stopColor="#EDE9FE" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#E9D5FF" stopOpacity="0.95" />
              </radialGradient>

              {/* Dark Mode Spherical Glass Disc Gradient */}
              <radialGradient id="orbGradDark" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.55" />
                <stop offset="35%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#7C3AED" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0B1224" stopOpacity="0.95" />
              </radialGradient>

              {/* Drop Shadow Filter for Glow */}
              <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Inner Spherical Glassmorphic Orb Disc with 3D Lens Highlight */}
            <g className="transition-transform duration-300 hover:scale-[1.02] origin-center cursor-pointer">
              {/* Outer soft ring */}
              <circle
                cx="120"
                cy="120"
                r="64"
                className="fill-transparent stroke-slate-200/60 dark:stroke-white/10"
                strokeWidth="1"
              />

              {/* Spherical Gradient Sphere */}
              <circle
                cx="120"
                cy="120"
                r="62"
                className="dark:hidden transition-all duration-500"
                fill="url(#orbGradLight)"
                filter="drop-shadow(0 8px 24px rgba(99,102,241,0.18))"
              />
              <circle
                cx="120"
                cy="120"
                r="62"
                className="hidden dark:block transition-all duration-500"
                fill="url(#orbGradDark)"
                filter="drop-shadow(0 8px 24px rgba(56,189,248,0.25))"
              />

              {/* Glass Highlight Rim */}
              <circle
                cx="120"
                cy="120"
                r="62"
                className="fill-transparent stroke-white/80 dark:stroke-white/20"
                strokeWidth="1.5"
              />
            </g>

            {/* Background Full 360-Degree Circular Track */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              className="stroke-slate-200/70 dark:stroke-white/[0.08] transition-colors"
              strokeWidth="13"
              fill="transparent"
            />

            {/* Active Vibrant Blue & Purple Progress Stroke (Starts at 12 o'clock and fills clockwise) */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="url(#scoreArcGradient)"
              strokeWidth="13"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              filter="url(#arcGlow)"
              transform="rotate(-90 120 120)"
              style={{
                transition: 'stroke-dashoffset 1.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
            />
          </svg>

          {/* Center Score Readout: Clean 88% LEGAL INDEX Format */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none drop-shadow-xs">
              {displayScore}%
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 dark:text-sky-300 mt-1">
              LEGAL INDEX
            </span>
          </div>
        </div>

        {/* Contextual Status Message */}
        <div className="text-center mt-1 space-y-0.5">
          <p className="text-xs font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>✨</span>
            <span>{statusText}</span>
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            High precision alignment with BIS Act 2016 statutory mandates
          </p>
        </div>
      </div>

      {/* Metric Breakdown Bars with Matching Indigo/Purple Gradients */}
      <div className="space-y-3 text-xs pt-3 border-t border-slate-200/80 dark:border-white/[0.08]">
        {Object.entries(metricDetails).map(([key, item]) => (
          <div 
            key={key} 
            className="group/bar cursor-pointer p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors"
            onMouseEnter={() => setActiveTooltip(key)}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <div className="flex items-center justify-between mb-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                {item.title}
                <Info className="w-3 h-3 text-slate-400 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
              </span>
              <span className="text-slate-950 dark:text-white font-black">{item.score}%</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden p-0.5">
              <div
                className={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all duration-700 group-hover/bar:brightness-110 shadow-xs`}
                style={{ width: `${item.score}%` }}
              />
            </div>

            {activeTooltip === key && (
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 animate-in fade-in duration-150 leading-tight">
                {item.desc}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Advice Note */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-transparent border border-indigo-200/60 dark:border-white/10 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-2.5 shadow-2xs">
        <Sparkles className="w-4 h-4 text-indigo-500 dark:text-sky-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          Include all normative raw material test codes to ensure bid specifications have zero legal loopholes.
        </p>
      </div>
    </div>
  );
}

export default ComplianceMeter;

