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
    <div className="min-h-screen bg-[#090D16] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded">
              Step 2 of 5 : Specification Configuration
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-2">
              {t.input.pageTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.input.pageSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadScenario('underground_cable_metro')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-amber-400 border border-slate-800 text-xs font-medium transition self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.input.btnQuickScenario}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: GeM Profile */}
          <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Building2 className="w-4 h-4 text-blue-400" />
              <div>
                <h2 className="font-semibold text-xs uppercase tracking-wider text-slate-200">
                  {t.input.sectionOrgTitle}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {t.input.sectionOrgSubtitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1 text-[11px]">
                  {t.input.applicantName} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orgProfile.applicantName}
                  onChange={(e) => handleInputChange('applicantName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-[#131C2E] focus:border-blue-500 focus:outline-none text-slate-100 text-xs transition"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1 text-[11px]">
                  {t.input.businessName} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orgProfile.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-[#131C2E] focus:border-blue-500 focus:outline-none text-slate-100 text-xs transition"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1 text-[11px]">
                  {t.input.orgType} <span className="text-rose-400">*</span>
                </label>
                <select
                  value={orgProfile.orgType}
                  onChange={(e) => handleInputChange('orgType', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-[#131C2E] focus:border-blue-500 focus:outline-none text-slate-100 text-xs transition"
                >
                  <option value="Public Sector Undertaking (PSU)">Public Sector Undertaking (PSU)</option>
                  <option value="Central Ministry / Department">Central Ministry / Department</option>
                  <option value="State Government Dept">State Government Department</option>
                  <option value="MSME Registered Enterprise">MSME Registered Enterprise</option>
                  <option value="Autonomous Govt Body">Autonomous Govt Body</option>
                  <option value="Private Limited Company">Private Limited Company</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1 text-[11px]">
                  {t.input.gstin} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orgProfile.gstin}
                  onChange={(e) => handleInputChange('gstin', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-[#131C2E] font-mono text-slate-100 text-xs transition"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1 text-[11px]">
                  {t.input.emailId} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={orgProfile.emailId}
                  onChange={(e) => handleInputChange('emailId', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-[#131C2E] text-slate-100 text-xs transition"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1 text-[11px]">
                  {t.input.mobileNumber} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orgProfile.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-[#131C2E] text-slate-100 text-xs transition"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1 text-[11px]">
                  {t.input.state}
                </label>
                <input
                  type="text"
                  value={orgProfile.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-[#131C2E] text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1 text-[11px]">
                  {t.input.district}
                </label>
                <input
                  type="text"
                  value={orgProfile.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-[#131C2E] text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1 text-[11px]">
                  {t.input.pincode}
                </label>
                <input
                  type="text"
                  value={orgProfile.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-[#131C2E] text-slate-100 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: BIS Division Selection */}
          <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Layers className="w-4 h-4 text-blue-400" />
              <div>
                <h2 className="font-semibold text-xs uppercase tracking-wider text-slate-200">
                  {t.input.sectionTechTitle}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {t.input.sectionTechSubtitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {BIS_DIVISIONS.map((div) => {
                const isSelected = selectedDivision === div.code;
                return (
                  <button
                    key={div.code}
                    type="button"
                    onClick={() => setSelectedDivision(div.code)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500/50 ring-1 ring-blue-500/30 text-slate-100'
                        : 'bg-[#131C2E] border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {div.code}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <p className="text-xs font-semibold text-slate-200 leading-tight">
                        {div.shortName}
                      </p>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>{div.standardsCount} Stds</span>
                      <span className="text-emerald-400 font-medium">{div.activeQCOs} QCOs</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Natural Language Query */}
          <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h2 className="font-semibold text-xs uppercase tracking-wider text-slate-200">
                  {t.input.naturalQueryTitle}
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {naturalQuery.length} chars
              </span>
            </div>

            <textarea
              rows={4}
              required
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              placeholder={t.input.naturalQueryPlaceholder}
              className="w-full p-3.5 rounded-xl border border-slate-800 bg-[#131C2E] text-slate-200 text-xs leading-relaxed focus:border-blue-500 focus:outline-none transition"
            />

            <div>
              <p className="text-[11px] font-medium text-slate-400 mb-1.5">
                {t.input.quickTagsLabel}
              </p>
              <div className="flex flex-wrap gap-1.5">
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
                    className="px-2 py-0.5 rounded bg-[#131C2E] hover:bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-800 transition"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Document Upload Zone */}
          <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <UploadCloud className="w-4 h-4 text-blue-400" />
              <h2 className="font-semibold text-xs uppercase tracking-wider text-slate-200">
                {t.input.sectionUploadTitle}
              </h2>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`border border-dashed rounded-xl p-6 text-center transition-all ${
                isDragOver
                  ? 'border-blue-500 bg-blue-500/5'
                  : 'border-slate-800 bg-[#131C2E]/40 hover:bg-[#131C2E]'
              }`}
            >
              <div className="max-w-md mx-auto space-y-2">
                <UploadCloud className="w-6 h-6 text-slate-500 mx-auto" />
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    {t.input.dropzoneTitle}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {t.input.dropzoneSubtitle}
                  </p>
                </div>

                <div className="pt-2">
                  <label className="px-3.5 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 cursor-pointer transition inline-block">
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
              <div className="p-3 rounded-lg bg-[#131C2E] border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-xs font-medium text-slate-200">{uploadedFile.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {uploadedFile.size} • {uploadedFile.extractedItems} line items
                    </p>
                  </div>
                </div>
                <Badge variant="qco" size="sm">Parsed</Badge>
              </div>
            )}
          </div>

          {/* Section 5: Statutory Compliance Checkboxes */}
          <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 sm:p-6 shadow-sm space-y-3">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-slate-200">
              {t.input.sectionDisclaimersTitle}
            </h2>

            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer text-slate-300 hover:text-white transition">
                <input
                  type="checkbox"
                  checked={disclaimers.gfr}
                  onChange={() => handleDisclaimerToggle('gfr')}
                  className="mt-0.5 rounded border-slate-800 text-blue-600 focus:ring-0 w-3.5 h-3.5 bg-slate-900"
                />
                <span className="text-[11px] leading-relaxed">{t.input.disclaimerGfr}</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-slate-300 hover:text-white transition">
                <input
                  type="checkbox"
                  checked={disclaimers.bisAct}
                  onChange={() => handleDisclaimerToggle('bisAct')}
                  className="mt-0.5 rounded border-slate-800 text-blue-600 focus:ring-0 w-3.5 h-3.5 bg-slate-900"
                />
                <span className="text-[11px] leading-relaxed">{t.input.disclaimerBis}</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-slate-300 hover:text-white transition">
                <input
                  type="checkbox"
                  checked={disclaimers.audit}
                  onChange={() => handleDisclaimerToggle('audit')}
                  className="mt-0.5 rounded border-slate-800 text-blue-600 focus:ring-0 w-3.5 h-3.5 bg-slate-900"
                />
                <span className="text-[11px] leading-relaxed">{t.input.disclaimerAudit}</span>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>GeM Regulatory Gate Active</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>{t.input.btnAnalyze}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
