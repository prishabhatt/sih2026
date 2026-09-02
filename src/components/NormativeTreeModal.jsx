import React from 'react';
import { 
  X, 
  GitFork, 
  HardHat, 
  CheckSquare, 
  Square
} from 'lucide-react';
import { Badge } from './Badge';
import { useProcurement } from '../context/ProcurementContext';

export function NormativeTreeModal() {
  const { 
    isNormativeModalOpen, 
    setIsNormativeModalOpen, 
    activeNormativeTreeStandard: standard,
    selectedNormativeTests,
    toggleNormativeTest
  } = useProcurement();

  if (!isNormativeModalOpen || !standard) return null;

  const currentSelectedTests = selectedNormativeTests[standard.id] || [];
  const rawTests = standard.normativeReferences?.rawMaterialTests || [];
  const safetyCodes = standard.normativeReferences?.safetyCodes || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative glass-card rounded-3xl max-w-4xl w-full shadow-2xl border border-white/70 dark:border-white/20 max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-all">
        {/* Header */}
        <div className="p-6 sm:p-7 flex items-start justify-between border-b border-slate-200/80 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="glass-pill-container px-3 py-0.5 rounded-full text-[#292524] dark:text-[#A8A29E] text-xs font-mono font-bold shadow-xs">
                {standard.code}
              </span>
              <Badge variant="qco" size="sm">
                Mandatory QCO Hierarchy
              </Badge>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Normative Reference Tree & Mandatory Test Explorer
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-normal leading-relaxed">
              Cross-standard dependencies, raw material test codes, and statutory safety standards required to eliminate quality substitution.
            </p>
          </div>
          <button
            onClick={() => setIsNormativeModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white/30 dark:bg-[#070B14]/40">
          {/* Root standard */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl flex items-center justify-between border border-white/70 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#292524]/10 dark:bg-[#292524]/25 text-[#292524] dark:text-[#A8A29E] flex items-center justify-center font-bold shadow-xs">
                <GitFork className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#292524] dark:text-[#A8A29E] font-mono">Root Specification</p>
                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">{standard.code}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xl">{standard.title}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 glass-pill-container px-3 py-1 rounded-full shadow-xs">
              Division: {standard.division}
            </span>
          </div>

          {/* Tier 1: Raw Material Tests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#059669]/15 text-emerald-600 dark:text-[#059669] flex items-center justify-center text-[10px] font-mono font-bold">
                  1
                </span>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Mandatory Raw Material & Laboratory Test Codes (Normative References)
                </h4>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {currentSelectedTests.length}/{rawTests.length} active
              </span>
            </div>

            <div className="space-y-3">
              {rawTests.map((test) => {
                const isChecked = currentSelectedTests.includes(test.code);
                return (
                  <div
                    key={test.code}
                    onClick={() => toggleNormativeTest(standard.id, test.code)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'glass-pill-active border-[#059669]/50 dark:border-[#059669]/40 text-slate-900 dark:text-white shadow-sm ring-1 ring-emerald-500/20'
                        : 'glass-card hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-emerald-600 dark:text-[#059669]">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                              {test.code}
                            </span>
                            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                              - {test.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            <strong className="text-slate-700 dark:text-slate-300 font-bold">Test Method:</strong> {test.testMethod}
                          </p>
                          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
                            <span className="px-2.5 py-0.5 rounded-full glass-pill-container text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold">
                              {test.mandatoryClause}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#059669]/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                              {test.importance}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full shrink-0 ${
                        isChecked ? 'bg-emerald-600 text-white shadow-xs' : 'glass-pill-container text-slate-600 dark:text-slate-400'
                      }`}>
                        {isChecked ? 'Included' : '+ Add'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tier 2: Safety & Installation Codes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-[#292524]/15 text-[#292524] dark:text-[#A8A29E] flex items-center justify-center text-[10px] font-mono font-bold">
                2
              </span>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Statutory Safety Codes & Execution Standards
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {safetyCodes.map((safe) => (
                <div key={safe.code} className="glass-card p-4 rounded-2xl">
                  <span className="font-mono font-bold text-xs text-[#292524] dark:text-[#A8A29E] block mb-1">
                    {safe.code}
                  </span>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white mb-1">{safe.title}</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{safe.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tier 3: Sampling Frequency */}
          <div className="glass-card p-4 rounded-2xl border border-amber-500/30">
            <h4 className="font-bold text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-2">
              <HardHat className="w-4 h-4 text-amber-500" />
              Mandatory Sampling Frequency & Field Inspection Rule
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {standard.normativeReferences?.samplingFrequency || 'Standard batch testing of 1 sample per manufactured lot.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-white/40 dark:bg-white/[0.02]">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Toggling test codes recalculates the <strong className="text-slate-900 dark:text-white font-bold">Compliance Completeness Index</strong>.
          </p>
          <button
            onClick={() => setIsNormativeModalOpen(false)}
            className="glass-btn-primary shimmer-sweep px-5 py-2.5 rounded-full text-white text-xs font-extrabold transition shadow-md cursor-pointer"
          >
            Apply & Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
