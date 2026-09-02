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
  QrCode
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { ComplianceMeter } from '../components/ComplianceMeter';
import { NormativeTreeModal } from '../components/NormativeTreeModal';
import { ModelClauseModal } from '../components/ModelClauseModal';
import { DigitalPassportQR } from '../components/DigitalPassportQR';
import { StandardsTable } from '../components/StandardsTable';

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-0.5 rounded">
              AI Output Matrix & Recommendation Engine
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-2">
              {t.dashboard.title}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Procuring Entity: <strong className="text-slate-900 dark:text-slate-200">{orgProfile.businessName}</strong> ({orgProfile.orgType})
            </p>

            {/* Inline Badges (Replaced Top Metrics) */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md text-[11px] font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> {selectedStandardIds.length} Applicable Standards
              </span>
              <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-md text-[11px] font-medium border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% QCO Verified
              </span>
              <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-md text-[11px] font-medium border border-indigo-200 dark:border-indigo-500/20 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Min 60% Local Content
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowQrCard(!showQrCard)}
              className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{showQrCard ? 'Hide QR Passport' : 'Digital QR Passport'}</span>
            </button>

            <button
              onClick={() => setIsModelClauseModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-sm flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.dashboard.btnGenerateNit}</span>
            </button>

            <button
              onClick={() => navigate('/reports')}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.dashboard.btnAuditReport}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Digital QR Passport Showcase (if toggled) */}
        {showQrCard && (
          <div className="animate-in fade-in slide-in-from-top-3 duration-200">
            <DigitalPassportQR isDarkTheme={false} />
          </div>
        )}

        {/* Main Content Layout: Left Table (8 cols), Right Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Table Section */}
          <div className="lg:col-span-8 flex flex-col h-full space-y-4">
            <div className="mb-4 shrink-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Recommended Primary Standards
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Expand a standard to view its scope and normative requirements.
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

          {/* Right Sidebar Section (Shopping Cart Model) */}
          <div className="lg:col-span-4 space-y-5 sticky top-24">
            <ComplianceMeter />

            <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col max-h-[calc(100vh-12rem)] min-h-[700px]">
              <div className="flex-shrink-0 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Your Tender Draft
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {/* Primary Standards */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
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
                          <li key={id} className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-start gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span>
                              <span className="font-bold text-slate-900 dark:text-white">{s.code}</span>
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
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
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
                          className={`p-2 rounded-lg border text-xs flex items-start gap-2 cursor-pointer transition ${
                            isChecked
                              ? 'bg-emerald-50 dark:bg-[#131C2E] border-emerald-300 dark:border-emerald-500/40 text-slate-900 dark:text-slate-100'
                              : 'bg-slate-50 dark:bg-[#090D16] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131C2E]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="mt-0.5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-500 focus:ring-0 w-3 h-3 shrink-0"
                          />
                          <div>
                            <span className="font-mono font-bold text-slate-900 dark:text-slate-200 block text-[10px]">
                              {item.test}
                            </span>
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight block">
                              {item.label}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setIsModelClauseModalOpen(true)}
                  className="w-full py-3 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold transition flex items-center justify-center gap-2 shadow-md"
                >
                  <FileText className="w-4 h-4" />
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
