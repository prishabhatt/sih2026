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
import { Badge } from '../components/Badge';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('ALL');
  const [qcoOnlyFilter, setQcoOnlyFilter] = useState(false);
  const [schemeFilter, setSchemeFilter] = useState('ALL');
  const [showQrCard, setShowQrCard] = useState(false);

  const filteredStandards = recommendedStandards.filter((std) => {
    if (divisionFilter !== 'ALL' && std.division !== divisionFilter) return false;
    if (qcoOnlyFilter && !std.qcoMandatory) return false;
    if (schemeFilter === 'SCHEME_1' && !std.certificationScheme.includes('Scheme-I')) return false;
    if (schemeFilter === 'SCHEME_2' && !std.certificationScheme.includes('Scheme-II')) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchCode = std.code.toLowerCase().includes(q);
      const matchTitle = std.title.toLowerCase().includes(q);
      const matchScope = std.scope.toLowerCase().includes(q);
      const matchCategory = std.category.toLowerCase().includes(q);
      return matchCode || matchTitle || matchScope || matchCategory;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
              AI Output Matrix & Recommendation Engine
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-2">
              {t.dashboard.title}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Procuring Entity: <strong className="text-slate-200">{orgProfile.businessName}</strong> ({orgProfile.orgType})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowQrCard(!showQrCard)}
              className="px-3.5 py-2 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition shadow-sm flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
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
              className="px-3.5 py-2 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.dashboard.btnAuditReport}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Digital QR Passport Showcase (if toggled or on load) */}
        {showQrCard && (
          <div className="animate-in fade-in slide-in-from-top-3 duration-200">
            <DigitalPassportQR isDarkTheme={true} />
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {t.dashboard.statActiveTenders}
              </span>
              <Layers className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <p className="text-xl font-bold font-mono text-slate-100">
              {selectedStandardIds.length} <span className="text-xs text-slate-500 font-normal">/ {recommendedStandards.length} In Scope</span>
            </p>
            <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> High Semantic Precision
            </p>
          </div>

          <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {t.dashboard.statQcoMandatory}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xl font-bold font-mono text-emerald-400">
              100% Verified
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Enforced under BIS Act 2016
            </p>
          </div>

          <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {t.dashboard.statAmendments}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-xl font-bold font-mono text-slate-100">
              Amdt 2021-23
            </p>
            <p className="text-[11px] text-amber-400 font-medium mt-1">
              Zero Superseded Standards
            </p>
          </div>

          <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {t.dashboard.statMakeInIndia}
              </span>
              <Award className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <p className="text-xl font-bold font-mono text-slate-100">
              60% Class-I
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              PPP-MII Order 2017 Compliant
            </p>
          </div>
        </div>

        {/* Main Content Layout: Left Table (8 cols), Right Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Table Section */}
          <div className="lg:col-span-8 space-y-4">
            {/* Search & Filter Toolbar */}
            <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.dashboard.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-800 bg-[#131C2E] text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={divisionFilter}
                  onChange={(e) => setDivisionFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-[#131C2E] text-slate-300 text-xs"
                >
                  <option value="ALL">All Divisions</option>
                  <option value="ETD">Electrotechnical (ETD)</option>
                  <option value="CED">Civil (CED)</option>
                  <option value="MTD">Mechanical/Met (MTD)</option>
                  <option value="LITD">Electronics/IT (LITD)</option>
                  <option value="CHD">Chemical (CHD)</option>
                </select>

                <button
                  type="button"
                  onClick={() => setQcoOnlyFilter(!qcoOnlyFilter)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
                    qcoOnlyFilter
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-[#131C2E] text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>QCO Only</span>
                </button>
              </div>
            </div>

            {/* Standards Table */}
            <div className="bg-[#0F172A] rounded-xl border border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                    {t.dashboard.tableTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {filteredStandards.length} standards resolved via semantic vector ranking
                  </p>
                </div>

                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedStandardIds.length} in Tender Clause
                </span>
              </div>

              <div className="divide-y divide-slate-800/80">
                {filteredStandards.map((std) => {
                  const isSelected = selectedStandardIds.includes(std.id);

                  return (
                    <div
                      key={std.id}
                      className={`p-4 transition-all ${
                        isSelected ? 'bg-[#131C2E]/60' : 'hover:bg-[#131C2E]/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleStandardSelection(std.id)}
                            className="mt-1 w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                          />

                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-bold text-xs text-slate-100">
                                {std.code}
                              </span>
                              <Badge variant="qco" size="sm">
                                {std.qcoMandatory ? 'Mandatory QCO' : 'Voluntary BIS'}
                              </Badge>
                              <Badge variant="scheme1" size="sm">
                                {std.certificationScheme}
                              </Badge>
                              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                                {std.confidenceScore}% Match
                              </span>
                            </div>

                            <h4 className="text-xs font-semibold text-slate-200 leading-snug">
                              {std.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                              {std.scope}
                            </p>

                            <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-slate-500 pt-0.5">
                              <span className="text-amber-400 font-mono">
                                {std.latestAmendment}
                              </span>
                              <span>•</span>
                              <span>
                                Enforcing: <strong className="text-slate-400">{std.ministryEnforcing}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <button
                            onClick={() => openNormativeModalFor(std)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#131C2E] hover:bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-800 transition"
                          >
                            <GitFork className="w-3 h-3 text-blue-400" />
                            <span>{t.dashboard.btnViewNormative}</span>
                          </button>

                          <button
                            onClick={() => toggleStandardSelection(std.id)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                            }`}
                          >
                            {isSelected ? '✓ In Tender' : '+ Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar Section */}
          <div className="lg:col-span-4 space-y-5">
            <ComplianceMeter />

            <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-4 shadow-sm space-y-3">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <HardHat className="w-3.5 h-3.5 text-emerald-400" />
                  {t.dashboard.normativeSidebarTitle}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t.dashboard.normativeSidebarDesc}
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'IS_7098_P2', test: 'IS 8130 : 2013', label: 'Conductor DC Resistance at 20°C (Kelvin Bridge)' },
                  { id: 'IS_7098_P2', test: 'IS 10810 (Part 58) : 1998', label: 'Oxygen Index Test (FRLS >= 29%)' },
                  { id: 'IS_1786', test: 'IS 1608 (Part 1) : 2018', label: 'Tensile & 0.2% Proof Stress Test' },
                  { id: 'IS_1786', test: 'IS 1599 : 2019', label: '180° Cold Bend Test without Fracture' },
                  { id: 'IS_269', test: 'IS 4031 (Part 6) : 1988', label: 'Cement 28-Day Compressive Strength' },
                  { id: 'IS_1239_P1', test: 'IS 4736 : 1986', label: 'Galvanized Zinc Mass (>= 400 g/m²)' },
                  { id: 'IS_16102_P1', test: 'IS 10322 (Part 5/Sec 3) : 2012', label: 'IP66 Jet Water Ingress Test' }
                ].map((item, idx) => {
                  const currentSelected = selectedNormativeTests[item.id] || [];
                  const isChecked = currentSelected.includes(item.test);

                  return (
                    <label
                      key={idx}
                      onClick={() => toggleNormativeTest(item.id, item.test)}
                      className={`p-2 rounded-lg border text-xs flex items-start gap-2 cursor-pointer transition ${
                        isChecked
                          ? 'bg-[#131C2E] border-emerald-500/40 text-slate-100'
                          : 'bg-[#090D16] border-slate-800 text-slate-400 hover:bg-[#131C2E]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 w-3 h-3"
                      />
                      <div>
                        <span className="font-mono font-bold text-slate-200 block text-[10px]">
                          {item.test}
                        </span>
                        <span className="text-[10px] text-slate-400 leading-tight">
                          {item.label}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsModelClauseModalOpen(true)}
                  className="w-full py-2 rounded-lg bg-[#131C2E] hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
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
