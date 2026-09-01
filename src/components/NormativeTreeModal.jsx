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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-[#0F172A] rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-200 transition-colors">
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-[#0B1120] flex items-start justify-between border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 text-xs font-mono font-bold">
                {standard.code}
              </span>
              <Badge variant="qco" size="sm">
                Mandatory QCO Hierarchy
              </Badge>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Normative Reference Tree & Mandatory Test Explorer
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Cross-standard dependencies, raw material test codes, and statutory safety standards required to eliminate quality substitution.
            </p>
          </div>
          <button
            onClick={() => setIsNormativeModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-[#090D16]/50">
          {/* Root standard */}
          <div className="bg-slate-50 dark:bg-[#131C2E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                <GitFork className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">Root Specification</p>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{standard.code}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-xl">{standard.title}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700">
              Division: {standard.division}
            </span>
          </div>

          {/* Tier 1: Raw Material Tests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-[10px] font-mono font-bold">
                  1
                </span>
                <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                  Mandatory Raw Material & Laboratory Test Codes (Normative References)
                </h4>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {currentSelectedTests.length}/{rawTests.length} active
              </span>
            </div>

            <div className="space-y-2.5">
              {rawTests.map((test) => {
                const isChecked = currentSelectedTests.includes(test.code);
                return (
                  <div
                    key={test.code}
                    onClick={() => toggleNormativeTest(standard.id, test.code)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50/60 dark:bg-[#131C2E] border-emerald-400 dark:border-emerald-500/40 text-slate-900 dark:text-slate-100'
                        : 'bg-slate-50/50 dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-emerald-600 dark:text-emerald-400">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-slate-100 font-mono">
                              {test.code}
                            </span>
                            <span className="text-xs text-slate-700 dark:text-slate-300 font-normal">
                              - {test.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            <strong className="text-slate-800 dark:text-slate-300">Test Method:</strong> {test.testMethod}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">
                              {test.mandatoryClause}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-[10px]">
                              {test.importance}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded shrink-0 ${
                        isChecked ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
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
              <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-800 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30 flex items-center justify-center text-[10px] font-mono font-bold">
                2
              </span>
              <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                Statutory Safety Codes & Execution Standards
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {safetyCodes.map((safe) => (
                <div key={safe.code} className="bg-slate-50 dark:bg-[#131C2E] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="font-mono font-bold text-xs text-blue-700 dark:text-blue-400 block mb-1">
                    {safe.code}
                  </span>
                  <h5 className="font-semibold text-xs text-slate-900 dark:text-slate-200 mb-1">{safe.title}</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{safe.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tier 3: Sampling Frequency */}
          <div className="bg-amber-50/50 dark:bg-[#131C2E] p-3.5 rounded-xl border border-amber-200 dark:border-slate-800">
            <h4 className="font-bold text-xs text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <HardHat className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Mandatory Sampling Frequency & Field Inspection Rule
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {standard.normativeReferences?.samplingFrequency || 'Standard batch testing of 1 sample per manufactured lot.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#0B1120] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Toggling test codes recalculates the <strong>Compliance Completeness Index</strong>.
          </p>
          <button
            onClick={() => setIsNormativeModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-sm"
          >
            Apply & Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
