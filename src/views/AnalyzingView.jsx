import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Terminal, 
  Activity, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';

export function AnalyzingView() {
  const navigate = useNavigate();
  const { t, selectedDivision, orgProfile } = useProcurement();

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(15);
  const [logLines, setLogLines] = useState([]);

  const pipelineStages = [
    { title: t.analyzing.stage1, latency: '12ms' },
    { title: t.analyzing.stage2, latency: '28ms' },
    { title: t.analyzing.stage3, latency: '44ms' },
    { title: t.analyzing.stage4, latency: '18ms' },
    { title: t.analyzing.stage5, latency: '35ms' },
  ];

  const simulatedLogs = [
    '[00:00.012] Initializing Multilingual Transformer Tokenizer (Hindi/Gujarati/English)...',
    '[00:00.038] Query Vector Dimensions: 768-D Dense Embeddings generated.',
    '[00:00.082] Querying ChromaDB / FAISS multi-index on Division ' + selectedDivision + ' (4,218 candidate standard nodes)...',
    '[00:00.124] Top match node identified: IS 7098 (Part 2) : 2011 (Cosine Sim: 0.9942).',
    '[00:00.180] Traversing Normative Reference Graph -> Resolving raw material dependency IS 8130:2013 (Conductors)...',
    '[00:00.220] Traversing Normative Reference Graph -> Resolving oxygen index flammability test IS 10810 (Part 58)...',
    '[00:00.275] Traversing Normative Reference Graph -> Resolving zinc mass coating IS 3975...',
    '[00:00.320] Checking Gazette QCO Registry under BIS Act 2016 -> Cables & Wires QCO 2023 [ACTIVE MANDATE].',
    '[00:00.360] Verifying Scheme-I (Mandatory ISI Mark) vs Scheme-II (CRS) certification criteria...',
    '[00:00.410] Validating Public Procurement (Preference to Make in India) local content threshold (>= 60%)...',
    '[00:00.480] Model NIT Technical Clauses synthesized and ready for GeM/CPPP insertion.'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/dashboard'), 800);
          return 100;
        }
        const next = prev + 18;
        if (next > 25 && currentStep === 0) setCurrentStep(1);
        if (next > 50 && currentStep === 1) setCurrentStep(2);
        if (next > 75 && currentStep === 2) setCurrentStep(3);
        if (next > 90 && currentStep === 3) setCurrentStep(4);
        return Math.min(100, next);
      });
    }, 450);

    return () => clearInterval(interval);
  }, [currentStep, navigate]);

  useEffect(() => {
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < simulatedLogs.length) {
        setLogLines((prev) => [...prev, simulatedLogs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 280);

    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0F172A] border border-slate-800 text-blue-400 text-xs font-mono font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>AI Neural Resolution Engine Active</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            {t.analyzing.title}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            {t.analyzing.subtitle}
          </p>
        </div>

        <div className="bg-[#0F172A] p-5 sm:p-6 rounded-xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Target Entity: <strong className="text-slate-100 font-semibold">{orgProfile.businessName}</strong>
            </span>
            <span className="font-mono font-bold text-emerald-400 text-xs">
              {progress}% Complete
            </span>
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
            {pipelineStages.map((stage, idx) => {
              const isDone = currentStep > idx || progress === 100;
              const isCurrent = currentStep === idx && progress < 100;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : isCurrent
                      ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                      : 'bg-[#131C2E] border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex justify-center mb-1">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full bg-slate-800 text-slate-500 text-[10px] flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-medium leading-tight line-clamp-2">
                    {stage.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-4 shadow-sm font-mono text-xs overflow-hidden">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              {t.analyzing.terminalTitle}
            </span>
            <span className="text-emerald-400 text-[10px] font-mono">
              [RAG PIPELINE STREAM]
            </span>
          </div>

          <div className="h-40 overflow-y-auto space-y-1 text-slate-300 scroll-smooth pr-2 text-[11px]">
            {logLines.map((line, idx) => (
              <p key={idx} className="leading-relaxed truncate">
                <span className="text-emerald-400 font-bold mr-2">›</span>
                {line}
              </p>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-[#0F172A] p-3 rounded-lg border border-slate-800">
            <p className="text-[10px] uppercase font-semibold text-slate-400">{t.analyzing.statVectors}</p>
            <p className="text-base font-bold font-mono text-slate-100 mt-0.5">22,410</p>
          </div>
          <div className="bg-[#0F172A] p-3 rounded-lg border border-slate-800">
            <p className="text-[10px] uppercase font-semibold text-slate-400">{t.analyzing.statQco}</p>
            <p className="text-base font-bold font-mono text-emerald-400 mt-0.5">142 Orders</p>
          </div>
          <div className="bg-[#0F172A] p-3 rounded-lg border border-slate-800">
            <p className="text-[10px] uppercase font-semibold text-slate-400">{t.analyzing.statConfidence}</p>
            <p className="text-base font-bold font-mono text-blue-400 mt-0.5">99.4%</p>
          </div>
          <div className="bg-[#0F172A] p-3 rounded-lg border border-slate-800">
            <p className="text-[10px] uppercase font-semibold text-slate-400">{t.analyzing.statLatency}</p>
            <p className="text-base font-bold font-mono text-slate-200 mt-0.5">38 ms</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs text-slate-400 hover:text-slate-200 transition inline-flex items-center gap-1"
          >
            <span>Skip transition to Dashboard</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
