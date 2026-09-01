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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#0F172A] h-full shadow-2xl border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-200 text-slate-200">
        <div className="p-5 bg-[#0B1120] flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100">Sample Tender Scenarios</h3>
              <p className="text-[11px] text-slate-400">One-click authentic procurement profiles</p>
            </div>
          </div>
          <button
            onClick={() => setIsSampleDrawerOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-[#090D16]/50">
          {SAMPLE_SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => handleSelectScenario(scenario.id)}
              className="bg-[#131C2E] p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {scenario.division}
                </span>
                <span className="text-[11px] text-slate-400 group-hover:text-blue-400 transition flex items-center gap-1">
                  Load <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
              <h4 className="font-semibold text-xs text-slate-100 mt-2 group-hover:text-blue-400 transition">
                {scenario.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {scenario.businessName} ({scenario.state})
              </p>
              <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                {scenario.query}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800 flex flex-wrap gap-1">
                {scenario.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#0B1120] border-t border-slate-800">
          <p className="text-[11px] text-slate-400 text-center">
            Clicking any scenario pre-fills official GeM metadata & technical parameters.
          </p>
        </div>
      </div>
    </div>
  );
}
