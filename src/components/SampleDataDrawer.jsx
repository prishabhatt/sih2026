import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';
import { useProcurement } from '../context/ProcurementContext';
import { useNavigate } from 'react-router-dom';

export function SampleDataDrawer() {
  const { isSampleDrawerOpen, setIsSampleDrawerOpen, loadScenario } = useProcurement();
  const navigate = useNavigate();

  if (!isSampleDrawerOpen) return null;

  const handleSelectScenario = (id) => {
    loadScenario(id);
    setIsSampleDrawerOpen(false);
    navigate('/input');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-[#0B132B] rounded-l-3xl h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200 text-slate-900 dark:text-slate-100 transition-all">
        <div className="p-6 flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-[#070B14]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Sample Tender Scenarios</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">One-click authentic procurement profiles</p>
            </div>
          </div>
          <button
            onClick={() => setIsSampleDrawerOpen(false)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-3.5 bg-white dark:bg-[#090D1A]">
          {SAMPLE_SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => handleSelectScenario(scenario.id)}
              className="bg-slate-50 dark:bg-[#0E1529] border border-slate-200 dark:border-white/10 p-4 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/40">
                  {scenario.division}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition flex items-center gap-1">
                  Load <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mt-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {scenario.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                {scenario.businessName} ({scenario.state})
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-2 leading-relaxed font-normal">
                {scenario.query}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-white/10 flex flex-wrap gap-1.5">
                {scenario.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-mono glass-pill-container text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200/80 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center font-normal">
            Clicking any scenario pre-fills official GeM metadata & technical parameters.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SampleDataDrawer;
