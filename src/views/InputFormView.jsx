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
  ShieldCheck
} from 'lucide-react';
import { BIS_DIVISIONS } from '../data/divisionsData';
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
    t
  } = useProcurement();

  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type || 'application/octet-stream',
        extractedItems: 16
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
        extractedItems: 16
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

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill-container text-slate-800 dark:text-slate-200 text-xs font-bold font-mono shadow-xs mb-2">
              <span className="w-2 h-2 rounded-full bg-[#292524] dark:bg-[#A8A29E] animate-pulse" />
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

          <button
            type="button"
            onClick={() => loadScenario('underground_cable_metro')}
            className="glass-btn-secondary inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-amber-600 dark:text-amber-300 shadow-xs cursor-pointer transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{t.input.btnQuickScenario}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: GeM Profile */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-lg space-y-5 border border-white/70 dark:border-white/10">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80 dark:border-white/10">
              <div className="w-9 h-9 rounded-xl bg-[#292524]/10 dark:bg-[#292524]/25 flex items-center justify-center text-[#292524] dark:text-[#A8A29E] font-bold shadow-xs">
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
                  className="w-full px-4 py-2.5 rounded-2xl glass-pill-container focus:ring-2 focus:ring-[#292524] focus:outline-none text-slate-900 dark:text-white text-xs font-semibold transition"
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
                  className="w-full px-4 py-2.5 rounded-2xl glass-pill-container focus:ring-2 focus:ring-[#292524] focus:outline-none text-slate-900 dark:text-white text-xs font-semibold transition"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 text-[10px]">
                  {t.input.orgType} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={orgProfile.orgType}
                  onChange={(e) => handleInputChange('orgType', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl glass-pill-container focus:ring-2 focus:ring-[#292524] focus:outline-none text-slate-900 dark:text-white text-xs font-semibold transition"
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
                  className="w-full px-4 py-2.5 rounded-2xl glass-pill-container font-mono font-bold text-[#292524] dark:text-[#A8A29E] focus:ring-2 focus:ring-[#292524] focus:outline-none text-xs transition"
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
                  className="w-full px-4 py-2.5 rounded-2xl glass-pill-container focus:ring-2 focus:ring-[#292524] focus:outline-none text-slate-900 dark:text-white text-xs font-mono font-medium transition"
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
                  className="w-full px-4 py-2.5 rounded-2xl glass-pill-container focus:ring-2 focus:ring-[#292524] focus:outline-none text-slate-900 dark:text-white text-xs font-mono font-bold transition"
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
                  className="w-full px-4 py-2.5 rounded-2xl glass-pill-container focus:ring-2 focus:ring-[#292524] focus:outline-none text-slate-900 dark:text-white text-xs font-semibold transition"
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
                  className="w-full px-4 py-2.5 rounded-2xl glass-pill-container focus:ring-2 focus:ring-[#292524] focus:outline-none text-slate-900 dark:text-white text-xs font-semibold transition"
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
                  className="w-full px-4 py-2.5 rounded-2xl glass-pill-container font-mono font-bold focus:ring-2 focus:ring-[#292524] focus:outline-none text-slate-900 dark:text-white text-xs transition"
                />
              </div>
            </div>
          </div>

          {/* Section 2: BIS Division Selection */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-lg space-y-4 border border-white/70 dark:border-white/10">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80 dark:border-white/10">
              <div className="w-9 h-9 rounded-xl bg-[#292524]/10 dark:bg-[#292524]/25 flex items-center justify-center text-[#292524] dark:text-[#A8A29E] font-bold shadow-xs">
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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {BIS_DIVISIONS.map((div) => {
                const isSelected = selectedDivision === div.code;
                return (
                  <button
                    key={div.code}
                    type="button"
                    onClick={() => setSelectedDivision(div.code)}
                    className={`p-4 rounded-2xl text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'glass-pill-active border-[#292524]/80 dark:border-[#A8A29E]/80 shadow-md ring-2 ring-[#292524]/20'
                        : 'glass-card hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#292524] text-white' : 'glass-pill-container text-slate-700 dark:text-slate-300'
                        }`}>
                          {div.code}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#292524] dark:text-[#A8A29E]" />}
                      </div>
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                        {div.shortName}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-white/10 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
                      <span>{div.standardsCount} Stds</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{div.activeQCOs} QCOs</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Natural Language Query */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-lg space-y-4 border border-white/70 dark:border-white/10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#292524]/10 dark:bg-[#292524]/25 flex items-center justify-center text-[#292524] dark:text-[#A8A29E] font-bold shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  {t.input.naturalQueryTitle}
                </h2>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {naturalQuery.length} chars
              </span>
            </div>

            <textarea
              rows={4}
              required
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              placeholder={t.input.naturalQueryPlaceholder}
              className="w-full p-4 rounded-2xl glass-pill-container text-slate-900 dark:text-white text-xs leading-relaxed focus:ring-2 focus:ring-[#292524] focus:outline-none transition shadow-inner font-medium"
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
                    className="px-3 py-1 rounded-full glass-btn-secondary text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold transition cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Document Upload Zone */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-lg space-y-4 border border-white/70 dark:border-white/10">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80 dark:border-white/10">
              <div className="w-9 h-9 rounded-xl bg-[#292524]/10 dark:bg-[#292524]/25 flex items-center justify-center text-[#292524] dark:text-[#A8A29E] font-bold shadow-xs">
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
                  ? 'border-[#292524] bg-[#292524]/5 dark:bg-[#292524]/15'
                  : 'border-slate-300 dark:border-white/15 bg-white/40 dark:bg-[#070B14]/40 hover:bg-white/60'
              }`}
            >
              <div className="max-w-md mx-auto space-y-3">
                <UploadCloud className="w-9 h-9 text-[#292524] dark:text-[#A8A29E] mx-auto" />
                <div>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {t.input.dropzoneTitle}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.input.dropzoneSubtitle}
                  </p>
                </div>

                <div className="pt-2">
                  <label className="glass-btn-secondary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-slate-800 dark:text-white cursor-pointer transition shadow-xs">
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
              <div className="p-4 rounded-2xl glass-card flex items-center justify-between border border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{uploadedFile.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {uploadedFile.size} • {uploadedFile.extractedItems} line items parsed
                    </p>
                  </div>
                </div>
                <Badge variant="qco" size="sm">Ready for Analysis</Badge>
              </div>
            )}
          </div>

          {/* Section 5: Statutory Compliance Checkboxes */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-lg space-y-5 border border-white/70 dark:border-white/10">
            <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              {t.input.sectionDisclaimersTitle}
            </h2>

            <div className="space-y-3.5 text-xs">
              <label className="flex items-start gap-3 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
                <input
                  type="checkbox"
                  checked={disclaimers.gfr}
                  onChange={() => handleDisclaimerToggle('gfr')}
                  className="mt-0.5 rounded border-slate-300 text-[#292524] focus:ring-[#292524] w-4 h-4"
                />
                <span className="text-xs leading-relaxed font-medium">{t.input.disclaimerGfr}</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
                <input
                  type="checkbox"
                  checked={disclaimers.bisAct}
                  onChange={() => handleDisclaimerToggle('bisAct')}
                  className="mt-0.5 rounded border-slate-300 text-[#292524] focus:ring-[#292524] w-4 h-4"
                />
                <span className="text-xs leading-relaxed font-medium">{t.input.disclaimerBis}</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
                <input
                  type="checkbox"
                  checked={disclaimers.audit}
                  onChange={() => handleDisclaimerToggle('audit')}
                  className="mt-0.5 rounded border-slate-300 text-[#292524] focus:ring-[#292524] w-4 h-4"
                />
                <span className="text-xs leading-relaxed font-medium">{t.input.disclaimerAudit}</span>
              </label>
            </div>

            <div className="pt-5 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">GeM Regulatory Gate Active • GFR 2017 Certified</span>
              </div>

              <button
                type="submit"
                className="glass-btn-primary shimmer-sweep w-full sm:w-auto px-8 py-3.5 rounded-full text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <span>{t.input.btnAnalyze}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputFormView;
