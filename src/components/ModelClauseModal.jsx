import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  CheckCircle2,
  FileText,
  ShieldCheck,
  Award,
  Lock,
  Building2,
  Calendar,
  User,
  Scale,
  FileCode,
  Layers,
  AlertTriangle,
  QrCode,
  Hash
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { MOCK_STANDARDS } from '../data/mockStandardsData';
import { downloadModelNITClausePDF } from '../utils/pdfGenerator';

export function ModelClauseModal() {
  const { 
    isModelClauseModalOpen, 
    setIsModelClauseModalOpen, 
    selectedStandardIds,
    recommendedStandards = [],
    orgProfile = {},
    analysisTimestamp,
    certificateId
  } = useProcurement();

  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('draft'); // 'draft' | 'raw'

  const selectedStds = useMemo(() => {
    const pool = [...recommendedStandards, ...MOCK_STANDARDS];
    const map = new Map();
    pool.forEach(s => {
      if (!map.has(s.id)) map.set(s.id, s);
    });
    const found = selectedStandardIds
      .map(id => map.get(id))
      .filter(Boolean);
    return found.length > 0 ? found : pool.slice(0, 3);
  }, [recommendedStandards, selectedStandardIds]);

  if (!isModelClauseModalOpen) return null;
  if (typeof document === 'undefined' || !document.body) return null;

  const generatedClauseText = `================================================================================
GOVERNMENT OF INDIA / PUBLIC SECTOR ENTERPRISE TENDER CLAUSE
MODEL NOTICE INVITING TENDER (NIT) TECHNICAL SPECIFICATIONS
Compliant with GFR 2017 Rule 144(xi), Public Procurement Order 2017 & BIS Act 2016
================================================================================

TENDER SPECIFICATION REFERENCE: ${certificateId || 'CERT-IS-GOV-2026-98442'}
PROCURING ENTITY: ${orgProfile?.businessName || 'National Metro Rail Corporation Ltd'} (${orgProfile?.orgType || 'Public Sector Undertaking (PSU)'})
OFFICER IN CHARGE: ${orgProfile?.applicantName || 'Er. Vikramaditya Sharma'}
TIMESTAMP OF CLAUSE GENERATION: ${analysisTimestamp || new Date().toISOString()}

--------------------------------------------------------------------------------
1.0 MANDATORY APPLICABLE INDIAN STANDARDS & REGULATORY COMPLIANCE:
--------------------------------------------------------------------------------
All materials, equipment, and structural components supplied under this tender schedule
shall strictly adhere to the Bureau of Indian Standards (BIS) specifications listed below,
incorporating all latest amendments, revisions, and reaffirmations as on the date of bid submission.

${selectedStds.map((s, idx) => `
[${idx + 1}] ${s.code} - ${s.title}
    * Division / Committee: ${s.divisionName || 'Electrotechnical (ETD)'}
    * Statutory Certification Scheme: ${s.certificationScheme || 'Scheme-I (ISI Mark)'}
    * Statutory QCO Mandate: ${s.qcoMandatory ? 'MANDATORY UNDER ' + (s.qcoGazetteOrder || 'Ministry Gazette Order') : 'Voluntary Compliance'}
    * Enforcing Ministry: ${s.ministryEnforcing || 'Ministry of Consumer Affairs'}
    * Minimum Local Content (PPP-MII): ${s.makeInIndiaLocalContentMin || '60%'}
    
    Technical Details:
${s.modelNitClause || `All products supplied under this schedule must conform to ${s.code}. Factory Test Certificates shall accompany each consignment.`}
`).join('\n--------------------------------------------------------------------------------\n')}

--------------------------------------------------------------------------------
2.0 MANDATORY BIDDER QUALIFICATION & CERTIFICATION SUBMISSION:
--------------------------------------------------------------------------------
2.1 VALID BIS LICENSE / REGISTRATION MANDATE:
    The bidder (or authorized OEM) must possess a valid Bureau of Indian Standards
    (BIS) Certification Mark (ISI Mark) License or Compulsory Registration Scheme (CRS)
    Registration Certificate for each of the specified Indian Standards listed in Section 1.0.
    Bids with expired, revoked, or non-authentic BIS licenses shall be summarily rejected
    at the Technical Bid Opening stage without seeking further clarification.

2.2 PROOF OF COMPLIANCE:
    Bidders must upload legible, self-attested copies of the valid BIS License / CML Number
    endorsed with validity dates and exact factory manufacturing address matching the GeM profile.

--------------------------------------------------------------------------------
3.0 RAW MATERIAL TESTS & THIRD-PARTY INSPECTION (TPIA):
--------------------------------------------------------------------------------
3.1 Factory Acceptance Testing (FAT) shall be conducted strictly as per the normative test methods
    stipulated in the applicable Indian Standards.
3.2 Pre-dispatch inspection must be carried out by an independent, NABL-accredited Third Party
    Inspection Agency (TPIA) approved by the Procuring Authority (e.g., RITES, CEIL, DNV, SGS, BV).
3.3 Manufacturer Test Certificates (MTC) with heat numbers / lot numbers must accompany each consignment.

--------------------------------------------------------------------------------
4.0 NON-COMPLIANCE & PENALTY CLAUSE UNDER BIS ACT 2016:
--------------------------------------------------------------------------------
Supply of spurious, non-ISI marked, or substandard materials in violation of statutory
Quality Control Orders (QCOs) shall attract statutory prosecution under Section 16 & Section 29
of the BIS Act 2016, immediate termination of contract, forfeiture of Performance Bank Guarantee (PBG),
and blacklisting across all Central/State Government and GeM procurement portals.

================================================================================
END OF MODEL NIT TECHNICAL CLAUSE - GENERATED VIA ISYNC
================================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedClauseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadModelNITClausePDF(generatedClauseText, certificateId || 'CERT-IS-GOV-2026-98442');
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => setIsModelClauseModalOpen(false)}
    >
      <div 
        className="relative bg-white dark:bg-[#0C1220] rounded-[2rem] max-w-5xl w-full shadow-[0_30px_90px_rgba(0,0,0,0.6)] border border-slate-200/90 dark:border-white/15 max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-all animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 sm:px-8 sm:py-6 flex items-start justify-between border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] backdrop-blur-md shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-emerald-500/15 border border-emerald-500/25 px-3 py-0.5 rounded-full text-emerald-700 dark:text-emerald-400 font-bold text-[11px] shadow-2xs">
                GeM & CPPP Ready
              </span>
              <span className="bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-blue-700 dark:text-blue-300 font-semibold text-[11px]">
                GFR 2017 Rule 144(xi)
              </span>
              <span className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-amber-700 dark:text-amber-300 font-semibold text-[11px]">
                BIS Act 2016 Compliant
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Model NIT Technical Clause Generator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">
              Official tender-ready technical draft formatted for direct insertion into GeM Custom Bids & CPPP e-Tenders.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-full bg-slate-200/80 dark:bg-black/40 border border-slate-300/80 dark:border-white/15 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode('draft')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  viewMode === 'draft'
                    ? 'bg-white text-[#0B1E36] dark:bg-slate-800 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Draft Preview
              </button>
              <button
                type="button"
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  viewMode === 'raw'
                    ? 'bg-white text-[#0B1E36] dark:bg-slate-800 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Raw Text
              </button>
            </div>

            <button
              onClick={() => setIsModelClauseModalOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-300/80 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer text-xs ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 bg-slate-100/60 dark:bg-[#070B14]">
          {viewMode === 'raw' ? (
            /* Raw Text View */
            <div className="p-6 bg-slate-900 text-slate-200 rounded-2xl font-mono text-xs leading-relaxed border border-slate-800 shadow-inner">
              <pre className="whitespace-pre-wrap selection:bg-[#1E3A5F] selection:text-white font-mono">
                {generatedClauseText}
              </pre>
            </div>
          ) : (
            /* Formatted Document Draft Preview */
            <div className="max-w-4xl mx-auto bg-white dark:bg-[#0E1526] rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-200/80 dark:border-white/10 space-y-8 font-sans">
              
              {/* Official Document Letterhead */}
              <div className="border-b-2 border-slate-900 dark:border-white/30 pb-6 text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-mono font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                  Government of India • Public Procurement Gateway
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                  Model Notice Inviting Tender (NIT) Technical Specifications
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
                  Statutory Compliance under GFR 2017 Rule 144(xi), Public Procurement Order 2017 & Bureau of Indian Standards Act 2016
                </p>
              </div>

              {/* Specification Metadata Dossier Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Hash className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="font-semibold">Tender Specification Reference:</span>
                  </div>
                  <p className="font-mono font-bold text-slate-900 dark:text-white text-xs pl-5.5">
                    {certificateId || 'CERT-IS-GOV-2026-98442'}
                  </p>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 pt-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="font-semibold">Procuring Entity:</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs pl-5.5">
                    {orgProfile?.businessName || 'National Metro Rail Corporation Ltd'} <span className="text-[11px] font-normal text-slate-500">({orgProfile?.orgType || 'Public Sector Undertaking'})</span>
                  </p>
                </div>

                <div className="space-y-2 sm:border-l sm:border-slate-200 dark:sm:border-white/10 sm:pl-4">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="font-semibold">Officer in Charge:</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs pl-5.5">
                    {orgProfile?.applicantName || 'Er. Vikramaditya Sharma'}
                  </p>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="font-semibold">Timestamp of Generation:</span>
                  </div>
                  <p className="font-mono text-slate-700 dark:text-slate-300 text-[11px] pl-5.5">
                    {analysisTimestamp || new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Section 1.0 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-white/10">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    1.0
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
                    Mandatory Applicable Indian Standards & Regulatory Compliance
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  All materials, equipment, and structural components supplied under this tender schedule shall strictly adhere to the Bureau of Indian Standards (BIS) specifications listed below, incorporating all latest amendments, revisions, and reaffirmations as on the date of bid submission:
                </p>

                {/* Standards Cards */}
                <div className="space-y-3.5 pt-1">
                  {selectedStds.map((std, idx) => (
                    <div 
                      key={std.id || idx}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-3 transition hover:border-blue-300 dark:hover:border-blue-700/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-mono font-bold text-xs">
                            [{idx + 1}] {std.code}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {std.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {std.qcoMandatory ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50">
                              <ShieldCheck className="w-3 h-3 text-amber-600" />
                              Mandatory QCO Decree
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                              Voluntary Standard
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40">
                            PPP-MII: {std.makeInIndiaLocalContentMin || 'Min 60% Local'}
                          </span>
                        </div>
                      </div>

                      {/* Technical Clause Detail Box */}
                      <div className="p-3 rounded-lg bg-white dark:bg-[#070B14] border-l-4 border-blue-600 text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                        {std.modelNitClause || `All products supplied under this item schedule must strictly conform to ${std.code}. Full batch laboratory test records and BIS license credentials must be furnished.`}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-0.5">
                        <span>• Division: <strong className="text-slate-700 dark:text-slate-300">{std.divisionName || 'Electrotechnical'}</strong></span>
                        <span>• Scheme: <strong className="text-slate-700 dark:text-slate-300">{std.certificationScheme || 'Scheme-I (ISI Mark)'}</strong></span>
                        <span>• Ministry: <strong className="text-slate-700 dark:text-slate-300">{std.ministryEnforcing || 'Ministry of Consumer Affairs'}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2.0 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-white/10">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    2.0
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
                    Mandatory Bidder Qualification & Certification Submission
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white text-xs">
                      2.1 Valid BIS License / Registration Mandate
                    </p>
                    <p>
                      The bidder (or authorized OEM) must possess a valid Bureau of Indian Standards (BIS) Certification Mark (ISI Mark) License or Compulsory Registration Scheme (CRS) Registration Certificate for each of the specified Indian Standards listed in Section 1.0. Bids with expired, revoked, or non-authentic BIS licenses shall be summarily rejected at the Technical Bid Opening stage without seeking further clarification.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white text-xs">
                      2.2 Proof of Compliance
                    </p>
                    <p>
                      Bidders must upload legible, self-attested copies of the valid BIS License / CML Number endorsed with validity dates and exact factory manufacturing address matching the GeM profile.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3.0 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-white/10">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    3.0
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
                    Raw Material Tests & Third-Party Inspection (TPIA)
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p>
                    • <strong>3.1 Factory Acceptance Testing (FAT):</strong> Shall be conducted strictly as per the normative test methods stipulated in the applicable Indian Standards.
                  </p>
                  <p>
                    • <strong>3.2 Pre-Dispatch Third-Party Inspection:</strong> Must be carried out by an independent, NABL-accredited Third Party Inspection Agency (TPIA) approved by the Procuring Authority (e.g., RITES, CEIL, DNV, SGS, BV).
                  </p>
                  <p>
                    • <strong>3.3 Manufacturer Test Certificates (MTC):</strong> Must include batch heat numbers, chemical analysis, and physical test records accompanying each consignment.
                  </p>
                </div>
              </div>

              {/* Section 4.0 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-white/10">
                  <span className="w-6 h-6 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    4.0
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
                    Statutory Penalties & Legal Recourse under BIS Act 2016
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-xs text-rose-900 dark:text-rose-200 leading-relaxed font-medium flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <p>
                    Supply of spurious, non-ISI marked, or substandard materials in violation of statutory Quality Control Orders (QCOs) shall attract statutory prosecution under Section 16 & Section 29 of the BIS Act 2016, immediate termination of contract, forfeiture of Performance Bank Guarantee (PBG), and blacklisting across all Central/State Government and GeM procurement portals.
                  </p>
                </div>
              </div>

              {/* Digital Verification & Stamp Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-[11px]">Digitally Compiled & Certified by ISync Gateway</p>
                    <p className="text-[10px]">Tamper-Evident SHA-256 Non-Repudiation Seal Active</p>
                  </div>
                </div>

                <div className="font-mono text-[10px] text-slate-400">
                  REF: {certificateId || 'CERT-IS-GOV-2026-98442'}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Modal Action Bar */}
        <div className="px-6 py-4 sm:px-8 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 bg-slate-50/80 dark:bg-white/[0.02] backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Ready for insertion into <strong className="text-slate-950 dark:text-white font-extrabold">GeM Custom Bids</strong> or <strong className="text-slate-950 dark:text-white font-extrabold">CPPP e-Tenders</strong></span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className={`bg-[#0B1E36] hover:bg-[#132845] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-black px-6 py-2.5 rounded-full shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-105 border border-white/30 dark:border-white/10 ${
                copied ? 'border-emerald-500 text-emerald-300' : ''
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copied ? 'Copied Clause!' : 'Copy Full Clause'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="bg-white hover:bg-slate-50 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-slate-200 text-xs font-bold px-5 py-2.5 rounded-full shadow-xs flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Download .PDF</span>
            </button>

            <button
              onClick={() => setIsModelClauseModalOpen(false)}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ModelClauseModal;

