import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Layers, 
  UploadCloud, 
  FileSpreadsheet, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  ChevronDown,
  Check
} from 'lucide-react';
import { BIS_DIVISIONS } from '../data/divisionsData';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';
import { useProcurement } from '../context/ProcurementContext';
import { Badge } from '../components/Badge';
import { AppleStripeBackground } from '../components/AppleStripeBackground';

export function InputFormView() {
  const navigate = useNavigate();
  const { 
    orgProfile, 
    setOrgProfile, 
    selectedDivision, 
    setSelectedDivision, 
    naturalQuery, 
    setNaturalQuery,
    uploadedFile,
    setUploadedFile,
    disclaimers,
    setDisclaimers,
    loadScenario,
    setIsSampleDrawerOpen,
    t
  } = useProcurement();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadedToast, setLoadedToast] = useState(null);

  const handleInputChange = (field, value) => {
    setOrgProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleDisclaimerToggle = (key) => {
    setDisclaimers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTagClick = (tag) => {
    if (!naturalQuery.includes(tag)) {
      setNaturalQuery((prev) => (prev ? `${prev} [Key Parameter: ${tag}]` : tag));
    }
  };

  const handleLoadDemo = (scenarioId = 'underground_cable_metro') => {
    loadScenario(scenarioId);
    setDisclaimers({ gfr: true, bisAct: true, audit: true });
    const s = SAMPLE_SCENARIOS.find((x) => x.id === scenarioId) || SAMPLE_SCENARIOS[0];
    setLoadedToast(`Loaded: ${s.title} (${s.division})`);
    setIsDropdownOpen(false);
    setTimeout(() => setLoadedToast(null), 4000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type || 'application/octet-stream',
        extractedItems: null,
        rawFile: file
      });
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type || 'application/octet-stream',
        extractedItems: null,
        rawFile: file
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!disclaimers.gfr || !disclaimers.bisAct) {
      alert('Please accept mandatory statutory disclaimers (GFR 2017 & BIS Act 2016) to proceed.');
      return;
    }
    navigate('/analyzing');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#090A0F] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-500 relative font-sans selection:bg-[#292524] selection:text-white">
      
      {/* Living Aurora Background */}
      <AppleStripeBackground />

      {/* Floating Demo Loaded Glass Notification Toast */}
      {loadedToast && (
        <div className="fixed top-24 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white/85 dark:bg-[#0E1529]/85 backdrop-blur-2xl border border-white dark:border-white/20 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-extrabold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                Demo Tender Scenario Applied
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{loadedToast}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white dark:border-white/20 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-xs mb-2">
              <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white animate-pulse" />
              <span>Step 1 of 4 : Specification Configuration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.input.pageTitle}{' '}
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#1C1917] via-[#292524] to-[#44403C] dark:from-[#A8A29E] dark:via-[#D6D3D1] dark:to-[#A8A29E]">
                Setup
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">
              {t.input.pageSubtitle}
            </p>
          </div>

          {/* Fully Working Glassmorphic Demo Scenario Button & Dropdown */}
          <div className="relative self-start sm:self-auto">
            <div className="inline-flex items-center rounded-full p-0.5 bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 backdrop-blur-2xl border border-white dark:border-white/25 shadow-[0_4px_20px_rgba(245,158,11,0.18)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.3)] transition-all">
              <button
                type="button"
                onClick={() => handleLoadDemo('underground_cable_metro')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold text-amber-700 dark:text-amber-300 bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>Load Demo Tender Scenario</span>
              </button>
              
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-2.5 py-2 rounded-full text-amber-700 dark:text-amber-300 hover:bg-white/90 dark:hover:bg-white/20 transition-all cursor-pointer border-l border-white/60 dark:border-white/20"
                title="Browse all demo scenarios"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Glassmorphic Dropdown Popover */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white/90 dark:bg-[#0E1529]/90 backdrop-blur-2xl border border-white dark:border-white/20 shadow-2xl p-3 z-50 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-white/60 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Select Procurement Demo</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">{SAMPLE_SCENARIOS.length} Scenarios</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
                    {SAMPLE_SCENARIOS.map((sc) => (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => handleLoadDemo(sc.id)}
                        className="w-full text-left p-2.5 rounded-2xl bg-white/60 dark:bg-white/[0.04] hover:bg-amber-500/15 dark:hover:bg-white/10 border border-white/90 dark:border-white/10 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                            {sc.division}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 flex items-center gap-1">
                            Load <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-amber-600 dark:group-hover:text-amber-300">
                          {sc.title}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {sc.businessName}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: GeM Profile */}
          <div className="bg-white/60 dark:bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 border border-white dark:border-white/20">
            <div className="flex items-center gap-3 pb-4 border-b border-white/60 dark:border-white/10">
              <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-white/10 backdrop-blur-md border border-white dark:border-white/20 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold shadow-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  {t.input.sectionOrgTitle}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.input.sectionOrgSubtitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 text-[10px]">
                  {t.input.applicantName} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orgProfile.applicantName}
                  onChange={(e) => handleInputChange('applicantName', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-black/30 backdrop-blur-md border border-white dark:border-white/20 focus:ring-2 focus:ring-slate-800 dark:focus:ring-white/30 focus:outline-none text-slate-900 dark:text-white text-xs font-semibold transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 text-[10px]">
                  {t.input.businessName} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orgProfile.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-black/30 backdrop-blur-md border border-white dark:border-white/20 focus:ring-2 focus:ring-slate-800 dark:focus:ring-white/30 focus:outline-none text-slate-900 dark:text-white text-xs font-semibold transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 text-[10px]">
                  {t.input.orgType} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={orgProfile.orgType}
                  onChange={(e) => handleInputChange('orgType', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-black/30 backdrop-blur-md border border-white dark:border-white/20 focus:ring-2 focus:ring-slate-800 dark:focus:ring-white/30 focus:outline-none text-slate-900 dark:text-white text-xs font-semibold transition shadow-2xs"
                >
                  <option value="Public Sector Undertaking (PSU)" className="dark:bg-[#090A0F]">Public Sector Undertaking (PSU)</option>
                  <option value="Central Ministry / Department" className="dark:bg-[#090A0F]">Central Ministry / Department</option>
                  <option value="State Government Dept" className="dark:bg-[#090A0F]">State Government Department</option>
                  <option value="MSME Registered Enterprise" className="dark:bg-[#090A0F]">MSME Registered Enterprise</option>
                  <option value="Autonomous Govt Body" className="dark:bg-[#090A0F]">Autonomous Govt Body</option>
                  <option value="Private Limited Company" className="dark:bg-[#090A0F]">Private Limited Company</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 text-[10px]">
                  {t.input.gstin} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orgProfile.gstin}
                  onChange={(e) => handleInputChange('gstin', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-black/30 backdrop-blur-md border border-white dark:border-white/20 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-800 dark:focus:ring-white/30 focus:outline-none text-xs transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 text-[10px]">
                  {t.input.emailId} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={orgProfile.emailId}
                  onChange={(e) => handleInputChange('emailId', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-black/30 backdrop-blur-md border border-white dark:border-white/20 focus:ring-2 focus:ring-slate-800 dark:focus:ring-white/30 focus:outline-none text-slate-900 dark:text-white text-xs font-medium transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 text-[10px]">
                  {t.input.mobileNumber} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orgProfile.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-black/30 backdrop-blur-md border border-white dark:border-white/20 focus:ring-2 focus:ring-slate-800 dark:focus:ring-white/30 focus:outline-none text-slate-900 dark:text-white text-xs font-bold transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 text-[10px]">
                  {t.input.state}
                </label>
                <input
                  type="text"
                  value={orgProfile.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-black/30 backdrop-blur-md border border-white dark:border-white/20 focus:ring-2 focus:ring-slate-800 dark:focus:ring-white/30 focus:outline-none text-slate-900 dark:text-white text-xs font-semibold transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 text-[10px]">
                  {t.input.district}
                </label>
                <input
                  type="text"
                  value={orgProfile.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-black/30 backdrop-blur-md border border-white dark:border-white/20 focus:ring-2 focus:ring-slate-800 dark:focus:ring-white/30 focus:outline-none text-slate-900 dark:text-white text-xs font-semibold transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 text-[10px]">
                  {t.input.pincode}
                </label>
                <input
                  type="text"
                  value={orgProfile.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-black/30 backdrop-blur-md border border-white dark:border-white/20 font-bold focus:ring-2 focus:ring-slate-800 dark:focus:ring-white/30 focus:outline-none text-slate-900 dark:text-white text-xs transition shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: BIS Division Selection */}
          <div className="bg-white/60 dark:bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border border-white dark:border-white/20">
            <div className="flex items-center gap-3 pb-4 border-b border-white/60 dark:border-white/10">
              <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-white/10 backdrop-blur-md border border-white dark:border-white/20 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  {t.input.sectionTechTitle}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.input.sectionTechSubtitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-2.5 overflow-x-auto pb-1">
              {BIS_DIVISIONS.map((div) => {
                const isSelected = selectedDivision === div.code;
                return (
                  <button
                    key={div.code}
                    type="button"
                    onClick={() => setSelectedDivision(div.code)}
                    className={`p-2.5 sm:p-3 rounded-2xl text-left transition-all flex flex-col justify-between cursor-pointer backdrop-blur-md min-w-[100px] ${
                      isSelected
                        ? 'bg-white/95 dark:bg-white/20 border-2 border-white shadow-md ring-2 ring-slate-900/10'
                        : 'bg-white/50 dark:bg-white/[0.02] border border-white/90 dark:border-white/15 hover:bg-white/70 dark:hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'bg-white/80 dark:bg-white/10 border border-white/60 text-slate-700 dark:text-slate-300'
                        }`}>
                          {div.code}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-900 dark:text-white" />}
                      </div>
                      <p className="text-[11px] sm:text-xs font-extrabold text-slate-900 dark:text-white leading-tight truncate" title={div.shortName}>
                        {div.shortName}
                      </p>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-white/60 dark:border-white/10 text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span>{div.standardsCount} Stds</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{div.activeQCOs} QCOs</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Natural Language Query */}
          <div className="bg-white/60 dark:bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border border-white dark:border-white/20">
            <div className="flex items-center justify-between pb-4 border-b border-white/60 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-white/10 backdrop-blur-md border border-white dark:border-white/20 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  {t.input.naturalQueryTitle}
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">
                {naturalQuery.length} chars
              </span>
            </div>

            <textarea
              rows={4}
              required
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              placeholder={t.input.naturalQueryPlaceholder}
              className="w-full p-4 rounded-2xl bg-white/70 dark:bg-black/30 backdrop-blur-md border border-white dark:border-white/20 text-slate-900 dark:text-white text-xs leading-relaxed focus:ring-2 focus:ring-slate-800 dark:focus:ring-white/30 focus:outline-none transition shadow-inner font-medium"
            />

            <div>
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t.input.quickTagsLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  '11kV XLPE',
                  'Fe 500D Rebar',
                  '53 Grade OPC',
                  'Heavy Class MS ERW',
                  'FRLS Sheath',
                  '415V 3-Phase',
                  'IP66 Luminaire',
                  '10kV Surge SPD',
                  'PE 100 HDPE',
                  'ISI Scheme-I',
                  'BEE 5-Star'
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md hover:bg-white dark:hover:bg-white/20 border border-white dark:border-white/20 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer shadow-2xs"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Document Upload Zone */}
          <div className="bg-white/60 dark:bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border border-white dark:border-white/20">
            <div className="flex items-center gap-3 pb-4 border-b border-white/60 dark:border-white/10">
              <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-white/10 backdrop-blur-md border border-white dark:border-white/20 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold shadow-xs">
                <UploadCloud className="w-4 h-4" />
              </div>
              <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                {t.input.sectionUploadTitle}
              </h2>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                isDragOver
                  ? 'border-white bg-white/40 dark:bg-white/15'
                  : 'border-white dark:border-white/30 bg-white/40 dark:bg-white/[0.02] backdrop-blur-md hover:bg-white/60'
              }`}
            >
              <div className="max-w-md mx-auto space-y-3">
                <UploadCloud className="w-9 h-9 text-slate-700 dark:text-slate-300 mx-auto" />
                <div>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {t.input.dropzoneTitle}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.input.dropzoneSubtitle}
                  </p>
                </div>

                <div className="pt-2">
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-white/80 dark:bg-white/10 backdrop-blur-md border border-white dark:border-white/20 text-slate-800 dark:text-white hover:bg-white dark:hover:bg-white/20 cursor-pointer transition shadow-xs">
                    <span>{t.input.browseFiles}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".xlsx,.csv,.pdf,.docx"
                    />
                  </label>
                </div>
              </div>
            </div>

            {uploadedFile && (
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-black/30 backdrop-blur-md flex items-center justify-between border border-emerald-500/30 shadow-xs">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{uploadedFile.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {uploadedFile.size} • {uploadedFile.extractedItems ? `${uploadedFile.extractedItems} line items parsed` : 'Uploaded & Ready for AI Audit'}
                    </p>
                  </div>
                </div>
                <Badge variant="qco" size="sm">Ready for Analysis</Badge>
              </div>
            )}
          </div>

          {/* Section 5: Statutory Compliance Checkboxes */}
          <div className="bg-white/60 dark:bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 border border-white dark:border-white/20">
            <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              {t.input.sectionDisclaimersTitle}
            </h2>

            <div className="space-y-3.5 text-xs">
              <label className="flex items-start gap-3 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
                <input
                  type="checkbox"
                  checked={disclaimers.gfr}
                  onChange={() => handleDisclaimerToggle('gfr')}
                  className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                />
                <span className="text-xs leading-relaxed font-medium">{t.input.disclaimerGfr}</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
                <input
                  type="checkbox"
                  checked={disclaimers.bisAct}
                  onChange={() => handleDisclaimerToggle('bisAct')}
                  className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                />
                <span className="text-xs leading-relaxed font-medium">{t.input.disclaimerBis}</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
                <input
                  type="checkbox"
                  checked={disclaimers.audit}
                  onChange={() => handleDisclaimerToggle('audit')}
                  className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                />
                <span className="text-xs leading-relaxed font-medium">{t.input.disclaimerAudit}</span>
              </label>
            </div>

            <div className="pt-5 border-t border-white/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">GeM Regulatory Gate Active • GFR 2017 Certified</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0B1E36]/80 hover:bg-[#0B1E36]/90 dark:bg-white/15 dark:hover:bg-white/25 backdrop-blur-2xl border border-white/60 dark:border-white/40 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:shadow-2xl cursor-pointer hover:scale-[1.01]"
              >
                <span>{t.input.btnAnalyze}</span>
                <ArrowRight className="w-4 h-4 text-amber-400 dark:text-white" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputFormView;
