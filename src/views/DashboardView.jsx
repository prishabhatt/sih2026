import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  GitFork, 
  FileText, 
  CheckCircle2, 
  Award, 
  Layers, 
  HardHat, 
  Sparkles, 
  QrCode,
  ArrowRight
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { ComplianceMeter } from '../components/ComplianceMeter';
import { NormativeTreeModal } from '../components/NormativeTreeModal';
import { ModelClauseModal } from '../components/ModelClauseModal';
import { DigitalPassportQR } from '../components/DigitalPassportQR';
import { StandardsTable } from '../components/StandardsTable';
import { AppleStripeBackground } from '../components/AppleStripeBackground';

export function DashboardView() {
  const navigate = useNavigate();
  const { 
    t, 
    recommendedStandards, 
    selectedStandardIds, 
    toggleStandardSelection,
    openNormativeModalFor,
    setIsModelClauseModalOpen,
    selectedNormativeTests,
    toggleNormativeTest,
    orgProfile
  } = useProcurement();

  const [showQrCard, setShowQrCard] = useState(false);

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-6 transition-colors duration-500 relative font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Living Aurora Background */}
      <AppleStripeBackground />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill-container text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold shadow-xs mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Output Matrix & Recommendation Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.dashboard.title}{' '}
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-sky-300">
                Matrix
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">
              Procuring Entity: <strong className="text-slate-900 dark:text-white font-bold">{orgProfile.businessName}</strong> ({orgProfile.orgType})
            </p>

            {/* Inline Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              <span className="glass-pill-container px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-xs">
                <Layers className="w-3.5 h-3.5 text-blue-500" /> {selectedStandardIds.length} Applicable Standards
              </span>
              <span className="glass-pill-container px-3 py-1 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% QCO Verified
              </span>
              <span className="glass-pill-container px-3 py-1 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 shadow-xs">
                <Award className="w-3.5 h-3.5 text-indigo-500" /> Min 60% Local Content
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowQrCard(!showQrCard)}
              className="glass-btn-secondary px-4 py-2.5 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{showQrCard ? 'Hide QR Passport' : 'Digital QR Passport'}</span>
            </button>

            <button
              onClick={() => setIsModelClauseModalOpen(true)}
              className="glass-btn-primary shimmer-sweep px-4 py-2.5 rounded-full text-white text-xs font-extrabold transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{t.dashboard.btnGenerateNit}</span>
            </button>

            <button
              onClick={() => navigate('/reports')}
              className="glass-btn-secondary px-4 py-2.5 rounded-full text-slate-900 dark:text-white text-xs font-extrabold transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Award className="w-4 h-4 text-emerald-500" />
              <span>{t.dashboard.btnAuditReport}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Digital QR Passport Showcase */}
        {showQrCard && (
          <div className="animate-in fade-in slide-in-from-top-3 duration-200">
            <DigitalPassportQR isDarkTheme={false} />
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Table Section */}
          <div className="lg:col-span-8 flex flex-col h-full space-y-4">
            <div className="mb-2 shrink-0">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-0.5">
                Recommended Primary Standards
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Expand a standard to view its scope, active reaffirmations, and normative dependencies.
              </p>
            </div>
            
            <div className="flex-1">
              <StandardsTable 
                standards={recommendedStandards}
                selectedStandardIds={selectedStandardIds}
                onToggleStandard={toggleStandardSelection}
                onExploreNormative={openNormativeModalFor}
                t={t}
              />
            </div>
          </div>

          {/* Right Sidebar Section */}
          <div className="lg:col-span-4 space-y-5 sticky top-24">
            <ComplianceMeter />

            <div className="glass-card rounded-3xl p-6 shadow-xl flex flex-col max-h-[calc(100vh-12rem)] min-h-[640px] border border-white/70 dark:border-white/10">
              <div className="flex-shrink-0 mb-4 pb-3 border-b border-slate-200/80 dark:border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Your Tender Draft
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {/* Primary Standards */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                    Primary Standards ({selectedStandardIds.length})
                  </h4>
                  {selectedStandardIds.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No standards added yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedStandardIds.map(id => {
                        const s = recommendedStandards.find(x => x.id === id);
                        if (!s) return null;
                        return (
                          <li key={id} className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-start gap-2.5 p-2 rounded-2xl glass-pill-container">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span>
                              <span className="font-bold text-slate-900 dark:text-white block font-mono">{s.code}</span>
                              <span className="block text-[10px] text-slate-500 truncate">{s.title}</span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Mandatory Associated Tests */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                    Mandatory Associated Tests
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'IS_7098_P2', test: 'IS 8130 : 2013', label: 'Conductor DC Resistance' },
                      { id: 'IS_7098_P2', test: 'IS 10810 (Part 58) : 1998', label: 'Oxygen Index Test' },
                      { id: 'IS_1786', test: 'IS 1608 (Part 1) : 2018', label: 'Tensile & Proof Stress' },
                      { id: 'IS_1786', test: 'IS 1599 : 2019', label: '180° Cold Bend Test' },
                      { id: 'IS_269', test: 'IS 4031 (Part 6) : 1988', label: 'Cement 28-Day Strength' },
                      { id: 'IS_1239_P1', test: 'IS 4736 : 1986', label: 'Galvanized Zinc Mass' },
                      { id: 'IS_16102_P1', test: 'IS 10322 (Part 5/Sec 3) : 2012', label: 'IP66 Jet Water Ingress' }
                    ].map((item, idx) => {
                      const currentSelected = selectedNormativeTests[item.id] || [];
                      const isChecked = currentSelected.includes(item.test);

                      return (
                        <label
                          key={idx}
                          onClick={() => toggleNormativeTest(item.id, item.test)}
                          className={`p-2.5 rounded-2xl text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                            isChecked
                              ? 'glass-pill-active border-emerald-500/50 dark:border-emerald-500/40 text-slate-900 dark:text-white shadow-xs'
                              : 'glass-card hover:bg-white/40 dark:hover:bg-white/10'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-0 w-3.5 h-3.5 shrink-0"
                          />
                          <div>
                            <span className="font-mono font-bold text-slate-900 dark:text-slate-200 block text-[10px]">
                              {item.test}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block mt-0.5">
                              {item.label}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 pt-4 mt-2 border-t border-slate-200/80 dark:border-white/10">
                <button
                  onClick={() => setIsModelClauseModalOpen(true)}
                  className="glass-btn-primary shimmer-sweep w-full py-3.5 rounded-full text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Preview Model NIT Clause</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <NormativeTreeModal />
        <ModelClauseModal />
      </div>
    </div>
  );
}

export default DashboardView;
