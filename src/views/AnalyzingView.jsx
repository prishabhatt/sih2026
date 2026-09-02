import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Terminal, 
  Activity, 
  ArrowRight,
  Loader2,
  Cpu,
  Sparkles
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { AppleStripeBackground } from '../components/AppleStripeBackground';

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
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500 relative font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Living Aurora Background */}
      <AppleStripeBackground />

      <div className="max-w-4xl mx-auto w-full space-y-6 relative z-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill-container text-blue-600 dark:text-blue-400 text-xs font-mono font-bold shadow-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
            <span>AI Neural Vector Resolution Pipeline</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.analyzing.title}{' '}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-sky-300">
              Intelligence
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-normal">
            {t.analyzing.subtitle}
          </p>
        </div>

        {/* Progress Container */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/70 dark:border-white/10 shadow-xl space-y-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Target Entity: <strong className="text-slate-900 dark:text-white font-extrabold">{orgProfile.businessName}</strong>
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              {progress}% Complete
            </span>
          </div>

          <div className="w-full bg-slate-200/80 dark:bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-sky-400 h-full rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-2">
            {pipelineStages.map((stage, idx) => {
              const isDone = currentStep > idx || progress === 100;
              const isCurrent = currentStep === idx && progress < 100;

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    isDone
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold'
                      : isCurrent
                      ? 'glass-pill-active border-blue-500/50 dark:border-blue-400/50 text-blue-900 dark:text-blue-300 font-extrabold ring-2 ring-blue-500/20'
                      : 'glass-card text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <div className="flex justify-center mb-1.5">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 text-[10px] flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] leading-tight line-clamp-2">
                    {stage.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streaming RAG Terminal */}
        <div className="bg-[#070B14]/90 dark:bg-[#070B14]/95 text-slate-200 rounded-3xl border border-white/10 p-5 shadow-2xl font-mono text-xs overflow-hidden backdrop-blur-2xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-slate-400 text-[11px]">
            <span className="flex items-center gap-2 text-white font-bold">
              <Terminal className="w-4 h-4 text-blue-400" />
              {t.analyzing.terminalTitle}
            </span>
            <span className="text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              [RAG PIPELINE STREAM]
            </span>
          </div>

          <div className="h-44 overflow-y-auto space-y-1.5 text-slate-300 scroll-smooth pr-2 text-[11px] font-mono">
            {logLines.map((line, idx) => (
              <p key={idx} className="leading-relaxed truncate">
                <span className="text-emerald-400 font-bold mr-2">›</span>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="glass-card p-4 rounded-2xl shadow-xs">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{t.analyzing.statVectors}</p>
            <p className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5">22,410</p>
          </div>
          <div className="glass-card p-4 rounded-2xl shadow-xs">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{t.analyzing.statQco}</p>
            <p className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">142 Orders</p>
          </div>
          <div className="glass-card p-4 rounded-2xl shadow-xs">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{t.analyzing.statConfidence}</p>
            <p className="text-lg font-black font-mono text-blue-600 dark:text-blue-400 mt-0.5">99.4%</p>
          </div>
          <div className="glass-card p-4 rounded-2xl shadow-xs">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{t.analyzing.statLatency}</p>
            <p className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5">38 ms</p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="glass-btn-secondary inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 transition cursor-pointer"
          >
            <span>Skip transition to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnalyzingView;
