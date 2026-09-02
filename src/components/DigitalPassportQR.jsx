import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
import { triggerVerification } from "../utils/verificationPulse";
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
    triggerVerification();
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-3xl border border-white dark:border-white/20 p-6 sm:p-8 bg-white/60 dark:bg-white/[0.04] backdrop-blur-2xl shadow-xl transition-all ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-white dark:border-white/20 flex items-center justify-center font-bold shadow-xs backdrop-blur-md">
            <QrCode className="w-5 h-5 text-slate-800 dark:text-slate-200" />
          </div>
          <div>
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <span>Physical Audit & Inventory QR Pass</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 font-bold">
                Live Scannable
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
              Immutable digital compliance passport for physical supply-chain inspection and warehouse verification.
            </p>
          </div>
        </div>

        {/* High-Contrast Simulate Field Scan Button */}
        <button
          onClick={() => setShowScannerModal(true)}
          className="bg-white/80 hover:bg-white dark:bg-white/15 dark:hover:bg-white/25 backdrop-blur-2xl border border-white dark:border-white/30 text-slate-900 dark:text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>Simulate Field Scan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-center">
        {/* QR Code Canvas Frame Matching Input Specs */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-white/90 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-white dark:border-white/20 shadow-md text-center">
          <div ref={qrRef} className="p-2.5 bg-white rounded-xl shadow-xs">
            <QRCodeCanvas
              value={payloadString}
              size={148}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-2">
            {certificateId}
          </p>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            ECC: HIGH (30% REDUNDANCY)
          </span>
        </div>

        {/* Passport Details & Actions */}
        <div className="md:col-span-8 space-y-5">
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/[0.03] backdrop-blur-md border border-white dark:border-white/10 shadow-xs">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Tender Ref ID</span>
              <strong className="text-slate-900 dark:text-white text-xs truncate block mt-0.5 font-black">{certificateId}</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/[0.03] backdrop-blur-md border border-white dark:border-white/10 shadow-xs">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Statutory QCO Status</span>
              <strong className="text-emerald-700 dark:text-emerald-400 text-xs truncate block mt-0.5 font-black">100% Enforced</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/[0.03] backdrop-blur-md border border-white dark:border-white/10 shadow-xs">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Primary Standards</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold truncate block mt-0.5">
                {primaryCodes.join(', ') || 'IS 7098 (Part 2):2011'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/[0.03] backdrop-blur-md border border-white dark:border-white/10 shadow-xs">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Normative Tests Bundled</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold truncate block mt-0.5">
                {allTests.length} Laboratory Methods
              </span>
            </div>
          </div>

          {/* Action Buttons: High-Contrast Download QR Button */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleDownloadPng}
              className="bg-[#0B1E36]/90 hover:bg-[#0B1E36] dark:bg-white/20 dark:hover:bg-white/30 text-white text-xs font-extrabold px-6 py-2.5 rounded-full backdrop-blur-2xl border border-white/60 dark:border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download QR Tag (PNG)</span>
            </button>

            <button
              onClick={handleCopyPayload}
              className="bg-white/80 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-2xl border border-white dark:border-white/20 text-slate-800 dark:text-slate-200 text-xs font-bold px-5 py-2.5 rounded-full shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON Payload' : 'Copy Payload'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Field Scanner Simulation Modal via React Portal (Full-Screen Blurred Overlay) */}
      {showScannerModal && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setShowScannerModal(false)}
        >
          <div 
            className="relative bg-white dark:bg-[#0E1322] rounded-[2rem] max-w-lg w-full border-2 border-white dark:border-white/20 p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.5)] space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200/80 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
                  <Scan className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">Handheld Field Scanner Verification</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Simulated NABL / Third Party Inspection Agency (TPIA) Terminal</p>
                </div>
              </div>
              <button
                onClick={() => setShowScannerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold transition cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {/* Authentic Passport Verification Banner */}
            <div className="p-3.5 bg-emerald-500/15 rounded-2xl border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5 font-bold backdrop-blur-md shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>AUTHENTIC TENDER PASSPORT: Digital signature verified with NIC Trust Gateway.</span>
            </div>

            {/* Decrypted Payload Terminal */}
            <div className="bg-[#070B14] p-4 rounded-2xl border border-slate-800 dark:border-white/10 overflow-y-auto flex-1 font-mono text-[11px] text-slate-300 space-y-1 shadow-inner scroll-smooth">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[10px] text-slate-400 font-mono">
                <span className="text-emerald-400 font-bold">› DECRYPTED_CERTIFICATE_PAYLOAD</span>
                <span>SHA-256 VERIFIED</span>
              </div>
              <pre className="whitespace-pre-wrap">{payloadString}</pre>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-200/80 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold">Status: COMPLIANT • SECURE-04</span>
              </div>
              <button
                onClick={() => setShowScannerModal(false)}
                className="bg-[#0B1E36] hover:bg-[#132845] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-black px-6 py-2.5 rounded-full shadow-md cursor-pointer transition-all hover:scale-105 border border-white/30 dark:border-white/10"
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
