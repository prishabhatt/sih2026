import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
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
    confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative glass-card rounded-3xl max-w-4xl w-full shadow-2xl border border-white/70 dark:border-white/20 max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-all">
        <div className="p-6 sm:p-7 flex items-start justify-between border-b border-slate-200/80 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="glass-pill-container px-3 py-0.5 rounded-full text-emerald-600 dark:text-emerald-400 font-bold font-mono text-xs shadow-xs">
                GeM & CPPP Ready
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
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
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-[#070B14]/90 dark:bg-[#070B14]/95 text-slate-200 font-mono text-xs leading-relaxed">
          <pre className="whitespace-pre-wrap font-mono selection:bg-[#292524] selection:text-white">
            {generatedClauseText}
          </pre>
        </div>

        <div className="p-5 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/40 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Ready for insertion into <strong className="text-slate-900 dark:text-white font-bold">GeM Custom Bids</strong> or <strong className="text-slate-900 dark:text-white font-bold">CPPP e-Tenders</strong></span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className={`glass-btn-primary shimmer-sweep flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all shadow-md cursor-pointer ${
                copied ? 'border-emerald-500 text-emerald-300' : ''
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Clause'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="glass-btn-secondary flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 transition shadow-xs cursor-pointer"
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
    </div>
  );
}
