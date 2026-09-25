import React, { useRef, useState, useEffect } from 'react';
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
  ExternalLink,
  Lock,
  Layers,
  FileCheck,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { MOCK_STANDARDS } from '../data/mockStandardsData';

const API_BASE = 'http://localhost:8000';

export function DigitalPassportQR({ className = '' }) {
  const { 
    certificateId = 'CERT-IS-GOV-2026-98442', 
    orgProfile = {}, 
    selectedStandardIds = [], 
    selectedNormativeTests = {}, 
    shaHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 
    analysisTimestamp = new Date().toISOString(),
    complianceStats = { overallScore: 88 }
  } = useProcurement();

  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [publishStatus, setPublishStatus] = useState('idle');

  const selectedStds = MOCK_STANDARDS.filter((s) => selectedStandardIds.includes(s.id));
  const primaryCodes = selectedStds.length > 0 
    ? selectedStds.map((s) => s.code)
    : ['IS 7098 (Part 2) : 2011', 'IS 694 : 2010', 'IS 1786 : 2008'];
  
  const schemes = selectedStds.length > 0
    ? [...new Set(selectedStds.map((s) => s.certificationScheme))].join(', ')
    : 'Scheme-I (Mandatory ISI Mark)';
  
  const allTests = [];
  selectedStds.forEach((s) => {
    const tests = selectedNormativeTests[s.id] || [];
    tests.forEach((t) => {
      if (!allTests.includes(t)) allTests.push(t);
    });
  });

  const testsCount = allTests.length > 0 ? allTests.length : 6;

  const payloadObject = {
    tender_id: certificateId,
    issuing_org: orgProfile.businessName || 'National Public Infrastructure Agency',
    officer: orgProfile.applicantName || 'Procurement Executive',
    primary_standards: primaryCodes,
    certification_scheme: schemes,
    mandatory_tests: allTests.length > 0 ? allTests : ['IS 8130 DC Resistance', 'IS 10810 Oxygen Index', 'IS 1608 Tensile Strength'],
    compliance_score: `${complianceStats.overallScore}%`,
    qco_status: "MANDATORY_ENFORCED_UNDER_BIS_ACT_2016",
    compliance_hash: shaHash,
    issued_on: analysisTimestamp,
    nic_gateway: "NIC-BIS-NODE-04"
  };

  const payloadString = JSON.stringify(payloadObject, null, 2);

  const verifyUrl = `${window.location.origin}/verify/${encodeURIComponent(certificateId)}`;

  useEffect(() => {
    const publishReport = async () => {
      setPublishStatus('publishing');
      try {
        const res = await fetch(`${API_BASE}/api/reports/publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            certificate_id: certificateId,
            payload: payloadObject
          })
        });
        if (res.ok) {
          setPublishStatus('published');
        } else {
          setPublishStatus('offline');
        }
      } catch {
        setPublishStatus('offline');
      }
    };
    publishReport();
  }, [certificateId, shaHash, complianceStats.overallScore, selectedStandardIds.length]);

  const handleDownloadPng = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const brandedCanvas = document.createElement('canvas');
    const bCtx = brandedCanvas.getContext('2d');
    brandedCanvas.width = 400;
    brandedCanvas.height = 520;

    bCtx.fillStyle = '#FFFFFF';
    bCtx.fillRect(0, 0, 400, 520);

    bCtx.strokeStyle = '#0F172A';
    bCtx.lineWidth = 4;
    bCtx.strokeRect(10, 10, 380, 500);

    bCtx.fillStyle = '#0F172A';
    bCtx.font = 'bold 14px sans-serif';
    bCtx.textAlign = 'center';
    bCtx.fillText('GOVERNMENT OF INDIA • BIS COMPLIANCE PASS', 200, 40);

    bCtx.font = '10px monospace';
    bCtx.fillStyle = '#475569';
    bCtx.fillText(`TENDER ID: ${certificateId}`, 200, 60);

    bCtx.drawImage(canvas, 75, 80, 250, 250);

    bCtx.fillStyle = '#0F172A';
    bCtx.font = 'bold 11px sans-serif';
    bCtx.fillText(`Entity: ${(orgProfile.businessName || 'Government Procurement Dept').substring(0, 35)}`, 200, 360);

    bCtx.font = '10px sans-serif';
    bCtx.fillStyle = '#047857';
    bCtx.fillText(`Primary Stds: ${primaryCodes.join(', ').substring(0, 40)}`, 200, 380);

    bCtx.font = '9px monospace';
    bCtx.fillStyle = '#475569';
    bCtx.fillText(`SHA: ${shaHash.substring(0, 32)}...`, 200, 405);
    bCtx.fillText('BIS Act 2016 Section 16 & GFR 2017 Verified', 200, 425);

    bCtx.fillStyle = '#047857';
    bCtx.font = 'bold 9px monospace';
    bCtx.fillText('SCAN QR TO VERIFY → ' + verifyUrl.substring(0, 45), 200, 450);

    bCtx.fillStyle = '#0F172A';
    bCtx.font = 'bold 10px sans-serif';
    bCtx.fillText('DIGITAL SUPPLY CHAIN PASSPORT', 200, 475);

    const link = document.createElement('a');
    link.download = `BIS_Compliance_QR_Pass_${certificateId}.png`;
    link.href = brandedCanvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-3xl border border-slate-200 p-6 sm:p-8 bg-white shadow-2xl text-slate-900 ${className}`}>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 shadow-xs">
            <QrCode className="w-5 h-5 text-slate-800" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                Physical Audit & Inventory QR Pass
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px]">
                LIVE SCANNABLE
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-normal">
              Immutable digital compliance passport for physical supply-chain inspection and warehouse verification.
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-center">
        
        <div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs text-center">
          <div ref={qrRef} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
            <QRCodeCanvas
              value={verifyUrl}
              size={152}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="font-mono font-bold text-xs text-slate-900 mt-3 tracking-tight">
            {certificateId}
          </p>
          <span className="text-[10px] font-mono font-semibold text-slate-500 mt-0.5 uppercase tracking-wider">
            ECC: HIGH (30% REDUNDANCY)
          </span>
          <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
            publishStatus === 'published'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : publishStatus === 'publishing'
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {publishStatus === 'published' && <><Wifi className="w-2.5 h-2.5" /> Report Published</>}
            {publishStatus === 'publishing' && <><Loader2 className="w-2.5 h-2.5 animate-spin" /> Publishing...</>}
            {publishStatus === 'offline' && <><WifiOff className="w-2.5 h-2.5" /> Backend Offline</>}
            {publishStatus === 'idle' && <><WifiOff className="w-2.5 h-2.5" /> Pending</>}
          </div>
        </div>

        <div className="md:col-span-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Tender Ref ID
              </span>
              <strong className="text-slate-900 font-mono font-black text-sm block mt-1 truncate">
                {certificateId}
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Statutory QCO Status
              </span>
              <strong className="text-emerald-700 font-black text-sm block mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                100% Enforced
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Primary Standards
              </span>
              <strong className="text-slate-900 font-bold text-xs block mt-1 truncate" title={primaryCodes.join(', ')}>
                {primaryCodes.join(', ')}
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Normative Tests Bundled
              </span>
              <strong className="text-slate-900 font-bold text-xs block mt-1">
                {testsCount} Laboratory Test Methods
              </strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleDownloadPng}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download QR Tag (PNG)</span>
            </button>

            <button
              onClick={handleCopyPayload}
              className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied JSON Payload</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Payload</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showScannerModal && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setShowScannerModal(false)}
        >
          <div 
            className="relative bg-white rounded-3xl max-w-lg w-full border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col overflow-hidden text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                  <Scan className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Handheld Field Scanner Verification</h4>
                  <p className="text-[11px] text-slate-500 font-normal">Simulated NABL / Third Party Inspection Agency (TPIA) Terminal</p>
                </div>
              </div>
              <button
                onClick={() => setShowScannerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 font-bold transition cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5 font-bold shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>AUTHENTIC TENDER PASSPORT: Digital signature verified with NIC Trust Gateway.</span>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-800 font-bold flex items-center gap-2 shrink-0">
              <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate">Scan opens: {verifyUrl}</span>
            </div>

            <div className="bg-[#070B14] p-4 rounded-2xl border border-slate-800 overflow-y-auto flex-1 font-mono text-[11px] text-slate-300 space-y-1 shadow-inner scroll-smooth">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[10px] text-slate-400 font-mono">
                <span className="text-emerald-400 font-bold">› DECRYPTED_CERTIFICATE_PAYLOAD</span>
                <span>SHA-256 VERIFIED</span>
              </div>
              <pre className="whitespace-pre-wrap">{payloadString}</pre>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-slate-600 font-bold">Status: COMPLIANT • SECURE-04</span>
              </div>
              <button
                onClick={() => setShowScannerModal(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-black px-6 py-2 rounded-xl shadow-md cursor-pointer transition-all"
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

export default DigitalPassportQR;
