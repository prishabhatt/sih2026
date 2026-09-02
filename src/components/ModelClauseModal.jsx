import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  CheckCircle2
} from 'lucide-react';
import { triggerVerification } from "../utils/verificationPulse";
import { useProcurement } from '../context/ProcurementContext';
import { MOCK_STANDARDS } from '../data/mockStandardsData';

export function ModelClauseModal() {
  const { 
    isModelClauseModalOpen, 
    setIsModelClauseModalOpen, 
    selectedStandardIds,
    orgProfile,
    analysisTimestamp,
    certificateId
  } = useProcurement();

  const [copied, setCopied] = useState(false);

  if (!isModelClauseModalOpen) return null;

  const selectedStds = MOCK_STANDARDS.filter((s) => selectedStandardIds.includes(s.id));

  const generatedClauseText = `================================================================================
GOVERNMENT OF INDIA / PUBLIC SECTOR ENTERPRISE TENDER CLAUSE
MODEL NOTICE INVITING TENDER (NIT) TECHNICAL SPECIFICATIONS
Compliant with GFR 2017 Rule 144(xi), Public Procurement Order 2017 & BIS Act 2016
================================================================================

TENDER SPECIFICATION REFERENCE: ${certificateId}
PROCURING ENTITY: ${orgProfile.businessName} (${orgProfile.orgType})
OFFICER IN CHARGE: ${orgProfile.applicantName}
TIMESTAMP OF CLAUSE GENERATION: ${analysisTimestamp}

--------------------------------------------------------------------------------
1.0 MANDATORY APPLICABLE INDIAN STANDARDS & REGULATORY COMPLIANCE:
--------------------------------------------------------------------------------
All materials, equipment, and structural components supplied under this tender schedule
shall strictly adhere to the Bureau of Indian Standards (BIS) specifications listed below,
incorporating all latest amendments, revisions, and reaffirmations as on the date of bid submission.

${selectedStds.map((s, idx) => `
[${idx + 1}] ${s.code} - ${s.title}
    * Division / Committee: ${s.divisionName}
    * Statutory Certification Scheme: ${s.certificationScheme}
    * Statutory QCO Mandate: ${s.qcoMandatory ? 'MANDATORY UNDER ' + s.qcoGazetteOrder : 'Voluntary Compliance'}
    * Enforcing Ministry: ${s.ministryEnforcing}
    * Minimum Local Content (PPP-MII): ${s.makeInIndiaLocalContentMin}
    
    Technical Details:
${s.modelNitClause}
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
END OF MODEL NIT TECHNICAL CLAUSE - GENERATED VIA BIS STANDARDS ENGINE
================================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedClauseText);
    setCopied(true);
    triggerVerification();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedClauseText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Model_NIT_Clause_${certificateId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => setIsModelClauseModalOpen(false)}
    >
      <div 
        className="relative bg-white dark:bg-[#0B111E] rounded-[2rem] max-w-4xl w-full shadow-[0_25px_70px_rgba(0,0,0,0.5)] border-2 border-white dark:border-white/20 max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-all animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-7 flex items-start justify-between border-b border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-md shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/15 border border-emerald-500/25 px-3 py-0.5 rounded-full text-emerald-700 dark:text-emerald-400 font-bold text-xs shadow-xs">
                GeM & CPPP Ready
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                GFR 2017 Rule 144(xi)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Model NIT Technical Clause Generator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-normal leading-relaxed">
              Legally binding, tender-ready technical clauses compiled directly from Bureau of Indian Standards specifications and statutory QCO decrees.
            </p>
          </div>
          <button
            onClick={() => setIsModelClauseModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold transition cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-[#070B14] text-slate-200 font-mono text-xs leading-relaxed border-y border-slate-800 dark:border-white/10 shadow-inner">
          <pre className="whitespace-pre-wrap selection:bg-[#292524] selection:text-white">
            {generatedClauseText}
          </pre>
        </div>

        <div className="p-5 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/60 dark:bg-white/[0.02] backdrop-blur-md shrink-0">
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
              <span>{copied ? 'Copied to Clipboard' : 'Copy Clause'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="bg-white hover:bg-slate-50 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-slate-200 text-xs font-bold px-5 py-2.5 rounded-full shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .TXT</span>
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
