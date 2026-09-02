import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Download, 
  QrCode, 
  Copy, 
  Check, 
  ShieldCheck, 
  Scan, 
  CheckCircle2, 
  Smartphone,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProcurement } from '../context/ProcurementContext';
import { MOCK_STANDARDS } from '../data/mockStandardsData';

export function DigitalPassportQR({ className = '', isDarkTheme = false }) {
  const { 
    certificateId, 
    orgProfile, 
    selectedStandardIds, 
    selectedNormativeTests, 
    shaHash, 
    analysisTimestamp,
    complianceStats 
  } = useProcurement();

  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  const selectedStds = MOCK_STANDARDS.filter((s) => selectedStandardIds.includes(s.id));
  const primaryCodes = selectedStds.map((s) => s.code);
  const schemes = [...new Set(selectedStds.map((s) => s.certificationScheme))].join(', ') || 'Scheme-I (ISI Mark)';
  
  // Aggregate all selected normative tests
  const allTests = [];
  selectedStds.forEach((s) => {
    const tests = selectedNormativeTests[s.id] || [];
    tests.forEach((t) => {
      if (!allTests.includes(t)) allTests.push(t);
    });
  });

  const payloadObject = {
    tender_id: certificateId,
    issuing_org: orgProfile.businessName,
    officer: orgProfile.applicantName,
    primary_standards: primaryCodes,
    certification_scheme: schemes,
    mandatory_tests: allTests,
    compliance_score: `${complianceStats.overallScore}%`,
    qco_status: "MANDATORY_ENFORCED_UNDER_BIS_ACT_2016",
    compliance_hash: shaHash,
    issued_on: analysisTimestamp,
    nic_gateway: "NIC-BIS-NODE-04"
  };

  const payloadString = JSON.stringify(payloadObject, null, 2);

  const handleDownloadPng = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    // Create a branded canvas with border, title, and metadata
    const brandedCanvas = document.createElement('canvas');
    const bCtx = brandedCanvas.getContext('2d');
    brandedCanvas.width = 400;
    brandedCanvas.height = 520;

    // Background
    bCtx.fillStyle = '#FFFFFF';
    bCtx.fillRect(0, 0, 400, 520);

    // Border
    bCtx.strokeStyle = '#12141C';
    bCtx.lineWidth = 4;
    bCtx.strokeRect(10, 10, 380, 500);

    // Header Title
    bCtx.fillStyle = '#12141C';
    bCtx.font = 'bold 14px sans-serif';
    bCtx.textAlign = 'center';
    bCtx.fillText('GOVERNMENT OF INDIA • BIS COMPLIANCE PASS', 200, 40);

    bCtx.font = '10px monospace';
    bCtx.fillStyle = '#64748B';
    bCtx.fillText(`TENDER ID: ${certificateId}`, 200, 60);

    // Draw QR code
    bCtx.drawImage(canvas, 75, 80, 250, 250);

    // Footer Metadata
    bCtx.fillStyle = '#12141C';
    bCtx.font = 'bold 11px sans-serif';
    bCtx.fillText(`Entity: ${orgProfile.businessName.substring(0, 35)}`, 200, 360);

    bCtx.font = '10px sans-serif';
    bCtx.fillStyle = '#059669';
    bCtx.fillText(`Primary Stds: ${primaryCodes.join(', ').substring(0, 40)}`, 200, 380);

    bCtx.font = '9px monospace';
    bCtx.fillStyle = '#64748B';
    bCtx.fillText(`SHA: ${shaHash.substring(0, 32)}...`, 200, 405);
    bCtx.fillText('BIS Act 2016 Section 16 & GFR 2017 Verified', 200, 425);

    bCtx.fillStyle = '#2563EB';
    bCtx.font = 'bold 10px sans-serif';
    bCtx.fillText('DIGITAL SUPPLY CHAIN PASSPORT', 200, 455);

    // Download image
    const link = document.createElement('a');
    link.download = `BIS_Compliance_QR_Pass_${certificateId}.png`;
    link.href = brandedCanvas.toDataURL('image/png');
    link.click();
    confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-3xl border p-6 glass-card shadow-xl transition-all ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#292524]/10 text-[#292524] dark:text-[#A8A29E] border border-[#292524]/20 flex items-center justify-center font-bold shadow-xs">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <span>Physical Audit & Inventory QR Pass</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#059669]/10 text-emerald-600 dark:text-[#059669] border border-[#059669]/20 font-bold">
                Live Scannable
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
              Immutable digital compliance passport for physical supply-chain inspection and warehouse verification.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowScannerModal(true)}
          className="glass-btn-secondary flex items-center gap-2 px-4 py-2 rounded-full text-slate-800 dark:text-slate-200 text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#292524] dark:text-[#A8A29E]" />
          <span>Simulate Field Scan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 items-center">
        {/* QR Code Canvas */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-md text-center">
          <div ref={qrRef} className="p-2 bg-white rounded-xl">
            <QRCodeCanvas
              value={payloadString}
              size={148}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-[10px] font-mono font-bold text-slate-800 mt-1.5">
            {certificateId}
          </p>
          <span className="text-[9px] text-slate-400 font-mono">
            ECC: HIGH (30% redundancy)
          </span>
        </div>

        {/* Passport Details & Actions */}
        <div className="md:col-span-8 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 rounded-2xl glass-pill-container shadow-xs">
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Tender Ref ID</span>
              <strong className="font-mono text-[#292524] dark:text-[#A8A29E] text-xs truncate block mt-0.5">{certificateId}</strong>
            </div>

            <div className="p-3 rounded-2xl glass-pill-container shadow-xs">
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Statutory QCO Status</span>
              <strong className="text-emerald-600 dark:text-[#059669] text-xs truncate block mt-0.5">100% Enforced</strong>
            </div>

            <div className="p-3 rounded-2xl glass-pill-container shadow-xs">
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Primary Standards</span>
              <span className="text-slate-800 dark:text-slate-200 font-mono font-bold truncate block mt-0.5">
                {primaryCodes.join(', ') || 'IS 7098 (Part 2):2011'}
              </span>
            </div>

            <div className="p-3 rounded-2xl glass-pill-container shadow-xs">
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Normative Tests Bundled</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold truncate block mt-0.5">
                {allTests.length} Laboratory Methods
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleDownloadPng}
              className="glass-btn-primary shimmer-sweep flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-extrabold transition shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download QR Tag (PNG)</span>
            </button>

            <button
              onClick={handleCopyPayload}
              className="glass-btn-secondary flex items-center gap-2 px-4 py-2.5 rounded-full text-slate-800 dark:text-slate-200 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON Payload' : 'Copy Payload'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Field Scanner Simulation Modal */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-lg w-full border border-white/20 p-6 space-y-4 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Scan className="w-5 h-5 text-[#059669] animate-pulse" />
                <div>
                  <h4 className="font-extrabold text-sm text-white">Handheld Field Scanner Verification</h4>
                  <p className="text-[11px] text-slate-400 font-normal">Simulated NABL / Third Party Inspection Agency (TPIA) Terminal</p>
                </div>
              </div>
              <button
                onClick={() => setShowScannerModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#059669]/10 rounded-2xl border border-[#059669]/20 text-xs text-emerald-300 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
              <span><strong className="font-bold">AUTHENTIC TENDER PASSPORT:</strong> Digital signature verified with NIC Trust Gateway.</span>
            </div>

            <div className="bg-[#070B14]/90 p-4 rounded-2xl border border-white/10 max-h-60 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-1">
              <pre className="whitespace-pre-wrap">{payloadString}</pre>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-slate-400 font-mono">Status: COMPLIANT • SECURE-04</span>
              <button
                onClick={() => setShowScannerModal(false)}
                className="glass-btn-primary shimmer-sweep px-5 py-2 rounded-full text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
