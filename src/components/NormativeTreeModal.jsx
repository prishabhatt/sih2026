import React from 'react';
import { createPortal } from 'react-dom';
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

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => setIsNormativeModalOpen(false)}
    >
      <div 
        className="relative bg-white dark:bg-[#0B111E] rounded-[2rem] max-w-4xl w-full shadow-[0_25px_70px_rgba(0,0,0,0.5)] border-2 border-white dark:border-white/20 max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-all animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-7 flex items-start justify-between border-b border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-md shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 rounded-full text-amber-700 dark:text-amber-400 text-xs font-bold shadow-xs">
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
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold transition cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50 dark:bg-black/20">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <GitFork className="w-4 h-4 text-[#292524] dark:text-[#A8A29E]" />
                Mandatory Raw Material Tests ({rawTests.length} Stipulated)
              </h4>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                Click test code to bundle in tender NIT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {rawTests.map((t, idx) => {
                const isSelected = currentSelectedTests.includes(t.code);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleNormativeTest(standard.id, t.code)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-white/10 border-slate-900 dark:border-white shadow-md'
                        : 'bg-white/60 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/10 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {t.code}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-semibold">
                        {t.parameter}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 ml-6 font-medium">
                      {t.name}
                    </p>
                    <div className="mt-2 ml-6 text-[11px] text-slate-400 font-normal">
                      Mandatory Acceptance Threshold: <strong className="text-slate-700 dark:text-slate-200">{t.threshold}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Statutory Fire & Environmental Safety Baselines ({safetyCodes.length} Codes)
            </h4>

            <div className="space-y-2.5">
              {safetyCodes.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {s.code}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {s.name}
                    </span>
                  </div>
                  <Badge variant="verified" size="sm">
                    {s.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <h4 className="font-bold text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-2">
              <HardHat className="w-4 h-4 text-amber-500" />
              Mandatory Sampling Frequency & Field Inspection Rule
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {standard.normativeReferences?.samplingFrequency || 'Standard batch testing of 1 sample per manufactured lot.'}
            </p>
          </div>
        </div>

        <div className="p-5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-white/60 dark:bg-white/[0.02] backdrop-blur-md shrink-0">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Toggling test codes recalculates the <strong className="text-slate-900 dark:text-white font-bold">Compliance Completeness Index</strong>.
          </p>
          <button
            onClick={() => setIsNormativeModalOpen(false)}
            className="bg-[#0B1E36] hover:bg-[#132845] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-black px-6 py-2.5 rounded-full shadow-md cursor-pointer transition-all hover:scale-105 border border-white/30 dark:border-white/10"
          >
            Apply & Close Explorer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default NormativeTreeModal;
